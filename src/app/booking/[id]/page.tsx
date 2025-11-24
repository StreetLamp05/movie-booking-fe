import { ShowtimesAPI, MoviesAPI, AuditoriumsAPI } from '@/lib/api';
import { fmtDateTime } from '@/lib/utils';
import { notFound } from 'next/navigation';


export default async function BookingPage({ params }: { params: { id: string } }) {
    const stId = params.id;

    let showtime;
    try {
        showtime = await ShowtimesAPI.get(stId);
    } catch {
        notFound();
    }
    const movie = await MoviesAPI.get(showtime.movie_id);
    const auditorium = await AuditoriumsAPI.get(showtime.auditorium_id);

    return (
        <main style={{ display: 'grid', gap: 24, paddingBottom: '3rem' }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 600,
                margin: '0 0 8px 0'
            }}>Complete Your Booking</h1>

            <div className="glass" style={{
                padding: 20,
                display: 'flex',
                gap: 24
            }}>
                <img
                    src={movie.trailer_picture}
                    alt={`${movie.title} poster`}
                    style={{
                        width: 140,
                        borderRadius: 'var(--border-radius-small)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                />
                <div style={{ flex: 1 }}>
                    <h2 style={{
                        margin: '0 0 8px 0',
                        fontSize: '1.5rem',
                        fontWeight: 600
                    }}>{movie.title}</h2>
                    <div style={{
                        display: 'grid',
                        gap: 8,
                        fontSize: '15px'
                    }}>
                        <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Showtime:</span>{' '}
                            <strong>{fmtDateTime(showtime.starts_at)}</strong>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-secondary)' }}>Auditorium:</span>{' '}
                            <strong>{auditorium.name}</strong>
                        </div>
                        <div style={{
                            color: 'var(--text-tertiary)',
                            fontSize: 13
                        }}>
                            Showtime ID: {showtime.showtime_id}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
