import { Search } from "lucide-react";

interface EmployeeFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const EmployeeFilters = ({
  searchQuery,
  setSearchQuery,
}: EmployeeFiltersProps) => {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-xl 
                    border border-gray-200 dark:border-white/10 
                    bg-white dark:bg-gs-surface 
                    shadow-sm w-full max-w-sm"
    >
      {/* Icon */}
      <Search size={18} className="text-gray-400 dark:text-gs-soft" />

      {/* Input */}
      <input
        type="text"
        id="searchQuery"
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
        placeholder="Search employees..."
        className="w-full bg-transparent outline-none 
                   text-sm text-gs-dark dark:text-gs-text-main 
                   placeholder:text-gray-400 dark:placeholder:text-gs-soft"
      />
    </div>
  );
};

export default EmployeeFilters;
