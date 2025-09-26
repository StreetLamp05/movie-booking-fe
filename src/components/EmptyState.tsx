export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div style={{ border: '1px dashed #ccc', borderRadius: 8, padding: 24, textAlign: 'center' }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ color: '#666' }}>{subtitle}</p>}
        </div>
    );
}