CREATE TABLE IF NOT EXISTS diecasts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT, scale TEXT, series TEXT,
  release_year INT, color TEXT, rarity TEXT,
  price INT DEFAULT 0,
  description TEXT,
  specs JSONB DEFAULT '[]',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  diecast_id INT REFERENCES diecasts(id) ON DELETE CASCADE,
  user_identifier TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  diecast_id INT REFERENCES diecasts(id) ON DELETE CASCADE,
  user_identifier TEXT,
  UNIQUE (diecast_id, user_identifier)
);
-- Baru: penyimpanan gambar upload
CREATE TABLE IF NOT EXISTS images (
  id SERIAL PRIMARY KEY,
  mime TEXT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
