'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './order-history.css';


interface OrderHistory {
    booking_id: string;
    order_date: string;
    total_cents: number;
    ticket_count: number;
    movie: {
        title: string;
        film_rating_code: string;
    }
    showtime: {
        starts_at: string;
    };
}

export default function OrderHistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<OrderHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1'}/bookings/history`, {
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Failed to fetch order history');
            }

            const data = await response.json();
            setOrders(data.data);

            /* Mock Data for testing
            setOrders([
                {
                    booking_id: 'abc123',
                    order_date: '2024-06-15T14:30:00Z',
                    total_cents: 4500,
                    ticket_count: 3,
                    movie: {
                        title: 'Inception',
                        film_rating_code: 'PG-13',
                    },
                    showtime: {
                        starts_at: '2024-06-20T19:00:00Z',
                    }, 
                },
                {
                    booking_id: 'def456',
                    order_date: '2024-05-10T10:15:00Z',
                    total_cents: 3000,
                    ticket_count: 2,
                    movie: {
                        title: 'The Matrix',
                        film_rating_code: 'R',
                    },
                    showtime: {
                        starts_at: '2024-05-15T21:00:00Z',
                    }, 
                }
            ]);
            */
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    if (loading) {
        return (
            <main className="orders-container">
                <div className="glass" style={{padding: '2rem', textAlign: 'center'}}>
                    Loading order history...
                </div>
            </main>
        );
    }

    return (
        <main className="orders-container">
            <div className="order-history-header glass">
                <Link href="/profile" className="back-link">
                    Back to Profile
                </Link>
                <h1 className="order-history-title">Order History</h1>
            </div>

            {error && (
                <div className="error-message glass-error">
                    {error}
                </div>
            )}

            <div className="orders-list">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <section key={order.booking_id} className="order-card glass">
                            <div className="order-info">
                                <div className="order-row">
                                    <span className="order-label">Movie:</span>
                                    <span>{order.movie.title} ({order.movie.film_rating_code})</span>
                                </div>
                                <div className="order-row">
                                    <span className="order-label">Showtime:</span>
                                    <span>{formatDate(order.showtime.starts_at)}</span>
                                </div>
                                <div className="order-row">
                                    <span className="order-label">Booking #:</span>
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                                        {order.booking_id}
                                    </span>
                                </div>
                                <div className="order-row">
                                    <span className="order-label">Tickets:</span>
                                    <span>{order.ticket_count}</span>
                                </div>
                                <div className="order-row">
                                    <span className="order-label">Total Price:</span>
                                    <span style={{ fontWeight: 600 }}>{formatPrice(order.total_cents)}</span>
                                </div>
                                <div className="order-row">
                                    <span className="order-label">Date of Order:</span>
                                    <span>{formatDate(order.order_date)}</span>
                                </div>
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            No orders found. Order history will only appear after completing a booking
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}