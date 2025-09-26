import { ShowtimesAPI, MoviesAPI } from '@/lib/api';
import { fmtDateTime } from '@/lib/utils';
import { notFound } from 'next/navigation';


export default async function BookingPage({ params }: { params: { showtime_id: string } }) {
    const stId = params.showtime_id;
    let showtime;
    try {
        showtime = await ShowtimesAPI.get(stId);
    } catch {
        notFound();
    }
    const movie = await MoviesAPI.get(showtime.movie_id);


    return (
        <main style={{ display: 'grid', gap: 16 }}>
            <h1>Booking</h1>
            <div style={{ display: 'flex', gap: 16 }}>
                <img src={movie.trailer_picture} alt={`${movie.title} poster`} style={{ width: 160, borderRadius: 8 }} />
                <div>
                    <h2 style={{ margin: '4px 0' }}>{movie.title}</h2>
                    <div>Showtime: <strong>{fmtDateTime(showtime.starts_at)}</strong></div>
                    <div style={{ color: '#666', fontSize: 12 }}>Showtime ID: {showtime.showtime_id}</div>
                </div>
            </div>


            <section style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
                <h3>Customer Details</h3>
                <form>
                    <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
                        <label>
                            Name
                            <input style={{ display: 'block', width: '100%', padding: 8 }} placeholder="Jane Doe" />
                        </label>
                        <label>
                            Email
                            <input type="email" style={{ display: 'block', width: '100%', padding: 8 }} placeholder="jane@example.com" />
                        </label>
                        <label>
                            Tickets
                            <input type="number" min={1} max={10} defaultValue={2} style={{ display: 'block', width: 120, padding: 8 }} />
                        </label>
                        <button type="button">Continue (UI only)</button>
                    </div>
                </form>
            </section>


            <p style={{ color: '#666' }}>
                This is a prototype screen. Seat selection, pricing, and checkout will be added in later sprints.
            </p>
        </main>
    );
}