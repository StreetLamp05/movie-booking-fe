"use client";

import Link from "next/link";

export default function LoginSignupButtons() {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <Link href="/signup">
        <button style={{ padding: "8px 16px" }}>Sign Up</button>
      </Link>
      <Link href="/login">
        <button style={{ padding: "8px 16px" }}>Login</button>
      </Link>
    </div>
  );
}
