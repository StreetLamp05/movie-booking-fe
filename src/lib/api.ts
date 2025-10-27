import { API_BASE } from './config';
import type {
    MoviesResponse,
    Movie,
    ShowtimesResponse,
    Showtime,
    AuditoriumsResponse,
    Auditorium,
    User,
    Address,
    PaymentCard,
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
    AddAddressRequest,
    AddPaymentCardRequest
} from './types';


async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        //TODO: switch to `next: { revalidate: 60 }` for prod
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
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


export const AuthAPI = {
    register: (data: RegisterRequest) => http<{ user: User }>('/auth/register', {
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

    forgotPassword: (data: ForgotPasswordRequest) => http<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    resetPassword: (data: ResetPasswordRequest) => http<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    verifyEmail: (token: string) => http<{ message: string }>(`/auth/verify-email?token=${token}`, {
        method: 'GET'
    }),
};


export const UserAPI = {
    getProfile: () => http<User>('/users/profile'),

    updateProfile: (data: UpdateProfileRequest) => http<User>('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    getAddresses: () => http<Address[]>('/users/addresses'),

    addAddress: (data: AddAddressRequest) => http<Address>('/users/addresses', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    updateAddress: (id: number, data: AddAddressRequest) => http<Address>(`/users/addresses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    deleteAddress: (id: number) => http<{ message: string }>(`/users/addresses/${id}`, {
        method: 'DELETE'
    }),

    getPaymentCards: () => http<PaymentCard[]>('/users/payment-cards'),

    addPaymentCard: (data: AddPaymentCardRequest) => http<PaymentCard>('/users/payment-cards', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    deletePaymentCard: (id: number) => http<{ message: string }>(`/users/payment-cards/${id}`, {
        method: 'DELETE'
    }),
};