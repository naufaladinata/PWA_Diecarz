import { useEffect, useState } from 'react';
import { useAsync } from './useAsync';
import favoriteService from '../services/favoriteService';

// Daftar favorit (server-first, fallback localStorage) + sinkron saat toggle
export function useFavorites() {
  const r = useAsync(() => favoriteService.list(), []);
  const [items, setItems] = useState(null);
  useEffect(() => { setItems(r.data); }, [r.data]);
  useEffect(() => {
    const on = () => setItems(favoriteService.getCached());
    window.addEventListener('diecarz-fav', on);
    return () => window.removeEventListener('diecarz-fav', on);
  }, []);
  return { data: items || [], loading: r.loading, error: r.error, refetch: r.refetch };
}

export function useIsFavorited(id) {
  const [on, setOn] = useState(() => favoriteService.isFavorited(id));
  useEffect(() => {
    const sync = () => setOn(favoriteService.isFavorited(id));
    sync();
    window.addEventListener('diecarz-fav', sync);
    return () => window.removeEventListener('diecarz-fav', sync);
  }, [id]);
  return on;
}

export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const toggle = async (diecast) => {
    setLoading(true);
    try { return await favoriteService.toggle(diecast); } finally { setLoading(false); }
  };
  return { toggle, loading };
}
