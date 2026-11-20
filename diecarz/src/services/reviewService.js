import api, { API_PREFIX } from '../config/api';
import userService from './userService';

class ReviewService {
  async list(diecastId) {
    const res = await api.get(`${API_PREFIX}/diecasts/${diecastId}/reviews`);
    return res.data || [];
  }
  async create(diecastId, { rating, comment }) {
    const res = await api.post(`${API_PREFIX}/diecasts/${diecastId}/reviews`, {
      user_identifier: userService.getUserId(), rating, comment,
    });
    return res.data;
  }
}
export default new ReviewService();
