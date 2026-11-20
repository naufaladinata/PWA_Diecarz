export const PLACEHOLDER = '/placeholder.svg';
export const BRANDS = ['Hot Wheels', 'MINI GT', 'Tomica', 'Majorette', 'Matchbox', 'Inno64', 'Lainnya'];
export const SCALES = ['1:64', '1:43', '1:32', '1:24', '1:18'];
export const RARITIES = ['Umum', 'Langka', 'Super Langka', 'Chase'];

export const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n) || 0);

export const avgRating = (reviews = []) =>
  reviews.length ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length : 0;

// Validasi gambar: jpg/png/webp dan batas ukuran (MB). Mengembalikan pesan error atau ''
export function validateImage(file, maxMB) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Format harus JPG, PNG, atau WebP.';
  if (file.size > maxMB * 1024 * 1024) return `Ukuran gambar maksimal ${maxMB} MB.`;
  return '';
}

export const fileToDataURL = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej(new Error('Gagal membaca file.'));
    r.readAsDataURL(file);
  });

// Filter + sort data lokal (dipakai saat API gagal)
export function filterLocal(list, p = {}) {
  const q = (p.search || '').toLowerCase();
  const out = list.filter(
    (d) =>
      (!q || [d.name, d.brand, d.series].some((x) => (x || '').toLowerCase().includes(q))) &&
      (!p.brand || d.brand === p.brand) &&
      (!p.scale || d.scale === p.scale) &&
      (!p.rarity || d.rarity === p.rarity)
  );
  const key = p.sort_by || 'name';
  const dir = p.order === 'desc' ? -1 : 1;
  return [...out].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * dir);
}
