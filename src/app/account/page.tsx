'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthAPI } from '@/lib/auth';
import { Card, TextInput, SubmitButton } from '@/components/Form';
import { toast } from 'react-toastify';
import Link from 'next/link';

// --- Simple fetchers for cards (use your fetch wrapper if you prefer)
async function apiGetCards() {
    const res = await fetch('/api/v1/users/cards', { credentials: 'include' });
    if (!res.ok) throw new Error(`Load cards failed (${res.status})`);
    return res.json();
}
async function apiAddCard(payload: any) {
    const res = await fetch('/api/v1/users/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json())?.error?.message || `Add failed (${res.status})`);
    return res.json();
}
async function apiPatchCard(id: string, payload: any) {
    const res = await fetch(`/api/v1/users/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error((await res.json())?.error?.message || `Update failed (${res.status})`);
    return res.json();
}
async function apiDeleteCard(id: string) {
    const res = await fetch(`/api/v1/users/cards/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Delete failed (${res.status})`);
}

export default function AccountPage() {
    const { user, loading, refresh } = useAuth();
    const router = useRouter();

    const [firstName, setFirstName] = useState(user?.first_name ?? '');
    const [lastName, setLastName] = useState(user?.last_name ?? '');
    const [phone, setPhone] = useState(user?.phone_number ?? '');
    const [street, setStreet] = useState(user?.address?.street ?? '');
    const [city, setCity] = useState(user?.address?.city ?? '');
    const [state, setState] = useState(user?.address?.state ?? '');
    const [country, setCountry] = useState(user?.address?.country ?? '');
    const [zip, setZip] = useState(user?.address?.zip_code ?? '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [loading, user, router]);

    useEffect(() => {
        setFirstName(user?.first_name ?? '');
        setLastName(user?.last_name ?? '');
        setPhone(user?.phone_number ?? '');
        setStreet(user?.address?.street ?? '');
        setCity(user?.address?.city ?? '');
        setState(user?.address?.state ?? '');
        setCountry(user?.address?.country ?? '');
        setZip(user?.address?.zip_code ?? '');
    }, [user]);

    const canEditEmail = user?.role === 'admin'; // policy: only admins via separate UX

    const changed = useMemo(() => {
        if (!user) return false;
        const addr = user.address || {};
        return (
            (firstName ?? '') !== (user.first_name ?? '') ||
            (lastName ?? '') !== (user.last_name ?? '') ||
            (phone ?? '') !== (user.phone_number ?? '') ||
            (street ?? '') !== (addr.street ?? '') ||
            (city ?? '') !== (addr.city ?? '') ||
            (state ?? '') !== (addr.state ?? '') ||
            (country ?? '') !== (addr.country ?? '') ||
            (zip ?? '') !== (addr.zip_code ?? '')
        );
    }, [user, firstName, lastName, phone, street, city, state, country, zip]);

    if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;
    if (!user) return null;

    async function onSubmit(form: FormData) {
        const first_name = String(form.get('first_name') || '').trim();
        const last_name = String(form.get('last_name') || '').trim();
        const phone_number = String(form.get('phone_number') || '').replace(/\D/g, '');
        const address = {
            street: String(form.get('street') || ''),
            city: String(form.get('city') || ''),
            state: String(form.get('state') || '').toUpperCase(),
            country: String(form.get('country') || ''),
            zip_code: String(form.get('zip') || ''),
        };

        // quick client-side sanity (server also validates)
        if (phone_number && phone_number.length !== 10) {
            toast.error('Phone must be 10 digits');
            return;
        }
        if (address.state && !/^[A-Z]{2}$/.test(address.state)) {
            toast.error('State must be 2 letters (e.g., GA)');
            return;
        }
        if (address.zip_code && !/^\d{5}$/.test(address.zip_code)) {
            toast.error('ZIP must be 5 digits');
            return;
        }

        setSaving(true);
        try {
            await AuthAPI.updateProfile({ first_name, last_name, phone_number, address });
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

                    {/* Phone */}
                    <TextInput
                        label="Phone (10 digits)"
                        name="phone_number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="7065551234"
                    />

                    {/* Address */}
                    <div style={{ display: 'grid', gap: 10, marginTop: 6 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Address</div>
                        <TextInput
                            label="Street"
                            name="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                        <TextInput
                            label="City"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '120px 1fr 140px' }}>
                            <TextInput
                                label="State"
                                name="state"
                                value={state}
                                onChange={(e) => setState(e.target.value.toUpperCase())}
                                placeholder="GA"
                            />
                            <TextInput
                                label="Country"
                                name="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="US"
                            />
                            <TextInput
                                label="ZIP"
                                name="zip"
                                value={zip}
                                onChange={(e) => setZip(e.target.value)}
                                placeholder="30602"
                            />
                        </div>
                    </div>

                    <SubmitButton type="submit" disabled={!changed || saving}>
                        {saving ? 'Saving…' : changed ? 'Save' : 'No changes'}
                    </SubmitButton>
                </form>
            </Card>

            <BillingCardsPanel />
        </main>
    );
}

function BillingCardsPanel() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // New card form state
    const [cardType, setCardType] = useState<'credit' | 'debit'>('credit');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExp, setCardExp] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [bStreet, setBStreet] = useState('');
    const [bCity, setBCity] = useState('');
    const [bState, setBState] = useState('');
    const [bZip, setBZip] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await apiGetCards();
                setCards(data || []);
            } catch (e: any) {
                toast.error(e?.message || 'Failed to load cards');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        // Minimal client checks
        if (!/^\d{16}$/.test(cardNumber.replace(/\D/g, ''))) return toast.error('Card number must be 16 digits');
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExp)) return toast.error('Exp must be MM/YY');
        if (!/^[A-Z]{2}$/.test(bState.toUpperCase())) return toast.error('State must be 2 letters');
        if (!/^\d{5}$/.test(bZip)) return toast.error('ZIP must be 5 digits');

        setCreating(true);
        try {
            const created = await apiAddCard({
                card_type: cardType,
                card_number: cardNumber.replace(/\D/g, ''),
                card_exp: cardExp,
                cardholder_name: cardholderName,
                billing_street: bStreet,
                billing_city: bCity,
                billing_state: bState.toUpperCase(),
                billing_zip_code: bZip,
            });
            setCards((prev) => [created, ...prev]);
            toast.success('Card added');
            // reset
            setCardNumber(''); setCardExp(''); setCardholderName(''); setBStreet(''); setBCity(''); setBState(''); setBZip('');
        } catch (e: any) {
            toast.error(e?.message || 'Add failed');
        } finally {
            setCreating(false);
        }
    }

    async function handleUpdate(id: string, payload: any) {
        try {
            const updated = await apiPatchCard(id, payload);
            setCards((prev) => prev.map((c) => (c.billing_info_id === id ? updated : c)));
            toast.success('Card updated');
        } catch (e: any) {
            toast.error(e?.message || 'Update failed');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Remove this card?')) return;
        try {
            await apiDeleteCard(id);
            setCards((prev) => prev.filter((c) => c.billing_info_id !== id));
            toast.success('Card removed');
        } catch (e: any) {
            toast.error(e?.message || 'Delete failed');
        }
    }

    return (
        <Card title="Billing cards">
            {loading ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
            ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                    {/* Create card */}
                    <form onSubmit={handleCreate} style={{ display: 'grid', gap: 10, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Add a card</div>
                        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '140px 1fr 120px' }}>
                            <label style={{ display: 'grid', gap: 6 }}>
                                <span style={{ fontWeight: 500 }}>Type</span>
                                <select
                                    value={cardType}
                                    onChange={(e) => setCardType(e.target.value as 'credit' | 'debit')}
                                    style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-primary)', border: '1px solid var(--border-color)' }}
                                >
                                    <option value="credit">credit</option>
                                    <option value="debit">debit</option>
                                </select>
                            </label>
                            <TextInput
                                label="Card number"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="16 digits"
                            />
                            <TextInput
                                label="Exp (MM/YY)"
                                value={cardExp}
                                onChange={(e) => setCardExp(e.target.value)}
                                placeholder="12/27"
                            />
                        </div>
                        <TextInput
                            label="Cardholder name"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Full name"
                        />
                        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '2fr 1fr 90px 120px' }}>
                            <TextInput label="Billing street" value={bStreet} onChange={(e) => setBStreet(e.target.value)} />
                            <TextInput label="City" value={bCity} onChange={(e) => setBCity(e.target.value)} />
                            <TextInput label="State" value={bState} onChange={(e) => setBState(e.target.value.toUpperCase())} placeholder="GA" />
                            <TextInput label="ZIP" value={bZip} onChange={(e) => setBZip(e.target.value)} placeholder="30602" />
                        </div>
                        <SubmitButton type="submit" disabled={creating}>
                            {creating ? 'Adding…' : 'Add card'}
                        </SubmitButton>
                    </form>

                    {/* Existing cards */}
                    {cards.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No cards on file.</p>
                    ) : (
                        <div style={{ display: 'grid', gap: 12 }}>
                            {cards.map((c) => (
                                <CardRow
                                    key={c.billing_info_id}
                                    card={c}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}

function CardRow({ card, onUpdate, onDelete }: { card: any; onUpdate: (id: string, payload: any) => void; onDelete: (id: string) => void; }) {
    const [exp, setExp] = useState(card.card_exp || '');
    const [street, setStreet] = useState(card.billing_address?.street || '');
    const [city, setCity] = useState(card.billing_address?.city || '');
    const [state, setState] = useState(card.billing_address?.state || '');
    const [zip, setZip] = useState(card.billing_address?.zip_code || '');
    const [name, setName] = useState(card.cardholder_name || '');
    const [type, setType] = useState(card.card_type || 'credit');
    const [saving, setSaving] = useState(false);

    const changed =
        exp !== (card.card_exp || '') ||
        street !== (card.billing_address?.street || '') ||
        city !== (card.billing_address?.city || '') ||
        state !== (card.billing_address?.state || '') ||
        zip !== (card.billing_address?.zip_code || '') ||
        name !== (card.cardholder_name || '') ||
        type !== (card.card_type || '');

    async function save() {
        // client checks
        if (exp && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return toast.error('Exp must be MM/YY');
        if (state && !/^[A-Z]{2}$/.test(state.toUpperCase())) return toast.error('State must be 2 letters');
        if (zip && !/^\d{5}$/.test(zip)) return toast.error('ZIP must be 5 digits');

        setSaving(true);
        await onUpdate(card.billing_info_id, {
            card_exp: exp,
            cardholder_name: name,
            billing_street: street,
            billing_city: city,
            billing_state: state.toUpperCase(),
            billing_zip_code: zip,
            card_type: type,
        });
        setSaving(false);
    }

    return (
        <div style={{ display: 'grid', gap: 10, border: '1px solid var(--border-color)', borderRadius: 10, padding: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600 }}>
                    {type.toUpperCase()} •••• {card.card_last4}
                    <span style={{ marginLeft: 8, color: 'var(--text-secondary)', fontWeight: 400 }}>
            added {new Date(card.created_at || Date.now()).toLocaleDateString()}
          </span>
                </div>
                <button
                    type="button"
                    onClick={() => onDelete(card.billing_info_id)}
                    className="glass"
                    style={{ padding: '6px 10px', borderRadius: 8 }}
                >
                    Remove
                </button>
            </div>

            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '140px 160px 1fr 1fr 90px 120px' }}>
                <label style={{ display: 'grid', gap: 6 }}>
                    <span style={{ fontWeight: 500 }}>Type</span>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface-primary)', border: '1px solid var(--border-color)' }}
                    >
                        <option value="credit">credit</option>
                        <option value="debit">debit</option>
                    </select>
                </label>
                <TextInput label="Exp (MM/YY)" value={exp} onChange={(e) => setExp(e.target.value)} />
                <TextInput label="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
                <TextInput label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <TextInput label="State" value={state} onChange={(e) => setState(e.target.value.toUpperCase())} />
                <TextInput label="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 160px' }}>
                <TextInput label="Cardholder name" value={name} onChange={(e) => setName(e.target.value)} />
                <button
                    type="button"
                    disabled={!changed || saving}
                    onClick={save}
                    className="glass"
                    style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        opacity: !changed || saving ? 0.6 : 1,
                        fontWeight: 600,
                    }}
                >
                    {saving ? 'Saving…' : changed ? 'Save changes' : 'Saved'}
                </button>
            </div>
        </div>
    );
}
