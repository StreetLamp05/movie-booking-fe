================================================
FILE: README.md
================================================
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

    ```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

    This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

    - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

                                                                           Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



================================================
FILE: biome.json
================================================
{
    "$schema": "https://biomejs.dev/schemas/2.2.0/schema.json",
    "vcs": {
        "enabled": true,
        "clientKind": "git",
        "useIgnoreFile": true
    },
    "files": {
        "ignoreUnknown": true,
        "includes": ["**", "!node_modules", "!.next", "!dist", "!build"]
    },
    "formatter": {
        "enabled": true,
        "indentStyle": "space",
        "indentWidth": 2
    },
    "linter": {
        "enabled": true,
        "rules": {
            "recommended": true,
            "suspicious": {
                "noUnknownAtRules": "off"
            }
        },
        "domains": {
            "next": "recommended",
            "react": "recommended"
        }
    },
    "assist": {
        "actions": {
            "source": {
                "organizeImports": "on"
            }
        }
    }
}



================================================
FILE: next.config.ts
================================================
import type { NextConfig } from "next";

const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:5000";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
            },
        ];
    },
};

export default nextConfig;



================================================
FILE: package.json
================================================
{
    "name": "movie-booking-fe",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "dev": "next dev --turbopack",
        "build": "next build --turbopack",
        "start": "next start",
        "lint": "biome check",
        "format": "biome format --write",
        "seed": "tsx scripts/seed.ts"
    },
    "dependencies": {
        "next": "15.5.4",
        "react": "19.1.0",
        "react-dom": "19.1.0",
        "react-toastify": "^11.0.5"
    },
    "devDependencies": {
        "@biomejs/biome": "2.2.0",
        "@tailwindcss/postcss": "^4",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "tailwindcss": "^4",
        "tsx": "^4.20.6",
        "typescript": "^5"
    }
}



================================================
FILE: postcss.config.mjs
================================================
const config = {
    plugins: ["@tailwindcss/postcss"],
};

export default config;



================================================
FILE: tsconfig.json
================================================
{
    "compilerOptions": {
        "target": "ES2017",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [
            {
                "name": "next"
            }
        ],
        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}



================================================
FILE: scripts/endpoints.txt
================================================
Authentication Routes (/api/v1/auth)
POST /api/v1/auth/signup - Register a new user
POST /api/v1/auth/login - Login user
POST /api/v1/auth/logout - Logout user
POST /api/v1/auth/verify-email - Verify email address
POST /api/v1/auth/resend-verification - Resend verification email
POST /api/v1/auth/forgot-password - Request password reset
POST /api/v1/auth/reset-password - Reset password with token
    User Routes (/api/v1/users)
GET /api/v1/users/profile - Get user profile (requires auth)
PUT /api/v1/users/profile - Update user profile (requires auth)
GET /api/v1/users/cards - Get user's payment cards (requires auth)
POST /api/v1/users/cards - Add a payment card (requires auth)
DELETE /api/v1/users/cards/:id - Delete a payment card (requires auth)
Movie Routes (/api/v1/movies)
GET /api/v1/movies - Get all movies (with filters/pagination)
    GET /api/v1/movies/:id - Get movie by ID
POST /api/v1/movies - Create a new movie (admin)
PUT /api/v1/movies/:id - Update movie (admin)
DELETE /api/v1/movies/:id - Delete movie (admin)
Showtime Routes (/api/v1/showtimes)
GET /api/v1/showtimes - Get all showtimes (with filters)
    GET /api/v1/showtimes/:id - Get showtime by ID
POST /api/v1/showtimes - Create a showtime (admin)
PUT /api/v1/showtimes/:id - Update showtime (admin)
DELETE /api/v1/showtimes/:id - Delete showtime (admin)
Auditorium Routes (/api/v1/auditoriums)
GET /api/v1/auditoriums - Get all auditoriums
GET /api/v1/auditoriums/:id - Get auditorium by ID
GET /api/v1/auditoriums/:id/seats - Get seats for an auditorium
POST /api/v1/auditoriums - Create auditorium (admin)
PUT /api/v1/auditoriums/:id - Update auditorium (admin)
DELETE /api/v1/auditoriums/:id - Delete auditorium (admin)
Booking Routes (if implemented)
    POST /api/v1/bookings - Create a booking (requires auth)
GET /api/v1/bookings - Get user's bookings (requires auth)
GET /api/v1/bookings/:id - Get booking by ID (requires auth)
DELETE /api/v1/bookings/:id - Cancel booking (requires auth)


================================================
FILE: scripts/seed.ts
================================================
[Binary file]


================================================
FILE: scripts/seedMovies.ts
================================================
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

interface MovieData {
    title: string;
    cast: string;
    director: string;
    producer: string;
    synopsis: string;
    trailer_picture: string;
    video: string;
    film_rating_code: string;
    categories: string[];
}

const movies: MovieData[] = [
    {
        title: 'The Shawshank Redemption',
        cast: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
        director: 'Frank Darabont',
        producer: 'Niki Marvin',
        synopsis: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        video: 'https://www.youtube.com/embed/6hB3S9bIaco',
        film_rating_code: 'R',
        categories: ['Drama'],
    },
    {
        title: 'The Godfather',
        cast: 'Marlon Brando, Al Pacino, James Caan, Robert Duvall',
        director: 'Francis Ford Coppola',
        producer: 'Albert S. Ruddy',
        synopsis: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        video: 'https://www.youtube.com/embed/sY1S34973zA',
        film_rating_code: 'R',
        categories: ['Crime', 'Drama'],
    },
    {
        title: 'The Dark Knight',
        cast: 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine',
        director: 'Christopher Nolan',
        producer: 'Emma Thomas, Charles Roven',
        synopsis: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        video: 'https://www.youtube.com/embed/EXeTwQWrcwY',
        film_rating_code: 'PG-13',
        categories: ['Action', 'Crime', 'Drama'],
    },
    {
        title: 'Pulp Fiction',
        cast: 'John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis',
        director: 'Quentin Tarantino',
        producer: 'Lawrence Bender',
        synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        video: 'https://www.youtube.com/embed/s7EdQ4FqbhY',
        film_rating_code: 'R',
        categories: ['Crime', 'Drama'],
    },
    {
        title: 'Inception',
        cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy',
        director: 'Christopher Nolan',
        producer: 'Emma Thomas, Christopher Nolan',
        synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
        video: 'https://www.youtube.com/embed/YoHD9XEInc0',
        film_rating_code: 'PG-13',
        categories: ['Action', 'Sci-Fi', 'Thriller'],
    },
    {
        title: 'The Matrix',
        cast: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving',
        director: 'Lana Wachowski, Lilly Wachowski',
        producer: 'Joel Silver',
        synopsis: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        video: 'https://www.youtube.com/embed/vKQi3bBA1y8',
        film_rating_code: 'R',
        categories: ['Action', 'Sci-Fi'],
    },
    {
        title: 'Forrest Gump',
        cast: 'Tom Hanks, Robin Wright, Gary Sinise, Sally Field',
        director: 'Robert Zemeckis',
        producer: 'Wendy Finerman, Steve Tisch, Steve Starkey',
        synopsis: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg',
        video: 'https://www.youtube.com/embed/bLvqoHBptjg',
        film_rating_code: 'PG-13',
        categories: ['Drama', 'Romance'],
    },
    {
        title: 'Interstellar',
        cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
        director: 'Christopher Nolan',
        producer: 'Emma Thomas, Christopher Nolan, Lynda Obst',
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        trailer_picture: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        video: 'https://www.youtube.com/embed/zSWdZVtXT7E',
        film_rating_code: 'PG-13',
        categories: ['Adventure', 'Drama', 'Sci-Fi'],
    },
    {
        title: 'Parasite',
        cast: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik',
        director: 'Bong Joon-ho',
        producer: 'Kwak Sin-ae, Moon Yang-kwon',
        synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        video: 'https://www.youtube.com/embed/5xH0HfJHsaY',
        film_rating_code: 'R',
        categories: ['Drama', 'Thriller'],
    },
    {
        title: 'Avengers: Endgame',
        cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth',
        director: 'Anthony Russo, Joe Russo',
        producer: 'Kevin Feige',
        synopsis: 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
        trailer_picture: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        video: 'https://www.youtube.com/embed/TcMBFSGVi1c',
        film_rating_code: 'PG-13',
        categories: ['Action', 'Adventure', 'Sci-Fi'],
    },
];

export async function seedMovies() {
    try {
        console.log('Seeding movies...');
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api/v1';
        let successCount = 0;
        let errorCount = 0;

        for (const movie of movies) {
            try {
                const response = await fetch( `${API_BASE}/movies`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(movie),
                });

                if (response.ok) {
                    const created = await response.json();
                    console.log(`✓ Created: ${movie.title} (ID: ${created.movie_id || created.id})`);
                    successCount++;
                } else {
                    const error = await response.text();
                    console.error(`✗ Failed to create "${movie.title}": ${response.status} - ${error}`);
                    errorCount++;
                }
            } catch (error) {
                console.error(`✗ Error creating "${movie.title}":`, error);
                errorCount++;
            }
        }

        console.log('\nFinished seeding:');
        console.log(`Success: ${successCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log(`Total: ${movies.length}`);

        if (errorCount === 0) {
            console.log('\nAll movies seeded successfully');
        } else {
            console.log(`\nFailed to seed ${errorCount} movies. Check the logs for details.`);
            process.exit(1);
        }
    } catch (error) {
        console.error('\nSeeding failed:', error);
        process.exit(1);
    }
}


