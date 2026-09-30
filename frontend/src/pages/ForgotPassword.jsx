import { useState } from "react";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [initiating, setInitiating] = useState(false);
  const { resendOtp } = useAuth();
  const navigate = useNavigate();

  // Button disabled if email field is empty or blank
  const isFormInvalid = !email.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return;
    setInitiating(true);
    localStorage.setItem("email", email);

    try {
      const response = await resendOtp(email, "resetPassword");
      toast.success(response.message);
      navigate("/reset-password", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Unable to initiate password reset";
      // toast.error(errorMessage);
      console.log(errorMessage);
    } finally {
      setIsSubmitted(true);
      setInitiating(false);
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
            {isSubmitted ? "Check your email" : "Forgot your password"}
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            {isSubmitted
              ? `If your email exists in our database, you would receive an otp code`
              : "Enter the email associated with your account and we'll send you an otp code"}
          </p>
        </section>

        {!isSubmitted ? (
          /* Form Section */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f0f3fa]/70 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isFormInvalid || initiating}
              className="w-full py-3 px-4 mt-2 bg-[#4748D4] hover:bg-[#3b3cb8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-colors duration-200"
            >
              {initiating ? (
                <Loader className="text-white animate-spin" />
              ) : (
                <>
                  <span>Proceed to inititate password reset</span>
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
        ) : (
          /* Confirmation State */
          <div className="space-y-4 text-center">
            <div className="flex justify-center my-2">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <CheckCircle2 size={32} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors duration-200"
            >
              Didn't receive the email? Try again
            </button>

            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:underline"
              >
                <ArrowLeft size={14} />
                <span>Back to login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
