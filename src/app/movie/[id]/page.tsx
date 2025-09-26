import { MoviesAPI, ShowtimesAPI } from '@/lib/api';
import TrailerEmbed from '@/components/TrailerEmbed';
import ShowtimesList from '@/components/ShowtimesList';
import { notFound } from 'next/navigation';


export default async function MoviePage({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    let movie;
    try {
        movie = await MoviesAPI.get(id);
    } catch {
        notFound();
    }


    const nowISO = new Date().toISOString();
    const showtimes = (await ShowtimesAPI.list({ movie_id: id, from: nowISO, sort: 'starts_at.asc', limit: 100 })).data;


    return (
        <main style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>
                <img src={movie.trailer_picture} alt={`${movie.title} poster`} style={{ width: '100%', borderRadius: 8 }} />
                <div>
                    <h1 style={{ margin: '4px 0' }}>{movie.title}</h1>
                    <div style={{ color: '#666' }}>{movie.film_rating_code}</div>
                    <p>{movie.synopsis}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {movie.categories?.map((c) => (
                            <span key={c.id} style={{ fontSize: 12, border: '1px solid #ddd', padding: '2px 6px', borderRadius: 999 }}>{c.name}</span>
                        ))}
                    </div>
                </div>
            </div>


            <section>
                <h2>Trailer</h2>
                <TrailerEmbed url={movie.video} />
            </section>


            <section>
                <h2>Showtimes</h2>
                <ShowtimesList showtimes={showtimes} />
            </section>
        </main>
    );
}