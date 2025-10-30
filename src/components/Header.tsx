import Link from 'next/link';

export default function Header() {
    return (
        <header className="glass" style={{ 
            padding: '1.5rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <Link href="/" style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    CineGlass Theatre
                </Link>
            </nav>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Link href="/" style={{ 
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s'
                }}>
                    Movies
                </Link>
                <Link href="/about" style={{ 
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s'
                }}>
                    About
                </Link>
            </div>
        </header>
    );
}
