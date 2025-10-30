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