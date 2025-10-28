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
    error: { code: 'NOT_FOUND' | 'BAD_REQUEST' | 'CONFLICT' | 'UNAUTHORIZED'; message: string; details?: unknown };
};


export type User = {
    user_id: string; // UUID
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    password_hash: string;
    is_admin: boolean;
    is_email_list: boolean;
    home_street?: string;
    home_city?: string;
    home_state?: string;
    home_country?: string;
    home_zip_code?: string;
    created_at: string; // ISO
};


export type BillingInfo = {
    billing_info_id: string; // UUID
    user_id: string; // UUID
    first_name: string;
    last_name: string;
    card_type: 'credit' | 'debit';
    card_number: string; // Full for adding, masked for display
    card_exp: string; // MM/YY format
    billing_street: string;
    billing_state: string;
    billing_zip_code: string;
    created_at: string; // ISO
};


export type RegisterRequest = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
};


export type VerifyEmailRequest = {
    email: string;
    code: string;
};


export type LoginRequest = {
    email: string;
    password: string;
};


export type LoginResponse = {
    message: string;
    userId: string;
};


export type UpdateProfileRequest = {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    is_email_list?: boolean;
    password?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zip_code?: string;
    };
};


export type AddPaymentCardRequest = {
    card_type: 'credit' | 'debit';
    card_number: string; // 16 digits
    card_exp: string; // MM/YY format
    billing_street: string;
    billing_state: string;
    billing_zip_code: string;
};