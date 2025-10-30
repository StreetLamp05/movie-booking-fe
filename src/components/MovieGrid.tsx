import MovieCard from './MovieCard';
import type { Movie } from '@/lib/types';

export default function MovieGrid({ movies }: { movies: Movie[] }) {
    if (!movies.length) return <p style={{ color: 'var(--text-secondary)' }}>No movies yet.</p>;
    return (
        <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
        }}>
            {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </section>
    );
}
