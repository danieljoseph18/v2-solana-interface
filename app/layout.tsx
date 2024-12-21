import "./globals.css";
import BottomNav from "@/components/nav/BottomNav";
import NavBar from "@/components/nav/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import FooterBanner from "@/components/nav/FooterBanner";
import { Providers } from "@/components/providers/Providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AccountOverlay from "@/components/wallet/AccountOverlay";

export const metadata: Metadata = {
  title: "PRINT3R | Onchain Leverage for DAOS.FUN",
  description:
    "Trade any Daos.Fun asset with up to 50x leverage directly from your wallet on Solana Network. Experience dynamic pricing, gamified trading, and unmatched liquidity incentives with PRINT3R.",
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${poppins.className} dark`}>
        <div className="">
          <Providers>
            <NavBar />
            {children}
            <BottomNav />
            <AccountOverlay />
            <FooterBanner />
          </Providers>
          <ToastContainer
            className={"text-sm"}
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
