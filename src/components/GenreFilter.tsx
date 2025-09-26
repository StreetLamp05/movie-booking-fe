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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {GENRES.map((g) => (
                <button
                    key={g}
                    onClick={() => toggle(g)}
                    aria-pressed={selected.includes(g)}
                    style={{ padding: '4px 10px', border: '1px solid #ddd', background: selected.includes(g) ? '#eee' : 'white' }}
                >
                    {g}
                </button>
            ))}
        </div>
    );
}