import MovieCard from './MovieCard';
import type { Movie } from '@/lib/types';


export default function MovieGrid({ movies }: { movies: Movie[] }) {
    if (!movies.length) return <p>No movies yet.</p>;
    return (
        <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
        }}>
            {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </section>
    );
}