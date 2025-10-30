'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card, TextInput, PasswordInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const sp = useSearchParams();
    const emailPrefill = sp.get('email') ?? '';

    async function onSubmit(form: FormData) {
        const email = String(form.get('email') || '').trim();
        const password = String(form.get('password') || '');
        try {
            await login(email, password);
            toast.success('Logged in');
            router.push('/account');
        } catch (e: any) {
            const msg = e?.message || 'Login failed';
            if (/not verified/i.test(msg)) {
                toast.error('Email not verified.');
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(msg);
            }
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
            <Card title="Log in">
                <form
                    action={onSubmit}
                    style={{ display: 'grid', gap: 14 }}
                >
                    <TextInput label="Email" name="email" type="email" defaultValue={emailPrefill} required />
                    <PasswordInput label="Password" name="password" required />
                    <SubmitButton type="submit">Log in</SubmitButton>
                </form>
                <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
                    <Link href="/forgot-password">Forgot password?</Link>
                </div>
                <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
                    New here? <Link href="/signup">Create an account</Link>
                </div>
            </Card>
        </main>
    );
}
