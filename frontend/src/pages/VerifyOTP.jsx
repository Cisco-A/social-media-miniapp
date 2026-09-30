import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ShieldCheck, RefreshCw, Loader } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const userEmail = localStorage.getItem("email");
  const inputRefs = useRef([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  // Countdown timer logic for Resend OTP
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!userEmail) {
    return <Navigate to="/login" replace />;
  }

  // Handle individual digit input and auto-focus next
  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation between inputs
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle full OTP paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const pasteArray = pasteData.split("");
      const newOtp = [...otp];
      pasteArray.forEach((char, idx) => {
        newOtp[idx] = char;
        if (inputRefs.current[idx]) {
          inputRefs.current[idx].value = char;
        }
      });
      setOtp(newOtp);
      // Focus last populated input or next available
      const focusIndex = Math.min(pasteArray.length, 5);
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    try {
      const response = await resendOtp(userEmail, "emailVerification");
      toast.success(response.message || "A new code was sent");
      console.log("Resending OTP code to:", userEmail);
      setResendTimer(30);
      setCanResend(false);
    } catch (error) {
      toast.error(
        error.response?.data.message ||
          error.response?.data.error ||
          "Unable to resend otp code",
      );
    } finally {
      setResending(false);
    }
  };

  const otpValue = otp.join("");
  const isFormInvalid = otpValue.length < 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return;
    setIsVerifying(true);

    try {
      const response = await verifyOtp(userEmail, String(otpValue));
      toast.success(response.message);
      navigate("/posts", { replace: true });
    } catch (error) {
      const errorMessage =
        error.response?.data.message || "Unable to verify otp at the moment";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }

    console.log("OTP Verification submitted:", {
      email: userEmail,
      otp: otpValue,
    });
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
            Verify your account
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-slate-700">{userEmail}</span>
          </p>
        </section>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Code Inputs */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-3 text-center">
              Enter verification code
            </label>
            <div
              className="flex justify-between items-center gap-2"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center font-bold text-lg sm:text-xl bg-[#f0f3fa]/70 focus:bg-white border border-transparent focus:border-indigo-500 rounded-xl text-slate-800 outline-none transition-all duration-200 shadow-inner"
                />
              ))}
            </div>
          </div>

          {/* Resend Code Option */}
          <div className="flex items-center justify-center text-xs text-slate-500">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold hover:underline focus:outline-none  disabled:text-slate-300 disabled:cursor-not-allowed"
              >
                {resending ? (
                  "Resending..."
                ) : (
                  <>
                    <RefreshCw size={14} />
                    <span>Resend otp code</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-slate-400">
                Resend code in{" "}
                <span className="font-semibold text-slate-600">
                  {resendTimer}s
                </span>
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isFormInvalid || isVerifying}
            className="w-full py-3 px-4 bg-[#4748D4] hover:bg-[#3b3cb8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-colors duration-200"
          >
            {isVerifying ? (
              <Loader className="text-white" />
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Verify Code</span>
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

export default VerifyOtp;
