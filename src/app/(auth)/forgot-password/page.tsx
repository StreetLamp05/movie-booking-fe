'use client';

import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
    async function onSubmit(form: FormData) {
        const email = String(form.get('email') || '').trim();
        try {
            await AuthAPI.forgotPassword({ email });
            toast.success('If that email exists, a reset code was sent.');
        } catch (e: any) {
            toast.error(e?.message || 'Request failed');
        }
    }

    return (
        <main>
            <Card title="Forgot password">
                <form action={onSubmit} style={{ display: 'grid', gap: 14 }}>
                    <TextInput label="Email" name="email" type="email" required />
                    <SubmitButton type="submit">Send reset code</SubmitButton>
                </form>
            </Card>
        </main>
    );
}
