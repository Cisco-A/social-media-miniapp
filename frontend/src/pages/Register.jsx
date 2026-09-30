import { LockKeyhole, ShieldCheck } from "lucide-react";
import RegisterForm from "../components/RegisterForm";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const Register = () => {
  return (
    <div className="bg-[#f6f7ff] min-h-screen w-full px-4 sm:px-6 lg:px-8 flex justify-center items-center py-8 md:py-12 flex-col font-sans">
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

          <div className="bg-[#EFF4FF] rounded-full flex items-center px-3 py-1 mb-3">
            <span className="mr-2">
              <div className="rounded-full bg-[#4748D4] h-1.5 w-1.5" />
            </span>
            <p className="text-[#4748D4] text-xs font-semibold tracking-wide">
              Welcome to Mingle
            </p>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            Join Mingle and share your moments today
          </p>
        </section>

        {/* Form Section */}
        <section>
          <RegisterForm />
        </section>
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

export default Register;
