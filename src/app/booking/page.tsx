// app/booking/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get title + showtime from query params
  const movieTitle = searchParams.get("title") || "Unknown Movie";
  const showtime = searchParams.get("showtime") || "Unknown Showtime";

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

      {/* Booking Info */}
      <section className="relative z-20 px-10 pt-8 min-h-[calc(100vh-140px)] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">{movieTitle}</h1>
        <p className="text-2xl text-gray-200">
          Selected Showtime: <span className="font-semibold">{showtime}</span>
        </p>
      </section>
    </main>
  );
}