import type { ReactNode } from 'react';
import Header from '../components/Header';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body style={{
            background: 'linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 50%, #4a1942 100%)',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            margin: 0,
            color: '#ffffff'
        }}>
        <AuthProvider>
            <Header />
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
                {children}
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}