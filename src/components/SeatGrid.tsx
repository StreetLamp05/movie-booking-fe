'use client';

export default function SeatGrid({ rows, cols }: { rows: number; cols: number }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '8px',
                maxWidth: '500px',
                margin: '0 auto'
            }}
        >
            {Array.from({ length: rows * cols }).map((_, idx) => (
                <div
                    key={idx}
                    className="glass"
                    style={{
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: 'var(--text-tertiary)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--surface-hover)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--surface-primary)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    {String.fromCharCode(65 + Math.floor(idx / cols))}{(idx % cols) + 1}
                </div>
            ))}
        </div>
    );
}
