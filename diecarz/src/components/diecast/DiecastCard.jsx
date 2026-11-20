import { formatRupiah } from '../../utils/helpers';
import FavoriteButton from '../common/FavoriteButton';

export default function DiecastCard({ item, onOpen }) {
  return (
    <article className="card">
      <button className="card-main" onClick={() => onOpen(item.id)} aria-label={`Buka detail ${item.name}`}>
        <img src={item.image_url} alt={item.name} loading="lazy" onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
        <div className="card-body">
          <span className="chip">{item.brand} · {item.scale}</span>
          <h3>{item.name}</h3>
          <p className="muted">{item.series} {item.release_year && `• ${item.release_year}`}</p>
          <p className="price">{formatRupiah(item.price)}</p>
        </div>
      </button>
      <FavoriteButton diecast={item} className="card-fav" />
    </article>
  );
}
