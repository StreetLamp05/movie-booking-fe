// Extend your existing types
export type Category = { id: number; name: string };

export type Movie = {
    id: number;
    title: string;
    cast: string;
    director: string;
    producer: string;
    synopsis: string;
    trailer_picture: string;
    video: string;
    film_rating_code: string;
    created_at: string;
    categories: Category[];
};

export type PageMeta = { limit: number; offset: number; total: number };
export type MoviesResponse = { data: Movie[]; page: PageMeta };

export type Auditorium = {
    auditorium_id: number;
    name: string;
    row_count: number;
    col_count: number;
};

export type AuditoriumsResponse = {
    data: Auditorium[];
    page: PageMeta
};

export type Showtime = {
    showtime_id: string;
    movie_id: number;
    auditorium_id: number;
    starts_at: string;
    child_price_cents: number;
    adult_price_cents: number;
    senior_price_cents: number;
};

export type ShowtimesResponse = {
    data: Showtime[];
    page: PageMeta
};

export type ApiError = {
    error: {
        code: 'NOT_FOUND' | 'BAD_REQUEST' | 'CONFLICT';
        message: string;
        details?: unknown
    };
};

// Booking-specific types

// Seat as it exists in DB
export interface Seat {
    seat_id: number;
    auditorium_id: number;
    row_label: string; // A, B, C, etc.
    seat_number: number; // 1, 2, 3, etc.
    status: 'available' | 'held' | 'sold';
}

export interface SeatRow {
    row_label: string;
    seats: Seat[];
}

export interface SeatMapResponse {
    showtime_id: string;
    auditorium: Auditorium;
    rows: SeatRow[];
}

// Ticket counts
export interface TicketCounts {
    adult: number;
    child: number;
    senior: number;
}

// Pricing structure
export interface Pricing {
    adult_price_cents: number;
    child_price_cents: number;
    senior_price_cents: number;
}

// Create booking request
export interface CreateBookingRequest {
    showtime_id: string;
    ticket_counts: TicketCounts;
}

// Booking response
export interface BookingResponse {
    booking_id: string;
    user_id: string;
    showtime_id: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    total_cents: number;
    created_at: string;
    expires_at: string;
    ticket_counts: TicketCounts;
}

// Seat hold request
export interface SeatHoldRequest {
    seat_ids: number[];
    hold_minutes: number;
}

// Seat hold response
export interface SeatHoldResponse {
    showtime_id: string;
    user_id: string;
    hold_expires_at: string;
    holds: Array<{ seat_id: number }>;
}

// Ticket type assignment (seat_id -> ticket type)
export interface TicketTypeAssignment {
    [seatId: string]: 'adult' | 'child' | 'senior';
}

// Checkout request
export interface CheckoutRequest {
    seat_ids: number[];
    ticket_types: TicketTypeAssignment;
    promo_code?: string;
    payment?: CardPaymentRequest;
    billing_info_id?: string; // For saved cards
}

// Individual ticket
export interface Ticket {
    ticket_id: string;
    seat_id: number;
    seat_display?: string;
    ticket_type: 'adult' | 'child' | 'senior';
    price_cents: number;
}

// Confirmed booking
export interface ConfirmedBooking {
    booking_id: string;
    status: 'CONFIRMED';
    showtime_id: string;
    user_id: string;
    user_email?: string;
    total_cents: number;
    ticket_counts: TicketCounts;
    seats?: string;
    tickets: Ticket[];
    movie?: {
        title: string;
        film_rating_code?: string;
    };
    showtime?: {
        starts_at: string;
        adult_price_cents?: number;
        child_price_cents?: number;
        senior_price_cents?: number;
    };
    auditorium?: {
        name: string;
    };
}

// Paginated response helper
export interface PaginatedResponse<T> {
    data: T[];
    page?: PageMeta;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface CardPaymentRequest {
    card_number: string;
    card_exp_month: string;  // MM
    card_exp_year: string;   // YYYY
    card_cvv: string;
    cardholder_name: string;
    card_type: 'debit' | 'credit';
    billing_street: string;
    billing_city: string;
    billing_state: string;
    billing_zip_code: string;
}
export interface CardPayment {
    billing_info_id: string;
    cardholder_name: string;
    card_type: 'debit' | 'credit';
    card_last4: string;
    card_exp: string;
    billing_street: string;
    billing_city: string;
    billing_state: string;
    billing_zip_code: string;
    created_at?: string;
}