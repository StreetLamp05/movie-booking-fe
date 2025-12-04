import { API_BASE } from './config';
import type {
    MoviesResponse,
    Movie,
    ShowtimesResponse,
    Showtime,
    AuditoriumsResponse,
    Auditorium,
    ShowtimeSeatsResponse,
    HoldSeatsRequest,
    HoldSeatsResponse,
    ReleaseSeatsRequest,
    Booking,
    CreateBookingRequest,
} from './types';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        cache: 'no-store',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });

    if (!res.ok) {
        // Read body ONCE; parse if JSON, otherwise use raw text.
        const raw = await res.text();
        let msg = raw;
        try {
            const j = JSON.parse(raw);
            msg =
                j?.error?.message ??
                j?.error ??
                j?.message ??
                (typeof j === 'string' ? j : raw);
        } catch {
            /* keep raw */
        }
        throw new Error(`HTTP ${res.status}: ${msg}`);
    }

    return res.json();
}

export const MoviesAPI = {
    list: (params: {
        q?: string;
        category?: string[];
        category_mode?: 'any' | 'all';
        limit?: number;
        offset?: number;
        sort?: string;
    }) => http<MoviesResponse>(`/movies${params ? qsMovies(params) : ''}`),
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
    list: (params: {
        movie_id?: number;
        auditorium_id?: number;
        from?: string;
        to?: string;
        limit?: number;
        offset?: number;
        sort?: 'starts_at.asc' | 'starts_at.desc';
    }) => {
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

export const BookingsAPI = {
    // Get seat availability for a showtime
    getShowtimeSeats: (showtimeId: string) =>
        http<ShowtimeSeatsResponse>(`/showtimes/${showtimeId}/seats`),

    // Get current user's held seats for a showtime
    getMyHolds: (showtimeId: string) =>
        http<HoldSeatsResponse>(`/bookings/showtimes/${showtimeId}/my-holds`),

    // Hold seats (requires auth)
    holdSeats: (showtimeId: string, request: HoldSeatsRequest) =>
        http<HoldSeatsResponse>(`/showtimes/${showtimeId}/hold`, {
            method: 'POST',
            body: JSON.stringify(request)
        }),

    // Release held seats (requires auth)
    releaseSeats: (showtimeId: string, request: ReleaseSeatsRequest) =>
        http<void>(`/bookings/showtimes/${showtimeId}/release-holds`, {
            method: 'POST',
            body: JSON.stringify(request)
        }),

    // Create a booking (requires auth)
    createBooking: (request: CreateBookingRequest) =>
        http<Booking>(`/bookings`, {
            method: 'POST',
            body: JSON.stringify(request)
        }),

    // Get user's bookings (requires auth)
    getMyBookings: () =>
        http<{ data: Booking[] }>(`/bookings/my-bookings`),

    // Get specific booking (requires auth)
    getBooking: (bookingId: string) =>
        http<Booking>(`/bookings/${bookingId}`),
};

// Small helpers that call http()
export async function httpPost<T>(path: string, body: unknown): Promise<T> {
    return http<T>(path, { method: 'POST', body: JSON.stringify(body) });
}
export async function httpGet<T>(path: string): Promise<T> {
    return http<T>(path, { method: 'GET' });
}
