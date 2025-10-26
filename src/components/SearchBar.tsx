'use client';
import { useState, useEffect } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';


export default function SearchBar() {
    const { searchParams, setParams } = useQueryParams();
    const initial = searchParams?.get('q') ?? '';
    const [q, setQ] = useState(initial);


    useEffect(() => setQ(initial), [initial]);


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                setParams({ q: q || undefined, offset: undefined });
            }}
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: '24px',
                paddingRight: '4px'
            }}
        >
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="search movies"
                style={{
                    padding: '10px 20px',
                    flex: 1,
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    outline: 'none',
                    color: '#333'
                }}
            />
            <button
                type="submit"
                style={{
                    padding: '8px 20px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366f1'}
            >
                🔍
            </button>
        </form>
    );
}