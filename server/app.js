import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './db.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

// Upload gambar disimpan di database (disk Vercel tidak permanen). Batas 4 MB (limit body Vercel ±4,5 MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    cb(['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype) ? null : new Error('Format gambar harus JPG, PNG, atau WebP'), true),
});

const ok = (res, data, extra = {}) => res.json({ success: true, data, message: 'OK', ...extra });
const fail = (res, status, message) => res.status(status).json({ success: false, message });
const wrap = (fn) => (req, res) => fn(req, res).catch((e) => { console.error(e); fail(res, 500, 'Terjadi kesalahan pada server'); });

const SORT = ['name', 'price', 'release_year', 'created_at'];
const COLS = ['name', 'brand', 'scale', 'series', 'release_year', 'color', 'rarity', 'price', 'description', 'specs', 'image_url', 'is_featured'];
const values = (b) => COLS.map((c) => (c === 'specs' ? JSON.stringify(b.specs || []) : b[c] ?? null));
const valid = (b) => b.name && b.name.trim().length >= 3;

// ---------- Autentikasi (JWT) ----------
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const signToken = (u) => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET belum diatur di environment');
  return jwt.sign({ sub: u.id, username: u.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
// Middleware: wajib login. Mengisi req.user = { id, username }
const auth = (req, res, next) => {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return fail(res, 401, 'Silakan login terlebih dahulu');
  try {
    const p = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: p.sub, username: p.username };
    next();
  } catch {
    fail(res, 401, 'Sesi berakhir, silakan login kembali');
  }
};

app.get('/api/v1/health', (_req, res) => ok(res, { name: 'DieCarz API', version: '1.0.0' }));

app.post('/api/v1/auth/register', wrap(async (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  if (!USERNAME_RE.test(username)) return fail(res, 400, 'Username 3-20 karakter: huruf, angka, atau underscore');
  if (password.length < 6 || password.length > 72) return fail(res, 400, 'Password 6-72 karakter');
  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await db.query('INSERT INTO users (username, password_hash) VALUES ($1,$2) RETURNING id, username', [username, hash]);
    res.status(201).json({ success: true, data: { user: r.rows[0], token: signToken(r.rows[0]) }, message: 'Akun dibuat' });
  } catch (e) {
    if (e.code === '23505') return fail(res, 409, 'Username sudah dipakai');
    throw e;
  }
}));

app.post('/api/v1/auth/login', wrap(async (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');
  const r = await db.query('SELECT id, username, password_hash FROM users WHERE lower(username) = lower($1)', [username]);
  const u = r.rows[0];
  // Pesan sengaja sama untuk username/password salah agar akun tidak bisa ditebak
  if (!u || !(await bcrypt.compare(password, u.password_hash))) return fail(res, 401, 'Username atau password salah');
  ok(res, { user: { id: u.id, username: u.username }, token: signToken(u) });
}));

app.get('/api/v1/auth/me', auth, wrap(async (req, res) => {
  const r = await db.query('SELECT id, username FROM users WHERE id = $1', [req.user.id]);
  r.rows[0] ? ok(res, r.rows[0]) : fail(res, 401, 'Akun tidak ditemukan');
}));

app.get('/api/v1/diecasts', wrap(async (req, res) => {
  const { search = '', brand, scale, rarity, sort_by = 'name', order = 'asc' } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const where = ['(name ILIKE $1 OR series ILIKE $1 OR brand ILIKE $1)'];
  const v = [`%${search}%`];
  for (const [k, val] of Object.entries({ brand, scale, rarity })) {
    if (val) { v.push(val); where.push(`${k} = $${v.length}`); }
  }
  const col = SORT.includes(sort_by) ? sort_by : 'name';
  const dir = order === 'desc' ? 'DESC' : 'ASC';
  const w = where.join(' AND ');
  const total = (await db.query(`SELECT COUNT(*)::int AS n FROM diecasts WHERE ${w}`, v)).rows[0].n;
  const rows = (await db.query(
    `SELECT * FROM diecasts WHERE ${w} ORDER BY ${col} ${dir} LIMIT ${limit} OFFSET ${(page - 1) * limit}`, v)).rows;
  ok(res, rows, { pagination: { page, limit, total, total_pages: Math.ceil(total / limit) } });
}));

app.get('/api/v1/diecasts/:id', wrap(async (req, res) => {
  const r = await db.query('SELECT * FROM diecasts WHERE id = $1', [req.params.id]);
  r.rows[0] ? ok(res, r.rows[0]) : fail(res, 404, 'Data tidak ditemukan');
}));

