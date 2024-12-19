import React from "react";
import FilterButton from "./FilterButton";

interface AssetPopupFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const AssetPopupFilters: React.FC<AssetPopupFiltersProps> = ({
  activeFilter,
  setActiveFilter,
}) => {
  const filters = [
    { title: "All" },
    { title: "Favorites" },
    { title: "Hot" },
    { title: "Memes" },
    { title: "DeFi" },
    { title: "AI" },
    { title: "Pre Launch" },
    { title: "NFTs" },
    { title: "Gaming" },
    { title: "L1s" },
  ];

  return (
    <div className="flex gap-2 pb-1.5 overflow-x-auto custom-scrollbar">
      {filters.map((filter) => (
        <FilterButton
          key={filter.title}
          title={filter.title}
          isActive={filter.title === activeFilter}
          onClick={() => setActiveFilter(filter.title)}
        />
      ))}
    </div>
  );
};

export default AssetPopupFilters;
