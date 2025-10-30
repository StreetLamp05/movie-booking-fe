'use client';
import { useQueryParams } from '@/hooks/useQueryParams';

const GENRES = [
    'Action','Adventure','Animation','Comedy','Crime','Drama','Fantasy','Horror','Mystery','Romance','Sci-Fi','Thriller'
];

export default function GenreFilter() {
    const { searchParams, setParams } = useQueryParams();
    const selected = searchParams?.getAll('category') ?? [];

    const toggle = (g: string) => {
        const next = new Set(selected);
        if (next.has(g)) next.delete(g); else next.add(g);
        const arr = [...next];
        setParams({ category: arr.length ? arr : undefined, offset: undefined });
    };

    return (
        <div className="glass" style={{ 
            padding: '16px',
            borderRadius: 'var(--border-radius)'
        }}>
            <div style={{ 
                marginBottom: '12px',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                fontWeight: 500
            }}>
                Filter by Genre
            </div>
            <div style={{ 
                display: 'flex', 
                gap: 8, 
                flexWrap: 'wrap' 
            }}>
                {GENRES.map((g) => (
                    <button
                        key={g}
                        onClick={() => toggle(g)}
                        aria-pressed={selected.includes(g)}
                        style={{ 
                            padding: '6px 14px',
                            fontSize: '14px',
                            borderRadius: '20px',
                            background: selected.includes(g) ? 'var(--accent)' : 'var(--surface-primary)',
                            borderColor: selected.includes(g) ? 'var(--accent)' : 'var(--border-color)',
                            fontWeight: selected.includes(g) ? 500 : 400
                        }}
                    >
                        {g}
                    </button>
                ))}
            </div>
        </div>
    );
}
