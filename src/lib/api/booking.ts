import type {
    SeatMapResponse,
    SeatHoldRequest,
    SeatHoldResponse,
    CreateBookingRequest,
    BookingResponse,
    CheckoutRequest,
    ConfirmedBooking,
} from '@/lib/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper to get JWT token from localStorage or cookie
function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Common token key names to check
    const tokenKeys = ['access_token', 'token', 'authToken', 'jwt', 'accessToken'];

    // Try localStorage with all common keys
    for (const key of tokenKeys) {
        const token = localStorage.getItem(key);
        if (token) {
            console.log(`[Auth] Found token in localStorage.${key}`);
            return token;
        }
    }

    // Try cookies
    const cookies = document.cookie.split(';');
    for (const key of tokenKeys) {
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === key && value) {
                console.log(`[Auth] Found token in cookie.${key}`);
                return value;
            }
        }
    }

    console.warn('[Auth] No token found in localStorage or cookies');
    return null;
}

// Helper for authenticated requests
async function authFetch(url: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        // @ts-ignore
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies in requests
    });

    if (!response.ok) {
        // Backend returns { error: { code, message, details } }
        const errorData = await response.json().catch(() => null);

        let errorMessage = `HTTP ${response.status}`;

        if (errorData && typeof errorData === 'object') {
            if (errorData.error && typeof errorData.error === 'object') {
                // Backend format: { error: { message: "..." } }
                errorMessage = errorData.error.message || errorMessage;
            } else if (errorData.message) {
                // Simple format: { message: "..." }
                errorMessage = errorData.message;
            } else if (errorData.error && typeof errorData.error === 'string') {
                // String error: { error: "..." }
                errorMessage = errorData.error;
            }
        }

        throw new Error(errorMessage);
    }

    return response.json();
}

export const SeatsAPI = {
    // GET /api/v1/showtimes/:id/seats
    getSeatMap: async (showtimeId: string): Promise<SeatMapResponse> => {
        return authFetch(`${API_BASE}/api/v1/showtimes/${showtimeId}/seats`);
    },

    // POST /api/v1/showtimes/:id/hold
    holdSeats: async (
        showtimeId: string,
        data: SeatHoldRequest
    ): Promise<SeatHoldResponse> => {
        return authFetch(`${API_BASE}/api/v1/showtimes/${showtimeId}/hold`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export const BookingsAPI = {
    // POST /api/v1/bookings
    create: async (data: CreateBookingRequest): Promise<BookingResponse> => {
        return authFetch(`${API_BASE}/api/v1/bookings`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // POST /api/v1/bookings/:id/checkout
    checkout: async (
        bookingId: string,
        data: CheckoutRequest
    ): Promise<ConfirmedBooking> => {
        return authFetch(`${API_BASE}/api/v1/bookings/${bookingId}/checkout`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};