"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { API_BASE_URL } from "@/api/config";

interface Movie {
  id: number;
  title: string;
  description: string;
  image: string;
  releaseDate: string;
  rottenTomatoes: string;
  showtimes: string[];
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`${API_BASE_URL}/movies/${id}`);
        if (!res.ok) throw new Error("Failed to fetch movie");
        const data = await res.json();
        setMovie(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchMovie();
  }, [id]);

  if (loading) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#060d22] to-[#162a6c] text-white">
      <p className="text-2xl animate-pulse">Loading movie details...</p>
    </main>
  );
}

if (error || !movie) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#060d22] to-[#162a6c] text-white text-center px-4">
      {/* 
<Image
  src="/error-illustration.svg"
  alt="Movie not found"
  width={200}
  height={200}
  className="mb-6 opacity-80"
/> 
*/}
      <h1 className="text-5xl font-bold mb-4">Movie Not Found</h1>
      <p className="text-lg text-gray-300 max-w-xl mb-8">
        We couldn’t find the movie you’re looking for. It might not exist yet, or the server isn’t online.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-[#5047cf] hover:bg-[#3d39a6] transition rounded-full text-white text-lg"
      >
        ← Back to Movie List
      </button>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#060d22] to-[#162a6c] text-white px-10 py-16">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center mb-16">
        <h1 className="text-4xl font-black">Movie Website</h1>
        <button
          onClick={() => router.push("/")}
          className="text-white text-lg underline hover:text-gray-300 transition"
        >
          ← Back to Movies
        </button>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Poster Section */}
        <div className="flex flex-col items-center">
          <div className="relative w-80 h-[480px] rounded-lg overflow-hidden shadow-lg">
            <Image
              src={movie.image}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <button className="mt-8 px-6 py-3 bg-[#d9d9d9] text-black text-2xl rounded-lg hover:bg-[#c0c0c0] transition">
            View Trailer
          </button>
        </div>

        {/* Movie Details Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
          <p className="text-xl text-gray-300 mb-6">{movie.description}</p>

          <div className="text-lg mb-2">
            <span className="font-semibold">Release Date:</span> {movie.releaseDate}
          </div>

          <div className="text-lg mb-2">
            <span className="font-semibold">Rotten Tomatoes:</span>{" "}
            {movie.rottenTomatoes || "N/A"}
          </div>

          {/* Showtimes */}
          <h2 className="text-3xl font-semibold mt-12 mb-4">Available Showtimes</h2>
          {movie.showtimes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {movie.showtimes.map((time) => (
                <div
                  key={time}
                  className="bg-[#d9d9d9] text-black rounded-lg py-3 text-center text-xl hover:bg-[#c0c0c0] transition"
                >
                  {time}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No showtimes available.</p>
          )}
        </div>
      </div>
    </main>
  );
}
