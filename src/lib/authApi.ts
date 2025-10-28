import { API_BASE } from './config';

import type { LoginResponse, SignupResponse, VerificationResponse } from './types';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    console.log('Making request to:', `${API_BASE}${path}`);
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }
    return res.json();
  } catch (err) {
    console.error('API request failed:', err);
    throw err;
  }
}

export const AuthAPI = {
  signup: (data: { first_name: string; last_name: string; email: string; password: string; is_email_list?: boolean }): Promise<SignupResponse> =>
    http<SignupResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verify: (data: { email: string; code: string }): Promise<VerificationResponse> =>
    http<VerificationResponse>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resendVerification: (token: string): Promise<VerificationResponse> =>
    http<VerificationResponse>('/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }),

  login: (data: { email: string; password: string }): Promise<LoginResponse> =>
    http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  requestPasswordReset: (email: string): Promise<{ message: string }> =>
    http<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  resetPassword: (data: { email: string; code: string; new_password: string }): Promise<{ message: string }> =>
    http<{ message: string }>(' /auth/reset-password'.replace(' ', ''), {
      method: 'POST',
      body: JSON.stringify(data)
    }),
};