"use client";

import { useState } from "react";
import { AuthAPI } from "../../lib/authApi";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await AuthAPI.login({ email, password });
      // Store the token in localStorage
      localStorage.setItem("authToken", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      
      // Redirect to home page
      router.push("/");
    } catch (err: any) {
      console.error('Login error:', err);
      setMessage(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 400, margin: "40px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h1>
      <a href="/forgot-password" style={{ textAlign: 'right', color: '#0070f3' }}>Forgot password?</a>
      <input 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <button 
        onClick={handleLogin} 
        disabled={isLoading}
        style={{ 
          padding: "10px", 
          borderRadius: "4px", 
          border: "none", 
          backgroundColor: "#0070f3",
          color: "white",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
      {message && (
        <p style={{ 
          color: message.includes("Invalid") ? "#e00" : "#0070f3",
          textAlign: "center",
          margin: "10px 0"
        }}>
          {message}
        </p>
      )}
    </div>
  );
}