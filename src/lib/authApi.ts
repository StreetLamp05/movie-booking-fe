import { API_BASE } from './config';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
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
}

export const AuthAPI = {
  signup: (data: { first_name: string; last_name: string; email: string; password: string }) =>
    http('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verify: (data: { email: string; code: string }) =>
    http('/auth/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    http('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
