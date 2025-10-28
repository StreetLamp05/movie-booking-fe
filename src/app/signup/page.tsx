"use client";

import { useState } from "react";
import { AuthAPI } from "../../lib/authApi";

export default function SignupPage() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", is_email_list: false });
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [verificationCode, setVerificationCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      setStatus('loading');
      console.log('Attempting signup with:', { ...form, password: '***' });
      await AuthAPI.signup(form);
      setStatus('idle');
      setStep('verify');
      setMessage("Please check your email for a 6-digit verification code.");
    } catch (err: any) {
      console.error('Signup error:', err);
      setStatus('error');
      setMessage(err.message || "Signup failed");
    }
  };

  const handleVerify = async () => {
    try {
      setStatus('loading');
      await AuthAPI.verify({ email: form.email, code: verificationCode });
      setStatus('success');
      setMessage("Email verified! You can now log in.");
    } catch (err: any) {
      console.error('Verification error:', err);
      setStatus('error');
      setMessage(err.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {step === 'signup' ? 'Create your account' : 'Verify your email'}
          </h2>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-xl font-semibold">✅ Email verified!</div>
            <p className="text-gray-600">{message}</p>
            <a 
              href="/login"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Login
            </a>
          </div>
        ) : step === 'verify' ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">Enter the 6-digit code sent to {form.email}</p>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 text-center mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                maxLength={6}
                required
                className="block w-full px-3 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
              />
            </div>

            {status === 'error' && (
              <div className="text-red-600 text-sm text-center">{message}</div>
            )}

            <button
              onClick={handleVerify}
              disabled={status === 'loading' || verificationCode.length !== 6}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                status === 'loading' || verificationCode.length !== 6
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {status === 'loading' ? 'Verifying...' : 'Verify Email'}
            </button>

            <button
              onClick={() => setStep('signup')}
              className="w-full text-sm text-blue-600 hover:text-blue-800"
            >
              ← Back to signup
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="first_name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="last_name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_email_list"
                type="checkbox"
                className="h-4 w-4"
                checked={form.is_email_list}
                onChange={(e) => setForm({ ...form, is_email_list: e.target.checked })}
              />
              <label htmlFor="is_email_list" className="text-sm text-gray-700">Register for promotional emails</label>
            </div>

            {status === 'error' && (
              <div className="text-red-600 text-sm">{message}</div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                status === 'loading' 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {status === 'loading' ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}