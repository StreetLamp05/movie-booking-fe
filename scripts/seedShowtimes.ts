import 'dotenv/config';

interface ShowtimePayload {
    movie_id: number;
    auditorium_id: number;
    starts_at: string; // ISO string for timestamptz
    child_price_cents: number;
    adult_price_cents: number;
    senior_price_cents: number;
}

// Manually choose which 3 movies to seed showtimes for
const MOVIE_IDS: number[] = [40, 41, 43]; // <- change these as needed

// Map each movie to a specific auditorium
const AUDITORIUM_IDS: number[] = [1, 2, 3]; // movie 40 → aud 1, 41 → aud 2, 43 → aud 3

// Default prices in cents
const CHILD_PRICE = 800;
const ADULT_PRICE = 1200;
const SENIOR_PRICE = 900;

// Create timestamps every 3 hours from 12 PM – 11 PM today
function generateTimes(): string[] {
    const times: string[] = [];

    const now = new Date();
    const baseDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        12, // 12 PM
        0,
        0,
        0
    );

    // 12, 15, 18, 21 (3-hour steps)
    for (let hour = 12; hour <= 21; hour += 3) {
        const dt = new Date(baseDay);
        dt.setHours(hour);
        times.push(dt.toISOString());
    }

    // Explicitly add 11 PM as last show if you want it
    const elevenPm = new Date(baseDay);
    elevenPm.setHours(23);
    times.push(elevenPm.toISOString());

    return times;
}

export async function seedShowtimes() {
    try {
        console.log('Seeding showtimes...');
        const API_BASE =
            process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1';

        if (MOVIE_IDS.length !== AUDITORIUM_IDS.length) {
            throw new Error(
                `MOVIE_IDS and AUDITORIUM_IDS must be same length (got ${MOVIE_IDS.length} movies, ${AUDITORIUM_IDS.length} auditoriums)`
            );
        }

        const times = generateTimes();
        const showtimes: ShowtimePayload[] = [];

        // Pair each movie with its matching auditorium
        for (let i = 0; i < MOVIE_IDS.length; i++) {
            const movieId = MOVIE_IDS[i];
            const auditoriumId = AUDITORIUM_IDS[i];

            for (const startsAt of times) {
                showtimes.push({
                    movie_id: movieId,
                    auditorium_id: auditoriumId,
                    starts_at: startsAt,
                    child_price_cents: CHILD_PRICE,
                    adult_price_cents: ADULT_PRICE,
                    senior_price_cents: SENIOR_PRICE,
                });
            }
        }

        let successCount = 0;
        let errorCount = 0;

        for (const showtime of showtimes) {
            try {
                const response = await fetch(`${API_BASE}/showtimes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(showtime),
                });

                if (response.ok) {
                    const created = await response.json();
                    console.log(
                        `✓ Created showtime: movie_id=${showtime.movie_id}, auditorium_id=${showtime.auditorium_id}, starts_at=${showtime.starts_at} (ID: ${
                            created.showtime_id || created.id || 'unknown'
                        })`
                    );
                    successCount++;
                } else {
                    const errorText = await response.text();
                    console.error(
                        `✗ Failed to create showtime for movie_id=${showtime.movie_id}, auditorium_id=${showtime.auditorium_id}, starts_at=${showtime.starts_at}: ${response.status} - ${errorText}`
                    );
                    errorCount++;
                }
            } catch (error) {
                console.error(
                    `✗ Error creating showtime for movie_id=${showtime.movie_id}, auditorium_id=${showtime.auditorium_id}, starts_at=${showtime.starts_at}:`,
                    error
                );
                errorCount++;
            }
        }

        console.log('\nFinished seeding showtimes:');
        console.log(`Success: ${successCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log(`Total: ${showtimes.length}`);

        if (errorCount === 0) {
            console.log('\nAll showtimes seeded successfully');
        } else {
            console.log(
                `\nFailed to seed ${errorCount} showtimes. Check the logs for details.`
            );
            process.exit(1);
        }
    } catch (error) {
        console.error('\nSeeding showtimes failed:', error);
        process.exit(1);
    }
}

// Allow running this file directly: `ts-node seedShowtimes.ts`
if (require.main === module) {
    seedShowtimes();
}
