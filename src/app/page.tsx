import GenreFilter from '../components/GenreFilter';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import { MoviesAPI, ShowtimesAPI } from '@/lib/api';
import type { Movie } from '@/lib/types';
import { fmtTime } from '@/lib/utils';


export default async function Home({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
    const q = (searchParams.q as string) || undefined;
    const category = Array.isArray(searchParams.category) ? (searchParams.category as string[]) : (searchParams.category ? [searchParams.category as string] : undefined);



    const moviesRes = await MoviesAPI.list({ q, category, category_mode: 'any', limit: 50, offset: 0, sort: 'title.asc' });
    const movies = moviesRes.data;



    const now = new Date();
    const to = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();


    const withShowtimesData: { movie: Movie; hasUpcoming: boolean; showtimes: string[] }[] = await Promise.all(
        movies.map(async (m) => {
            const s = await ShowtimesAPI.list({ movie_id: m.id, from: now.toISOString(), to, limit: 3, sort: 'starts_at.asc' });
            const showtimes = s.data.map(st => fmtTime(st.starts_at));
            return { movie: m, hasUpcoming: s.data.length > 0, showtimes };
        })
    );


    const running = withShowtimesData.filter((x) => x.hasUpcoming);
    const comingSoon = withShowtimesData.filter((x) => !x.hasUpcoming);

    const runningShowtimesMap = running.reduce((acc, item) => {
        acc[item.movie.id] = item.showtimes;
        return acc;
    }, {} as Record<number, string[]>);

    const comingSoonShowtimesMap = comingSoon.reduce((acc, item) => {
        acc[item.movie.id] = item.showtimes;
        return acc;
    }, {} as Record<number, string[]>);


    return (
        <main style={{ display: 'grid', gap: 24 }}>
            <section style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px',
                marginBottom: '24px'
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    color: 'white',
                    margin: 0,
                    letterSpacing: '0.5px'
                }}>
                    Now Showing
                </h2>
                <GenreFilter />
            </section>

            <section>
                {running.length ? <MovieGrid movies={running.map(x => x.movie)} showtimesMap={runningShowtimesMap} /> : <EmptyState title="No running titles match your filters." />}
            </section>


            <section style={{ marginBottom: '60px' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    color: 'white',
                    marginBottom: '24px',
                    letterSpacing: '0.5px'
                }}>
                    Coming Soon
                </h2>
                {comingSoon.length ? <MovieGrid movies={comingSoon.map(x => x.movie)} showtimesMap={comingSoonShowtimesMap} /> : <EmptyState title="No coming soon titles match your filters." />}
            </section>
        </main>
    );
}