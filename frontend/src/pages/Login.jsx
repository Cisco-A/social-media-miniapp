import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  LockKeyhole,
  Loader,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberDevice: false,
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Button disabled if email or password is empty/blank
  const isFormInvalid = !formData.email.trim() || !formData.password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return;

    setIsLoggingIn(true);
    try {
      const res = await login(formData.email.trim(), formData.password.trim());
      toast.success(res.message);
      navigate("/posts", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Unable to login at the moment";
      toast.error(errorMessage);
    } finally {
      setIsLoggingIn(false);
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
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Sign in to connect with your community
          </p>
        </section>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email address */}
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

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-indigo-600 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
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
          </div>

          {/* Remember this device Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberDevice"
              name="rememberDevice"
              checked={formData.rememberDevice}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-[#4748D4] focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="rememberDevice"
              className="text-xs text-slate-500 cursor-pointer select-none"
            >
              Remember this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFormInvalid || isLoggingIn}
            className="w-full py-3 px-4 mt-2 bg-[#4748D4] hover:bg-[#3b3cb8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-colors duration-200"
          >
            {!isLoggingIn ? (
              <>
                <span>Login</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <Loader className="text-white animate-spin" />
            )}
          </button>

          {/* Navigation Link to Sign Up */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
      {/* Footer Security Section */}
      <section className="flex flex-row items-center justify-center gap-4 sm:gap-6 mt-6 text-xs text-slate-500">
        <p className="flex items-center">
          <ShieldCheck className="text-[#625cf0] mr-1.5" size={16} />
          256-bit encryption
        </p>
        <p className="flex items-center">
          <LockKeyhole className="text-[#625cf0] mr-1.5" size={16} />
          Zero tracker policy
        </p>
      </section>
    </div>
  );
};

export default Login;
