import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { FaArrowLeft, FaChevronDown, FaMinus, FaPlus } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";

const Divider = () => {
  return (
    <div className="w-full h-px bg-white opacity-20 text-transparent">-</div>
  );
};

const Settings = ({
  handleSettingsBackClick,
}: {
  handleSettingsBackClick: () => void;
}) => {
  const [maxActions, setMaxActions] = useState(10);
  const [initialTopUp, setInitialTopUp] = useState(0.005);
  const [convertAmount, setConvertAmount] = useState(0.005);
  const [maxAutoTopUp, setMaxAutoTopUp] = useState(0.005);

  const handleMaxActionsChange = (isIncrease: boolean) => {
    if (isIncrease) {
      setMaxActions(maxActions + 1);
    } else {
      setMaxActions(maxActions - 1);
    }
  };

  const handleInitialTopUpChange = (isIncrease: boolean) => {
    if (isIncrease) {
      setInitialTopUp(initialTopUp + 0.001);
    } else {
      setInitialTopUp(initialTopUp - 0.001);
    }
  };

  const handleConvertAmountChange = (isIncrease: boolean) => {
    if (isIncrease) {
      setConvertAmount(convertAmount + 0.001);
    } else {
      setConvertAmount(convertAmount - 0.001);
    }
  };

  const handleMaxAutoTopUpChange = (isIncrease: boolean) => {
    if (isIncrease) {
      setMaxAutoTopUp(maxAutoTopUp + 0.001);
    } else {
      setMaxAutoTopUp(maxAutoTopUp - 0.001);
    }
  };

  return (
    <div className="min-h-screen h-full bg-card-grad text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row items-center justify-between pb-6">
          <FaArrowLeft
            className="cursor-pointer text-white hover:opacity-80"
            onClick={handleSettingsBackClick}
          />
          <p className="text-lg font-medium text-white">Preferences</p>
          {/* Empty div to push the right side to the right */}
          <div></div>
        </div>
        <div className="space-y-4">
          <Divider />
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex flex-col">
              <p className="text-sm text-white">Currency</p>
              <p className="text-sm text-white">USD</p>
            </div>
            <FaChevronDown className="text-white cursor-pointer hover:opacity-80" />
          </div>
          <Divider />
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex flex-col">
              <p className="text-sm text-white">Max Actions</p>
              <p className="text-sm text-white">{maxActions}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaMinus
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => handleMaxActionsChange(false)}
              />
              <FaPlus
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => handleMaxActionsChange(true)}
              />
            </div>
          </div>
          <Divider />
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex flex-col">
              <p className="text-sm text-white">Initial Top Up</p>
              <p className="text-sm text-white">{initialTopUp}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaMinus
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => handleInitialTopUpChange(false)}
              />
              <FaPlus
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => handleInitialTopUpChange(true)}
              />
            </div>
          </div>
          <Divider />
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex flex-col">
              <p className="text-sm text-white">Convert Amount</p>
              <p className="text-sm text-white">{convertAmount}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaMinus
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => handleConvertAmountChange(false)}
              />
              <FaPlus
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => handleConvertAmountChange(true)}
              />
            </div>
          </div>
          <Divider />
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex flex-col">
              <p className="text-sm text-white">Max Auto Top Up</p>
              <p className="text-sm text-white">{maxAutoTopUp}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaMinus
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => handleMaxAutoTopUpChange(false)}
              />
              <FaPlus
                className="text-white cursor-pointer hover:opacity-80"
                onClick={() => handleMaxAutoTopUpChange(true)}
              />
            </div>
          </div>
          <Divider />
          <div className="flex w-full items-center justify-center gap-4 px-8">
            <IoIosWarning className="text-printer-red w-9 h-9" />
            <p className="text-printer-red text-15 font-normal text-wrap">
              You have unsaved changes, be sure to save them before you proceed.
            </p>
          </div>
          <div className="flex w-full items-center justify-center px-8 py-4">
            <Button className="bg-green-grad hover:bg-green-grad-hover border-printer-green border-2 text-white rounded-[53px] w-full">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
