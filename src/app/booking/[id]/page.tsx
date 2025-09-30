import { ShowtimesAPI, MoviesAPI } from '@/lib/api';
import { fmtDateTime } from '@/lib/utils';
import { notFound } from 'next/navigation';




export default async function BookingPage({ params }: { params: { showtime_id: string } }) {
    const stId = params.id;

    // TODO: pull these from booking
    const rows = 5;
    const cols = 7;
    const imageUrl = "/chair.svg";
    //

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
                <h3>Ticket Selection</h3>
                <form>
                    <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
                        <label>
                            Child
                            <input type="number" min={1} max={10} defaultValue={0} style={{ display: 'block', width: 120, padding: 8 }} />
                        </label>
                        <label>
                            Adult
                            <input type="number" min={1} max={10} defaultValue={2} style={{ display: 'block', width: 120, padding: 8 }} />
                        </label>
                        <label>
                            Senior
                            <input type="number" min={1} max={10} defaultValue={0} style={{ display: 'block', width: 120, padding: 8 }} />
                        </label>
                        <button type="button">Continue (UI only)</button>
                    </div>
                </form>
            </section>


            <p style={{ color: '#666' }}>
                This is a prototype screen. Seat selection, pricing, and checkout will be added in later sprints.
            </p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    width: "100%",
                    aspectRatio: `${cols} / ${rows}`,
                }}
            >
                {Array.from({ length: rows * cols }).map((_, idx) => (
                    <img
                        key={idx}
                        src={imageUrl}
                        alt="Grid item"
                        style={{
                            width: "80%",
                            height: "80%",
                            objectFit: "cover",
                        }}
                    />
                ))}
            </div>

        </main>
    );
}