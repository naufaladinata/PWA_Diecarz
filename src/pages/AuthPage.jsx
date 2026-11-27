import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import authService from '../services/authService';

// Halaman masuk / daftar. onDone dipanggil setelah berhasil, onCancel untuk kembali
export default function AuthPage({ onDone, onCancel }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isRegister = mode === 'register';

  const switchMode = (m) => { setMode(m); setError(''); setPassword(''); setConfirm(''); };

  const submit = async (e) => {
    e.preventDefault();
    const name = username.trim();
    if (isRegister) {
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(name)) return setError('Username 3-20 karakter: huruf, angka, atau underscore.');
      if (password.length < 6) return setError('Password minimal 6 karakter.');
      if (password !== confirm) return setError('Konfirmasi password tidak sama.');
    } else if (!name || !password) {
      return setError('Username dan password wajib diisi.');
    }
    setLoading(true); setError('');
    try {
      await (isRegister ? authService.register(name, password) : authService.login(name, password));
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <button className="back" onClick={onCancel}>← Kembali</button>
      <h2>{isRegister ? 'Buat akun' : 'Masuk'}</h2>
      <p className="muted">{isRegister ? 'Daftar agar ulasanmu tampil dengan username.' : 'Masuk untuk memberi rating dan ulasan.'}</p>

      <div className="pills" role="tablist" aria-label="Mode">
        <button role="tab" aria-selected={!isRegister} className={`pill ${!isRegister ? 'on' : ''}`} onClick={() => switchMode('login')}>Masuk</button>
        <button role="tab" aria-selected={isRegister} className={`pill ${isRegister ? 'on' : ''}`} onClick={() => switchMode('register')}>Daftar</button>
      </div>

      <form onSubmit={submit} className="form" noValidate>
        <label>Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} maxLength={20} autoComplete="username" autoCapitalize="none" />
        </label>
        <label>Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={72} autoComplete={isRegister ? 'new-password' : 'current-password'} />
        </label>
        {isRegister && (
          <label>Ulangi password
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} maxLength={72} autoComplete="new-password" />
          </label>
        )}
        {error && <p role="alert" className="error">{error}</p>}
        <button className="btn btn-block" disabled={loading}>
          {isRegister ? <UserPlus size={16} aria-hidden="true" /> : <LogIn size={16} aria-hidden="true" />}
          {loading ? 'Memproses...' : isRegister ? 'Daftar' : 'Masuk'}
        </button>
      </form>
    </section>
  );
}
