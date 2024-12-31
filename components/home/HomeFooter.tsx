import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavLogo from "@/app/assets/home/nav-logo.png";

const HomeFooter = () => {
  return (
    <footer className="text-white py-8 font-poppins w-full pb-20 bg-transparent">
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start w-full">
          <div className="flex flex-col gap-4 mb-6 md:mb-0 w-full items-start">
            <Image
              src={NavLogo}
              className="w-32 sm:w-36 md:w-44 h-auto"
              alt="PRINT3R Logo"
            />
            <p className="text-sm">Trade Beyond Boundaries.</p>
          </div>
          <div className="flex flex-row justify-between w-full mb-8">
            <div>
              <h3 className="font-semibold mb-2 text-white text-15">Learn</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    className="font-poppins font-medium text-15 text-[#ADADAD] hover:text-white"
                    href="https://print3r.gitbook.io/print3r"
                  >
                    User Guides
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-poppins font-medium text-15 text-[#ADADAD] hover:text-white"
                    href="https://print3r.readme.io/docs/getting-started"
                  >
                    Technical Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-white text-15">
                Community
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="https://discord.com/invite/print3r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-poppins font-medium text-15 text-[#ADADAD] hover:text-white"
                  >
                    Discord
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-poppins font-medium text-15 text-[#ADADAD] hover:text-white"
                    href="https://mirror.xyz/0xCc5504e28b2763Bf146fdD24d62703258dbd360c"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://x.com/PRINT3R"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-poppins font-medium text-15 text-[#ADADAD] hover:text-white"
                  >
                    X (Twitter)
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-white text-15">Help</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    className="font-poppins font-medium text-15 text-[#ADADAD] hover:text-white"
                    href="/faqs"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-poppins font-medium text-15 text-[#ADADAD] hover:text-white"
                    href="/terms-of-service"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    className="font-poppins font-medium text-15 text-[#ADADAD] hover:text-white"
                    href="/privacy-policy"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
