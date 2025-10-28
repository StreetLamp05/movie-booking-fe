'use client';

import { useState } from 'react';
import { AuthAPI } from '@/lib/authApi';

interface EmailVerificationBannerProps {
  userToken: string;
}

export default function EmailVerificationBanner({ userToken }: EmailVerificationBannerProps) {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await AuthAPI.resendVerification(userToken);
      setMessage({
        type: 'success',
        text: 'Verification email sent! Please check your inbox.'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to resend verification email'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Please verify your email address to access all features.
            </p>
          </div>
        </div>
        <div className="pl-4">
          <button
            onClick={handleResendVerification}
            disabled={isResending}
            className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-50 focus:outline-none focus:border-yellow-300 focus:ring focus:ring-yellow-200 active:bg-yellow-200 transition ease-in-out duration-150 ${
              isResending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isResending ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>
      </div>
      {message && (
        <div className={`mt-2 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}