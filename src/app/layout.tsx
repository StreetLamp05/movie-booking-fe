import type { ReactNode } from 'react';
import Header from '../components/Header';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import { cookies } from 'next/headers';
import { ToastContainer } from "react-toastify";
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const token = cookies().get('authToken')?.value;
    return (
        <html lang="en">
        <body className="min-h-screen bg-slate-900">
          <div className="min-h-screen flex flex-col">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
              <Header />
              {token && <EmailVerificationBanner userToken={token} />}
            </div>
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <footer className="border-t border-slate-700 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-400 text-sm">
                <p>&copy; {new Date().getFullYear()} Team 5's Theatre. All rights reserved.</p>
              </div>
            </footer>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </body>
        </html>
    );
}