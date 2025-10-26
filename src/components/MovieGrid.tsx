'use client';
import { useRef } from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '@/lib/types';


export default function MovieGrid({ movies, showtimesMap }: { movies: Movie[]; showtimesMap?: Record<number, string[]> }) {
    const scrollRef = useRef<HTMLElement>(null);

    if (!movies.length) return <p>No movies yet.</p>;
    return (
        <section
            ref={scrollRef}
            style={{
                display: 'flex',
                gap: 16,
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingBottom: '16px',
                paddingTop: '20px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(99, 102, 241, 0.5) rgba(255, 255, 255, 0.1)'
            }}
        >
            {movies.map((m) => (
                <div key={m.id} style={{
                    minWidth: '240px',
                    flexShrink: 0
                }}>
                    <MovieCard movie={m} showtimes={showtimesMap?.[m.id]} />
                </div>
            ))}
        </section>
    );
}