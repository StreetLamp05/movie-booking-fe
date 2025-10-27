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
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    role: 'user' | 'admin';
    is_active: boolean;
    subscribed_to_promotions: boolean;
    created_at: string; // ISO
};


export type Address = {
    id: number;
    user_id: number;
    street: string;
    city: string;
    state: string;
    zip_code: string;
};


export type PaymentCard = {
    id: number;
    user_id: number;
    card_number_last4: string;
    card_type: string;
    expiration_month: number;
    expiration_year: number;
    billing_address_id?: number;
};


export type RegisterRequest = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    subscribed_to_promotions: boolean;
};


export type LoginRequest = {
    email: string;
    password: string;
    remember_me?: boolean;
};


export type LoginResponse = {
    user: User;
    token: string;
};


export type ForgotPasswordRequest = {
    email: string;
};


export type ResetPasswordRequest = {
    token: string;
    new_password: string;
};


export type UpdateProfileRequest = {
    first_name?: string;
    last_name?: string;
    phone?: string;
    current_password?: string;
    new_password?: string;
    subscribed_to_promotions?: boolean;
};


export type AddAddressRequest = {
    street: string;
    city: string;
    state: string;
    zip_code: string;
};


export type AddPaymentCardRequest = {
    card_number: string;
    card_type: string;
    expiration_month: number;
    expiration_year: number;
    cvv: string;
    billing_address_id?: number;
};