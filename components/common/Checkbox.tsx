import React from "react";
import cx from "classnames";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

const Checkbox = (props: {
  children?: any;
  isChecked?: boolean;
  setIsChecked?: (isChecked: boolean) => void;
  disabled?: boolean;
  className?: string;
}) => {
  const { isChecked, setIsChecked, disabled, className } = props;

  return (
    <div
      className={cx(
        "flex items-center select-none",
        {
          "cursor-pointer": !disabled,
          "cursor-default pointer-events-none": disabled,
          "text-printer-dark-orange": disabled && isChecked,
        },
        className
      )}
      onClick={() => !disabled && setIsChecked && setIsChecked(!isChecked)}
    >
      <span className="inline-flex items-center">
        {isChecked ? (
          <ImCheckboxChecked className="text-xl text-printer-orange" />
        ) : (
          <ImCheckboxUnchecked className="text-xl text-printer-orange" />
        )}
      </span>
      <span className="inline-block align-middle text-sm">
        {props.children}
      </span>
    </div>
  );
};

export default Checkbox;
