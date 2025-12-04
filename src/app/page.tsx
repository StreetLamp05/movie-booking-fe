import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import { MoviesAPI, ShowtimesAPI } from '@/lib/api';
import type { Movie } from '@/lib/types';

export default async function Home({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const q = (params.q as string) || undefined;
    const category = Array.isArray(params.category) ? (params.category as string[]) : (params.category ? [params.category as string] : undefined);

    const moviesRes = await MoviesAPI.list({ q, category, category_mode: 'any', limit: 50, offset: 0, sort: 'title.asc' });
    const movies = moviesRes.data;

    const now = new Date();
    const to = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const withShowtimesFlags: { movie: Movie; hasUpcoming: boolean }[] = await Promise.all(
        movies.map(async (m) => {
            const s = await ShowtimesAPI.list({ movie_id: m.id, from: now.toISOString(), to, limit: 1, sort: 'starts_at.asc' });
            return { movie: m, hasUpcoming: s.data.length > 0 };
        })
    );

    const running = withShowtimesFlags.filter((x) => x.hasUpcoming).map((x) => x.movie);
    const comingSoon = withShowtimesFlags.filter((x) => !x.hasUpcoming).map((x) => x.movie);

    return (
        <main style={{ display: 'grid', gap: 32, paddingBottom: '3rem' }}>
            <section style={{ display: 'grid', gap: 16 }}>
                <SearchBar />
                <GenreFilter />
            </section>

            <section>
                <h2 style={{ 
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{
                        width: '4px',
                        height: '24px',
                        background: 'var(--accent)',
                        borderRadius: '2px'
                    }}></span>
                    Currently Running
                </h2>
                {running.length ? <MovieGrid movies={running} /> : <EmptyState title="No running titles match your filters." subtitle="Try adjusting your search or genre filters" />}
            </section>

            <section>
                <h2 style={{ 
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{
                        width: '4px',
                        height: '24px',
                        background: 'var(--accent)',
                        borderRadius: '2px'
                    }}></span>
                    Coming Soon
                </h2>
                {comingSoon.length ? <MovieGrid movies={comingSoon} /> : <EmptyState title="No coming soon titles match your filters." subtitle="Check back later for upcoming releases" />}
            </section>
        </main>
    );
}
