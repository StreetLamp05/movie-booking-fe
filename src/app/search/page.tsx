"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MovieCard } from "@/components/MovieCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query) return;

    console.log("Searching for:", query);
    {/* THIS IS THE CODE FOR API THAT NEEDS TO BE CHANGED TO MATCH BE CODE */}
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
       .then((res) => res.json())
       .then((data) => setResults(data));
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <main className="relative min-h-screen">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 blur-md">
        <Image
          src="/background.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Header */}
      <header className="w-full h-[140px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 blur-sm">
          <Image
            src="/header.png"
            alt="Header rectangle"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Header content */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center px-10">
          <Link href="/" className="text-white text-4xl font-black hover:opacity-80 transition">
            Movie Website
          </Link>

          {/* Search bar remains */}
          <form
            onSubmit={handleSearchSubmit}
            className="ml-auto flex items-center gap-2 bg-[#ece6f0] rounded-full px-4 py-2"
          >
            <input
              type="search"
              placeholder="Search movies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none px-2 py-1 text-gray-700"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-[#5047cf] text-white rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Results Section */}
      <section className="mt-8 px-10">
        {results.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-white text-lg">
            No results. Please try searching something else.
          </p>
        )}
      </section>
    </main>
  );
}