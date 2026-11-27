import axios from 'axios';

// Semua URL berasal dari .env (tidak ada hardcode)
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
export const API_PREFIX = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Interceptor request: sisipkan token login bila ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('diecarz_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor response: kembalikan body, normalkan error jadi { message, status, code, raw }
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status ?? 0;
    // Token kedaluwarsa/tidak valid pada endpoint selain login/daftar -> keluarkan sesi
    if (status === 401 && localStorage.getItem('diecarz_token') && !error.config?.url?.includes('/auth/login') && !error.config?.url?.includes('/auth/register')) {
      localStorage.removeItem('diecarz_token');
      localStorage.removeItem('diecarz_user');
      window.dispatchEvent(new Event('diecarz-auth'));
    }
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
