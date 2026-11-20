import { Heart } from 'lucide-react';
import { useIsFavorited, useToggleFavorite } from '../../hooks/useFavorites';

export default function FavoriteButton({ diecast, className = '' }) {
  const on = useIsFavorited(diecast.id);
  const { toggle, loading } = useToggleFavorite();
  return (
    <button
      className={`fav-btn ${on ? 'on' : ''} ${className}`}
      disabled={loading}
      aria-pressed={on}
      aria-label={on ? `Hapus ${diecast.name} dari favorit` : `Tambah ${diecast.name} ke favorit`}
      onClick={(e) => { e.stopPropagation(); toggle(diecast); }}
    >
      <Heart size={18} fill={on ? 'currentColor' : 'none'} aria-hidden="true" />
    </button>
  );
}
