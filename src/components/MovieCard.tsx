'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Movie } from '@/lib/types';

export default function MovieCard({ movie, showtimes }: { movie: Movie; showtimes?: string[] }) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <article
            style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: isHovered ? '0 12px 32px rgba(0, 0, 0, 0.6)' : '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/movie/${movie.id}`} style={{ display: 'block', position: 'relative' }}>
                {imageError ? (
                    <div style={{
                        width: '100%',
                        height: 320,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        padding: '20px'
                    }}>
                        {movie.title}
                    </div>
                ) : (
                    <img
                        src={movie.trailer_picture}
                        alt={`${movie.title} poster`}
                        style={{
                            width: '100%',
                            height: 320,
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                        }}
                        onError={() => setImageError(true)}
                    />
                )}
            </Link>
            {showtimes && showtimes.length > 0 && (
                <div style={{
                    padding: '12px',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {showtimes.slice(0, 3).map((time, idx) => (
                        <button
                            key={idx}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                backgroundColor: '#6366f1',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#4f46e5';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#6366f1';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            )}
        </article>
    );
}