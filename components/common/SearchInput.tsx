import React from "react";
import { RiSearch2Line } from "react-icons/ri";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ComponentType; // Optional prop to allow custom icons
  searchName: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
  icon: Icon = RiSearch2Line,
  searchName,
}) => {
  return (
    <div className="flex flex-row items-center gap-2 w-full py-2 px-4 lg:min-w-[350px] rounded bg-input-grad border-cardborder border-2">
      <Icon className="text-[#F5F6FA] text-2xl" />
      <div className="w-px h-full bg-printer-gray"></div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        name={searchName}
        onChange={onChange}
        className="text-gray-text text-[15px] bg-transparent outline-none focus:outline-none focus:ring-0 ring-0 w-full"
      />
    </div>
  );
};

export default SearchInput;
