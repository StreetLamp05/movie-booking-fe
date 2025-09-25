import React from "react";
import Image, { StaticImageData } from "next/image";

export interface Movie {
  id: number;
  image: string;
  showtimes: string[];
  section?: "now-showing" | "coming-soon";
  title?: string;
}

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="w-[180px] flex-shrink-0">
      {/* Poster background */}
      <div className="w-[180px] h-[265px] bg-[#d9d9d9] rounded-b-[15px] border border-black opacity-60 relative" />

      {/* Movie poster */}
      <Image
        src={movie.image}
        alt={movie.title || "Movie poster"}
        className="w-[180px] h-[265px] object-cover rounded-t-[15px]"
      />

      {/* Showtimes */}
      <div className="flex gap-2 mt-2">
        {movie.showtimes.map((time, idx) => (
          <button
            key={idx}
            className="w-[43px] h-[26px] bg-[#5047cf] rounded-[10px] border border-black text-white text-[10px] flex items-center justify-center"
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};