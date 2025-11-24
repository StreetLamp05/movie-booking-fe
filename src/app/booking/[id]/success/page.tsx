import { BookingsAPI, ShowtimesAPI, MoviesAPI } from '@/lib/api';
import { fmtDateTime } from '@/lib/utils';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BookingSuccessPage({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams: { bookingId?: string };
}) {
    if (!searchParams.bookingId) {
        notFound();
    }

    let booking;
    try {
        booking = await BookingsAPI.getBooking(searchParams.bookingId);
    } catch {
        notFound();
    }

    const showtime = await ShowtimesAPI.get(booking.showtime_id);
    const movie = await MoviesAPI.get(showtime.movie_id);

    // Group tickets by seat
    const seatMap = new Map(
        booking.tickets.map(ticket => [ticket.seat_id, ticket])
    );

    return (
        <main style={{ display: 'grid', gap: 24, paddingBottom: '3rem', maxWidth: 800, margin: '0 auto' }}>
            {/* Success Header */}
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                    fontSize: '4rem',
                    marginBottom: 16
                }}>✓</div>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 600,
                    margin: '0 0 8px 0',
                    color: 'var(--accent)'
                }}>Booking Confirmed!</h1>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem'
                }}>
                    Your tickets have been reserved
                </p>
            </div>

            {/* Booking Details */}
            <section className="glass" style={{ padding: 24 }}>
                <h3 style={{
                    margin: '0 0 20px 0',
                    fontSize: '1.3rem',
                    fontWeight: 600
                }}>Booking Details</h3>

                <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                    <img
                        src={movie.trailer_picture}
                        alt={`${movie.title} poster`}
                        style={{
                            width: 120,
                            borderRadius: 'var(--border-radius-small)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                    />
                    <div style={{ flex: 1 }}>
                        <h4 style={{
                            margin: '0 0 12px 0',
                            fontSize: '1.3rem',
                            fontWeight: 600
                        }}>{movie.title}</h4>
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
                                <span style={{ color: 'var(--text-secondary)' }}>Booking ID:</span>{' '}
                                <strong style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                                    {booking.booking_id}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: 16,
                    background: 'var(--surface-secondary)',
                    borderRadius: 'var(--border-radius-small)',
                    marginBottom: 20
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12
                    }}>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Total Paid:</span>
                        <span style={{ fontWeight: 600, fontSize: '1.5rem', color: 'var(--accent)' }}>
                            ${(booking.total_price_cents / 100).toFixed(2)}
                        </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {booking.tickets.length} ticket{booking.tickets.length !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Tickets List */}
                <h4 style={{
                    margin: '20px 0 12px 0',
                    fontSize: '1.1rem',
                    fontWeight: 600
                }}>Your Tickets</h4>

                <div style={{ display: 'grid', gap: 12 }}>
                    {booking.tickets.map((ticket, idx) => (
                        <div
                            key={ticket.ticket_id}
                            className="glass"
                            style={{
                                padding: 16,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                                    Ticket #{idx + 1}
                                </div>
                                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{ticket.age_category}</span>
                                    {' • '}
                                    Seat: <strong>{ticket.seat_id.slice(0, 8)}</strong>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                    ${(ticket.price_cents / 100).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <Link href="/profile">
                    <button style={{
                        padding: '12px 24px',
                        background: 'var(--accent)',
                        borderColor: 'var(--accent)',
                        fontSize: '15px',
                        fontWeight: 500
                    }}>
                        View My Bookings
                    </button>
                </Link>
                <Link href="/">
                    <button style={{
                        padding: '12px 24px',
                        background: 'var(--surface-secondary)',
                        borderColor: 'var(--border)',
                        fontSize: '15px',
                        fontWeight: 500
                    }}>
                        Back to Home
                    </button>
                </Link>
            </div>

            <div style={{
                textAlign: 'center',
                padding: '20px',
                color: 'var(--text-tertiary)',
                fontSize: '14px'
            }}>
                <p style={{ margin: 0 }}>
                    A confirmation email has been sent to your registered email address.
                </p>
            </div>
        </main>
    );
}
