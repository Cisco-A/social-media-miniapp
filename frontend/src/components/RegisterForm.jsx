import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    agreeTerms: false,
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  // Helper color map for the strength bars
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

  // 2. Check if passwords match
  const isConfirmTouched = formData.confirmPassword.length > 0;
  const isPasswordMatch = formData.password === formData.confirmPassword;

  // 3. Form Validation State for Submit Button
  const isFormInvalid =
    !formData.agreeTerms ||
    !formData.gender ||
    formData.password.length < 8 ||
    (isConfirmTouched && !isPasswordMatch);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordMatch) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    // Handle registration API submission logic
    // console.log("Form submitted successfully:", formData);
    setIsRegistering(true);
    try {
      const response = await register(
        formData.fullName.trim(),
        formData.email,
        formData.password,
        formData.gender,
      );
      localStorage.setItem("email", formData.email);
      toast.success(response.message || "Check your email for an otp code");

      navigate("/verify-otp", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data.message ||
        error.response?.data.error ||
        "Unable to register. Please try again.";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name Input */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Full Name
        </label>
        <div className="relative flex items-center">
          <User className="absolute left-3.5 text-slate-400" size={18} />
          <input
            type="text"
            name="fullName"
            placeholder="Alex Morgan"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2.5 bg-[#f0f3fa]/70 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Email address
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 text-slate-400" size={18} />
          <input
            type="email"
            name="email"
            placeholder="alex@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full pl-10 pr-4 py-2.5 bg-[#f0f3fa]/70 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
          />
        </div>
      </div>
      {/* Gender Field */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Gender
        </label>
        <div className="relative flex items-center">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-[#f0f3fa]/70 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl text-sm text-slate-800 outline-none transition-all duration-200 cursor-pointer appearance-none"
          >
            <option value="" disabled hidden>
              Select your gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* Custom Dropdown Arrow Icon */}
          <div className="absolute right-3.5 pointer-events-none text-slate-400">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Password Input */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Password
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

        {/* Dynamic Password Strength Indicators */}
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
          Confirm password
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

      {/* Terms & Conditions Checkbox */}
      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="agreeTerms"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#4f46e5] focus:ring-indigo-500 cursor-pointer"
        />
        <label
          htmlFor="agreeTerms"
          className="text-xs text-slate-500 leading-tight cursor-pointer"
        >
          I agree to the{" "}
          <Link to="#" className="text-indigo-600 hover:underline font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="#" className="text-indigo-600 hover:underline font-medium">
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isFormInvalid || isRegistering}
        className="w-full py-3 px-4 mt-2 bg-[#4748D4] hover:bg-[#3b3cb8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-colors duration-200"
      >
        {isRegistering ? (
          <Loader className="animate-spin text-white" />
        ) : (
          <>
            <span>Register</span>
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Login Link */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;
