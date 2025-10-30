'use client';

import Link from 'next/link';
import type { Movie } from '@/lib/types';
import './MovieCard.css';

export default function MovieCard({ movie }: { movie: Movie }) {
    return (
        <article className="glass movie-card">
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                <img 
                    src={movie.trailer_picture} 
                    alt={`${movie.title} poster`} 
                    className="movie-poster"
                />
                <div className="poster-overlay" />
            </div>
            <div style={{ padding: 16 }}>
                <h3 style={{ 
                    margin: '4px 0', 
                    fontSize: '1.1rem',
                    fontWeight: 600 
                }}>{movie.title}</h3>
                <div style={{ 
                    fontSize: 14, 
                    color: 'var(--text-secondary)',
                    marginBottom: 8 
                }}>{movie.film_rating_code}</div>
                <div style={{ 
                    marginTop: 12, 
                    display: 'flex', 
                    gap: 6, 
                    flexWrap: 'wrap' 
                }}>
                    {movie.categories?.map((c) => (
                        <span key={c.id} className="glass category-tag">
                            {c.name}
                        </span>
                    ))}
                </div>
                <div style={{ marginTop: 16 }}>
                    <Link 
                        href={`/movie/${movie.id}`} 
                        className="view-details-btn">
                        View Details →
                    </Link>
                </div>
            </div>
        </article>
    );
}
