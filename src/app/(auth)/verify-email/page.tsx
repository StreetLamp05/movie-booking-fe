'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function VerifyEmailPage() {
    const sp = useSearchParams();
    const emailPrefill = sp.get('email') ?? '';
    const router = useRouter();

    async function onVerify(form: FormData) {
        const email = String(form.get('email') || '').trim();
        const code = String(form.get('code') || '').trim();
        try {
            await AuthAPI.verifyEmail({ email, code });
            toast.success('Email verified!');
            router.push(`/login?email=${encodeURIComponent(email)}`);
        } catch (e: any) {
            toast.error(e?.message || 'Verification failed');
        }
    }

    async function onResend(form: FormData) {
        const email = String(form.get('email') || '').trim();
        try {
            await AuthAPI.resendVerification({ email });
            toast.success('Verification email resent');
        } catch (e: any) {
            toast.error(e?.message || 'Resend failed');
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
            <Card title="Verify your email">
                <form action={onVerify} style={{ display: 'grid', gap: 14 }}>
                    <TextInput label="Email" name="email" type="email" defaultValue={emailPrefill} required />
                    <TextInput label="Verification code" name="code" inputMode="numeric" required />
                    <SubmitButton type="submit">Verify</SubmitButton>
                </form>

                <form action={onResend} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                    <input type="hidden" name="email" defaultValue={emailPrefill} />
                    <button type="submit" style={{ padding: '8px 12px' }}>Resend code</button>
                </form>

                <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
                    Already verified? <Link href="/login">Log in</Link>
                </div>
            </Card>
        </main>
    );
}
