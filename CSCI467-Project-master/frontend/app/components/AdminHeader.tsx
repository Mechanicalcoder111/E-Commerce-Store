'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const AdminHeader = () => {
  const { logout } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <nav>
        <Link href="/admin" style={{ margin: '0 1rem' }}>
          Admin Home
        </Link>
        <Link href="/warehouse" style={{ margin: '0 1rem' }}>
          Warehouse Home
        </Link>
        <Link href="/" style={{ margin: '0 1rem' }}>
          Customer Site
        </Link>
      </nav>
      <button onClick={logout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;