import { MoviesAPI, ShowtimesAPI } from '@/lib/api';
import TrailerEmbed from '@/components/TrailerEmbed';
import { notFound } from 'next/navigation';
import { fmtTime } from '@/lib/utils';


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
        <main style={{ display: 'grid', gap: 40, marginBottom: '60px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 40, alignItems: 'start' }}>
                <img
                    src={movie.trailer_picture}
                    alt={`${movie.title} poster`}
                    style={{
                        width: '100%',
                        borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                    }}
                />
                <div>
                    <h1 style={{
                        margin: '0 0 16px 0',
                        fontSize: '3rem',
                        fontWeight: '300',
                        color: 'white',
                        letterSpacing: '0.5px'
                    }}>
                        {movie.title}
                    </h1>
                    <div style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '1.1rem',
                        marginBottom: '24px'
                    }}>
                        Rotten Tomatoes: {movie.film_rating_code || 'N/A'}
                    </div>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        marginBottom: '32px'
                    }}>
                        {movie.synopsis || 'Description...'}
                    </p>
                    <button style={{
                        padding: '14px 32px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)'
                    }}>
                        View Trailer
                    </button>
                </div>
            </div>


            <section>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    color: 'white',
                    marginBottom: '24px',
                    letterSpacing: '0.5px'
                }}>
                    Available Showtimes
                </h2>
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap'
                }}>
                    {showtimes.slice(0, 8).map((showtime) => (
                        <button
                            key={showtime.showtime_id}
                            style={{
                                padding: '14px 28px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {fmtTime(showtime.starts_at)}
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}