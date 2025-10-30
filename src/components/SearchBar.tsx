'use client';
import { useState, useEffect } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';
import './SearchBar.css';

export default function SearchBar() {
    const { searchParams, setParams } = useQueryParams();
    const initial = searchParams?.get('q') ?? '';
    const [q, setQ] = useState(initial);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => setQ(initial), [initial]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                setParams({ q: q || undefined, offset: undefined });
            }}
            className={`search-form ${isFocused ? 'focused' : ''}`}
        >
            <div className="search-input-wrapper">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Search movies by title..."
                    className="search-input"
                />
                <svg 
                    className="search-icon"
                    viewBox="0 0 24 24"
                >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
            </div>
            <button 
                type="submit"
                className="search-button"
            >
                <span>Search</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                </svg>
            </button>
        </form>
    );
}
