import Link from 'next/link';


export default function Header() {
    return (
        <header style={{ padding: '1rem 0' }}>
            <nav style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Link href="/">Team 5's Theatre</Link>
                </div>
                <div>
                    <Link href="/profile/edit">Edit Profile</Link>
                </div>
            </nav>
        </header>
    );
}