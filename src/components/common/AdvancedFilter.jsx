import { SlidersHorizontal } from 'lucide-react';
import { SCALES, RARITIES } from '../../utils/helpers';

// Filter skala, rarity, dan urutan
export default function AdvancedFilter({ value, onChange }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  return (
    <details className="filter">
      <summary><SlidersHorizontal size={16} aria-hidden="true" /> Filter lanjutan</summary>
      <div className="filter-grid">
        <label>Skala
          <select value={value.scale} onChange={set('scale')}>
            <option value="">Semua</option>
            {SCALES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>Rarity
          <select value={value.rarity} onChange={set('rarity')}>
            <option value="">Semua</option>
            {RARITIES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>Urutkan
          <select value={value.sort_by} onChange={set('sort_by')}>
            <option value="name">Nama</option>
            <option value="price">Harga</option>
            <option value="release_year">Tahun</option>
          </select>
        </label>
        <label>Arah
          <select value={value.order} onChange={set('order')}>
            <option value="asc">Naik (A-Z / termurah)</option>
            <option value="desc">Turun (Z-A / termahal)</option>
          </select>
        </label>
      </div>
    </details>
  );
}
