import { useState } from 'react';
import { Heart, UserRound } from 'lucide-react';
import userService from '../services/userService';
import { useFavorites } from '../hooks/useFavorites';
import { validateImage, fileToDataURL } from '../utils/helpers';

export default function ProfilePage() {
  const [p, setP] = useState(userService.getProfile());
  const [msg, setMsg] = useState('');
  const { data: favs } = useFavorites();

  const avatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const err = validateImage(file, 2);
    if (err) return setMsg(err);
    setP({ ...p, avatar: await fileToDataURL(file) });
    setMsg('');
  };
  const save = (e) => {
    e.preventDefault();
    try { userService.saveProfile({ ...p, username: p.username.trim() || 'Kolektor' }); setMsg('Profil tersimpan.'); }
    catch { setMsg('Gagal menyimpan. Gunakan avatar yang lebih kecil.'); }
  };

  return (
    <section className="page">
      <h2>Profil</h2>
      <form onSubmit={save} className="form">
        <div className="avatar">{p.avatar ? <img src={p.avatar} alt="Avatar" /> : <UserRound size={40} aria-hidden="true" />}</div>
        <label>Foto avatar (maks. 2 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={avatar} /></label>
        <label>Username<input value={p.username} onChange={(e) => setP({ ...p, username: e.target.value })} maxLength={30} /></label>
        <label>Bio<textarea rows={3} maxLength={200} value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} /></label>
        <p className="muted small">ID anonim: {userService.getUserId()}</p>
        {msg && <p role="status" className={msg.startsWith('Profil') ? 'ok' : 'error'}>{msg}</p>}
        <button className="btn btn-block">Simpan profil</button>
      </form>
      <div className="stat"><Heart size={20} aria-hidden="true" /><div><b>{favs.length}</b><span> diecast favorit</span></div></div>
    </section>
  );
}
