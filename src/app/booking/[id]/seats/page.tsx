'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SeatsAPI } from '@/lib/api/booking';
import type { SeatMapResponse, Seat, TicketCounts } from '@/lib/types';
import { formatCountdown, getTotalTickets } from '@/lib/booking-utils';
import './seats-page.css';

type SeatsPageProps = {
    params: Promise<{ id: string }>;
};

export default function SeatsPage({ params }: SeatsPageProps) {
    const router = useRouter();
    const [showtimeId, setShowtimeId] = useState<string>('');
    const [seatMap, setSeatMap] = useState<SeatMapResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Load booking info from session
    const [bookingInfo, setBookingInfo] = useState<{
        booking_id: string;
        ticket_counts: TicketCounts;
        expires_at: string;
    } | null>(null);

    // Timer state
    const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

    useEffect(() => {
        // Load booking info
        const stored = sessionStorage.getItem('current_booking');
        if (stored) {
            setBookingInfo(JSON.parse(stored));
        }

        // Load showtime ID and fetch seat map
        params.then(({ id }) => {
            setShowtimeId(id);
            loadSeatMap(id);
        });
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!holdExpiresAt) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expires = new Date(holdExpiresAt).getTime();
            const diff = Math.max(0, Math.floor((expires - now) / 1000));

            setSecondsRemaining(diff);

            if (diff === 0) {
                // Hold expired - clear selection and refresh
                setSelectedSeats([]);
                setHoldExpiresAt(null);
                loadSeatMap(showtimeId);
                alert('Your seat hold has expired. Please select seats again.');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [holdExpiresAt, showtimeId]);

    async function loadSeatMap(id: string) {
        try {
            setLoading(true);
            const data = await SeatsAPI.getSeatMap(id);
            setSeatMap(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load seat map');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const requiredSeats = bookingInfo ? getTotalTickets(bookingInfo.ticket_counts) : 0;

    const handleSeatClick = (seatId: number, status: string) => {
        if (status !== 'available') return;

        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                // Deselect
                return prev.filter(id => id !== seatId);
            } else {
                // Select (if under limit)
                if (prev.length >= requiredSeats) {
                    alert(`You can only select ${requiredSeats} seat${requiredSeats !== 1 ? 's' : ''}`);
                    return prev;
                }
                return [...prev, seatId];
            }
        });
    };

    const handleHoldSeats = async () => {
        if (selectedSeats.length !== requiredSeats) {
            alert(`Please select exactly ${requiredSeats} seat${requiredSeats !== 1 ? 's' : ''}`);
            return;
        }

        try {
            setSubmitting(true);
            const holdResponse = await SeatsAPI.holdSeats(showtimeId, {
                seat_ids: selectedSeats,
                hold_minutes: 5,
            });

            setHoldExpiresAt(holdResponse.hold_expires_at);

            // Refresh seat map to show held seats
            await loadSeatMap(showtimeId);

            // Store selected seats for checkout
            sessionStorage.setItem('selected_seats', JSON.stringify(selectedSeats));

            // Navigate to checkout
            router.push(`/booking/${showtimeId}/checkout`);
        } catch (err: any) {
            alert(err.message || 'Failed to hold seats');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem' }}>
                    <p>Loading seat map...</p>
                </div>
            </main>
        );
    }

    if (error || !seatMap || !bookingInfo) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem' }}>
                    <p style={{ color: 'var(--error, #ef4444)' }}>
                        {error || 'Unable to load booking information'}
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        style={{
                            marginTop: '1rem',
                            padding: '0.75rem 1.5rem',
                            background: 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        Return Home
                    </button>
                </div>
            </main>
        );
    }

    const canContinue = selectedSeats.length === requiredSeats;

    return (
        <main className="seats-container">
            <div className="seats-header glass">
                <h1>Select Your Seats</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                    Choose {requiredSeats} seat{requiredSeats !== 1 ? 's' : ''} for your booking
                </p>
                {holdExpiresAt && secondsRemaining > 0 && (
                    <div className={`hold-timer ${secondsRemaining < 60 ? 'warning' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>Seats held: {formatCountdown(secondsRemaining)}</span>
                    </div>
                )}
            </div>

            <div className="seats-layout">
                {/* Seat Map */}
                <div className="seat-map-container glass">
                    <div className="screen-indicator">
                        <div className="screen">SCREEN</div>
                    </div>

                    <div className="seat-grid">
                        {seatMap.rows.map((row, rowIdx) => (
                            <div key={rowIdx} className="seat-row">
                                <div className="row-label">{row.row_label}</div>
                                <div className="seats">
                                    {row.seats.map((seat) => {
                                        const isSelected = selectedSeats.includes(seat.seat_id);
                                        return (
                                            <button
                                                key={seat.seat_id}
                                                className={`seat seat-${seat.status} ${isSelected ? 'selected' : ''}`}
                                                onClick={() => handleSeatClick(seat.seat_id, seat.status)}
                                                disabled={seat.status !== 'available' && !isSelected}
                                                title={`Seat ${seat.seat_number} - ${seat.status}`}
                                            >
                                                {seat.seat_number}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="seat-legend">
                        <div className="legend-item">
                            <div className="legend-box available"></div>
                            <span>Available</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-box selected"></div>
                            <span>Your Selection</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-box held"></div>
                            <span>Held</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-box sold"></div>
                            <span>Sold</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="seats-sidebar">
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Booking Summary</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>Tickets</div>
                            <div style={{ display: 'grid', gap: 4, marginTop: 4 }}>
                                {bookingInfo.ticket_counts.adult > 0 && (
                                    <div>{bookingInfo.ticket_counts.adult} Adult</div>
                                )}
                                {bookingInfo.ticket_counts.child > 0 && (
                                    <div>{bookingInfo.ticket_counts.child} Child</div>
                                )}
                                {bookingInfo.ticket_counts.senior > 0 && (
                                    <div>{bookingInfo.ticket_counts.senior} Senior</div>
                                )}
                            </div>
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'var(--glass-bg-hover, rgba(255, 255, 255, 0.05))',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                                Selected Seats
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 4 }}>
                                {selectedSeats.length} / {requiredSeats}
                            </div>
                        </div>

                        {selectedSeats.length > 0 && (
                            <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <div style={{ color: 'var(--text-tertiary)', marginBottom: 8 }}>
                                    Your seats:
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {selectedSeats.map(seatId => {
                                        const seat = seatMap.rows
                                            .flatMap(r => r.seats)
                                            .find(s => s.seat_id === seatId);
                                        return seat ? (
                                            <span
                                                key={seatId}
                                                style={{
                                                    padding: '4px 10px',
                                                    background: 'var(--accent)',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85rem',
                                                }}
                                            >
                        {seat.row_label}{seat.seat_number}
                      </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        className="continue-btn"
                        onClick={handleHoldSeats}
                        disabled={!canContinue || submitting}
                    >
                        {submitting ? 'Holding Seats...' : 'Continue to Checkout'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>

                    {!canContinue && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-tertiary)',
                            textAlign: 'center',
                            marginTop: 12
                        }}>
                            {selectedSeats.length === 0
                                ? `Select ${requiredSeats} seat${requiredSeats !== 1 ? 's' : ''} to continue`
                                : `Select ${requiredSeats - selectedSeats.length} more seat${(requiredSeats - selectedSeats.length) !== 1 ? 's' : ''}`
                            }
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}