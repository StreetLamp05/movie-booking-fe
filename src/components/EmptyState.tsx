export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div style={{
            border: '2px dashed rgba(255, 255, 255, 0.2)',
            borderRadius: 16,
            padding: 60,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)'
        }}>
            <h3 style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.5rem',
                fontWeight: '300',
                letterSpacing: '0.5px'
            }}>
                {title}
            </h3>
            {subtitle && (
                <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    marginTop: '12px',
                    fontSize: '1rem'
                }}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}