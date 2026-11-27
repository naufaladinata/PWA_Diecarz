import api, { API_PREFIX } from '../config/api';

class ReviewService {
  async list(diecastId) {
    const res = await api.get(`${API_PREFIX}/diecasts/${diecastId}/reviews`);
    return res.data || [];
  }
  // Pengirim ditentukan server dari token login (header Authorization)
  async create(diecastId, { rating, comment }) {
    const res = await api.post(`${API_PREFIX}/diecasts/${diecastId}/reviews`, { rating, comment });
    return res.data;
  }
}
export default new ReviewService();
