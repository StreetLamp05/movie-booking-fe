"use client";

import { useState } from "react";
import { AuthAPI } from "@/lib/authApi";

export default function SignupPage() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });
  const [step, setStep] = useState(1); // 1=signup, 2=verify
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    try {
      const res = await AuthAPI.signup(form);
      setStep(2);
      setMessage("Check console for verification code (or email in prod)");
    } catch (err: any) {
      setMessage(err.message || "Signup failed");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await AuthAPI.verify({ email: form.email, code });
      setMessage("Email verified! You can now log in.");
    } catch (err: any) {
      setMessage(err.message || "Verification failed");
    }
  };

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 400 }}>
      {step === 1 && (
        <>
          <input placeholder="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button onClick={handleSignup}>Sign Up</button>
        </>
      )}
      {step === 2 && (
        <>
          <input placeholder="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} />
          <button onClick={handleVerify}>Verify</button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
