// Menambah konfigurasi backend ke file frontend yang sudah ada (aman dijalankan berulang)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const log = (m) => console.log(m);
const edit = (file, fn) => {
  if (!existsSync(file)) return log(`! ${file} tidak ditemukan, lewati`);
  const before = readFileSync(file, 'utf8');
  const after = fn(before);
  if (after === before) return log(`- ${file}: sudah sesuai / tidak ada yang diubah`);
  writeFileSync(file, after);
  log(`+ ${file}: diperbarui`);
};

// 1) package.json: dependensi + script
edit('package.json', (t) => {
  const p = JSON.parse(t);
  p.dependencies = { ...p.dependencies, dotenv: '^16.4.7', express: '^4.21.2', multer: '^1.4.5-lts.1', pg: '^8.13.1' };
  p.scripts = { ...p.scripts, 'dev:api': 'node server/dev.js', 'db:setup': 'node scripts/setup-db.js' };
  return JSON.stringify(p, null, 2) + '\n';
});

// 2) vite.config.js: proxy /api saat dev + service worker tidak menangani /api
edit('vite.config.js', (t) => {
  if (!t.includes("proxy: { '/api'")) t = t.replace('export default defineConfig({', "export default defineConfig({\n  server: { proxy: { '/api': 'http://localhost:3000' } },");
  if (!t.includes('navigateFallbackDenylist')) t = t.replace("navigateFallback: '/index.html',", "navigateFallback: '/index.html',\n        navigateFallbackDenylist: [/^\\/api\\//],");
  return t;
});

// 3) Form: batas gambar 5 MB -> 4 MB (batas request Vercel)
edit('src/components/diecast/DiecastForm.jsx', (t) =>
  t.replace('validateImage(file, 5)', 'validateImage(file, 4)').replace('maks. 5 MB', 'maks. 4 MB'));

log('\nSelesai. Langkah berikutnya: npm install, lalu npm run db:setup');
