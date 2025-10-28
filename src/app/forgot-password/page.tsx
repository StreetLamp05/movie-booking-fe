"use client";

import { useState } from 'react';
import { AuthAPI } from '@/lib/authApi';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const requestCode = async () => {
    if (!email) return;
    setLoading(true);
    setMessage('');
    try {
      await AuthAPI.requestPasswordReset(email);
      setStep('reset');
      setMessage('We sent a 6-digit code to your email (if it exists).');
    } catch (e: any) {
      setMessage(e.message || 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async () => {
    if (!email || !code || !newPassword) return;
    setLoading(true);
    setMessage('');
    try {
      await AuthAPI.resetPassword({ email, code, new_password: newPassword });
      setStep('done');
      setMessage('Password updated. You can now login.');
    } catch (e: any) {
      setMessage(e.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-center">Forgot Password</h1>
        {step === 'request' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input className="w-full border rounded px-3 py-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <button onClick={requestCode} disabled={loading || !email} className={`w-full py-2 text-white rounded ${loading||!email?'bg-blue-400':'bg-blue-600 hover:bg-blue-700'}`}>{loading?'Sending...':'Send Code'}</button>
            {message && <p className="text-sm text-gray-600 text-center">{message}</p>}
          </div>
        )}
        {step === 'reset' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Enter the 6-digit code we sent to {email} and your new password.</p>
            <div>
              <label className="block text-sm mb-1">Code</label>
              <input className="w-full border rounded px-3 py-2 tracking-widest" maxLength={6} value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input className="w-full border rounded px-3 py-2" type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
            </div>
            <button onClick={submitReset} disabled={loading || code.length!==6 || !newPassword} className={`w-full py-2 text-white rounded ${loading||code.length!==6||!newPassword?'bg-blue-400':'bg-blue-600 hover:bg-blue-700'}`}>{loading?'Updating...':'Reset Password'}</button>
            <button onClick={()=>setStep('request')} className="w-full text-sm text-blue-600">← Back</button>
            {message && <p className="text-sm text-gray-600 text-center">{message}</p>}
          </div>
        )}
        {step === 'done' && (
          <div className="text-center space-y-3">
            <div className="text-green-600 font-medium">Password updated successfully.</div>
            <a href="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Login</a>
          </div>
        )}
      </div>
    </div>
  );
}
