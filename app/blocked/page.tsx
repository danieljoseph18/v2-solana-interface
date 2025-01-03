import Image from "next/image";
import NavLogo from "@/app/assets/nav/nav-logo.png";

// Add export const dynamic = 'force-static'
export const dynamic = "force-static";

const BlockedPage = () => {
  return (
    <div className="min-h-screen bg-home-card-grad flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center gap-8 max-w-md w-full rounded-lg border-cardborder border-2 modal-gradient-shadow p-8 text-center bg-card-grad">
        <Image
          src={NavLogo}
          className="w-32 sm:w-36 md:w-44 h-auto"
          alt="PRINT Logo"
          width={176}
          height={176}
          priority
        />
        <h1 className="text-2xl font-bold text-printer-orange underline">
          Access Restricted
        </h1>
        <p className="text-gray-300">
          We apologize, but our service is not available in your region due to
          regulatory requirements.
        </p>
      </div>
    </div>
  );
};

export default BlockedPage;
