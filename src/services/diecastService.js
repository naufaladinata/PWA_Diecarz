import api, { API_BASE_URL, API_PREFIX } from '../config/api';

const P = `${API_PREFIX}/diecasts`;

// Ubah bentuk data dari server agar konsisten di UI
export function normalizeDiecast(d = {}) {
  let specs = d.specs;
  if (typeof specs === 'string') { try { specs = JSON.parse(specs); } catch { specs = []; } }
  let img = d.image_url || '';
  if (img.startsWith('/')) img = API_BASE_URL + img;
  return {
    id: d.id, name: d.name || '', brand: d.brand || 'Lainnya', scale: d.scale || '1:64',
    series: d.series || '', release_year: Number(d.release_year) || '', color: d.color || '',
    rarity: d.rarity || 'Umum', price: Number(d.price) || 0, description: d.description || '',
    specs: Array.isArray(specs) ? specs : [], image_url: img || '/placeholder.svg',
    is_featured: !!d.is_featured, created_at: d.created_at,
  };
}

class DiecastService {
  async list(params = {}) {
    const { _r, ...rest } = params; // _r hanya pemicu refresh
    const clean = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== '' && v != null));
    const res = await api.get(P, { params: clean });
    const items = (res.data || []).map(normalizeDiecast);
    return { items, total: res.pagination?.total ?? items.length };
  }
  async getById(id) { return normalizeDiecast((await api.get(`${P}/${id}`)).data); }
  async create(payload) { return normalizeDiecast((await api.post(P, payload)).data); }
  async update(id, payload) { return normalizeDiecast((await api.put(`${P}/${id}`, payload)).data); }
  async remove(id) { return api.delete(`${P}/${id}`); }
}
export default new DiecastService();
