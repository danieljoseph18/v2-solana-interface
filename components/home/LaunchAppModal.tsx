import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import ModalV2 from "../common/ModalV2";
import ModalClose from "../common/ModalClose";
import Checkbox from "../common/Checkbox";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LaunchAppModal = ({
  isOpen,
  setIsOpen,
  selectedPath = "/trade",
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedPath: string;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const dontShowAgain = localStorage.getItem("dontShowLaunchAppModal");
    if (dontShowAgain === "true" && isOpen) {
      handleAgree();
    }
  }, [isOpen]);

  const handleAgree = () => {
    if (isChecked) {
      localStorage.setItem("dontShowLaunchAppModal", "true");
    }
    router.push(selectedPath);
    setIsOpen(false);
  };

  return (
    <ModalV2
      isOpen={isOpen}
      setIsModalOpen={setIsOpen}
      size="lg"
      fullScreenOnMobile={false}
    >
      <div className="flex flex-col justify-center gap-4 p-6 w-full h-full">
        <div className="flex w-full items-center justify-between">
          <p className="text-white text-lg font-semibold">Launch App</p>
          <ModalClose onClose={() => setIsOpen(false)} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-wrap">
            You are leaving PRINT3R.xyz and will be redirected to a third party,
            independent website.
          </p>
          <p className="text-wrap">
            The website is a community deployed and maintained instance of the
            open source{" "}
            <Link
              href="/trade"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              PRINT3R front end
            </Link>
            , hosted and served on the distributed, peer-to-peer{" "}
            <Link
              href="https://ipfs.tech/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              IPFS network
            </Link>
            .
          </p>
          <p className="text-wrap">
            Alternative links can be found in the{" "}
            <Link
              href="https://print3r.gitbook.io/print3r"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs
            </Link>
            .
          </p>
          <p className="text-wrap">
            By clicking Agree you accept the{" "}
            <Link href="/terms-of-service" className="underline">
              T&Cs
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Checkbox isChecked={isChecked} setIsChecked={setIsChecked} />
          <label htmlFor="agree">Don’t show this message again.</label>
        </div>
        <Button
          className="bg-p3-button hover:bg-p3-button-hover border-2 border-p3-border !rounded-3 text-base text-white font-semibold font-poppins px-3 py-2 w-full"
          onPress={handleAgree}
        >
          Trade Now
        </Button>
      </div>
    </ModalV2>
  );
};

export default LaunchAppModal;
