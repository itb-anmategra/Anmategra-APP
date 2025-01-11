import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder: string;
}

export function SearchBar({ placeholder }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#636A6D]" />
      <input
        className="hover:border-black-300 h-10 w-full rounded-2xl border border-[#C4CACE] bg-white pl-10 pr-4 text-sm focus:outline-none"
        placeholder={placeholder}
        type="search"
      />
    </div>
  );
}