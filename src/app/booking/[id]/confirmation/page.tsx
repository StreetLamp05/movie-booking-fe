'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ConfirmedBooking } from '@/lib/types';
import { formatCents } from '@/lib/booking-utils';
import './confirmation-page.css';

export default function ConfirmationPage() {
    const router = useRouter();
    const [booking, setBooking] = useState<ConfirmedBooking | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem('confirmed_booking');
        if (stored) {
            setBooking(JSON.parse(stored));
        } else {
            // No booking found - redirect home
            router.push('/');
        }
    }, [router]);

    if (!booking) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem' }}>
                    <p>Loading confirmation...</p>
                </div>
            </main>
        );
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const showDateTime = booking.showtime ? formatDateTime(booking.showtime.starts_at) : null;

    return (
        <main className="confirmation-container">
            {/* Designed by Claude */}
            <div className="confirmation-card glass">
                <div className="success-animation">
                    <svg className="checkmark" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>

                <h1 style={{
                    margin: '1.5rem 0 0.5rem',
                    fontSize: '2rem',
                    fontWeight: 700,
                    textAlign: 'center'
                }}>
                    Booking Confirmed!
                </h1>

                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '1.1rem',
                    marginBottom: '2rem'
                }}>
                    Your tickets have been successfully reserved
                </p>

                <div className="booking-id">
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                        Booking ID
                    </div>
                    <div style={{
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        marginTop: '0.25rem'
                    }}>
                        {booking.booking_id.slice(0, 8).toUpperCase()}
                    </div>
                </div>

                {/* Movie & Showtime Details */}
                {booking.movie && booking.showtime && booking.auditorium && (
                    <div style={{
                        margin: '1.5rem 0',
                        padding: '1rem',
                        background: 'var(--glass-bg, rgba(255, 255, 255, 0.03))',
                        borderRadius: '8px',
                        borderLeft: '3px solid var(--accent)'
                    }}>
                        <div style={{
                            display: 'grid',
                            gap: '1rem'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                                    Movie
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                    {booking.movie.title}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                                    Rating: {booking.movie.film_rating_code}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>
                                    Theater & Showtime
                                </div>
                                <div style={{ fontSize: '0.95rem' }}>
                                    <div style={{ fontWeight: 600 }}>
                                        {booking.auditorium.name}
                                    </div>
                                    {showDateTime && (
                                        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                                            <div>{showDateTime.date}</div>
                                            <div>{showDateTime.time}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="ticket-details">
                    <h3 style={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        marginBottom: '1rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        paddingBottom: '0.75rem'
                    }}>
                        Your Tickets
                    </h3>

                    <div className="ticket-list">
                        {booking.tickets.map((ticket, idx) => (
                            <div key={ticket.ticket_id} className="ticket-item">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div className="ticket-number">#{idx + 1}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                                            {ticket.ticket_type}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                                            Seat: {ticket.seat_display || `Seat ${ticket.seat_id}`}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 600 }}>
                                    {formatCents(ticket.price_cents)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="total-amount">
                        <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total Paid</span>
                        <span style={{ fontSize: '1.8rem', fontWeight: 700 }}>
              {formatCents(booking.total_cents)}
            </span>
                    </div>
                </div>

                <div className="confirmation-actions">
                    <Link href="/" className="action-btn primary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Back to Home
                    </Link>

                    <button
                        className="action-btn secondary"
                        onClick={() => window.print()}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9"/>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                            <rect x="6" y="14" width="12" height="8"/>
                        </svg>
                        Print Tickets
                    </button>
                </div>

                {booking.user_email && (
                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'var(--glass-bg, rgba(255, 255, 255, 0.03))',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'center'
                    }}>
                        <p style={{ margin: 0 }}>
                            Confirmation email sent to <strong>{booking.user_email}</strong>
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}