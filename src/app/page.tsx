import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import { MoviesAPI, ShowtimesAPI } from '@/lib/api';
import type { Movie } from '@/lib/types';


export default async function Home({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
    const q = (searchParams.q as string) || undefined;
    const category = Array.isArray(searchParams.category) ? (searchParams.category as string[]) : (searchParams.category ? [searchParams.category as string] : undefined);



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
        <main style={{ display: 'grid', gap: 24 }}>
            <section style={{ display: 'grid', gap: 12 }}>
                <SearchBar />
                <GenreFilter />
            </section>


            <section>
                <h2>Currently Running</h2>
                {running.length ? <MovieGrid movies={running} /> : <EmptyState title="No running titles match your filters." />}
            </section>


            <section>
                <h2>Coming Soon</h2>
                {comingSoon.length ? <MovieGrid movies={comingSoon} /> : <EmptyState title="No coming soon titles match your filters." />}
            </section>
        </main>
    );
}