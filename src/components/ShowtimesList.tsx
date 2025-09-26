import Link from 'next/link';
import type { Showtime } from '@/lib/types';
import { fmtDateTime, fmtTime, fmtMoney } from '@/lib/utils';


export default function ShowtimesList({ showtimes }: { showtimes: Showtime[] }) {
    if (!showtimes.length) return <p>No upcoming showtimes.</p>;
    return (
        <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
            {showtimes.map((s) => (
                <li key={s.showtime_id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                        <div>
                            <div><strong>{fmtTime(s.starts_at)}</strong> <span style={{ color: '#666' }}>({fmtDateTime(s.starts_at)})</span></div>
                            <div style={{ fontSize: 12, color: '#666' }}>Adult {fmtMoney(s.adult_price_cents)} • Child {fmtMoney(s.child_price_cents)} • Senior {fmtMoney(s.senior_price_cents)}</div>
                        </div>
                        <Link href={`/booking/${s.showtime_id}`}>Select</Link>
                    </div>
                </li>
            ))}
        </ul>
    );
}