if (require.main === module) {
    seedMovies();
}



================================================
FILE: src/app/globals.css
================================================
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
    --background: #0a0a0f;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --surface-primary: rgba(255, 255, 255, 0.05);
    --surface-secondary: rgba(255, 255, 255, 0.08);
    --surface-hover: rgba(255, 255, 255, 0.1);
    --border-color: rgba(255, 255, 255, 0.1);
    --text-primary: rgba(255, 255, 255, 0.9);
    --text-secondary: rgba(255, 255, 255, 0.6);
    --text-tertiary: rgba(255, 255, 255, 0.4);
    --accent: #667eea;
    --accent-hover: #764ba2;
    --blur-amount: 10px;
    --border-radius: 16px;
    --border-radius-small: 8px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html, body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: var(--background);
    color: var(--text-primary);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
}

body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--background-gradient);
    opacity: 0.3;
    z-index: -2;
}

body::after {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
    animation: rotate 30s linear infinite;
    z-index: -1;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Glass effect utilities */
.glass {
    background: var(--surface-primary);
    backdrop-filter: blur(var(--blur-amount));
    -webkit-backdrop-filter: blur(var(--blur-amount));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
}

.glass-secondary {
    background: var(--surface-secondary);
    backdrop-filter: blur(var(--blur-amount));
    -webkit-backdrop-filter: blur(var(--blur-amount));
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
}

/* Button styles */
button {
    background: var(--surface-primary);
    backdrop-filter: blur(var(--blur-amount));
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 8px 16px;
    border-radius: var(--border-radius-small);
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
}

button:hover {
    background: var(--surface-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

button:active {
    transform: translateY(0);
}

button[aria-pressed="true"] {
    background: var(--accent);
    border-color: var(--accent);
}

/* Input styles */
input[type="text"]:not(.search-input),
input[type="number"],
    input[type="search"]:not(.search-input) {
    background: var(--surface-primary);
    backdrop-filter: blur(var(--blur-amount));
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    padding: 10px 16px;
    border-radius: var(--border-radius-small);
    font-family: inherit;
    transition: all 0.2s ease;
    width: 100%;
}

input:not(.search-input)::placeholder {
    color: var(--text-tertiary);
}

input:not(.search-input):focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

/* Link styles */
a {
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s ease;
}

a:hover {
    color: var(--accent-hover);
}

/* Utility classes */
.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 16px;
}

.fade-in {
    animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar styling */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--surface-primary);
}

::-webkit-scrollbar-thumb {
    background: var(--surface-secondary);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--surface-hover);
}


================================================
FILE: src/app/layout.tsx
================================================
import type { ReactNode } from 'react';
import Header from '../components/Header';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
            <AuthProvider>
                <div className="container" style={{ minHeight: '100vh', paddingTop: '1rem' }}>
    <Header />
    <div className="fade-in">{children}</div>
        </div>
        <ToastContainer position="top-right" theme="dark" autoClose={3000} />
    </AuthProvider>
    </body>
    </html>
);
}



================================================
FILE: src/app/page.tsx
================================================
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import { MoviesAPI, ShowtimesAPI } from '@/lib/api';
import type { Movie } from '@/lib/types';

export default async function Home({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
    const q = (searchParams.q as string) || undefined;
    const category = Array.isArray(searchParams.category) ? (searchParams.category as string[]) : (searchParams.category ? [searchParams.category as string] : undefined);

    const moviesRes = await MoviesAPI.list({ q, category, category_mode: 'any', limit: 50, offset: 0, sort: 'title.asc' });
    const movies = moviesRes.data;

    const now = new Date();
    const to = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const withShowtimesFlags: { movie: Movie; hasUpcoming: boolean }[] = await Promise.all(
        movies.map(async (m) => {
            const s = await ShowtimesAPI.list({ movie_id: m.id, from: now.toISOString(), to, limit: 1, sort: 'starts_at.asc' });
            return { movie: m, hasUpcoming: s.data.length > 0 };
        })
    );

    const running = withShowtimesFlags.filter((x) => x.hasUpcoming).map((x) => x.movie);
    const comingSoon = withShowtimesFlags.filter((x) => !x.hasUpcoming).map((x) => x.movie);

    return (
        <main style={{ display: 'grid', gap: 32, paddingBottom: '3rem' }}>
    <section style={{ display: 'grid', gap: 16 }}>
    <SearchBar />
    <GenreFilter />
    </section>

    <section>
    <h2 style={{
        fontSize: '1.8rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
    }}>
    <span style={{
        width: '4px',
            height: '24px',
            background: 'var(--accent)',
            borderRadius: '2px'
    }}></span>
    Currently Running
    </h2>
    {running.length ? <MovieGrid movies={running} /> : <EmptyState title="No running titles match your filters." subtitle="Try adjusting your search or genre filters" />}
    </section>

    <section>
    <h2 style={{
        fontSize: '1.8rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
    }}>
    <span style={{
        width: '4px',
            height: '24px',
            background: 'var(--accent)',
            borderRadius: '2px'
    }}></span>
    Coming Soon
    </h2>
    {comingSoon.length ? <MovieGrid movies={comingSoon} /> : <EmptyState title="No coming soon titles match your filters." subtitle="Check back later for upcoming releases" />}
    </section>
    </main>
);
}


================================================
FILE: src/app/(auth)/forgot-password/page.tsx
================================================
'use client';

import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
    async function onSubmit(form: FormData) {
        const email = String(form.get('email') || '').trim();
        try {
            await AuthAPI.forgotPassword({ email });
            toast.success('If that email exists, a reset code was sent.');
        } catch (e: any) {
            toast.error(e?.message || 'Request failed');
        }
    }

    return (
        <main>
            <Card title="Forgot password">
        <form action={onSubmit} style={{ display: 'grid', gap: 14 }}>
    <TextInput label="Email" name="email" type="email" required />
    <SubmitButton type="submit">Send reset code</SubmitButton>
    </form>
    </Card>
    </main>
);
}



================================================
FILE: src/app/(auth)/login/page.tsx
================================================
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, TextInput, PasswordInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const sp = useSearchParams();
    const emailPrefill = sp.get('email') ?? '';

    async function onSubmit(form: FormData) {
        const email = String(form.get('email') || '').trim();
        const password = String(form.get('password') || '');
        try {
            await login(email, password);
            toast.success('Logged in');
            router.push('/account');
        } catch (e: any) {
            const msg = e?.message || 'Login failed';
            if (/not verified/i.test(msg)) {
                toast.error('Email not verified.');
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(msg);
            }
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
    <Card title="Log in">
    <form
        action={onSubmit}
    style={{ display: 'grid', gap: 14 }}
>
    <TextInput label="Email" name="email" type="email" defaultValue={emailPrefill} required />
    <PasswordInput label="Password" name="password" required />
    <SubmitButton type="submit">Log in</SubmitButton>
        </form>
        <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
    <Link href="/forgot-password">Forgot password?</Link>
        </div>
        <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
    New here? <Link href="/signup">Create an account</Link>
    </div>
    </Card>
    </main>
);
}



================================================
FILE: src/app/(auth)/reset-password/page.tsx
================================================
'use client';

import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, PasswordInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const router = useRouter();

    async function onSubmit(form: FormData) {
        const email = String(form.get('email') || '').trim();
        const code = String(form.get('code') || '').trim();
        const new_password = String(form.get('new_password') || '');
        try {
            await AuthAPI.resetPassword({ email, code, new_password });
            toast.success('Password reset. Please log in.');
            router.push(`/login?email=${encodeURIComponent(email)}`);
        } catch (e: any) {
            toast.error(e?.message || 'Reset failed');
        }
    }

    return (
        <main>
            <Card title="Reset password">
        <form action={onSubmit} style={{ display: 'grid', gap: 14 }}>
    <TextInput label="Email" name="email" type="email" required />
    <TextInput label="Reset code" name="code" inputMode="numeric" required />
    <PasswordInput label="New password" name="new_password" required />
    <SubmitButton type="submit">Set new password</SubmitButton>
    </form>
    </Card>
    </main>
);
}



