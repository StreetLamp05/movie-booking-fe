// app/movie-detail/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";

interface MovieDetailType {
  id: number;
  title: string;
  image: string;
  rottenTomatoesScore?: string;
  description: string;
  showtimes: string[];
  trailerUrl?: string;
}

export default function MovieDetailPage() {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const movieId = params?.id;

  useEffect(() => {
    if (movieId) {
      {/* THIS IS THE CODE FOR API THAT NEEDS TO BE CHANGED TO MATCH BE CODE */}
      fetch(`/api/movie-detail/${movieId}`)
        .then((res) => res.json())
        .then((data: MovieDetailType) => {
          setMovie(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch movie details:", err);
          setLoading(false);
        });
    }
  }, [movieId]);

  const handleViewTrailer = () => {
    if (movie?.trailerUrl) {
      window.open(movie.trailerUrl, "_blank");
    }
  };

  return (
    <main className="relative min-h-screen">
      {/* Main background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 blur-sm">
        <Image
          src="/background.png"
          alt="Background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Header */}
      <header className="w-full h-[140px] relative z-10 overflow-visible">
        <div className="absolute top-0 left-0 w-full h-full -z-10 blur-sm">
          <Image
            src="/header.png"
            alt="Header rectangle"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center px-10 relative z-20">
          <h1
            className="text-white text-4xl font-black cursor-pointer"
            onClick={() => router.push("/")}
          >
            Movie Website
          </h1>
        </div>
      </header>

      {/* Movie Content */}
      <section className="relative z-20 px-10 pt-8 min-h-[calc(100vh-140px)] flex items-center justify-center">
        {loading ? (
          <p className="text-white text-xl">Loading...</p>
        ) : movie ? (
          <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full">
            {/* Movie Poster */}
            <div className="flex-shrink-0 w-[300px] h-[450px] relative rounded-lg overflow-hidden">
              <Image
                src={movie.image}
                alt={movie.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white">
              <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>

              <p className="text-lg text-gray-300 mb-6">
                Rotten Tomatoes: {movie.rottenTomatoesScore || "N/A"}
              </p>

              <p className="text-lg leading-relaxed text-gray-200 mb-8">
                {movie.description || "Description..."}
              </p>

              {movie.trailerUrl && (
                <button
                  onClick={handleViewTrailer}
                  className="bg-blue-600/80 hover:bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 mb-8"
                >
                  View Trailer
                </button>
              )}

              {/* Showtimes */}
              <div className="mt-12">
                <h2 className="text-white text-3xl font-semibold mb-6">
                  Available Showtimes
                </h2>
                <div className="flex gap-4 flex-wrap">
                  {movie.showtimes.map((showtime, index) => (
                    <button
                      key={index}
                      className="bg-blue-500/30 hover:bg-blue-500/50 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200 backdrop-blur-sm border border-blue-400/30"
                    >
                      {showtime}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-white text-xl text-center">
              Movie not found. Please try another one.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}