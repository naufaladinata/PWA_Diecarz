// Menjalankan API secara lokal (npm run dev:api) di port 3000
import app from './app.js';
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`DieCarz API lokal berjalan di http://localhost:${port}`));
