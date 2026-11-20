import { useEffect, useState } from 'react';
import { Search, WifiOff } from 'lucide-react';
import { useDiecasts } from '../hooks/useDiecasts';
import DiecastCard from '../components/diecast/DiecastCard';
import AdvancedFilter from '../components/common/AdvancedFilter';
import { BRANDS } from '../utils/helpers';

export default function Catalog({ onOpen, refreshKey }) {
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [adv, setAdv] = useState({ scale: '', rarity: '', sort_by: 'name', order: 'asc' });

  // Debounce pencarian 400 ms
  useEffect(() => { const t = setTimeout(() => setSearch(q), 400); return () => clearTimeout(t); }, [q]);

  const { data, loading, refetch } = useDiecasts({ search, brand, ...adv, limit: 100, _r: refreshKey });
  const items = data?.items || [];

  return (
    <section className="page">
      <div className="searchbox">
        <Search size={18} aria-hidden="true" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, brand, atau seri" aria-label="Cari diecast" />
      </div>
      <div className="pills" role="group" aria-label="Filter brand">
        {['', ...BRANDS].map((b) => (
          <button key={b} className={`pill ${brand === b ? 'on' : ''}`} onClick={() => setBrand(b)}>{b || 'Semua'}</button>
        ))}
      </div>
      <AdvancedFilter value={adv} onChange={setAdv} />
      {data?.fallback && (
        <div className="notice"><WifiOff size={16} aria-hidden="true" /> {data.error?.message} Menampilkan data lokal.
          <button className="link" onClick={refetch}>Coba lagi</button></div>
      )}
      {loading ? <p className="state">Memuat katalog...</p> : (<>
        <p className="muted">{data?.total ?? items.length} koleksi</p>
        {items.length === 0
          ? <p className="state">Tidak ada diecast yang cocok. Ubah kata kunci atau filter, atau tambahkan koleksi baru.</p>
          : <div className="grid">{items.map((it) => <DiecastCard key={it.id} item={it} onOpen={onOpen} />)}</div>}
      </>)}
    </section>
  );
}
