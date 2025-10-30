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
