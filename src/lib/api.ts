import { API_BASE } from './config';
import type {
    MoviesResponse,
    Movie,
    ShowtimesResponse,
    Showtime,
    AuditoriumsResponse,
    Auditorium,
    User,
    BillingInfo,
    RegisterRequest,
    VerifyEmailRequest,
    LoginRequest,
    LoginResponse,
    UpdateProfileRequest,
    AddPaymentCardRequest
} from './types';


async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        //TODO: switch to `next: { revalidate: 60 }` for prod
        cache: 'no-store',
        credentials: 'include', // Important for session cookies
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }
    return res.json();
}



async function authFetch<T>(path: string, init?: RequestInit): Promise<T> {
    
    // 1. Get the token from localStorage
    const token = localStorage.getItem('authToken');

        // 2. Define the headers object first
    //    We start with your defaults and any headers from 'init'
    // --- (FIXED THE TYPE HERE) ---
    // Changed from Record<string, string> to HeadersInit
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
    };

    // 3. If a token exists, add the Authorization header
    //    We need to check if headers is a Headers object or a plain object
    if (token) {
        // We must 'set' the header in a way that works for both
        // Headers object and plain object. Easiest is to
        // just treat it as an indexable object (which both are).
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    // 4. Make the fetch call using the new headers object
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        //TODO: switch to `next: { revalidate: 60 }` for prod
        cache: 'no-store',
        credentials: 'include', // Left this as requested
        headers: headers,        // Use our dynamically built headers
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }
    return res.json();
}




// This is your main login function on the frontend
async function handleRegistration(registerRequest : RegisterRequest) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: registerRequest.email, password: registerRequest.password })
        });

        if (!response.ok) {
            // Handle bad login (e.g., show "Invalid credentials")
            console.error('Login failed');
            return;
        }

        // 1. Get the JSON data from the successful response
        const data = await response.json();
        
        // 2. THIS IS THE KEY: Store the token in localStorage
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            console.log('Login successful, token stored!');
            
            // Now you would redirect to the user's dashboard
            // window.location.href = '/dashboard';
        }

        return data;

    } catch (error) {
        console.error('An error occurred:', error);
    }
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


export const AuthAPI = {
    signup: (data: RegisterRequest) => handleRegistration(data),

    verify: (data: VerifyEmailRequest) => http<{ message: string; user: User }>('/auth/verify', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    login: (data: LoginRequest) => http<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    logout: () => http<{ message: string }>('/auth/logout', {
        method: 'POST'
    }),
};


export const UserAPI = {
    getProfile: () => authFetch<User>('/users/profile'),

    updateProfile: (data: UpdateProfileRequest) => authFetch<User>('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    getCards: () => authFetch<BillingInfo[]>('/users/cards'),

    addCard: (data: AddPaymentCardRequest) => authFetch<BillingInfo>('/users/cards', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    deleteCard: (cardId: string) => authFetch<{ message: string }>(`/users/cards/${cardId}`, {
        method: 'DELETE'
    }),
};