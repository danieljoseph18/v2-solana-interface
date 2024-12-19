import { ChangeEvent, RefObject, useState, useEffect } from "react";

const inputRegex = /^\d*\.?\d*$/;

type Props = {
  value?: string | number;
  inputRef?: RefObject<HTMLInputElement>;
  onValueChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
};

function NumberInput({
  value = "",
  inputRef,
  onValueChange,
  onFocus,
  onBlur,
  className,
  placeholder,
}: Props) {
  const [internalValue, setInternalValue] = useState(value.toString());

  // Update internalValue when the prop value changes
  useEffect(() => {
    setInternalValue(value.toString());
  }, [value]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!onValueChange) return;

    const newValue = e.target.value.replace(/,/g, ".");

    if (newValue === "" || newValue === ".") {
      setInternalValue(newValue);
      onValueChange(newValue === "." ? "0." : newValue);
      return;
    }

    if (inputRegex.test(newValue)) {
      setInternalValue(newValue);
      onValueChange(newValue);
    }
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder={placeholder}
      className={`${className}`}
      value={internalValue}
      ref={inputRef}
      onChange={onChange}
      autoComplete="off"
      autoCorrect="off"
      minLength={1}
      maxLength={15}
      spellCheck="false"
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}

export default NumberInput;
