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

    useEffect(() => {
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
            let showtimeData;

            const directUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/showtimes/${id}`;
            const directResponse = await fetch(directUrl);

            if (directResponse.ok) {
                showtimeData = await directResponse.json();
            } else {
                const listUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/showtimes?limit=1000`;
                const listResponse = await fetch(listUrl);
                const listData = await listResponse.json();
                showtimeData = listData.data.find((st: any) => st.showtime_id === id);
                if (!showtimeData) throw new Error('Showtime not found');
            }

            const seatMapData = await SeatsAPI.getSeatMap(id);

            setShowtime(showtimeData);
            setSeatMap(seatMapData);
        } catch (err: any) {
            setError(err.message || 'Failed to load checkout data');
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

    const validateAssignments = () => {
        if (!bookingInfo) return false;

        for (const seatId of selectedSeats) {
            if (!ticketAssignments[seatId]) {
                alert('Please assign a ticket type to all selected seats');
                return false;
            }
        }

        const counts = { adult: 0, child: 0, senior: 0 };
        Object.values(ticketAssignments).forEach(type => counts[type]++);

        const { ticket_counts } = bookingInfo;
        if (
            counts.adult !== ticket_counts.adult ||
            counts.child !== ticket_counts.child ||
            counts.senior !== ticket_counts.senior
        ) {
            alert('Ticket counts must match your booking');
            return false;
        }

        return true;
    };

    const handleCheckout = async () => {
        if (!bookingInfo) return;
        if (!validateAssignments()) return;

        try {
            setSubmitting(true);

            const confirmed = await BookingsAPI.checkout(bookingInfo.booking_id, {
                seat_ids: selectedSeats,
                ticket_types: ticketAssignments,
            });

            sessionStorage.removeItem('current_booking');
            sessionStorage.removeItem('selected_seats');

            sessionStorage.setItem('confirmed_booking', JSON.stringify(confirmed));

            router.push(`/booking/${showtimeId}/confirmation`);
        } catch (err: any) {
            alert(err.message || 'Checkout failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="checkout-loading">
                <div className="glass">
                    <p>Loading checkout...</p>
                </div>
            </main>
        );
    }

    if (error || !showtime || !seatMap || !bookingInfo) {
        return (
            <main className="checkout-error">
                <div className="glass">
                    <p>{error || 'Unable to load checkout information'}</p>
                    <button onClick={() => router.push('/')}>Return Home</button>
                </div>
            </main>
        );
    }

    const allAssigned = selectedSeats.every(id => ticketAssignments[id]);
    const totalPrice = calculateTotalPrice(bookingInfo.ticket_counts, {
        adult_price_cents: showtime.adult_price_cents,
        child_price_cents: showtime.child_price_cents,
        senior_price_cents: showtime.senior_price_cents,
    });

    return (
        <main className="checkout-container">
            <div className="checkout-header glass">
                <h1>Assign Ticket Types</h1>
                <p>Match each selected seat to the correct ticket type</p>
            </div>

            <div className="checkout-grid">

                {/* LEFT SIDE — ASSIGNMENTS */}
                <div className="seat-assignments glass">

                    <h2>Your Seats</h2>

                    <div className="assignment-list">
                        {selectedSeats.map(seatId => {
                            const seat = seatMap.rows.flatMap(r => r.seats).find(s => s.seat_id === seatId);
                            if (!seat) return null;

                            return (
                                <div key={seatId} className="assignment-row">
                                    <div className="seat-info">
                                        <div className="seat-badge">{seat.row_label}{seat.seat_number}</div>
                                        <span>Select ticket type</span>
                                    </div>

                                    <select
                                        className="ticket-type-select"
                                        value={ticketAssignments[seatId] || ''}
                                        onChange={e => handleAssignment(seatId, e.target.value as any)}
                                    >
                                        <option value="">-- Select --</option>
                                        {bookingInfo.ticket_counts.adult > 0 && (
                                            <option value="adult">Adult — {formatCents(showtime.adult_price_cents)}</option>
                                        )}
                                        {bookingInfo.ticket_counts.child > 0 && (
                                            <option value="child">Child — {formatCents(showtime.child_price_cents)}</option>
                                        )}
                                        {bookingInfo.ticket_counts.senior > 0 && (
                                            <option value="senior">Senior — {formatCents(showtime.senior_price_cents)}</option>
                                        )}
                                    </select>
                                </div>
                            );
                        })}
                    </div>

                    <div className="assignment-summary">
                        <h4>Remaining</h4>
                        <div className="remaining-counts">
                            {bookingInfo.ticket_counts.adult > 0 && (
                                <span>
                                    {bookingInfo.ticket_counts.adult - Object.values(ticketAssignments).filter(t => t === 'adult').length} Adult
                                </span>
                            )}
                            {bookingInfo.ticket_counts.child > 0 && (
                                <span>
                                    {bookingInfo.ticket_counts.child - Object.values(ticketAssignments).filter(t => t === 'child').length} Child
                                </span>
                            )}
                            {bookingInfo.ticket_counts.senior > 0 && (
                                <span>
                                    {bookingInfo.ticket_counts.senior - Object.values(ticketAssignments).filter(t => t === 'senior').length} Senior
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — SUMMARY */}
                <div className="checkout-sidebar">

                    <div className="summary-card glass">
                        <h3>Order Summary</h3>

                        <div className="summary-block">
                            <label>Movie</label>
                            <div>Showtime #{showtimeId.slice(0, 8)}</div>
                        </div>

                        <div className="summary-block">
                            <label>Tickets</label>
                            {bookingInfo.ticket_counts.adult > 0 && (
                                <div className="summary-row">
                                    <span>{bookingInfo.ticket_counts.adult} Adult</span>
                                    <span>{formatCents(bookingInfo.ticket_counts.adult * showtime.adult_price_cents)}</span>
                                </div>
                            )}
                            {bookingInfo.ticket_counts.child > 0 && (
                                <div className="summary-row">
                                    <span>{bookingInfo.ticket_counts.child} Child</span>
                                    <span>{formatCents(bookingInfo.ticket_counts.child * showtime.child_price_cents)}</span>
                                </div>
                            )}
                            {bookingInfo.ticket_counts.senior > 0 && (
                                <div className="summary-row">
                                    <span>{bookingInfo.ticket_counts.senior} Senior</span>
                                    <span>{formatCents(bookingInfo.ticket_counts.senior * showtime.senior_price_cents)}</span>
                                </div>
                            )}
                        </div>

                        <div className="summary-block">
                            <label>Selected Seats</label>
                            <div className="seat-list">
                                {selectedSeats.map(seatId => {
                                    const seat = seatMap.rows.flatMap(r => r.seats).find(s => s.seat_id === seatId);
                                    return seat ? (
                                        <span key={seatId} className="seat-chip">
                                            {seat.row_label}{seat.seat_number}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>

                        <div className="total-box">
                            <span>Total</span>
                            <strong>{formatCents(totalPrice)}</strong>
                        </div>
                    </div>

                    <button
                        className="checkout-btn"
                        onClick={handleCheckout}
                        disabled={!allAssigned || submitting}
                    >
                        {submitting ? 'Processing...' : 'Complete Purchase'}
                    </button>

                    {!allAssigned && (
                        <p className="assign-hint">Assign all seats to continue</p>
                    )}
                </div>
            </div>
        </main>
    );
}
