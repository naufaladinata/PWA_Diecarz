import api, { API_PREFIX } from '../config/api';

const TOKEN = 'diecarz_token';
const USER = 'diecarz_user';
const emit = () => window.dispatchEvent(new Event('diecarz-auth'));

// Sesi login: token JWT + data user disimpan di localStorage
class AuthService {
  getToken() { return localStorage.getItem(TOKEN); }
  getUser() { try { return JSON.parse(localStorage.getItem(USER)); } catch { return null; } }
  isLoggedIn() { return !!this.getToken() && !!this.getUser(); }

  #save({ user, token }) {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(USER, JSON.stringify(user));
    emit();
    return user;
  }
  async register(username, password) {
    return this.#save((await api.post(`${API_PREFIX}/auth/register`, { username, password })).data);
  }
  async login(username, password) {
    return this.#save((await api.post(`${API_PREFIX}/auth/login`, { username, password })).data);
  }
  logout() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    emit();
  }
}
export default new AuthService();
