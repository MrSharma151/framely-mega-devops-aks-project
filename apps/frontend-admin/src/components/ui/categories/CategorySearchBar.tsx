"use client";

import { useEffect, useState, useRef } from "react";
import Button from "../Button";
import { X } from "lucide-react";

interface CategorySearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function CategorySearchBar({
  searchTerm,
  onSearch,
}: CategorySearchBarProps) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const inputRef = useRef<HTMLInputElement>(null);

  // Updates local input state when external search term changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Handles form submission and triggers search
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  // Clears the input field and resets search
  const handleClear = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row sm:items-end gap-4 mb-3 fade-in"
    >
      {/* Input field for category search with clear button */}
      <div className="relative w-full">
        <label className="block mb-1 text-sm text-secondary">
          Search Category
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pr-12"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-[65%] right-3 translate-y-[-50%] text-secondary hover:text-red-400 transition"
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Button to submit the search query */}
      <div className="sm:w-auto">
        <Button type="submit" size="sm" className="w-full sm:w-auto">
          Search
        </Button>
      </div>
    </form>
  );
}