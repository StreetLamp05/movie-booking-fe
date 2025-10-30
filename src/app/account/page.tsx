'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function AccountPage() {
    const { user, loading, refresh } = useAuth();
    const router = useRouter();

    const [firstName, setFirstName] = useState(user?.first_name ?? '');
    const [lastName, setLastName] = useState(user?.last_name ?? '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [loading, user, router]);

    useEffect(() => {
        setFirstName(user?.first_name ?? '');
        setLastName(user?.last_name ?? '');
    }, [user]);

    const canEditEmail = user?.role === 'admin'; // policy: only admins can edit email via separate UX

    const changed = useMemo(() => {
        if (!user) return false;
        return (firstName ?? '') !== (user.first_name ?? '') || (lastName ?? '') !== (user.last_name ?? '');
    }, [user, firstName, lastName]);

    if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;
    if (!user) return null;

    async function onSubmit(form: FormData) {
        const first_name = String(form.get('first_name') || '').trim();
        const last_name = String(form.get('last_name') || '').trim();
        setSaving(true);
        try {
            await AuthAPI.updateProfile({ first_name, last_name });
            toast.success('Profile updated');
            await refresh();
        } catch (e: any) {
            toast.error(e?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    }

    return (
        <main style={{ display: 'grid', gap: 24 }}>
            <Card title="Your account">
                {/* Identity summary */}
                <div style={{ color: 'var(--text-secondary)', display: 'grid', gap: 6 }}>
                    <div>
                        Email: <strong>{user.email}</strong>
                        {!user.is_verified && (
                            <span style={{ marginLeft: 8, color: '#ffae42' }}>(unverified)</span>
                        )}
                    </div>
                    <div>Role: <strong>{user.role}</strong></div>
                    {!user.is_verified && (
                        <div style={{ marginTop: 6 }}>
                            <Link
                                href={`/verify-email?email=${encodeURIComponent(user.email)}`}
                                className="glass"
                                style={{ padding: '6px 10px', borderRadius: 8 }}
                            >
                                Verify email
                            </Link>
                        </div>
                    )}
                </div>

                {/* Edit form */}
                <form action={onSubmit} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
                    <TextInput
                        label="First name"
                        name="first_name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextInput
                        label="Last name"
                        name="last_name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    {/* Email shown read-only unless you later add an admin edit flow */}
                    <label style={{ display: 'grid', gap: 8 }}>
                        <span style={{ fontWeight: 500 }}>Email</span>
                        <input
                            value={user.email}
                            disabled
                            readOnly
                            style={{
                                background: 'var(--surface-primary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                padding: '10px 16px',
                                borderRadius: 'var(--border-radius-small)',
                                fontFamily: 'inherit',
                                opacity: canEditEmail ? 1 : 0.7,
                            }}
                        />
                    </label>

                    <SubmitButton type="submit" disabled={!changed || saving}>
                        {saving ? 'Saving…' : changed ? 'Save' : 'No changes'}
                    </SubmitButton>
                </form>
            </Card>
        </main>
    );
}
