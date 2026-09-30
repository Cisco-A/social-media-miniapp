import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-slate-200">
      <div className="bg-white py-4 px-2 rounded-md flex flex-col items-center justify-center gap-2">
        <Loader className="animate-spin text-[#625cf0]" />
        <p className="text-sm">Please wait...</p>
      </div>
    </div>
  );
};

export default Loading;
