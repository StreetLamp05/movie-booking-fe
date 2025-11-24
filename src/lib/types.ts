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


export type Auditorium = { id: number; name: string; row_count: number; col_count: number; created_at: string };
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


export type Seat = {
    seat_id: string; // uuid
    auditorium_id: number;
    row: number;
    col: number;
    seat_type: 'standard' | 'premium' | 'wheelchair';
};

export type SeatStatus = {
    seat_id: string;
    row: number;
    col: number;
    seat_type: 'standard' | 'premium' | 'wheelchair';
    is_available: boolean;
    held_by_current_user: boolean;
};

export type ShowtimeSeatsResponse = {
    showtime_id: string;
    seats: SeatStatus[];
};

export type HoldSeatsRequest = {
    seat_ids: string[];
};

export type HoldSeatsResponse = {
    held_seats: string[];
};

export type ReleaseSeatsRequest = {
    seat_ids?: string[]; // optional - if not provided, releases all holds
};

export type Booking = {
    booking_id: string;
    user_id: number;
    showtime_id: string;
    total_price_cents: number;
    booking_status: 'confirmed' | 'cancelled';
    created_at: string;
    tickets: Ticket[];
};

export type Ticket = {
    ticket_id: string;
    booking_id: string;
    seat_id: string;
    age_category: 'child' | 'adult' | 'senior';
    price_cents: number;
};

export type CreateBookingRequest = {
    showtime_id: string;
    seat_ids: string[];
    tickets: {
        seat_id: string;
        age_category: 'child' | 'adult' | 'senior';
    }[];
};