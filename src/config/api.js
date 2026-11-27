import axios from 'axios';

// Semua URL berasal dari .env (tidak ada hardcode)
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export const API_PREFIX = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Interceptor response: kembalikan body, normalkan error jadi { message, status, code, raw }
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status ?? 0;
    const code = error.code || (status ? `HTTP_${status}` : 'NETWORK_ERROR');
    let message = error.response?.data?.message;
    if (!message) {
      if (code === 'ECONNABORTED') message = 'Server terlalu lama merespons. Coba lagi.';
      else if (!error.response) message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      else if (status === 404) message = 'Data tidak ditemukan.';
      else if (status >= 500) message = 'Terjadi kesalahan pada server. Coba beberapa saat lagi.';
      else message = 'Permintaan gagal diproses.';
    }
    return Promise.reject({ message, status, code, raw: error });
  }
);

export default api;
