import Link from 'next/link';


export default function Header() {
    return (
        <header style={{ padding: '1rem 0' }}>
            <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                {/*FIXME: change this name lol */}
                <Link href="/">Team 5's Theatre</Link>
            </nav>
        </header>
    );
}