================================================
FILE: src/app/(auth)/signup/page.tsx
================================================
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, PasswordInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function SignupPage() {
    const router = useRouter();

    async function onSubmit(form: FormData) {
        const first_name = String(form.get('first_name') || '').trim();
        const last_name = String(form.get('last_name') || '').trim();
        const email = String(form.get('email') || '').trim();
        const password = String(form.get('password') || '');
        try {
            await AuthAPI.signup({ first_name, last_name, email, password });
            toast.success('Account created. Check your email for the code.');
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (e: any) {
            toast.error(e?.message || 'Signup failed');
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
    <Card title="Create your account">
    <form action={onSubmit} style={{ display: 'grid', gap: 14 }}>
    <TextInput label="First name" name="first_name" required />
    <TextInput label="Last name" name="last_name" required />
    <TextInput label="Email" name="email" type="email" required />
    <PasswordInput label="Password" name="password" required />
    <SubmitButton type="submit">Sign up</SubmitButton>
    </form>
    <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
    Already have an account? <Link href="/login">Log in</Link>
        </div>
        </Card>
        </main>
);
}



================================================
FILE: src/app/(auth)/verify-email/page.tsx
================================================
'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function VerifyEmailPage() {
    const sp = useSearchParams();
    const emailPrefill = sp.get('email') ?? '';
    const router = useRouter();

    async function onVerify(form: FormData) {
        const email = String(form.get('email') || '').trim();
        const code = String(form.get('code') || '').trim();
        try {
            await AuthAPI.verifyEmail({ email, code });
            toast.success('Email verified!');
            router.push(`/login?email=${encodeURIComponent(email)}`);
        } catch (e: any) {
            toast.error(e?.message || 'Verification failed');
        }
    }

    async function onResend(form: FormData) {
        const email = String(form.get('email') || '').trim();
        try {
            await AuthAPI.resendVerification({ email });
            toast.success('Verification email resent');
        } catch (e: any) {
            toast.error(e?.message || 'Resend failed');
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
    <Card title="Verify your email">
    <form action={onVerify} style={{ display: 'grid', gap: 14 }}>
    <TextInput label="Email" name="email" type="email" defaultValue={emailPrefill} required />
    <TextInput label="Verification code" name="code" inputMode="numeric" required />
    <SubmitButton type="submit">Verify</SubmitButton>
        </form>

        <form action={onResend} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
    <input type="hidden" name="email" defaultValue={emailPrefill} />
    <button type="submit" style={{ padding: '8px 12px' }}>Resend code</button>
    </form>

    <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
    Already verified? <Link href="/login">Log in</Link>
        </div>
        </Card>
        </main>
);
}



================================================
FILE: src/app/account/page.tsx
================================================
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';
import Link from 'next/link';

// --- Simple fetchers for cards (use your fetch wrapper if you prefer)
async function apiGetCards() {
    const res = await fetch('/api/v1/users/cards', { credentials: 'include' });
    if (!res.ok) throw new Error(`Load cards failed (${res.status})`);
    return res.json();
}
async function apiAddCard(payload: any) {
    const res = await fetch('/api/v1/users/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json())?.error?.message || `Add failed (${res.status})`);
    return res.json();
}
async function apiPatchCard(id: string, payload: any) {
    const res = await fetch(`/api/v1/users/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json())?.error?.message || `Update failed (${res.status})`);
    return res.json();
}
async function apiDeleteCard(id: string) {
    const res = await fetch(`/api/v1/users/cards/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Delete failed (${res.status})`);
}

export default function AccountPage() {
    const { user, loading, refresh } = useAuth();
    const router = useRouter();

    const [firstName, setFirstName] = useState(user?.first_name ?? '');
    const [lastName, setLastName] = useState(user?.last_name ?? '');
    const [phone, setPhone] = useState(user?.phone_number ?? '');
    const [street, setStreet] = useState(user?.address?.street ?? '');
    const [city, setCity] = useState(user?.address?.city ?? '');
    const [state, setState] = useState(user?.address?.state ?? '');
    const [country, setCountry] = useState(user?.address?.country ?? '');
    const [zip, setZip] = useState(user?.address?.zip_code ?? '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [loading, user, router]);

    useEffect(() => {
        setFirstName(user?.first_name ?? '');
        setLastName(user?.last_name ?? '');
        setPhone(user?.phone_number ?? '');
        setStreet(user?.address?.street ?? '');
        setCity(user?.address?.city ?? '');
        setState(user?.address?.state ?? '');
        setCountry(user?.address?.country ?? '');
        setZip(user?.address?.zip_code ?? '');
    }, [user]);

    const canEditEmail = user?.role === 'admin'; // policy: only admins via separate UX

    const changed = useMemo(() => {
        if (!user) return false;
        const addr = user.address || {};
        return (
            (firstName ?? '') !== (user.first_name ?? '') ||
            (lastName ?? '') !== (user.last_name ?? '') ||
            (phone ?? '') !== (user.phone_number ?? '') ||
            (street ?? '') !== (addr.street ?? '') ||
            (city ?? '') !== (addr.city ?? '') ||
            (state ?? '') !== (addr.state ?? '') ||
            (country ?? '') !== (addr.country ?? '') ||
            (zip ?? '') !== (addr.zip_code ?? '')
        );
    }, [user, firstName, lastName, phone, street, city, state, country, zip]);

    if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;
    if (!user) return null;

    async function onSubmit(form: FormData) {
        const first_name = String(form.get('first_name') || '').trim();
        const last_name = String(form.get('last_name') || '').trim();
        const phone_number = String(form.get('phone_number') || '').replace(/\D/g, '');
        const address = {
            street: String(form.get('street') || ''),
            city: String(form.get('city') || ''),
            state: String(form.get('state') || '').toUpperCase(),
            country: String(form.get('country') || ''),
            zip_code: String(form.get('zip') || ''),
        };

        // quick client-side sanity (server also validates)
        if (phone_number && phone_number.length !== 10) {
            toast.error('Phone must be 10 digits');
            return;
        }
        if (address.state && !/^[A-Z]{2}$/.test(address.state)) {
            toast.error('State must be 2 letters (e.g., GA)');
            return;
        }
        if (address.zip_code && !/^\d{5}$/.test(address.zip_code)) {
            toast.error('ZIP must be 5 digits');
            return;
        }

        setSaving(true);
        try {
            await AuthAPI.updateProfile({ first_name, last_name, phone_number, address });
            toast.success('Profile updated');
            await refresh();
        } catch (e: any) {
            toast.error(e?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
    <Card title="Your account">
        {/* Identity summary */}
        <div style={{ color: 'var(--text-secondary)', display: 'grid', gap: 6 }}>
    <div>
        Email: <strong>{user.email}</strong>
    {!user.is_verified && (
        <span style={{ marginLeft: 8, color: '#ffae42' }}>(unverified)</span>
    )}
    </div>
    <div>Role: <strong>{user.role}</strong></div>
    {!user.is_verified && (
        <div style={{ marginTop: 6 }}>
    <Link
        href={`/verify-email?email=${encodeURIComponent(user.email)}`}
    className="glass"
    style={{ padding: '6px 10px', borderRadius: 8 }}
>
    Verify email
    </Link>
    </div>
)}
    </div>

    {/* Edit form */}
    <form action={onSubmit} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
    <TextInput
        label="First name"
    name="first_name"
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    />
    <TextInput
    label="Last name"
    name="last_name"
    value={lastName}
    onChange={(e) => setLastName(e.target.value)}
    />

    {/* Email shown read-only unless you later add an admin edit flow */}
    <label style={{ display: 'grid', gap: 8 }}>
    <span style={{ fontWeight: 500 }}>Email</span>
    <input
    value={user.email}
    disabled
    readOnly
    style={{
        background: 'var(--surface-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '10px 16px',
            borderRadius: 'var(--border-radius-small)',
            fontFamily: 'inherit',
            opacity: canEditEmail ? 1 : 0.7,
    }}
    />
    </label>

    {/* Phone */}
    <TextInput
        label="Phone (10 digits)"
    name="phone_number"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
    placeholder="7065551234"
        />

        {/* Address */}
        <div style={{ display: 'grid', gap: 10, marginTop: 6 }}>
    <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Address</div>
    <TextInput
    label="Street"
    name="street"
    value={street}
    onChange={(e) => setStreet(e.target.value)}
    />
    <TextInput
    label="City"
    name="city"
    value={city}
    onChange={(e) => setCity(e.target.value)}
    />
    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '120px 1fr 140px' }}>
    <TextInput
        label="State"
    name="state"
    value={state}
    onChange={(e) => setState(e.target.value.toUpperCase())}
    placeholder="GA"
    />
    <TextInput
        label="Country"
    name="country"
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    placeholder="US"
    />
    <TextInput
        label="ZIP"
    name="zip"
    value={zip}
    onChange={(e) => setZip(e.target.value)}
    placeholder="30602"
        />
        </div>
        </div>

        <SubmitButton type="submit" disabled={!changed || saving}>
    {saving ? 'Saving…' : changed ? 'Save' : 'No changes'}
    </SubmitButton>
    </form>
    </Card>

    <BillingCardsPanel />
    </main>
);
}

function BillingCardsPanel() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // New card form state
    const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExp, setCardExp] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [bStreet, setBStreet] = useState('');
    const [bCity, setBCity] = useState('');
    const [bState, setBState] = useState('');
    const [bZip, setBZip] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await apiGetCards();
                setCards(data || []);
            } catch (e: any) {
                toast.error(e?.message || 'Failed to load cards');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        // Minimal client checks
        if (!/^\d{16}$/.test(cardNumber.replace(/\D/g, ''))) return toast.error('Card number must be 16 digits');
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExp)) return toast.error('Exp must be MM/YY');
        if (!/^[A-Z]{2}$/.test(bState.toUpperCase())) return toast.error('State must be 2 letters');
        if (!/^\d{5}$/.test(bZip)) return toast.error('ZIP must be 5 digits');

        setCreating(true);
        try {
            const created = await apiAddCard({
                card_type: cardType,
                card_number: cardNumber.replace(/\D/g, ''),
                card_exp: cardExp,
                cardholder_name: cardholderName,
                billing_street: bStreet,
                billing_city: bCity,
                billing_state: bState.toUpperCase(),
                billing_zip_code: bZip,
            });
            setCards((prev) => [created, ...prev]);
            toast.success('Card added');
            // reset
            setCardNumber(''); setCardExp(''); setCardholderName(''); setBStreet(''); setBCity(''); setBState(''); setBZip('');
        } catch (e: any) {
            toast.error(e?.message || 'Add failed');
        } finally {
            setCreating(false);
        }
    }

    async function handleUpdate(id: string, payload: any) {
        try {
            const updated = await apiPatchCard(id, payload);
            setCards((prev) => prev.map((c) => (c.billing_info_id === id ? updated : c)));
            toast.success('Card updated');
        } catch (e: any) {
            toast.error(e?.message || 'Update failed');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Remove this card?')) return;
        try {
            await apiDeleteCard(id);
            setCards((prev) => prev.filter((c) => c.billing_info_id !== id));
            toast.success('Card removed');
        } catch (e: any) {
            toast.error(e?.message || 'Delete failed');
        }
    }

    return (
        <Card title="Billing cards">
            {loading ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
) : (
        <div style={{ display: 'grid', gap: 16 }}>
    {/* Create card */}
    <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Add a card</div>
    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '140px 1fr 120px' }}>
    <label style={{ display: 'grid', gap: 6 }}>
    <span style={{ fontWeight: 500 }}>Type</span>
    <select
    value={cardType}
    onChange={(e) => setCardType(e.target.value as 'credit' | 'debit')}
    style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-primary)', border: '1px solid var(--border-color)' }}
>
    <option value="credit">credit</option>
        <option value="debit">debit</option>
        </select>
        </label>
        <TextInput
    label="Card number"
    value={cardNumber}
    onChange={(e) => setCardNumber(e.target.value)}
    placeholder="16 digits"
    />
    <TextInput
        label="Exp (MM/YY)"
    value={cardExp}
    onChange={(e) => setCardExp(e.target.value)}
    placeholder="12/27"
        />
        </div>
        <TextInput
    label="Cardholder name"
    value={cardholderName}
    onChange={(e) => setCardholderName(e.target.value)}
    placeholder="Full name"
    />
    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '2fr 1fr 90px 120px' }}>
    <TextInput label="Billing street" value={bStreet} onChange={(e) => setBStreet(e.target.value)} />
    <TextInput label="City" value={bCity} onChange={(e) => setBCity(e.target.value)} />
    <TextInput label="State" value={bState} onChange={(e) => setBState(e.target.value.toUpperCase())} placeholder="GA" />
    <TextInput label="ZIP" value={bZip} onChange={(e) => setBZip(e.target.value)} placeholder="30602" />
        </div>
        <SubmitButton type="submit" disabled={creating}>
        {creating ? 'Adding…' : 'Add card'}
        </SubmitButton>
        </form>

    {/* Existing cards */}
    {cards.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No cards on file.</p>
    ) : (
        <div style={{ display: 'grid', gap: 12 }}>
        {cards.map((c) => (
            <CardRow
                key={c.billing_info_id}
            card={c}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            />
        ))}
        </div>
    )}
    </div>
)}
    </Card>
);
}

function CardRow({ card, onUpdate, onDelete }: { card: any; onUpdate: (id: string, payload: any) => void; onDelete: (id: string) => void; }) {
    const [exp, setExp] = useState(card.card_exp || '');
    const [street, setStreet] = useState(card.billing_address?.street || '');
    const [city, setCity] = useState(card.billing_address?.city || '');
    const [state, setState] = useState(card.billing_address?.state || '');
    const [zip, setZip] = useState(card.billing_address?.zip_code || '');
    const [name, setName] = useState(card.cardholder_name || '');
    const [type, setType] = useState(card.card_type || 'credit');
    const [saving, setSaving] = useState(false);

    const changed =
        exp !== (card.card_exp || '') ||
        street !== (card.billing_address?.street || '') ||
        city !== (card.billing_address?.city || '') ||
        state !== (card.billing_address?.state || '') ||
        zip !== (card.billing_address?.zip_code || '') ||
        name !== (card.cardholder_name || '') ||
        type !== (card.card_type || '');

    async function save() {
        // client checks
        if (exp && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return toast.error('Exp must be MM/YY');
        if (state && !/^[A-Z]{2}$/.test(state.toUpperCase())) return toast.error('State must be 2 letters');
        if (zip && !/^\d{5}$/.test(zip)) return toast.error('ZIP must be 5 digits');

        setSaving(true);
        await onUpdate(card.billing_info_id, {
            card_exp: exp,
            cardholder_name: name,
            billing_street: street,
            billing_city: city,
            billing_state: state.toUpperCase(),
            billing_zip_code: zip,
            card_type: type,
        });
        setSaving(false);
    }

    return (
        <div style={{ display: 'grid', gap: 10, border: '1px solid var(--border-color)', borderRadius: 10, padding: 12 }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ fontWeight: 600 }}>
    {type.toUpperCase()} •••• {card.card_last4}
    <span style={{ marginLeft: 8, color: 'var(--text-secondary)', fontWeight: 400 }}>
    added {new Date(card.created_at || Date.now()).toLocaleDateString()}
    </span>
    </div>
    <button
    type="button"
    onClick={() => onDelete(card.billing_info_id)}
    className="glass"
    style={{ padding: '6px 10px', borderRadius: 8 }}
>
    Remove
    </button>
    </div>

    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '140px 160px 1fr 1fr 90px 120px' }}>
    <label style={{ display: 'grid', gap: 6 }}>
    <span style={{ fontWeight: 500 }}>Type</span>
    <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-primary)', border: '1px solid var(--border-color)' }}
>
    <option value="credit">credit</option>
        <option value="debit">debit</option>
        </select>
        </label>
        <TextInput label="Exp (MM/YY)" value={exp} onChange={(e) => setExp(e.target.value)} />
    <TextInput label="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
    <TextInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />
    <TextInput label="State" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} />
    <TextInput label="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
    </div>

    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 160px' }}>
    <TextInput label="Cardholder name" value={name} onChange={(e) => setName(e.target.value)} />
    <button
    type="button"
    disabled={!changed || saving}
    onClick={save}
    className="glass"
    style={{
        padding: '10px 14px',
            borderRadius: 8,
            opacity: !changed || saving ? 0.6 : 1,
            fontWeight: 600,
    }}
>
    {saving ? 'Saving…' : changed ? 'Save changes' : 'Saved'}
    </button>
    </div>
    </div>
);
}



================================================
FILE: src/app/admin/page.tsx
================================================
'use client';

import { RequireRole } from '@/components/Guards';
import Link from 'next/link';

export default function AdminPage() {
    return (
        <RequireRole role="admin">
        <main style={{ display: 'grid', gap: 24 }}>
    <section className="glass" style={{ padding: 24 }}>
    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>Admin Dashboard</h1>
    <p style={{ color: 'var(--text-secondary)' }}>
    Management tools for movies, showtimes, and users.
    </p>

    <div
    style={{
        display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            marginTop: 16,
    }}
>
    <div className="glass" style={{ padding: 16 }}>
    <h3 style={{ margin: '0 0 8px 0' }}>Movies</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
    Create, update, or remove titles.
    </p>
    {/* Wire these when you add routes */}
    <Link href="/admin" className="glass" style={{ padding: '8px 12px', display: 'inline-block', marginTop: 10 }}>
    Manage Movies
    </Link>
    </div>

    <div className="glass" style={{ padding: 16 }}>
    <h3 style={{ margin: '0 0 8px 0' }}>Showtimes</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Schedule and pricing.</p>
    <Link href="/admin" className="glass" style={{ padding: '8px 12px', display: 'inline-block', marginTop: 10 }}>
    Manage Showtimes
    </Link>
    </div>

    <div className="glass" style={{ padding: 16 }}>
    <h3 style={{ margin: '0 0 8px 0' }}>Users</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
    Search, view roles, reset verification.
    </p>
    <Link href="/admin" className="glass" style={{ padding: '8px 12px', display: 'inline-block', marginTop: 10 }}>
    Manage Users
    </Link>
    </div>
    </div>
    </section>
    </main>
    </RequireRole>
);
}



================================================
FILE: src/app/booking/[id]/page.tsx
================================================
import { ShowtimesAPI, MoviesAPI } from '@/lib/api';
import { fmtDateTime } from '@/lib/utils';
import { notFound } from 'next/navigation';
import SeatGrid from '@/components/SeatGrid';

export default async function BookingPage({ params }: { params: { id: string } }) {
    const stId = params.id;

    // TODO: pull these from booking
    const rows = 5;
    const cols = 7;

    let showtime;
    try {
        showtime = await ShowtimesAPI.get(stId);
    } catch {
        notFound();
    }
    const movie = await MoviesAPI.get(showtime.movie_id);

    return (
        <main style={{ display: 'grid', gap: 24, paddingBottom: '3rem' }}>
    <h1 style={{
        fontSize: '2rem',
            fontWeight: 600,
            margin: '0 0 8px 0'
    }}>Complete Your Booking</h1>

    <div className="glass" style={{
        padding: 20,
            display: 'flex',
            gap: 24
    }}>
    <img
        src={movie.trailer_picture}
    alt={`${movie.title} poster`}
    style={{
        width: 140,
            borderRadius: 'var(--border-radius-small)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    }}
    />
    <div style={{ flex: 1 }}>
    <h2 style={{
        margin: '0 0 8px 0',
            fontSize: '1.5rem',
            fontWeight: 600
    }}>{movie.title}</h2>
    <div style={{
        display: 'grid',
            gap: 8,
            fontSize: '15px'
    }}>
    <div>
        <span style={{ color: 'var(--text-secondary)' }}>Showtime:</span>{' '}
    <strong>{fmtDateTime(showtime.starts_at)}</strong>
    </div>
    <div style={{
        color: 'var(--text-tertiary)',
            fontSize: 13
    }}>
    Showtime ID: {showtime.showtime_id}
    </div>
    </div>
    </div>
    </div>

    <section className="glass" style={{ padding: 24 }}>
    <h3 style={{
        margin: '0 0 20px 0',
            fontSize: '1.3rem',
            fontWeight: 600
    }}>Ticket Selection</h3>
    <form>
    <div style={{
        display: 'grid',
            gap: 16,
            maxWidth: 520
    }}>
    <label style={{ display: 'grid', gap: 8 }}>
    <span style={{ fontWeight: 500 }}>Child</span>
    <input
    type="number"
    min={0}
    max={10}
    defaultValue={0}
    style={{
        width: 140,
            padding: '10px 16px'
    }}
    />
    </label>
    <label style={{ display: 'grid', gap: 8 }}>
    <span style={{ fontWeight: 500 }}>Adult</span>
    <input
    type="number"
    min={0}
    max={10}
    defaultValue={2}
    style={{
        width: 140,
            padding: '10px 16px'
    }}
    />
    </label>
    <label style={{ display: 'grid', gap: 8 }}>
    <span style={{ fontWeight: 500 }}>Senior</span>
    <input
    type="number"
    min={0}
    max={10}
    defaultValue={0}
    style={{
        width: 140,
            padding: '10px 16px'
    }}
    />
    </label>
    <button
    type="button"
    style={{
        marginTop: 8,
            padding: '14px 28px',
            background: 'var(--accent)',
            borderColor: 'var(--accent)',
            fontSize: '16px',
            fontWeight: 500
    }}
>
    Continue to Seat Selection
    </button>
    </div>
    </form>
    </section>

    <section className="glass" style={{ padding: 24 }}>
    <h3 style={{
        margin: '0 0 20px 0',
            fontSize: '1.3rem',
            fontWeight: 600
    }}>Seat Preview</h3>

    <div style={{
        textAlign: 'center',
            marginBottom: 24
    }}>
    <div style={{
        display: 'inline-block',
            background: 'var(--accent)',
            height: '4px',
            width: '60%',
            borderRadius: '2px',
            marginBottom: '8px'
    }}></div>
    <div style={{
        fontSize: '12px',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
    }}>Screen</div>
    </div>

    <SeatGrid rows={rows} cols={cols} />

    <p style={{
        color: 'var(--text-tertiary)',
            fontSize: '14px',
            textAlign: 'center',
            marginTop: '24px'
    }}>
    <span style={{
        display: 'inline-block',
            background: 'var(--surface-secondary)',
            padding: '4px 12px',
            borderRadius: 'var(--border-radius-small)',
            marginRight: '8px'
    }}>ℹ️</span>
    This is a prototype screen. Seat selection functionality coming soon.
    </p>
    </section>
    </main>
);
}


================================================
FILE: src/app/dashboard/page.tsx
================================================
'use client';

import Link from 'next/link';
import { RequireAuth } from '@/components/Guards';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserDashboard() {
    const { user } = useAuth();
    const router = useRouter();

    // If an admin somehow lands here, punt them to the admin dashboard.
    useEffect(() => {
        if (user?.role === 'admin') router.replace('/admin');
    }, [user, router]);

    return (
        <RequireAuth>
            <main style={{ display: 'grid', gap: 24 }}>
    <section className="glass" style={{ padding: 24 }}>
    <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: 8 }}>Your Dashboard</h1>
    <p style={{ color: 'var(--text-secondary)' }}>Quick links to your stuff.</p>

    <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
    <Link className="glass" href="/account" style={{ padding: '10px 16px', borderRadius: 10 }}>
    Edit Profile
    </Link>
    <Link className="glass" href="/" style={{ padding: '10px 16px', borderRadius: 10 }}>
    Browse Movies
    </Link>
    {/* Future: add /bookings once implemented */}
    </div>
    </section>
    </main>
    </RequireAuth>
);
}



================================================
FILE: src/app/movie/[id]/page.tsx
================================================
import { MoviesAPI, ShowtimesAPI } from '@/lib/api';
import TrailerEmbed from '@/components/TrailerEmbed';
import ShowtimesList from '@/components/ShowtimesList';
import { notFound } from 'next/navigation';

export default async function MoviePage({ params }: { params: { id: string } }) {
    const id = Number(params.id);
    let movie;
    try {
        movie = await MoviesAPI.get(id);
    } catch {
        notFound();
    }

    const nowISO = new Date().toISOString();
    const showtimes = (await ShowtimesAPI.list({ movie_id: id, from: nowISO, sort: 'starts_at.asc', limit: 100 })).data;

    return (
        <main style={{ display: 'grid', gap: 32, paddingBottom: '3rem' }}>
    <div className="glass" style={{
        padding: '24px',
            display: 'grid',
            gridTemplateColumns: '340px 1fr',
            gap: 32
    }}>
    <div style={{ position: 'relative' }}>
    <img
        src={movie.trailer_picture}
    alt={`${movie.title} poster`}
    style={{
        width: '100%',
            borderRadius: 'var(--border-radius)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
    }}
    />
    <div className="glass" style={{
        position: 'absolute',
            top: 16,
            right: 16,
            padding: '6px 12px',
            fontSize: '14px',
            fontWeight: 600
    }}>
    {movie.film_rating_code}
    </div>
    </div>
    <div>
    <h1 style={{
        margin: '0 0 8px 0',
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
    }}>{movie.title}</h1>

    <div style={{
        display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 20
    }}>
    {movie.categories?.map((c) => (
        <span key={c.id} className="glass" style={{
        fontSize: 14,
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: 500
    }}>{c.name}</span>
    ))}
    </div>

    <p style={{
        fontSize: '1.1rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: 24
    }}>{movie.synopsis}</p>

    <div className="glass-secondary" style={{
        padding: '16px',
            borderRadius: 'var(--border-radius-small)',
            display: 'grid',
            gap: 12
    }}>
    <div>
        <strong style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Director</strong>
    <div>{movie.director}</div>
    </div>
    <div>
    <strong style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Producer</strong>
    <div>{movie.producer}</div>
    </div>
    <div>
    <strong style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Cast</strong>
    <div>{movie.cast}</div>
    </div>
    </div>
    </div>
    </div>

    <section>
    <h2 style={{
        fontSize: '1.6rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
    }}>
    <span style={{
        width: '4px',
            height: '24px',
            background: 'var(--accent)',
            borderRadius: '2px'
    }}></span>
    Trailer
    </h2>
    <TrailerEmbed url={movie.video} />
    </section>

    <section>
    <h2 style={{
        fontSize: '1.6rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
    }}>
    <span style={{
        width: '4px',
            height: '24px',
            background: 'var(--accent)',
            borderRadius: '2px'
    }}></span>
    Showtimes
    </h2>
    <ShowtimesList showtimes={showtimes} />
    </section>
    </main>
);
}


================================================
FILE: src/components/EmptyState.tsx
================================================
export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="glass" style={{
        borderStyle: 'dashed',
            padding: '48px 24px',
            textAlign: 'center',
            opacity: 0.8
    }}>
    <div style={{
        width: '64px',
            height: '64px',
            margin: '0 auto 16px',
            background: 'var(--surface-secondary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
    }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
        </svg>
        </div>
        <h3 style={{
        margin: 0,
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
    }}>{title}</h3>
    {subtitle && <p style={{
        color: 'var(--text-secondary)',
            marginTop: '8px'
    }}>{subtitle}</p>}
    </div>
    );
    }



================================================
    FILE: src/components/Form.tsx
    ================================================
    'use client';

    import { useState } from 'react';

    export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
        const { label, ...rest } = props;
        return (
            <label style={{ display: 'grid', gap: 8 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <input
        {...rest}
        style={{
            background: 'var(--surface-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 16px',
                borderRadius: 'var(--border-radius-small)',
                fontFamily: 'inherit',
        }}
        />
        </label>
    );
    }

    export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
        const { label, ...rest } = props;
        const [show, setShow] = useState(false);
        return (
            <label style={{ display: 'grid', gap: 8, position: 'relative' }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <input
        {...rest}
        type={show ? 'text' : 'password'}
        style={{
            background: 'var(--surface-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '10px 40px 10px 16px',
                borderRadius: 'var(--border-radius-small)',
                fontFamily: 'inherit',
        }}
        />
        <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{ position: 'absolute', right: 8, top: 30, padding: '4px 8px' }}
    >
        {show ? 'Hide' : 'Show'}
        </button>
        </label>
    );
    }

    export function SubmitButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
        return (
            <button
                {...rest}
        style={{
            padding: '12px 20px',
                background: 'var(--accent)',
                borderColor: 'var(--accent)',
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 'var(--border-radius-small)',
        }}
    >
        {children}
        </button>
    );
    }

    export function Card({ children, title }: { children: React.ReactNode; title: string }) {
        return (
            <div className="glass" style={{ padding: 24, maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: 16 }}>{title}</h1>
        <div style={{ display: 'grid', gap: 14 }}>{children}</div>
        </div>
    );
    }



================================================
    FILE: src/components/GenreFilter.tsx
    ================================================
    'use client';
    import { useQueryParams } from '@/hooks/useQueryParams';

    const GENRES = [
        'Action','Adventure','Animation','Comedy','Crime','Drama','Fantasy','Horror','Mystery','Romance','Sci-Fi','Thriller'
    ];

    export default function GenreFilter() {
        const { searchParams, setParams } = useQueryParams();
        const selected = searchParams?.getAll('category') ?? [];

        const toggle = (g: string) => {
            const next = new Set(selected);
            if (next.has(g)) next.delete(g); else next.add(g);
            const arr = [...next];
            setParams({ category: arr.length ? arr : undefined, offset: undefined });
        };

        return (
            <div className="glass" style={{
            padding: '16px',
                borderRadius: 'var(--border-radius)'
        }}>
        <div style={{
            marginBottom: '12px',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                fontWeight: 500
        }}>
        Filter by Genre
        </div>
        <div style={{
            display: 'flex',
                gap: 8,
                flexWrap: 'wrap'
        }}>
        {GENRES.map((g) => (
            <button
                key={g}
            onClick={() => toggle(g)}
            aria-pressed={selected.includes(g)}
            style={{
            padding: '6px 14px',
                fontSize: '14px',
                borderRadius: '20px',
                background: selected.includes(g) ? 'var(--accent)' : 'var(--surface-primary)',
                borderColor: selected.includes(g) ? 'var(--accent)' : 'var(--border-color)',
                fontWeight: selected.includes(g) ? 500 : 400
        }}
        >
            {g}
            </button>
        ))}
        </div>
        </div>
    );
    }



================================================
    FILE: src/components/Guards.tsx
    ================================================
    'use client';

    import { useEffect } from 'react';
    import { useRouter } from 'next/navigation';
    import { useAuth } from '@/context/AuthContext';
    import type { Role } from '@/lib/auth';

    type GuardProps = {
        children: React.ReactNode;
        /** Where to send the user if the guard blocks them. Defaults to '/'. */
        redirectTo?: string;
        /** Optional: render this while auth state is loading. */
        loadingFallback?: React.ReactNode;
    };

    export function RequireAuth({
                                    children,
                                    redirectTo = '/login',
                                    loadingFallback = <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>,
}: GuardProps) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) router.replace(redirectTo);
        }, [loading, user, router, redirectTo]);

        if (loading) return <>{loadingFallback}</>;
        if (!user) return null;
        return <>{children}</>;
    }

    export function RequireRole({
                                    role,
                                    children,
                                    redirectTo = '/',
                                    loadingFallback = <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>,
}: GuardProps & { role: Role }) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && (!user || user.role !== role)) router.replace(redirectTo);
        }, [loading, user, role, router, redirectTo]);

        if (loading) return <>{loadingFallback}</>;
        if (!user || user.role !== role) return null;
        return <>{children}</>;
    }



================================================
    FILE: src/components/Header.tsx
    ================================================
    'use client';

    import Link from 'next/link';
    import { useAuth } from '@/context/AuthContext';
    import { useRouter } from 'next/navigation';

    export default function Header() {
        const { user, logout, loading } = useAuth();
        const router = useRouter();

        const dashHref = user?.role === 'admin' ? '/admin' : '/dashboard';

        return (
            <header
                className="glass"
        style={{
            padding: '1.5rem 2rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
        }}
    >
        <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link
            href="/"
        style={{
            fontSize: '1.5rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
        }}
    >
        CineGlass Theatre
        </Link>

        <Link href="/" style={{ color: 'var(--text-secondary)' }}>Movies</Link>
        <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About</Link>

        {!loading && user && (
            <Link href={dashHref} className="glass" style={{ padding: '6px 12px', borderRadius: 8 }}>
            Dashboard
            </Link>
        )}

        {!loading && user?.role === 'admin' && (
            <Link href="/admin" className="glass" style={{ padding: '6px 12px', borderRadius: 8 }}>
            Admin
            </Link>
        )}
        </nav>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {loading ? (
            <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>…</span>
        ) : user ? (
            <>
                <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {user.first_name ? `Hi, ${user.first_name}` : user.email}
            {!user.is_verified && (
                <span style={{ marginLeft: 8, color: '#ffae42' }} title="Email not verified">
                (unverified)
                </span>
            )}
            {user.role === 'admin' && (
                <span style={{ marginLeft: 8, color: '#7dd3fc' }} title="Administrator">[admin]</span>
            )}
            </span>

            <Link className="glass" href="/account" style={{ padding: '6px 12px', borderRadius: 8 }}>
            Profile
            </Link>

            <button
            onClick={async () => {
            await logout();
            router.push('/login');
        }}
            style={{ padding: '6px 12px' }}
        >
            Logout
            </button>
            </>
        ) : (
            <>
                <Link className="glass" href="/login" style={{ padding: '6px 12px', borderRadius: 8 }}>
            Log in
            </Link>
            <Link
            className="glass"
            href="/signup"
            style={{
            padding: '6px 12px',
                borderRadius: 8,
                background: 'var(--accent)',
                borderColor: 'var(--accent)',
        }}
        >
            Sign up
        </Link>
        </>
        )}
        </div>
        </header>
    );
    }



================================================
    FILE: src/components/MovieCard.css
    ================================================
.movie-card {
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
    }

.movie-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 12px 24px rgba(102, 126, 234, 0.3);
    }

.movie-poster {
        width: 100%;
        height: 280px;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

.movie-card:hover .movie-poster {
        transform: scale(1.05);
    }

.poster-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60%;
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        pointer-events: none;
    }

.category-tag {
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 20px;
        color: var(--text-secondary);
    }

.view-details-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;
        background: var(--accent);
        border-radius: var(--border-radius-small);
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        color: white;
    }

.view-details-btn:hover {
        background: var(--accent-hover);
        transform: translateY(-1px);
    }



================================================
    FILE: src/components/MovieCard.tsx
    ================================================
    'use client';

    import Link from 'next/link';
    import type { Movie } from '@/lib/types';
    import './MovieCard.css';

    export default function MovieCard({ movie }: { movie: Movie }) {
        return (
            <article className="glass movie-card">
            <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
            src={movie.trailer_picture}
        alt={`${movie.title} poster`}
        className="movie-poster"
        />
        <div className="poster-overlay" />
            </div>
            <div style={{ padding: 16 }}>
        <h3 style={{
            margin: '4px 0',
                fontSize: '1.1rem',
                fontWeight: 600
        }}>{movie.title}</h3>
        <div style={{
            fontSize: 14,
                color: 'var(--text-secondary)',
                marginBottom: 8
        }}>{movie.film_rating_code}</div>
        <div style={{
            marginTop: 12,
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap'
        }}>
        {movie.categories?.map((c) => (
            <span key={c.id} className="glass category-tag">
            {c.name}
            </span>
        ))}
        </div>
        <div style={{ marginTop: 16 }}>
        <Link
            href={`/movie/${movie.id}`}
        className="view-details-btn">
            View Details →
                    </Link>
                    </div>
                    </div>
                    </article>
    );
    }



================================================
    FILE: src/components/MovieGrid.tsx
    ================================================
    import MovieCard from './MovieCard';
    import type { Movie } from '@/lib/types';

    export default function MovieGrid({ movies }: { movies: Movie[] }) {
        if (!movies.length) return <p style={{ color: 'var(--text-secondary)' }}>No movies yet.</p>;
        return (
            <section style={{
            display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 24,
        }}>
        {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </section>
        );
        }



    ================================================
        FILE: src/components/SearchBar.css
        ================================================
    .search-form {
            display: flex;
            gap: 12px;
            position: relative;
            padding: 8px;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            transition: all 0.3s ease;
        }

    .search-form:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.12);
        }

    .search-form.focused {
            background: rgba(255, 255, 255, 0.06);
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1),
                0 8px 32px rgba(102, 126, 234, 0.15);
        }

    .search-input-wrapper {
            position: relative;
            flex: 1;
        }

    .search-input {
            width: 100%;
            padding: 12px 20px 12px 48px;
            font-size: 16px;
            background: transparent;
            border: none;
            color: var(--text-primary);
            outline: none;
            font-family: inherit;
        }

    .search-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
            transition: color 0.3s ease;
        }

    .search-form:hover .search-input::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }

    .search-form.focused .search-input::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

    .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            stroke: rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease;
        }

    .search-form:hover .search-icon {
            stroke: rgba(255, 255, 255, 0.6);
        }

    .search-form.focused .search-icon {
            stroke: var(--accent);
            transform: translateY(-50%) scale(1.1);
        }

    .search-button {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 12px 24px;
            background: var(--accent);
            border: 1px solid var(--accent);
            border-radius: 16px;
            font-weight: 500;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            font-size: 15px;
            white-space: nowrap;
            position: relative;
            overflow: hidden;
        }

    .search-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2));
            transform: translateX(-100%);
            transition: transform 0.6s ease;
        }

    .search-button:hover::before {
            transform: translateX(0);
        }

    .search-button:hover {
            background: var(--accent-hover);
            border-color: var(--accent-hover);
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
        }

    .search-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
        }

    .search-button svg {
            transition: transform 0.3s ease;
        }

    .search-button:hover svg {
            transform: translateX(2px);
        }

        /* Animation for search results */
    @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Responsive adjustments */
    @media (max-width: 640px) {
        .search-form {
                flex-direction: column;
                border-radius: 20px;
            }

        .search-button {
                width: 100%;
                justify-content: center;
            }
        }


    ================================================
        FILE: src/components/SearchBar.tsx
        ================================================
        'use client';
        import { useState, useEffect } from 'react';
        import { useQueryParams } from '@/hooks/useQueryParams';
        import './SearchBar.css';

        export default function SearchBar() {
            const { searchParams, setParams } = useQueryParams();
            const initial = searchParams?.get('q') ?? '';
            const [q, setQ] = useState(initial);
            const [isFocused, setIsFocused] = useState(false);

            useEffect(() => setQ(initial), [initial]);

            return (
                <form
                    onSubmit={(e) => {
                e.preventDefault();
                setParams({ q: q || undefined, offset: undefined });
            }}
            className={`search-form ${isFocused ? 'focused' : ''}`}
        >
            <div className="search-input-wrapper">
            <input
                value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search movies by title..."
            className="search-input"
            />
            <svg
                className="search-icon"
            viewBox="0 0 24 24"
            >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                </div>
                <button
            type="submit"
            className="search-button"
                >
                <span>Search</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14m-7-7l7 7-7 7"/>
                </svg>
                </button>
                </form>
        );
        }


    ================================================
        FILE: src/components/SeatGrid.tsx
        ================================================
        'use client';

        export default function SeatGrid({ rows, cols }: { rows: number; cols: number }) {
            return (
                <div
                    style={{
                display: "grid",
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)`,
                    gap: '8px',
                    maxWidth: '500px',
                    margin: '0 auto'
            }}
        >
            {Array.from({ length: rows * cols }).map((_, idx) => (
                <div
                    key={idx}
                className="glass"
                style={{
                aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text-tertiary)'
            }}
                onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-hover)';
                e.currentTarget.style.transform = 'scale(1.1)';
            }}
                onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface-primary)';
                e.currentTarget.style.transform = 'scale(1)';
            }}
            >
                {String.fromCharCode(65 + Math.floor(idx / cols))}{(idx % cols) + 1}
                </div>
            ))}
            </div>
        );
        }



    ================================================
        FILE: src/components/ShowtimesList.css
        ================================================
    .showtime-item {
            padding: 16px;
            transition: all 0.2s ease;
        }

    .showtime-item:hover {
            transform: translateX(4px);
            background: var(--surface-secondary);
        }

    .select-seats-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 20px;
            background: var(--accent);
            border-radius: var(--border-radius-small);
            font-weight: 500;
            transition: all 0.2s;
            color: white;
        }

    .select-seats-btn:hover {
            background: var(--accent-hover);
            transform: translateY(-1px);
        }



    ================================================
        FILE: src/components/ShowtimesList.tsx
        ================================================
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



    ================================================
        FILE: src/components/TrailerEmbed.css
        ================================================
    .trailer-container {
            position: relative;
            padding-top: 56.25%; /* 16:9 Aspect Ratio */
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

    .trailer-iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }

    .watch-trailer-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: var(--accent);
            border-radius: var(--border-radius-small);
            font-weight: 500;
            transition: all 0.2s;
            color: white;
            border-color: var(--accent);
        }

    .watch-trailer-btn:hover {
            background: var(--accent-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }


    ================================================
        FILE: src/components/TrailerEmbed.tsx
        ================================================
        'use client';

        import * as React from 'react';
        import './TrailerEmbed.css';

        function extractYouTubeId(url: string): string | null {
            try {
                const u = new URL(url);
                if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
                if (u.hostname.includes('youtube.com')) {
                    if (u.pathname.includes('embed/')) {
                        // Handle embed URLs like https://www.youtube.com/embed/6hB3S9bIaco
                        return u.pathname.split('/embed/')[1];
                    }
                    return u.searchParams.get('v');
                }
                return null;
            } catch { return null; }
        }

        export default function TrailerEmbed({ url }: { url: string }) {
            const id = extractYouTubeId(url);

            // Always try to embed if we have an ID
            if (id) {
                return (
                    <div className="glass trailer-container">
                    <iframe
                        src={`https://www.youtube.com/embed/${id}`}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="trailer-iframe"
                    />
                    </div>
            );
            }

            // Only show button as fallback for non-YouTube URLs
            return (
                <a
                    href={url}
            target="_blank"
            rel="noreferrer"
            className="glass watch-trailer-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
                </svg>
            Watch Trailer (External Link)
            </a>
        );
        }


    ================================================
        FILE: src/context/AuthContext.tsx
        ================================================
        'use client';

        import { createContext, useContext, useEffect, useMemo, useState } from 'react';
        import { AuthAPI, type AuthUser } from '@/lib/auth';

        type AuthState = {
            user: AuthUser | null;
            loading: boolean;
            refresh: () => Promise<void>;
            login: (email: string, password: string) => Promise<void>;
            logout: () => Promise<void>;
        };

        const Ctx = createContext<AuthState | null>(null);

        export function AuthProvider({ children }: { children: React.ReactNode }) {
            const [user, setUser] = useState<AuthUser | null>(null);
            const [loading, setLoading] = useState(true);

            const refresh = async () => {
                try {
                    const res = await AuthAPI.verify();
                    if ((res as any).error) setUser(null);
                    else setUser(res as AuthUser);
                } catch {
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };

            useEffect(() => {
                void refresh();
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []);

            const login = async (email: string, password: string) => {
                await AuthAPI.login({ email, password });
                await refresh();
            };

            const logout = async () => {
                await AuthAPI.logout();
                setUser(null);
            };

            const value = useMemo(() => ({ user, loading, refresh, login, logout }), [user, loading]);

            return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
        }

        export function useAuth() {
            const ctx = useContext(Ctx);
            if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
            return ctx;
        }



    ================================================
        FILE: src/hooks/useQueryParams.ts
        ================================================
        'use client';
        import { usePathname, useRouter, useSearchParams } from 'next/navigation';
        import { useCallback } from 'react';


        export function useQueryParams() {
            const router = useRouter();
            const pathname = usePathname();
            const searchParams = useSearchParams();


            const setParams = useCallback((updates: Record<string, string | string[] | undefined>) => {
                const usp = new URLSearchParams(searchParams?.toString());
                Object.entries(updates).forEach(([k, v]) => {
                    usp.delete(k);
                    if (v == null) return;
                    if (Array.isArray(v)) v.forEach((x) => usp.append(k, x));
                    else usp.set(k, v);
                });
                router.replace(`${pathname}?${usp.toString()}`);
            }, [router, pathname, searchParams]);


            return { searchParams, setParams };
        }


    ================================================
        FILE: src/lib/api.ts
        ================================================
        import { API_BASE } from './config';
        import type { MoviesResponse, Movie, ShowtimesResponse, Showtime, AuditoriumsResponse, Auditorium } from './types';

        async function http<T>(path: string, init?: RequestInit): Promise<T> {
            const res = await fetch(`${API_BASE}${path}`, {
                ...init,
                // SSR-safe; we want latest user state
                cache: 'no-store',
                credentials: 'include', // <-- IMPORTANT for JWT cookie
                headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
            });
            if (!res.ok) {
                let payload: any;
                try { payload = await res.json(); } catch { payload = await res.text(); }
                const msg = typeof payload === 'string' ? payload : (payload?.error || payload?.message || JSON.stringify(payload));
                throw new Error(`HTTP ${res.status}: ${msg}`);
            }
            return res.json();
        }

        export const MoviesAPI = {
            list: (params: { q?: string; category?: string[]; category_mode?: 'any' | 'all'; limit?: number; offset?: number; sort?: string }) =>
                http<MoviesResponse>(`/movies${params ? qsMovies(params) : ''}`),
            get: (id: number) => http<Movie>(`/movies/${id}`),
        };

        const qsMovies = (p: any) => {
            const usp = new URLSearchParams();
            if (p.q) usp.set('q', p.q);
            if (p.category) for (const c of p.category) usp.append('category', c);
            if (p.category_mode) usp.set('category_mode', p.category_mode);
            if (p.limit) usp.set('limit', String(p.limit));
            if (p.offset) usp.set('offset', String(p.offset));
            if (p.sort) usp.set('sort', p.sort);
            const s = usp.toString();
            return s ? `?${s}` : '';
        };

        export const ShowtimesAPI = {
            list: (params: { movie_id?: number; auditorium_id?: number; from?: string; to?: string; limit?: number; offset?: number; sort?: 'starts_at.asc' | 'starts_at.desc' }) => {
                const usp = new URLSearchParams();
                if (params.movie_id) usp.set('movie_id', String(params.movie_id));
                if (params.auditorium_id) usp.set('auditorium_id', String(params.auditorium_id));
                if (params.from) usp.set('from', params.from);
                if (params.to) usp.set('to', params.to);
                if (params.limit) usp.set('limit', String(params.limit));
                if (params.offset) usp.set('offset', String(params.offset));
                if (params.sort) usp.set('sort', params.sort);
                const s = usp.toString();
                return http<ShowtimesResponse>(`/showtimes${s ? `?${s}` : ''}`);
            },
            get: (id: string) => http<Showtime>(`/showtimes/${id}`),
        };

        export const AuditoriumsAPI = {
            list: (params?: { q?: string; limit?: number; offset?: number; sort?: string }) => {
                const usp = new URLSearchParams();
                if (params?.q) usp.set('q', params.q);
                if (params?.limit) usp.set('limit', String(params.limit));
                if (params?.offset) usp.set('offset', String(params.offset));
                if (params?.sort) usp.set('sort', params.sort!);
                const s = usp.toString();
                return http<AuditoriumsResponse>(`/auditorium${s ? `?${s}` : ''}`);
            },
            get: (id: number) => http<Auditorium>(`/auditorium/${id}`),
        };

// Auth endpoints
        export async function httpPost<T>(path: string, body: unknown): Promise<T> {
            return http<T>(path, { method: 'POST', body: JSON.stringify(body) });
        }
        export async function httpGet<T>(path: string): Promise<T> {
            return http<T>(path, { method: 'GET' });
        }



    ================================================
        FILE: src/lib/auth.ts
        ================================================
        import { httpGet, httpPost } from './api';

        export type Role = 'user' | 'admin';

        export type AuthUser = {
            user_id: string;
            email: string;
            first_name?: string;
            last_name?: string;
            is_verified: boolean;
            role: Role; // <-- add this (backend must return it on /auth/verify and /users/profile)
        };

        export const AuthAPI = {
            signup: (payload: { first_name: string; last_name: string; email: string; password: string }) =>
                httpPost<{ message: string }>('/auth/signup', payload),

            login: (payload: { email: string; password: string }) =>
                httpPost<{ user: AuthUser }>('/auth/login', payload),

            logout: () =>
                httpPost<{ message: string }>('/auth/logout', {}),

            verify: () =>
                httpGet<AuthUser | { error: string }>('/auth/verify'),

            verifyEmail: (payload: { email: string; code: string }) =>
                httpPost<{ message: string }>('/auth/verify-email', payload),

            resendVerification: (payload: { email: string }) =>
                httpPost<{ message: string }>('/auth/resend-verification', payload),

            forgotPassword: (payload: { email: string }) =>
                httpPost<{ message: string }>('/auth/forgot-password', payload),

            resetPassword: (payload: { email: string; code: string; new_password: string }) =>
                httpPost<{ message: string }>('/auth/reset-password', payload),

            profile: () =>
                httpGet<AuthUser>('/users/profile'),

            updateProfile: (payload: { first_name?: string; last_name?: string }) =>
                httpPost<{ message: string }>('/users/profile', payload),
        };



    ================================================
        FILE: src/lib/config.ts
        ================================================
        export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000/api/v1';





    ================================================
        FILE: src/lib/types.ts
        ================================================
        export type Category = { id: number; name: string };


        export type Movie = {
            id: number;
            title: string;
            cast: string;
            director: string;
            producer: string;
            synopsis: string;
            trailer_picture: string;
            video: string; // yt link
            film_rating_code: string;
            created_at: string; // ISO
            categories: Category[];
        };


        export type PageMeta = { limit: number; offset: number; total: number };


        export type MoviesResponse = { data: Movie[]; page: PageMeta };


        export type Auditorium = { id: number; name: string; created_at: string };
        export type AuditoriumsResponse = { data: Auditorium[]; page: PageMeta };


        export type Showtime = {
            showtime_id: string; // uuid
            movie_id: number;
            auditorium_id: number;
            starts_at: string; // ISO
            child_price_cents: number;
            adult_price_cents: number;
            senior_price_cents: number;
        };


        export type ShowtimesResponse = { data: Showtime[]; page: PageMeta };


        export type ApiError = {
            error: { code: 'NOT_FOUND' | 'BAD_REQUEST' | 'CONFLICT'; message: string; details?: unknown };
        };


    ================================================
        FILE: src/lib/utils.ts
        ================================================
        export const fmtMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;
        export const fmtDateTime = (iso: string) => new Date(iso).toLocaleString();
        export const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });


// query string helper
        export const qs = (params: Record<string, any>) => {
            const u = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => {
                if (v == null) return;
                if (Array.isArray(v)) v.forEach((x) => u.append(k, String(x)));
                else u.set(k, String(v));
            });
            const s = u.toString();
            return s ? `?${s}` : '';
        };

