import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import { useBottomNav } from "@/contexts/BottomNavContext";
import useWindowSize from "@/hooks/useWindowSize";

type ModalV2Props = {
  isOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  mainLoader?: boolean;
  placement?:
    | "center"
    | "auto"
    | "top"
    | "top-center"
    | "bottom"
    | "bottom-center"
    | undefined;
  style?: "default" | "secondary";
  fullScreenOnMobile?: boolean;
};

const ModalV2 = ({
  isOpen,
  setIsModalOpen,
  children,
  size = "xl",
  mainLoader,
  placement,
  style = "default",
  fullScreenOnMobile = true,
}: ModalV2Props) => {
  const { isVisible, toggleVisibility } = useBottomNav();
  const { width } = useWindowSize();
  const prevIsOpenRef = useRef(isOpen);

  const fullHeight = fullScreenOnMobile && width && width < 768 ? true : false;

  useEffect(() => {
    if (fullScreenOnMobile && width && width < 768) {
      if (isOpen && !prevIsOpenRef.current && isVisible) {
        // Modal is being opened and bottom nav is visible
        toggleVisibility();
      } else if (!isOpen && prevIsOpenRef.current && !isVisible) {
        // Modal is being closed and bottom nav is hidden
        toggleVisibility();
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, isVisible, width, fullScreenOnMobile]);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      backdrop="blur"
      placement={placement ? placement : "center"}
      hideCloseButton={true}
      size={size}
      radius="lg"
      shadow="lg"
      className={`${fullHeight ? "h-full max-h-screen" : ""} overflow-x-hidden`}
      classNames={{
        body: mainLoader
          ? ""
          : style === "default"
          ? "bg-card-grad h-full shadow-lg pb-10 md:p-0 rounded-lg overflow-x-hidden"
          : "bg-input-grad h-full shadow-lg pb-10 md:p-0 rounded-lg overflow-x-hidden",
        base: mainLoader
          ? "bg-transparent"
          : `rounded-lg border-cardborder border-2 modal-gradient-shadow ${
              fullHeight ? "h-full max-h-screen" : ""
            } overflow-x-hidden`,
        backdrop: mainLoader ? "" : "bg-black/50 backdrop-opacity-40",
        wrapper: fullHeight ? "h-full max-h-screen overflow-x-hidden" : "",
      }}
    >
      <ModalContent
        className={`${fullHeight ? "h-full" : ""} overflow-x-hidden`}
      >
        <ModalBody
          className={`${fullHeight ? "h-full p-0" : ""} ${
            fullScreenOnMobile && width && width < 768 ? "pb-20" : ""
          } overflow-x-hidden`}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalV2;
