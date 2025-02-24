"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

export function SearchBar({ onSearch }: { onSearch: Function }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleChange = (e: any) => {
    const value = e.target.value;

    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative group transition-all">
      <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-1000" />
      <div className="relative flex items-center bg-slate-900/70 border border-slate-800/50 rounded-lg">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          className="w-full pl-10 pr-12 py-3 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-0"
          placeholder="Search articles..."
          type="text"
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <button
            className="absolute right-3 p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}