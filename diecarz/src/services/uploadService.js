import api, { API_PREFIX } from '../config/api';

class UploadService {
  // Upload multipart/form-data, field "image". Mengembalikan URL gambar
  async upload(file) {
    const fd = new FormData();
    fd.append('image', file);
    const res = await api.post(`${API_PREFIX}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data?.url || res.data?.image_url || res.data;
  }
}
export default new UploadService();
