import React from "react";

const LowerFooter = () => {
  return (
    <div className="bg-transparent flex flex-col gap-4 w-full border-t-2 border-t-cardborder py-6">
      <div className="flex items-center justify-between w-full text-[#ADADAD] text-15 font-semibold">
        <p>Powered by Odin Labs</p>
        <p>© 2025 Odin Labs. All Rights Reserved.</p>
      </div>
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center gap-6">
          <a
            className="text-printer-gray opacity-40 hover:opacity-100 font-medium"
            href="/terms-of-service"
          >
            Terms of Service
          </a>
          <a
            className="text-printer-gray opacity-40 hover:opacity-100 font-medium"
            href="/privacy-policy"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default LowerFooter;
