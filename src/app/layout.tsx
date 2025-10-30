import type { ReactNode } from 'react';
import Header from '../components/Header';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <AuthProvider>
            <div className="container" style={{ minHeight: '100vh', paddingTop: '1rem' }}>
                <Header />
                <div className="fade-in">{children}</div>
            </div>
            <ToastContainer position="top-right" theme="dark" autoClose={3000} />
        </AuthProvider>
        </body>
        </html>
    );
}
