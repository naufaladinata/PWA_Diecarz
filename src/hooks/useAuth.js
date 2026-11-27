import { useEffect, useState } from 'react';
import authService from '../services/authService';

// Mengembalikan user yang sedang login (null bila belum) dan ikut berubah saat login/logout
export function useAuth() {
  const [user, setUser] = useState(() => authService.getUser());
  useEffect(() => {
    const sync = () => setUser(authService.getUser());
    window.addEventListener('diecarz-auth', sync);
    return () => window.removeEventListener('diecarz-auth', sync);
  }, []);
  return { user, isLoggedIn: !!user && !!authService.getToken() };
}
