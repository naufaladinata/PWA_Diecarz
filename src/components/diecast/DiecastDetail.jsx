import { useState } from 'react';
import { ArrowLeft, Pencil, Trash2, Star } from 'lucide-react';
import { useDiecastById } from '../../hooks/useDiecasts';
import { useReviews, useCreateReview } from '../../hooks/useReviews';
import { useAuth } from '../../hooks/useAuth';
import diecastService from '../../services/diecastService';
import FavoriteButton from '../common/FavoriteButton';
import ConfirmModal from '../modals/ConfirmModal';
import { formatRupiah, avgRating } from '../../utils/helpers';

function Stars({ value, onPick }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onPick} onClick={() => onPick?.(n)} aria-label={`${n} bintang`}>
          <Star size={onPick ? 26 : 16} fill={n <= Math.round(value) ? 'currentColor' : 'none'} />
        </button>
      ))}
    </span>
  );
}

export default function DiecastDetail({ id, onBack, onEdit, onDeleted, onLogin }) {
  const { user } = useAuth();
  const { data: d, loading, error, refetch } = useDiecastById(id);
  const reviews = useReviews(id);
  const { submit, loading: sending, error: sendErr } = useCreateReview();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState('');

  if (loading) return <p className="state">Memuat detail...</p>;
  if (error) return (
    <div className="state">
      <p>{error.message}</p>
      <button className="btn" onClick={refetch}>Coba lagi</button>
      <button className="btn btn-ghost" onClick={onBack}>Kembali</button>
    </div>
  );

  const list = reviews.data || [];
  const isLocal = String(id).startsWith('local-');

  const sendReview = async (e) => {
    e.preventDefault();
    if (!rating) return setMsg('Pilih rating bintang 1-5.');
    setMsg('');
    try { await submit(id, { rating, comment: comment.trim() }); setRating(0); setComment(''); reviews.refetch(); } catch { /* ditampilkan via sendErr */ }
  };

  const remove = async () => {
    setDeleting(true);
    try { await diecastService.remove(id); onDeleted(); }
    catch (e) { setMsg(e.message); setConfirm(false); }
    finally { setDeleting(false); }
  };

  return (
    <section className="page">
      <button className="back" onClick={onBack}><ArrowLeft size={18} aria-hidden="true" /> Kembali</button>
      <img className="detail-img" src={d.image_url} alt={d.name} onError={(e) => { e.currentTarget.src = '/placeholder.svg'; }} />
      <div className="row-between">
        <div>
          <span className="chip">{d.brand} · {d.scale}</span>
          <h2>{d.name}</h2>
        </div>
        <FavoriteButton diecast={d} />
      </div>
      <p className="price big">{formatRupiah(d.price)}</p>
      <div className="meta">
        <span>Seri: <b>{d.series || '-'}</b></span>
        <span>Tahun: <b>{d.release_year || '-'}</b></span>
        <span>Warna: <b>{d.color || '-'}</b></span>
        <span>Rarity: <b>{d.rarity}</b></span>
      </div>
      <div className="rating-line"><Stars value={avgRating(list)} /> <span className="muted">{list.length ? `${avgRating(list).toFixed(1)} (${list.length} ulasan)` : 'Belum ada ulasan'}</span></div>
      <h3>Deskripsi</h3>
      <p>{d.description || 'Belum ada deskripsi.'}</p>
      {d.specs.length > 0 && (<>
        <h3>Spesifikasi</h3>
        <dl className="specs">{d.specs.map((s, i) => (<div key={i}><dt>{s.name}</dt><dd>{s.value}</dd></div>))}</dl>
      </>)}

      <h3>Ulasan</h3>
      {isLocal ? <p className="muted">Ulasan tidak tersedia untuk data lokal.</p> : (<>
        {user ? (
          <form onSubmit={sendReview} className="review-form">
            <p className="muted">Mengulas sebagai <b>@{user.username}</b></p>
            <Stars value={rating} onPick={setRating} />
            <textarea maxLength={500} rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Tulis ulasan (maks. 500 karakter)" aria-label="Komentar ulasan" />
            <div className="row-between"><small className="muted">{comment.length}/500</small><button className="btn" disabled={sending}>{sending ? 'Mengirim...' : 'Kirim ulasan'}</button></div>
            {(msg || sendErr) && <p className="error">{msg || sendErr.message}</p>}
          </form>
        ) : (
          <div className="login-prompt">
            <p>Masuk untuk memberi rating dan ulasan.</p>
            <button className="btn btn-sm" onClick={onLogin}>Masuk / Daftar</button>
          </div>
        )}
        {reviews.loading && <p className="muted">Memuat ulasan...</p>}
        {reviews.error && <p className="error">{reviews.error.message} <button className="link" onClick={reviews.refetch}>Coba lagi</button></p>}
        {list.map((r, i) => (
          <div className="review" key={r.id || i}>
            <div className="review-head">
              <b className={r.username ? '' : 'muted'}>{r.username ? `@${r.username}` : 'Anonim'}</b>
              {user && r.username === user.username && <span className="chip">Anda</span>}
              {r.created_at && <span className="muted small">{new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
            </div>
            <Stars value={r.rating} />
            {r.comment && <p>{r.comment}</p>}
          </div>
        ))}
      </>)}

      {!isLocal && (
        <div className="row-end sticky-actions">
          <button className="btn btn-ghost" onClick={() => onEdit(id)}><Pencil size={16} aria-hidden="true" /> Edit</button>
          <button className="btn btn-danger" onClick={() => setConfirm(true)}><Trash2 size={16} aria-hidden="true" /> Hapus</button>
        </div>
      )}
      {confirm && <ConfirmModal title="Hapus diecast?" message={`"${d.name}" akan dihapus permanen.`} loading={deleting} onConfirm={remove} onCancel={() => setConfirm(false)} />}
    </section>
  );
}
