"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MovieCard } from "@/components/MovieCard";
import { Filter } from "@/components/Filter";

interface MovieType {
  id: number;
  title: string;
  image: string; // URL from DB
  showtimes: string[];
  section: "now-showing" | "coming-soon";
}

export default function Page() {
  {/* THIS IS THE CODE FOR API THAT NEEDS TO BE CHANGED TO MATCH BE CODE */}
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data: MovieType[]) => setMovies(data))
      .catch((err) => console.error("Failed to fetch movies:", err));
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main className="relative min-h-screen bg-transparent">
      {/* Main background image */}
      <div className="absolute top-0 left-0 w-full h-full -z-20 blur-sm">
        <Image
          src="/background.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Header */}
      <header className="w-full h-[140px] relative z-10 overflow-visible">
        {/* Blurred header background */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 blur-sm">
          <Image
            src="/header.png"
            alt="Header rectangle"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Header content */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center px-10 relative z-20">
          <h1 className="text-white text-4xl font-black">Movie Website</h1>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="ml-auto flex items-center gap-2 bg-[#ece6f0] rounded-full px-4 py-2"
          >
            <input
              type="search"
              placeholder="Search movies"
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-transparent outline-none px-2 py-1 text-gray-700"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-[#5047cf] text-white rounded-full"
            >
              Search
            </button>
          </form>

          {/* Filter dropdown */}
          <div className="ml-4 relative z-20">
            <Filter selectedGenres={selectedGenres} onChange={setSelectedGenres} />
          </div>
        </div>
      </header>

      {/* Movie Sections */}
      <section aria-labelledby="now-showing-heading" className="mt-8 px-10">
        <h2
          id="now-showing-heading"
          className="text-white text-3xl font-semibold mb-4"
        >
          Now Showing
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {movies
            .filter((m) => m.section === "now-showing")
            .map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </section>

      <section aria-labelledby="coming-soon-heading" className="mt-8 px-10">
        <h2
          id="coming-soon-heading"
          className="text-white text-3xl font-semibold mb-4"
        >
          Coming Soon
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {movies
            .filter((m) => m.section === "coming-soon")
            .map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </section>
    </main>
  );
}