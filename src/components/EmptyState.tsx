export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="glass" style={{ 
            borderStyle: 'dashed',
            padding: '48px 24px',
            textAlign: 'center',
            opacity: 0.8
        }}>
            <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 16px',
                background: 'var(--surface-secondary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
            </div>
            <h3 style={{ 
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
            }}>{title}</h3>
            {subtitle && <p style={{ 
                color: 'var(--text-secondary)',
                marginTop: '8px'
            }}>{subtitle}</p>}
        </div>
    );
}
