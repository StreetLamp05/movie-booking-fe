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
            style={{ display: 'flex', gap: 8 }}
        >
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title"
                style={{ padding: 8, flex: 1 }}
            />
            <button type="submit">Search</button>
        </form>
    );
}