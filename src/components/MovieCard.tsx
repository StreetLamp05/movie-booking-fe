import Link from 'next/link';
import type { Movie } from '@/lib/types';

export default function MovieCard({ movie }: { movie: Movie }) {
    return (
        <article style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
            <img src={movie.trailer_picture} alt={`${movie.title} poster`} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
            <div style={{ padding: 12 }}>
                <h3 style={{ margin: '4px 0' }}>{movie.title}</h3>
                <div style={{ fontSize: 12, color: '#666' }}>{movie.film_rating_code}</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {movie.categories?.map((c) => (
                        <span key={c.id} style={{ fontSize: 12, border: '1px solid #ddd', padding: '2px 6px', borderRadius: 999 }}>{c.name}</span>
                    ))}
                </div>
                <div style={{ marginTop: 10 }}>
                    <Link href={`/movie/${movie.id}`}>Details →</Link>
                </div>
            </div>
        </article>
    );
}