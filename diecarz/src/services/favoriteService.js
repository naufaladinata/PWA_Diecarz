import api, { API_PREFIX } from '../config/api';
import userService from './userService';
import { normalizeDiecast } from './diecastService';

const IDS = 'diecarz_fav_ids';     // daftar id favorit
const ITEMS = 'diecarz_fav_items'; // cache objek diecast favorit (untuk offline)
const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
const emit = () => window.dispatchEvent(new Event('diecarz-fav'));

class FavoriteService {
  getIds() { return read(IDS); }
  getCached() { return read(ITEMS); }
  isFavorited(id) { return this.getIds().includes(id); }

  // Server-first; bila gagal pakai cache localStorage
  async list() {
    try {
      const res = await api.get(`${API_PREFIX}/favorites`, { params: { user_identifier: userService.getUserId() } });
      const items = (res.data || []).map((x) => normalizeDiecast(x.diecast || x));
      const local = this.getCached().filter((i) => String(i.id).startsWith('local-'));
      const all = [...items, ...local];
      localStorage.setItem(IDS, JSON.stringify(all.map((i) => i.id)));
      localStorage.setItem(ITEMS, JSON.stringify(all));
      return all;
    } catch {
      return this.getCached();
    }
  }

  // Optimistik: simpan lokal dulu, lalu sinkron ke server (gagal = tetap tersimpan lokal)
  async toggle(diecast) {
    const ids = this.getIds();
    const on = !ids.includes(diecast.id);
    const items = this.getCached().filter((i) => i.id !== diecast.id);
    localStorage.setItem(IDS, JSON.stringify(on ? [...ids, diecast.id] : ids.filter((i) => i !== diecast.id)));
    localStorage.setItem(ITEMS, JSON.stringify(on ? [...items, diecast] : items));
    emit();
    if (!String(diecast.id).startsWith('local-')) {
      try {
        await api.post(`${API_PREFIX}/favorites/toggle`, { diecast_id: diecast.id, user_identifier: userService.getUserId() });
      } catch { /* fallback lokal */ }
    }
    return on;
  }
}
export default new FavoriteService();
