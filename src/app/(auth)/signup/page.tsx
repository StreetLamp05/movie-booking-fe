'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, PasswordInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function SignupPage() {
    const router = useRouter();

    async function onSubmit(form: FormData) {
        const first_name = String(form.get('first_name') || '').trim();
        const last_name = String(form.get('last_name') || '').trim();
        const email = String(form.get('email') || '').trim();
        const password = String(form.get('password') || '');
        try {
            await AuthAPI.signup({ first_name, last_name, email, password });
            toast.success('Account created. Check your email for the code.');
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (e: any) {
            toast.error(e?.message || 'Signup failed');
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
            <Card title="Create your account">
                <form action={onSubmit} style={{ display: 'grid', gap: 14 }}>
                    <TextInput label="First name" name="first_name" required />
                    <TextInput label="Last name" name="last_name" required />
                    <TextInput label="Email" name="email" type="email" required />
                    <PasswordInput label="Password" name="password" required />
                    <SubmitButton type="submit">Sign up</SubmitButton>
                </form>
                <div style={{ marginTop: 8, color: 'var(--text-secondary)', fontSize: 14 }}>
                    Already have an account? <Link href="/login">Log in</Link>
                </div>
            </Card>
        </main>
    );
}
