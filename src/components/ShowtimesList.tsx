'use client';

import Link from 'next/link';
import type { Showtime } from '@/lib/types';
import { fmtDateTime, fmtTime, fmtMoney } from '@/lib/utils';
import './ShowtimesList.css';

export default function ShowtimesList({ showtimes }: { showtimes: Showtime[] }) {
    if (!showtimes.length) return (
        <p style={{ color: 'var(--text-secondary)' }}>No upcoming showtimes available.</p>
    );
    
    return (
        <ul style={{ 
            display: 'grid', 
            gap: 12, 
            listStyle: 'none', 
            padding: 0 
        }}>
            {showtimes.map((s) => (
                <li key={s.showtime_id} className="glass showtime-item">
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        gap: 16, 
                        alignItems: 'center' 
                    }}>
                        <div>
                            <div style={{ marginBottom: 8 }}>
                                <strong style={{ fontSize: '1.1rem' }}>{fmtTime(s.starts_at)}</strong> 
                                <span style={{ 
                                    color: 'var(--text-secondary)',
                                    marginLeft: 12
                                }}>{fmtDateTime(s.starts_at)}</span>
                            </div>
                            <div style={{ 
                                display: 'flex',
                                gap: 16,
                                fontSize: 14, 
                                color: 'var(--text-secondary)' 
                            }}>
                                <span>Adult {fmtMoney(s.adult_price_cents)}</span>
                                <span>•</span>
                                <span>Child {fmtMoney(s.child_price_cents)}</span>
                                <span>•</span>
                                <span>Senior {fmtMoney(s.senior_price_cents)}</span>
                            </div>
                        </div>
                        <Link 
                            href={`/booking/${s.showtime_id}`}
                            className="select-seats-btn">
                            Select Seats
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6"/>
                            </svg>
                        </Link>
                    </div>
                </li>
            ))}
        </ul>
    );
}
