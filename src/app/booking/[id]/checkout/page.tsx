'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingsAPI, SeatsAPI } from '@/lib/api/booking';
import type { TicketCounts, Showtime, SeatMapResponse, TicketTypeAssignment } from '@/lib/types';
import { formatCents, calculateTotalPrice } from '@/lib/booking-utils';
import './checkout-page.css';

type CheckoutPageProps = {
    params: Promise<{ id: string }>;
};

export default function CheckoutPage({ params }: CheckoutPageProps) {
    const router = useRouter();
    const [showtimeId, setShowtimeId] = useState<string>('');
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [seatMap, setSeatMap] = useState<SeatMapResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [bookingInfo, setBookingInfo] = useState<{
        booking_id: string;
        ticket_counts: TicketCounts;
        expires_at: string;
    } | null>(null);

    const [ticketAssignments, setTicketAssignments] = useState<TicketTypeAssignment>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [promoCode, setPromoCode] = useState<string>('');
    const [promoApplied, setPromoApplied] = useState<{
        code: string;
        discount_percent: number;
    } | null>(null);
    const [promoError, setPromoError] = useState<string>('');
    const [checkingPromo, setCheckingPromo] = useState<boolean>(false);

    useEffect(() => {
        // Load booking and seat data
        const storedBooking = sessionStorage.getItem('current_booking');
        const storedSeats = sessionStorage.getItem('selected_seats');

        if (storedBooking) setBookingInfo(JSON.parse(storedBooking));
        if (storedSeats) setSelectedSeats(JSON.parse(storedSeats));

        params.then(({ id }) => {
            setShowtimeId(id);
            loadData(id);
        });
    }, []);

    async function loadData(id: string) {
        try {
            setLoading(true);

            // Fetch showtime - try direct endpoint, fallback to list
            let showtimeData;
            const directUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/showtimes/${id}`;
            const directResponse = await fetch(directUrl);

            if (directResponse.ok) {
                showtimeData = await directResponse.json();
            } else {
                // Fallback: fetch from list
                const listUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/showtimes?limit=1000`;
                const listResponse = await fetch(listUrl);
                const listData = await listResponse.json();
                showtimeData = listData.data.find((st: any) => st.showtime_id === id);
                if (!showtimeData) throw new Error('Showtime not found');
            }

            // Fetch seat map
            const seatMapData = await SeatsAPI.getSeatMap(id);

            setShowtime(showtimeData);
            setSeatMap(seatMapData);
        } catch (err: any) {
            setError(err.message || 'Failed to load checkout data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleAssignment = (seatId: number, type: 'adult' | 'child' | 'senior') => {
        setTicketAssignments(prev => ({
            ...prev,
            [seatId]: type,
        }));
    };

    const validateAssignments = (): boolean => {
        if (!bookingInfo) return false;

        // Check all seats have assignments
        for (const seatId of selectedSeats) {
            if (!ticketAssignments[seatId]) {
                alert('Please assign a ticket type to all selected seats');
                return false;
            }
        }

        // Count assignments
        const counts = { adult: 0, child: 0, senior: 0 };
        Object.values(ticketAssignments).forEach((type) => {
            counts[type]++;
        });

        // Verify counts match booking
        const { ticket_counts } = bookingInfo;
        if (
            counts.adult !== ticket_counts.adult ||
            counts.child !== ticket_counts.child ||
            counts.senior !== ticket_counts.senior
        ) {
            alert(
                `Ticket assignments must match your booking:\n` +
                `Adult: ${ticket_counts.adult}, Child: ${ticket_counts.child}, Senior: ${ticket_counts.senior}`
            );
            return false;
        }

        return true;
    };

    const handleApplyPromo = async () => {
        if (promoCode.trim() === '') {
            setPromoError('Please enter a promo code');
            return;
        }

        try {
            setCheckingPromo(true);
            setPromoError('');

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/promotions/validate`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ code: promoCode.trim() }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPromoError(data.message || 'Invalid promo code');
                return;
            }

            setPromoApplied({
                code: promoCode.trim(),
                discount_percent: data.discount_percent,
            });
            setPromoError('');
        } catch (err: any) {
            setPromoError('Failed to validate promo code');
            console.error(err);
        } finally {
            setCheckingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setPromoApplied(null);
        setPromoCode('');
        setPromoError('');
    }

    const handleCheckout = async () => {
        if (!bookingInfo) return;
        if (!validateAssignments()) return;

        try {
            setSubmitting(true);

            const confirmedBooking = await BookingsAPI.checkout(bookingInfo.booking_id, {
                seat_ids: selectedSeats,
                ticket_types: ticketAssignments,
            });

            // Clear session storage
            sessionStorage.removeItem('current_booking');
            sessionStorage.removeItem('selected_seats');

            // Store confirmation for display
            sessionStorage.setItem('confirmed_booking', JSON.stringify(confirmedBooking));

            // Navigate to confirmation
            router.push(`/booking/${showtimeId}/confirmation`);
        } catch (err: any) {
            alert(err.message || 'Failed to complete checkout');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem' }}>
                    <p>Loading checkout...</p>
                </div>
            </main>
        );
    }

    if (error || !showtime || !seatMap || !bookingInfo || selectedSeats.length === 0) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem' }}>
                    <p style={{ color: 'var(--error, #ef4444)' }}>
                        {error || 'Unable to load checkout information'}
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

    const allAssigned = selectedSeats.every(id => ticketAssignments[id]);
    const subTotalPrice = calculateTotalPrice(bookingInfo.ticket_counts, {
        adult_price_cents: showtime.adult_price_cents,
        child_price_cents: showtime.child_price_cents,
        senior_price_cents: showtime.senior_price_cents,
    });

    const discount = promoApplied
        ? Math.round(subTotalPrice * (promoApplied.discount_percent / 100))
        : 0;

    const totalPrice = subTotalPrice - discount;

    return (
        <main className="checkout-container">
            <div className="checkout-header glass">
                <h1>Assign Ticket Types</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                    Assign each seat to the correct ticket type
                </p>
            </div>

            <div className="checkout-grid">
                {/* Left: Seat Assignments */}
                <div className="seat-assignments glass">
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Your Seats</h2>

                    <div className="assignment-list">
                        {selectedSeats.map(seatId => {
                            const seat = seatMap.rows
                                .flatMap(r => r.seats)
                                .find(s => s.seat_id === seatId);

                            if (!seat) return null;

                            return (
                                <div key={seatId} className="assignment-row">
                                    <div className="seat-info">
                                        <div className="seat-badge">
                                            {seat.row_label}{seat.seat_number}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                                            Select ticket type
                                        </div>
                                    </div>

                                    <select
                                        className="ticket-type-select"
                                        value={ticketAssignments[seatId] || ''}
                                        onChange={(e) => handleAssignment(seatId, e.target.value as any)}
                                    >
                                        <option value="">-- Select --</option>
                                        {bookingInfo.ticket_counts.adult > 0 && (
                                            <option value="adult">Adult - {formatCents(showtime.adult_price_cents)}</option>
                                        )}
                                        {bookingInfo.ticket_counts.child > 0 && (
                                            <option value="child">Child - {formatCents(showtime.child_price_cents)}</option>
                                        )}
                                        {bookingInfo.ticket_counts.senior > 0 && (
                                            <option value="senior">Senior - {formatCents(showtime.senior_price_cents)}</option>
                                        )}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    <div className="assignment-summary">
                        <div style={{ fontSize: '0.9rem', marginBottom: 8 }}>
                            Remaining to assign:
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: '0.95rem' }}>
                            {bookingInfo.ticket_counts.adult > 0 && (
                                <span>
                  <strong>{bookingInfo.ticket_counts.adult - Object.values(ticketAssignments).filter(t => t === 'adult').length}</strong> Adult
                </span>
                            )}
                            {bookingInfo.ticket_counts.child > 0 && (
                                <span>
                  <strong>{bookingInfo.ticket_counts.child - Object.values(ticketAssignments).filter(t => t === 'child').length}</strong> Child
                </span>
                            )}
                            {bookingInfo.ticket_counts.senior > 0 && (
                                <span>
                  <strong>{bookingInfo.ticket_counts.senior - Object.values(ticketAssignments).filter(t => t === 'senior').length}</strong> Senior
                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Summary + Checkout */}
                <div className="checkout-sidebar">
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Order Summary</h3>

                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                                Movie
                            </div>
                            <div style={{ fontWeight: 600 }}>Showtime #{showtimeId.slice(0, 8)}</div>
                        </div>

                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                                Tickets
                            </div>
                            <div style={{ display: 'grid', gap: 4, fontSize: '0.95rem' }}>
                                {bookingInfo.ticket_counts.adult > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{bookingInfo.ticket_counts.adult} Adult</span>
                                        <span>{formatCents(bookingInfo.ticket_counts.adult * showtime.adult_price_cents)}</span>
                                    </div>
                                )}
                                {bookingInfo.ticket_counts.child > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{bookingInfo.ticket_counts.child} Child</span>
                                        <span>{formatCents(bookingInfo.ticket_counts.child * showtime.child_price_cents)}</span>
                                    </div>
                                )}
                                {bookingInfo.ticket_counts.senior > 0 && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{bookingInfo.ticket_counts.senior} Senior</span>
                                        <span>{formatCents(bookingInfo.ticket_counts.senior * showtime.senior_price_cents)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                                Selected Seats
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
                        

                        <div style={{
                            padding: '1rem',
                            background: 'var(--glass-bg-hover, rgba(255, 255, 255, 0.05))',
                            borderRadius: '8px',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total</span>
                                <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  {formatCents(totalPrice)}
                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={!allAssigned || submitting}
                    >
                        {submitting ? 'Processing...' : 'Complete Purchase'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </button>

                    {!allAssigned && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-tertiary)',
                            textAlign: 'center',
                            marginTop: 12
                        }}>
                            Assign all seats to continue
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}