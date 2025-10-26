'use client';
import { useState } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';


const GENRES = [
    'Action','Adventure','Animation','Comedy','Crime','Drama','Fantasy','Horror','Mystery','Romance','Sci-Fi','Thriller'
];


export default function GenreFilter() {
    const { searchParams, setParams } = useQueryParams();
    const selected = searchParams?.getAll('category') ?? [];
    const [isOpen, setIsOpen] = useState(false);


    const toggle = (g: string) => {
        const next = new Set(selected);
        if (next.has(g)) next.delete(g); else next.add(g);
        const arr = [...next];
        setParams({ category: arr.length ? arr : undefined, offset: undefined });
    };


    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px 20px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
                Filter by Genre {selected.length > 0 && `(${selected.length})`}
                <span style={{ fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    backgroundColor: 'rgba(20, 20, 40, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    minWidth: '250px',
                    zIndex: 1000,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {GENRES.map((g) => (
                            <label
                                key={g}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selected.includes(g) ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                                    color: 'white',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (!selected.includes(g)) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!selected.includes(g)) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(g)}
                                    onChange={() => toggle(g)}
                                    style={{ cursor: 'pointer' }}
                                />
                                {g}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}