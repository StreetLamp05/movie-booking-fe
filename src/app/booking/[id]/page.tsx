import { ShowtimesAPI, MoviesAPI } from '@/lib/api';
import { fmtDateTime } from '@/lib/utils';
import { notFound } from 'next/navigation';
import SeatGrid from '@/components/SeatGrid';

export default async function BookingPage({ params }: { params: { id: string } }) {
    const stId = params.id;

    // TODO: pull these from booking
    const rows = 5;
    const cols = 7;

    let showtime;
    try {
        showtime = await ShowtimesAPI.get(stId);
    } catch {
        notFound();
    }
    const movie = await MoviesAPI.get(showtime.movie_id);

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
                        <div style={{ 
                            color: 'var(--text-tertiary)', 
                            fontSize: 13
                        }}>
                            Showtime ID: {showtime.showtime_id}
                        </div>
                    </div>
                </div>
            </div>

            <section className="glass" style={{ padding: 24 }}>
                <h3 style={{ 
                    margin: '0 0 20px 0',
                    fontSize: '1.3rem',
                    fontWeight: 600
                }}>Ticket Selection</h3>
                <form>
                    <div style={{ 
                        display: 'grid', 
                        gap: 16, 
                        maxWidth: 520 
                    }}>
                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 500 }}>Child</span>
                            <input 
                                type="number" 
                                min={0} 
                                max={10} 
                                defaultValue={0} 
                                style={{ 
                                    width: 140,
                                    padding: '10px 16px'
                                }} 
                            />
                        </label>
                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 500 }}>Adult</span>
                            <input 
                                type="number" 
                                min={0} 
                                max={10} 
                                defaultValue={2} 
                                style={{ 
                                    width: 140,
                                    padding: '10px 16px'
                                }} 
                            />
                        </label>
                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 500 }}>Senior</span>
                            <input 
                                type="number" 
                                min={0} 
                                max={10} 
                                defaultValue={0} 
                                style={{ 
                                    width: 140,
                                    padding: '10px 16px'
                                }} 
                            />
                        </label>
                        <button 
                            type="button"
                            style={{
                                marginTop: 8,
                                padding: '14px 28px',
                                background: 'var(--accent)',
                                borderColor: 'var(--accent)',
                                fontSize: '16px',
                                fontWeight: 500
                            }}
                        >
                            Continue to Seat Selection
                        </button>
                    </div>
                </form>
            </section>

            <section className="glass" style={{ padding: 24 }}>
                <h3 style={{ 
                    margin: '0 0 20px 0',
                    fontSize: '1.3rem',
                    fontWeight: 600
                }}>Seat Preview</h3>
                
                <div style={{ 
                    textAlign: 'center',
                    marginBottom: 24
                }}>
                    <div style={{
                        display: 'inline-block',
                        background: 'var(--accent)',
                        height: '4px',
                        width: '60%',
                        borderRadius: '2px',
                        marginBottom: '8px'
                    }}></div>
                    <div style={{ 
                        fontSize: '12px',
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>Screen</div>
                </div>

                <SeatGrid rows={rows} cols={cols} />

                <p style={{ 
                    color: 'var(--text-tertiary)',
                    fontSize: '14px',
                    textAlign: 'center',
                    marginTop: '24px'
                }}>
                    <span style={{
                        display: 'inline-block',
                        background: 'var(--surface-secondary)',
                        padding: '4px 12px',
                        borderRadius: 'var(--border-radius-small)',
                        marginRight: '8px'
                    }}>ℹ️</span>
                    This is a prototype screen. Seat selection functionality coming soon.
                </p>
            </section>
        </main>
    );
}
