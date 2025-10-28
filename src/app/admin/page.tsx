"use client";

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) { setIsAdmin(false); return; }
      const user = JSON.parse(raw);
      setIsAdmin(!!user?.is_admin);
    } catch {
      setIsAdmin(false);
    }
  }, []);

  if (isAdmin === null) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!isAdmin) return <div style={{ padding: 24 }}>403 | Not authorized</div>;

  return (
    <main style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h1>Admin</h1>
      <p>placeholder for future implementations.</p>
    </main>
  );
}
