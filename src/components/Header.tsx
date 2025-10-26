import Link from 'next/link';
import SearchBar from './SearchBar';


export default function Header() {
    return (
        <header style={{
            background: 'linear-gradient(135deg, #0f1829 0%, #1a1f3a 100%)',
            padding: '1.5rem 0',
            marginBottom: '1rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
            <nav style={{
                maxWidth: 1100,
                margin: '0 auto',
                padding: '0 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <Link href="/" style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    color: 'white',
                    textDecoration: 'none',
                    letterSpacing: '0.5px'
                }}>
                    Movie Website
                </Link>
                <div style={{ flex: '0 1 400px' }}>
                    <SearchBar />
                </div>
            </nav>
        </header>
    );
}