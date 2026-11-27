import { useAsync } from './useAsync';
import diecastService from '../services/diecastService';
import localData from '../data/diecasts';
import { filterLocal } from '../utils/helpers';

// Daftar diecast; bila API gagal otomatis memakai data lokal (fallback = true)
export function useDiecasts(params) {
  return useAsync(async () => {
    try {
      const r = await diecastService.list(params);
      return { items: r.items, total: r.total, fallback: false, error: null };
    } catch (error) {
      const items = filterLocal(localData, params);
      return { items, total: items.length, fallback: true, error };
    }
  }, [JSON.stringify(params)]);
}

export function useDiecastById(id) {
  return useAsync(async () => {
    const local = localData.find((d) => d.id === id);
    return local || diecastService.getById(id);
  }, [id]);
}
