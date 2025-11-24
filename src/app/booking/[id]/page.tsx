'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookingsAPI } from '@/lib/api/booking';
import type { Showtime, TicketCounts, Movie } from '@/lib/types';
import { calculateTotalPrice, formatCents, getTotalTickets } from '@/lib/booking-utils';
import './booking-page.css';

type BookingPageProps = {
    params: Promise<{ id: string }>;
};

export default function BookingPage({ params }: BookingPageProps) {
    const router = useRouter();
    const [showtimeId, setShowtimeId] = useState<string>('');
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [ticketCounts, setTicketCounts] = useState<TicketCounts>({
        adult: 0,
        child: 0,
        senior: 0,
    });

    const [submitting, setSubmitting] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        // Check for token in common key names
        const tokenKeys = ['access_token', 'token', 'authToken', 'jwt', 'accessToken'];
        let foundToken = false;

        // Check localStorage
        for (const key of tokenKeys) {
            if (localStorage.getItem(key)) {
                foundToken = true;
                console.log(`[Auth] Found token in localStorage.${key}`);
                break;
            }
        }

        // Check cookies if not found in localStorage
        if (!foundToken) {
            const cookies = document.cookie.split(';');
            for (const key of tokenKeys) {
                if (cookies.some(c => c.trim().startsWith(`${key}=`))) {
                    foundToken = true;
                    console.log(`[Auth] Found token in cookie.${key}`);
                    break;
                }
            }
        }

        // If still not found, might be httpOnly cookie (can't be read by JS)
        // We'll assume user is logged in and let the backend validate
        if (!foundToken) {
            console.log('[Auth] No token in localStorage/readable cookies.');
            console.log('[Auth] Assuming httpOnly cookie - backend will validate on request');
            // Don't show warning - httpOnly cookies are sent automatically
            foundToken = true; // Assume logged in, backend will return 401 if not
        }

        setIsAuthenticated(foundToken);
    }, []);

    // Load showtime ID from params
    useEffect(() => {
        params.then(({ id }) => {
            setShowtimeId(id);
            loadShowtime(id);
        });
    }, []);

    async function loadShowtime(id: string) {
        try {
            setLoading(true);

            // Try direct endpoint first
            const directUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/showtimes/${id}`;
            const directResponse = await fetch(directUrl);

            if (directResponse.ok) {
                const data = await directResponse.json();
                setShowtime(data);
            } else {
                // Fallback: fetch from list and find by ID
                const listUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/showtimes?limit=1000`;
                const listResponse = await fetch(listUrl);

                if (!listResponse.ok) {
                    throw new Error('Failed to load showtimes');
                }

                const listData = await listResponse.json();
                const found = listData.data.find((st: any) => st.showtime_id === id);

                if (!found) {
                    throw new Error('Showtime not found');
                }

                setShowtime(found);
            }
        } catch (err) {
            setError('Failed to load showtime details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const totalTickets = getTotalTickets(ticketCounts);
    const totalPrice = showtime ? calculateTotalPrice(ticketCounts, {
        adult_price_cents: showtime.adult_price_cents,
        child_price_cents: showtime.child_price_cents,
        senior_price_cents: showtime.senior_price_cents,
    }) : 0;

    const handleTicketChange = (type: keyof TicketCounts, value: number) => {
        setTicketCounts(prev => ({
            ...prev,
            [type]: Math.max(0, value),
        }));
    };

    const handleContinue = async () => {
        if (totalTickets === 0) {
            alert('Please select at least one ticket');
            return;
        }

        try {
            setSubmitting(true);

            // Create booking reservation
            const booking = await BookingsAPI.create({
                showtime_id: showtimeId,
                ticket_counts: ticketCounts,
            });

            // Store booking info in sessionStorage
            sessionStorage.setItem('current_booking', JSON.stringify({
                booking_id: booking.booking_id,
                ticket_counts: ticketCounts,
                expires_at: booking.expires_at,
            }));

            // Navigate to seat selection
            router.push(`/booking/${showtimeId}/seats`);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to create booking';
            console.error('Booking error:', err);

            // Check if it's an auth error
            if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
                alert('Authentication failed. Your session may have expired. Please log out and log back in.');
                console.error('[Auth] 401 Unauthorized - Session may be expired or httpOnly cookie not sent');
            } else {
                alert(errorMessage);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem', maxWidth: 600, margin: '0 auto' }}>
                    <p>Loading showtime details...</p>
                </div>
            </main>
        );
    }

    if (error || !showtime) {
        return (
            <main style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="glass" style={{ padding: '3rem', maxWidth: 600, margin: '0 auto' }}>
                    <p style={{ color: 'var(--error, #ef4444)' }}>{error || 'Showtime not found'}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="booking-container">
            <div className="booking-header glass">
                <h1>Select Tickets</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
                    Choose the number and type of tickets for your booking
                </p>
                {!isAuthenticated && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #ef4444',
                        borderRadius: '8px',
                        color: '#fca5a5',
                        fontSize: '0.9rem'
                    }}>
                        ⚠️ You must be logged in to make a booking. Please log in first.
                    </div>
                )}
            </div>

            <div className="booking-grid">
                {/* Left: Ticket Selection */}
                <div className="ticket-selection glass">
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.3rem' }}>Ticket Types</h2>

                    <div className="ticket-type-list">
                        <TicketTypeRow
                            label="Adult"
                            price={showtime.adult_price_cents}
                            count={ticketCounts.adult}
                            onChange={(val) => handleTicketChange('adult', val)}
                        />

                        <TicketTypeRow
                            label="Child"
                            subtitle="Ages 2-12"
                            price={showtime.child_price_cents}
                            count={ticketCounts.child}
                            onChange={(val) => handleTicketChange('child', val)}
                        />

                        <TicketTypeRow
                            label="Senior"
                            subtitle="Ages 65+"
                            price={showtime.senior_price_cents}
                            count={ticketCounts.senior}
                            onChange={(val) => handleTicketChange('senior', val)}
                        />
                    </div>

                    {totalTickets > 0 && (
                        <div className="ticket-summary">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)'
                            }}>
                                <span>{totalTickets} ticket{totalTickets !== 1 ? 's' : ''}</span>
                                <span>Subtotal</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                marginTop: 8
                            }}>
                                <span></span>
                                <span>{formatCents(totalPrice)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Showtime Info + Continue */}
                <div className="booking-sidebar">
                    <div className="glass" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Showtime Details</h3>

                        <div style={{ display: 'grid', gap: 12, fontSize: '0.95rem' }}>
                            <div>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Date & Time</div>
                                <div style={{ fontWeight: 500 }}>
                                    {new Date(showtime.starts_at).toLocaleString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                </div>
                            </div>

                            <div>
                                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Auditorium</div>
                                <div style={{ fontWeight: 500 }}>#{showtime.auditorium_id}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="continue-btn"
                        onClick={handleContinue}
                        disabled={totalTickets === 0 || submitting}
                    >
                        {submitting ? 'Processing...' : 'Continue to Seat Selection'}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>

                    {totalTickets === 0 && (
                        <p style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-tertiary)',
                            textAlign: 'center',
                            marginTop: 12
                        }}>
                            Select at least one ticket to continue
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
}

function TicketTypeRow({
                           label,
                           subtitle,
                           price,
                           count,
                           onChange
                       }: {
    label: string;
    subtitle?: string;
    price: number;
    count: number;
    onChange: (value: number) => void;
}) {
    return (
        <div className="ticket-type-row">
            <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>{label}</div>
                {subtitle && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>{subtitle}</div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontWeight: 600, minWidth: 60, textAlign: 'right' }}>
                    {formatCents(price)}
                </div>

                <div className="ticket-counter">
                    <button
                        className="counter-btn"
                        onClick={() => onChange(count - 1)}
                        disabled={count === 0}
                    >
                        −
                    </button>
                    <span className="counter-value">{count}</span>
                    <button
                        className="counter-btn"
                        onClick={() => onChange(count + 1)}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}