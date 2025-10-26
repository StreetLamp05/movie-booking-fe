"use client";

import { useState } from "react";
import { AuthAPI } from "@/lib/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await AuthAPI.login({ email, password });
      setMessage(`Logged in! Token: ${res.token}`);
      // You can store JWT in localStorage or context for API auth
    } catch (err: any) {
      setMessage(err.message || "Login failed");
    }
  };

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 400 }}>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {message && <p>{message}</p>}
    </div>
  );
}
