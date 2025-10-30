'use client';

import { useState } from 'react';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    const { label, ...rest } = props;
    return (
        <label style={{ display: 'grid', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>{label}</span>
            <input
                {...rest}
                style={{
                    background: 'var(--surface-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '10px 16px',
                    borderRadius: 'var(--border-radius-small)',
                    fontFamily: 'inherit',
                }}
            />
        </label>
    );
}

export function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
    const { label, ...rest } = props;
    const [show, setShow] = useState(false);
    return (
        <label style={{ display: 'grid', gap: 8, position: 'relative' }}>
            <span style={{ fontWeight: 500 }}>{label}</span>
            <input
                {...rest}
                type={show ? 'text' : 'password'}
                style={{
                    background: 'var(--surface-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '10px 40px 10px 16px',
                    borderRadius: 'var(--border-radius-small)',
                    fontFamily: 'inherit',
                }}
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                style={{ position: 'absolute', right: 8, top: 30, padding: '4px 8px' }}
            >
                {show ? 'Hide' : 'Show'}
            </button>
        </label>
    );
}

export function SubmitButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...rest}
            style={{
                padding: '12px 20px',
                background: 'var(--accent)',
                borderColor: 'var(--accent)',
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 'var(--border-radius-small)',
            }}
        >
            {children}
        </button>
    );
}

export function Card({
                         children,
                         title,
                         maxWidth,
                     }: {
    children: React.ReactNode;
    title: string;
    /** 'full' for 100%, number for px, undefined defaults to 520px */
    maxWidth?: number | 'full';
}) {
    const resolvedMaxWidth =
        maxWidth === 'full' ? '100%' : typeof maxWidth === 'number' ? `${maxWidth}px` : '520px';
    return (
        <div className="glass" style={{ padding: 24, width: '100%', maxWidth: resolvedMaxWidth, margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: 16 }}>{title}</h1>
            <div style={{ display: 'grid', gap: 14 }}>{children}</div>
        </div>
    );
}
