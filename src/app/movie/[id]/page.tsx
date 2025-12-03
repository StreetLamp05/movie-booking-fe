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

        <main style={{ display: 'grid', gap: 32, paddingBottom: '3rem' }}>
            <section>
                <h2 style={{
                    fontSize: '1.6rem',
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
                    Showtimes
                </h2>
                <ShowtimesList showtimes={showtimes} />
            </section>
            <div className="glass" style={{ 
                padding: '24px',
                display: 'grid', 
                gridTemplateColumns: '340px 1fr', 
                gap: 32 
            }}>

                <div style={{ position: 'relative' }}>
                    <img 
                        src={movie.trailer_picture} 
                        alt={`${movie.title} poster`} 
                        style={{ 
                            width: '100%', 
                            borderRadius: 'var(--border-radius)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                        }} 
                    />
                    <div className="glass" style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        padding: '6px 12px',
                        fontSize: '14px',
                        fontWeight: 600
                    }}>
                        {movie.film_rating_code}
                    </div>
                </div>
                <div>
                    <h1 style={{ 
                        margin: '0 0 8px 0',
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>{movie.title}</h1>
                    
                    <div style={{ 
                        display: 'flex', 
                        gap: 8, 
                        flexWrap: 'wrap',
                        marginBottom: 20
                    }}>
                        {movie.categories?.map((c) => (
                            <span key={c.id} className="glass" style={{ 
                                fontSize: 14, 
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontWeight: 500
                            }}>{c.name}</span>
                        ))}
                    </div>
                    
                    <p style={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        marginBottom: 24
                    }}>{movie.synopsis}</p>
                    
                    <div className="glass-secondary" style={{
                        padding: '16px',
                        borderRadius: 'var(--border-radius-small)',
                        display: 'grid',
                        gap: 12
                    }}>
                        <div>
                            <strong style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Director</strong>
                            <div>{movie.director}</div>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Producer</strong>
                            <div>{movie.producer}</div>
                        </div>
                        <div>
                            <strong style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Cast</strong>
                            <div>{movie.cast}</div>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                <h2 style={{ 
                    fontSize: '1.6rem',
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
                    Trailer
                </h2>
                <TrailerEmbed url={movie.video} />
            </section>


        </main>
    );
}
