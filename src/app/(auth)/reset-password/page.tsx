'use client';

import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, PasswordInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const router = useRouter();

    async function onSubmit(form: FormData) {
        const email = String(form.get('email') || '').trim();
        const code = String(form.get('code') || '').trim();
        const new_password = String(form.get('new_password') || '');
        try {
            await AuthAPI.resetPassword({ email, code, new_password });
            toast.success('Password reset. Please log in.');
            router.push(`/login?email=${encodeURIComponent(email)}`);
        } catch (e: any) {
            toast.error(e?.message || 'Reset failed');
        }
    }

    return (
        <main>
            <Card title="Reset password">
                <form action={onSubmit} style={{ display: 'grid', gap: 14 }}>
                    <TextInput label="Email" name="email" type="email" required />
                    <TextInput label="Reset code" name="code" inputMode="numeric" required />
                    <PasswordInput label="New password" name="new_password" required />
                    <SubmitButton type="submit">Set new password</SubmitButton>
                </form>
            </Card>
        </main>
    );
}
