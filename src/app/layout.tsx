import type { ReactNode } from 'react';
import Header from '../components/Header';


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
            <Header />
            {children}
        </div>
        </body>
        </html>
    );
}