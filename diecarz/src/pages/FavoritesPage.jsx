import { useFavorites } from '../hooks/useFavorites';
import DiecastCard from '../components/diecast/DiecastCard';

export default function FavoritesPage({ onOpen }) {
  const { data, loading, refetch } = useFavorites();
  return (
    <section className="page">
      <h2>Favorit</h2>
      {loading && data.length === 0 ? <p className="state">Memuat favorit...</p>
        : data.length === 0 ? <p className="state">Belum ada favorit. Ketuk ikon hati pada kartu di Katalog untuk menyimpannya di sini.</p>
        : (<>
          <p className="muted">{data.length} favorit</p>
          <div className="grid">{data.map((it) => <DiecastCard key={it.id} item={it} onOpen={onOpen} />)}</div>
        </>)}
      <button className="link" onClick={refetch}>Muat ulang dari server</button>
    </section>
  );
}
