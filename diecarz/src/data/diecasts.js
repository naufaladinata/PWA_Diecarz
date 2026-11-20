// Data lokal fallback offline (12 item)
const d = (id, brand, scale, series, release_year, color, rarity, price, name, description, specs) => ({
  id: `local-${id}`, name, brand, scale, series, release_year, color, rarity, price, description,
  specs, image_url: '/placeholder.svg', is_featured: id <= 3, created_at: '2024-01-01T00:00:00Z',
});

const diecasts = [
  d(1, "Hot Wheels", "1:64", "Hot Wheels Mainline", 2023, "Merah", "Umum", 25000, "Nissan Skyline GT-R (BNR34)", "Mobil ikonik JDM versi mainline.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(2, "Hot Wheels", "1:64", "Treasure Hunt", 2022, "Biru", "Langka", 85000, "Toyota Supra A80", "Seri Treasure Hunt dengan detail ekstra.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(3, "Hot Wheels", "1:64", "Car Culture", 2023, "Hitam", "Langka", 120000, "Mazda RX-7 FD3S", "Seri Car Culture dengan body metal dan ban karet.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(4, "MINI GT", "1:64", "MINI GT Reguler", 2023, "Putih", "Langka", 135000, "Porsche 911 GT3 RS", "Detail tinggi dengan lisensi resmi Porsche.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(5, "MINI GT", "1:64", "MINI GT Reguler", 2022, "Kuning", "Langka", 140000, "Lamborghini Huracan EVO", "Cat berkilau dan velg detail.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(6, "Tomica", "1:64", "Tomica Premium", 2021, "Silver", "Umum", 95000, "Honda Civic Type R", "Tomica Premium dengan kemasan kotak hitam.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(7, "Tomica", "1:64", "Tomica Reguler", 2020, "Putih", "Umum", 45000, "Toyota Alphard", "Mobil keluarga favorit di Indonesia.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(8, "Majorette", "1:64", "Street Cars", 2019, "Oranye", "Umum", 40000, "Mini Cooper S", "Majorette dengan pintu yang bisa dibuka.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(9, "Matchbox", "1:64", "Moving Parts", 2021, "Hijau", "Umum", 35000, "Jeep Wrangler", "Kap mesin bisa dibuka.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(10, "Inno64", "1:64", "Inno64 Reguler", 2023, "Merah", "Super Langka", 250000, "Honda NSX Type R NA2", "Edisi terbatas dengan cat premium.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(11, "Hot Wheels", "1:64", "Super Treasure Hunt", 2024, "Spectraflame Biru", "Chase", 450000, "Datsun 510 Wagon", "Super Treasure Hunt bercat Spectraflame.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
  d(12, "MINI GT", "1:64", "MINI GT Edisi Terbatas", 2024, "Abu-abu", "Super Langka", 300000, "Nissan GT-R Nismo", "Edisi terbatas dengan kemasan khusus.", [{"name": "Material", "value": "Die-cast metal"}, {"name": "Panjang", "value": "±7 cm"}]),
];

export default diecasts;
