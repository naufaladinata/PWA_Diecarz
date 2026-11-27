// Membuat tabel + mengisi 12 data contoh (hanya jika tabel diecasts masih kosong)
import { readFileSync } from 'node:fs';
import { db } from '../server/db.js';

const R = [
  ['Nissan Skyline GT-R (BNR34)', 'Hot Wheels', 'Hot Wheels Mainline', 2023, 'Merah', 'Umum', 25000, 'Mobil ikonik JDM versi mainline.'],
  ['Toyota Supra A80', 'Hot Wheels', 'Treasure Hunt', 2022, 'Biru', 'Langka', 85000, 'Seri Treasure Hunt dengan detail ekstra.'],
  ['Mazda RX-7 FD3S', 'Hot Wheels', 'Car Culture', 2023, 'Hitam', 'Langka', 120000, 'Seri Car Culture dengan body metal dan ban karet.'],
  ['Porsche 911 GT3 RS', 'MINI GT', 'MINI GT Reguler', 2023, 'Putih', 'Langka', 135000, 'Detail tinggi dengan lisensi resmi Porsche.'],
  ['Lamborghini Huracan EVO', 'MINI GT', 'MINI GT Reguler', 2022, 'Kuning', 'Langka', 140000, 'Cat berkilau dan velg detail.'],
  ['Honda Civic Type R', 'Tomica', 'Tomica Premium', 2021, 'Silver', 'Umum', 95000, 'Tomica Premium dengan kemasan kotak hitam.'],
  ['Toyota Alphard', 'Tomica', 'Tomica Reguler', 2020, 'Putih', 'Umum', 45000, 'Mobil keluarga favorit di Indonesia.'],
  ['Mini Cooper S', 'Majorette', 'Street Cars', 2019, 'Oranye', 'Umum', 40000, 'Majorette dengan pintu yang bisa dibuka.'],
  ['Jeep Wrangler', 'Matchbox', 'Moving Parts', 2021, 'Hijau', 'Umum', 35000, 'Kap mesin bisa dibuka.'],
  ['Honda NSX Type R NA2', 'Inno64', 'Inno64 Reguler', 2023, 'Merah', 'Super Langka', 250000, 'Edisi terbatas dengan cat premium.'],
  ['Datsun 510 Wagon', 'Hot Wheels', 'Super Treasure Hunt', 2024, 'Spectraflame Biru', 'Chase', 450000, 'Super Treasure Hunt bercat Spectraflame.'],
  ['Nissan GT-R Nismo', 'MINI GT', 'MINI GT Edisi Terbatas', 2024, 'Abu-abu', 'Super Langka', 300000, 'Edisi terbatas dengan kemasan khusus.'],
];
const SPECS = JSON.stringify([{ name: 'Material', value: 'Die-cast metal' }, { name: 'Panjang', value: '±7 cm' }]);

try {
  await db.query(readFileSync(new URL('../db/schema.sql', import.meta.url), 'utf8'));
  const { rows } = await db.query('SELECT COUNT(*)::int AS n FROM diecasts');
  if (rows[0].n === 0) {
    for (const [name, brand, series, year, color, rarity, price, desc] of R) {
      await db.query(
        `INSERT INTO diecasts (name, brand, scale, series, release_year, color, rarity, price, description, specs, is_featured)
         VALUES ($1,$2,'1:64',$3,$4,$5,$6,$7,$8,$9,$10)`,
        [name, brand, series, year, color, rarity, price, desc, SPECS, rarity !== 'Umum']
      );
    }
    console.log('Tabel dibuat dan 12 data contoh dimasukkan.');
  } else {
    console.log('Tabel sudah berisi data, seed dilewati.');
  }
} catch (e) {
  console.error('Setup gagal:', e.message);
  process.exitCode = 1;
} finally {
  await db.end();
}
