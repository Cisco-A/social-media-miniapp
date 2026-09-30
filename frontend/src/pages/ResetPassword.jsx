import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader,
} from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const userEmail = localStorage.getItem("email");
  const [isReseting, setIsReseting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  if (!userEmail) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 1. Password Strength Calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    if (pass.length < 8) return 1;

    let score = 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(formData.password);

  const getBarColor = (index) => {
    if (!formData.password || index >= strengthScore) return "bg-slate-200";
    if (strengthScore === 1) return "bg-rose-500";
    if (strengthScore === 2) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (!formData.password) return "Must be at least 8 characters";
    if (formData.password.length < 8) return "Must be at least 8 characters";
    if (strengthScore === 1) return "Weak password";
    if (strengthScore === 2) return "Moderate password";
    return "Strong password";
  };

  // 2. Real-time confirm password check
  const isConfirmTouched = formData.confirmPassword.length > 0;
  const isPasswordMatch = formData.password === formData.confirmPassword;

  // 3. Validation state for submit button
  const isFormInvalid =
    !formData.otp.trim() || formData.password.length < 8 || !isPasswordMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return;
    setIsReseting(true);

    try {
      const res = await resetPassword(
        userEmail,
        formData.otp,
        formData.password,
      );
      localStorage.removeItem("email");
      toast.success(res.message);
      navigate("/login", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Unable to reset password";
      toast.error(errorMessage);
    } finally {
      setIsReseting(false);
    }
  };

  return (
    <div className="bg-[#f6f7ff] min-h-screen w-full px-4 sm:px-6 lg:px-8 flex justify-center items-center py-8 md:py-12 flex-col font-sans">
      {/* Main Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-indigo-100/50 p-6 sm:p-8 border border-slate-100">
        {/* Header Section */}
        <section className="flex flex-col items-center text-center mb-6">
          <img
            src={`${FRONTEND_URL}/mingle-logo.svg`}
            width={48}
            height={48}
            alt="Mingle app logo"
            className="mb-4"
          />

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create new password
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Enter the OTP code sent to your email and set your new password.
          </p>
        </section>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Read-only / Uneditable Email Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              readOnly
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed select-none outline-none"
            />
          </div>

          {/* OTP Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              OTP Code
            </label>
            <div className="relative flex items-center">
              <KeyRound
                className="absolute left-3.5 text-slate-400"
                size={18}
              />
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                maxLength={6}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#f0f3fa]/70 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* New Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-slate-700">
                New password
              </label>
              <span className="text-[11px] text-slate-400">Min 8 chars</span>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#f0f3fa]/70 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Bars */}
            <div className="flex gap-1.5 mt-2">
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${getBarColor(0)}`}
              />
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${getBarColor(1)}`}
              />
              <div
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${getBarColor(2)}`}
              />
            </div>
            <p
              className={`text-[11px] mt-1 transition-colors duration-200 ${
                !formData.password || formData.password.length < 8
                  ? "text-slate-400"
                  : strengthScore === 1
                    ? "text-rose-500"
                    : strengthScore === 2
                      ? "text-amber-600"
                      : "text-emerald-600"
              }`}
            >
              {getStrengthText()}
            </p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Confirm new password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full pl-10 pr-10 py-2.5 bg-[#f0f3fa]/70 focus:bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 ${
                  isConfirmTouched
                    ? isPasswordMatch
                      ? "border-emerald-400 focus:border-emerald-500"
                      : "border-rose-400 focus:border-rose-500"
                    : "border-transparent focus:border-indigo-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Real-time Match Feedback */}
            {isConfirmTouched && (
              <p
                className={`text-[11px] mt-1 flex items-center gap-1 ${
                  isPasswordMatch ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {isPasswordMatch ? (
                  <>
                    <CheckCircle2 size={12} /> Passwords match
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} /> Passwords do not match
                  </>
                )}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFormInvalid || isReseting}
            className="w-full py-3 px-4 mt-2 bg-[#4748D4] hover:bg-[#3b3cb8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-colors duration-200"
          >
            {isReseting ? (
              <Loader className="animate-spin text-white" />
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Navigation Link back to Login */}
          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Back to login</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