app.post('/api/v1/diecasts', wrap(async (req, res) => {
  if (!valid(req.body)) return fail(res, 400, 'Nama minimal 3 karakter');
  const r = await db.query(
    `INSERT INTO diecasts (${COLS.join(',')}) VALUES (${COLS.map((_, i) => '$' + (i + 1)).join(',')}) RETURNING *`, values(req.body));
  res.status(201).json({ success: true, data: r.rows[0], message: 'Diecast dibuat' });
}));

app.put('/api/v1/diecasts/:id', wrap(async (req, res) => {
  if (!valid(req.body)) return fail(res, 400, 'Nama minimal 3 karakter');
  const r = await db.query(
    `UPDATE diecasts SET ${COLS.map((c, i) => `${c} = $${i + 1}`).join(',')} WHERE id = $${COLS.length + 1} RETURNING *`,
    [...values(req.body), req.params.id]);
  r.rows[0] ? ok(res, r.rows[0]) : fail(res, 404, 'Data tidak ditemukan');
}));

app.delete('/api/v1/diecasts/:id', wrap(async (req, res) => {
  const r = await db.query('DELETE FROM diecasts WHERE id = $1', [req.params.id]);
  r.rowCount ? ok(res, null) : fail(res, 404, 'Data tidak ditemukan');
}));

app.get('/api/v1/diecasts/:id/reviews', wrap(async (req, res) => {
  ok(res, (await db.query(
    `SELECT r.id, r.diecast_id, r.rating, r.comment, r.created_at, r.user_id, u.username
       FROM reviews r LEFT JOIN users u ON u.id = r.user_id
      WHERE r.diecast_id = $1 ORDER BY r.created_at DESC`, [req.params.id])).rows);
}));

app.post('/api/v1/diecasts/:id/reviews', auth, wrap(async (req, res) => {
  const { rating, comment = '' } = req.body;
  if (!(Number(rating) >= 1 && Number(rating) <= 5)) return fail(res, 400, 'Rating harus 1-5');
  try {
    const r = await db.query(
      'INSERT INTO reviews (diecast_id, user_id, user_identifier, rating, comment) VALUES ($1,$2,$3,$4,$5) RETURNING id, diecast_id, rating, comment, created_at, user_id',
      [req.params.id, req.user.id, String(req.user.id), Number(rating), String(comment).slice(0, 500)]);
    res.status(201).json({ success: true, data: { ...r.rows[0], username: req.user.username }, message: 'Ulasan dikirim' });
  } catch (e) {
    if (e.code === '23503') return fail(res, 404, 'Data tidak ditemukan');
    throw e;
  }
}));

app.get('/api/v1/favorites', wrap(async (req, res) => {
  const r = await db.query(
    'SELECT d.* FROM favorites f JOIN diecasts d ON d.id = f.diecast_id WHERE f.user_identifier = $1 ORDER BY f.id DESC',
    [req.query.user_identifier || '']);
  ok(res, r.rows);
}));

app.post('/api/v1/favorites/toggle', wrap(async (req, res) => {
  const { diecast_id, user_identifier } = req.body;
  if (!diecast_id || !user_identifier) return fail(res, 400, 'diecast_id dan user_identifier wajib diisi');
  const del = await db.query('DELETE FROM favorites WHERE diecast_id = $1 AND user_identifier = $2', [diecast_id, user_identifier]);
  if (!del.rowCount) await db.query('INSERT INTO favorites (diecast_id, user_identifier) VALUES ($1,$2)', [diecast_id, user_identifier]);
  ok(res, { favorited: !del.rowCount });
}));

// Upload gambar -> disimpan di tabel images, URL: /api/v1/images/:id
app.post('/api/v1/upload', upload.single('image'), wrap(async (req, res) => {
  if (!req.file) return fail(res, 400, 'File gambar tidak ditemukan');
  const r = await db.query('INSERT INTO images (mime, data) VALUES ($1,$2) RETURNING id', [req.file.mimetype, req.file.buffer]);
  ok(res, { url: `/api/v1/images/${r.rows[0].id}` });
}));

app.get('/api/v1/images/:id', wrap(async (req, res) => {
  const id = parseInt(req.params.id);
  const r = Number.isInteger(id) ? await db.query('SELECT mime, data FROM images WHERE id = $1', [id]) : { rows: [] };
  if (!r.rows[0]) return fail(res, 404, 'Gambar tidak ditemukan');
  res.set('Content-Type', r.rows[0].mime).set('Cache-Control', 'public, max-age=31536000, immutable').send(r.rows[0].data);
}));

app.use((err, _req, res, _next) => fail(res, 400, err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran gambar maksimal 4 MB' : err.message));

export default app;
