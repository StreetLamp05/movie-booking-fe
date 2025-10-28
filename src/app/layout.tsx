import type { ReactNode } from 'react';
import Header from '../components/Header';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import { cookies } from 'next/headers';

export default function RootLayout({ children }: { children: ReactNode }) {
  const token = cookies().get('authToken')?.value;
    return (
        <html lang="en">
        <body className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header />
            {token && <EmailVerificationBanner userToken={token} />}
            <main className="py-6">
              {children}
            </main>
          </div>
        </body>
        </html>
    );
}