import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiUrl } from '@/lib/api';

interface AdminInfo {
  firstName: string;
  lastName: string;
  role: string;
}

interface AdminContextType {
  token: string | null;
  adminInfo: AdminInfo | null;
  isAuthenticated: boolean;
  login: (token: string, adminInfo: AdminInfo) => void;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(() => {
    const stored = localStorage.getItem('admin_info');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (newToken: string, info: AdminInfo) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_info', JSON.stringify(info));
    setToken(newToken);
    setAdminInfo(info);
  };

  const logout = async () => {
    try {
      const stored = localStorage.getItem('admin_token');
      if (stored) {
        await fetch(apiUrl('/api/auth/admin/logout'), {
          method: 'POST',
          headers: { Authorization: `Bearer ${stored}` },
        });
      }
    } catch { /* always clear local state regardless */ }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    sessionStorage.removeItem('dismissedVendorIds');
    sessionStorage.removeItem('dismissedStoreIds');
    setToken(null);
    setAdminInfo(null);
  };

  return (
    <AdminContext.Provider value={{ token, adminInfo, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
