import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { BRANDS, SCALES, RARITIES, validateImage, fileToDataURL } from '../../utils/helpers';
import { draftStorage } from '../../utils/draftStorage';

const EMPTY = { name: '', brand: 'Hot Wheels', scale: '1:64', series: '', release_year: '', color: '', rarity: 'Umum', price: '', description: '', is_featured: false, specs: [] };

// Form bersama untuk Tambah & Edit. useDraft=true -> simpan draft otomatis tiap 30 detik
export default function DiecastForm({ title, initial, useDraft, onSubmit, onCancel }) {
  const [f, setF] = useState(() => initial || (useDraft && draftStorage.load()) || EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image_url || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverErr, setServerErr] = useState('');
  const ref = useRef(f);
  ref.current = f;

  useEffect(() => {
    if (!useDraft) return;
    const t = setInterval(() => draftStorage.save(ref.current), 30000);
    return () => clearInterval(t);
  }, [useDraft]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const setSpec = (i, k, v) => setF({ ...f, specs: f.specs.map((s, j) => (j === i ? { ...s, [k]: v } : s)) });

  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const err = validateImage(file, 4);
    setErrors((x) => ({ ...x, image: err }));
    if (err) return;
    setFile(file);
    setPreview(await fileToDataURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (f.name.trim().length < 3) err.name = 'Nama minimal 3 karakter.';
    if (f.price !== '' && Number(f.price) < 0) err.price = 'Harga tidak boleh negatif.';
    const y = Number(f.release_year);
    if (f.release_year !== '' && (y < 1900 || y > new Date().getFullYear() + 1)) err.release_year = 'Tahun tidak valid.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setSaving(true); setServerErr('');
    try {
      await onSubmit({
        ...f, name: f.name.trim(), price: Number(f.price) || 0,
        release_year: f.release_year === '' ? null : y,
        specs: f.specs.filter((s) => s.name.trim() && s.value.trim()),
      }, file);
      if (useDraft) draftStorage.clear();
    } catch (e2) { setServerErr(e2.message || 'Gagal menyimpan.'); }
    finally { setSaving(false); }
  };

  const field = (label, k, props = {}) => (
    <label>{label}
      <input value={f[k] ?? ''} onChange={set(k)} {...props} />
      {errors[k] && <span className="error">{errors[k]}</span>}
    </label>
  );

  return (
    <form className="page form" onSubmit={submit} noValidate>
      <button type="button" className="back" onClick={onCancel}><ArrowLeft size={18} aria-hidden="true" /> Batal</button>
      <h2>{title}</h2>
      {useDraft && <p className="muted">Draft tersimpan otomatis tiap 30 detik.</p>}
      {field('Nama *', 'name', { placeholder: 'mis. Nissan Skyline GT-R' })}
      <label>Brand
        <select value={f.brand} onChange={set('brand')}>{BRANDS.map((b) => <option key={b}>{b}</option>)}</select>
      </label>
      <div className="two">
        <label>Skala<select value={f.scale} onChange={set('scale')}>{SCALES.map((b) => <option key={b}>{b}</option>)}</select></label>
        <label>Rarity<select value={f.rarity} onChange={set('rarity')}>{RARITIES.map((b) => <option key={b}>{b}</option>)}</select></label>
      </div>
      {field('Seri', 'series')}
      <div className="two">{field('Tahun rilis', 'release_year', { type: 'number', inputMode: 'numeric' })}{field('Warna', 'color')}</div>
      {field('Harga (Rp)', 'price', { type: 'number', inputMode: 'numeric', min: 0 })}
      <label>Deskripsi<textarea rows={3} value={f.description} onChange={set('description')} /></label>
      <label>Gambar (JPG/PNG/WebP, maks. 4 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} />
        {errors.image && <span className="error">{errors.image}</span>}
      </label>
      {preview && <img className="preview" src={preview} alt="Pratinjau gambar" />}
      <fieldset>
        <legend>Spesifikasi</legend>
        {f.specs.map((s, i) => (
          <div className="spec-row" key={i}>
            <input placeholder="Nama" aria-label="Nama spesifikasi" value={s.name} onChange={(e) => setSpec(i, 'name', e.target.value)} />
            <input placeholder="Nilai" aria-label="Nilai spesifikasi" value={s.value} onChange={(e) => setSpec(i, 'value', e.target.value)} />
            <button type="button" className="icon-btn" aria-label="Hapus spesifikasi" onClick={() => setF({ ...f, specs: f.specs.filter((_, j) => j !== i) })}><X size={16} /></button>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setF({ ...f, specs: [...f.specs, { name: '', value: '' }] })}><Plus size={14} aria-hidden="true" /> Tambah spesifikasi</button>
      </fieldset>
      <label className="check"><input type="checkbox" checked={!!f.is_featured} onChange={set('is_featured')} /> Tandai sebagai unggulan</label>
      {serverErr && <p className="error">{serverErr}</p>}
      <button className="btn btn-block" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
    </form>
  );
}
