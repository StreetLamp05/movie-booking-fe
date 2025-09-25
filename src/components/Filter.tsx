"use client";

import React from "react";

interface FilterProps {
  className?: string;
  selectedGenres: string[];
  onChange: (genres: string[]) => void;
}

const dummyGenres = ["Action", "Comedy", "Horror", "Romance", "Sci-Fi"];

export const Filter: React.FC<FilterProps> = ({
  className,
  selectedGenres,
  onChange,
}) => {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`relative inline-block ${className || ""}`}>
      <button
        onClick={toggleDropdown}
        className="bg-gray-300 p-2 rounded hover:bg-gray-400 transition"
      >
        Filter
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg z-10">
          <p className="font-semibold px-3 py-2 border-b border-gray-200">
            Select Genres
          </p>
          <div className="flex flex-col px-3 py-2 gap-1 max-h-60 overflow-y-auto">
            {dummyGenres.map((genre) => (
              <label key={genre} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                  className="w-4 h-4"
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};