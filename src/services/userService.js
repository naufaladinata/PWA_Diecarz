// Profil kolektor disimpan di localStorage (UUID anonim)
const UID = 'diecarz_uid';
const PROFILE = 'diecarz_profile';

class UserService {
  getUserId() {
    let id = localStorage.getItem(UID);
    if (!id) {
      id = crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            return (c === 'x' ? r : (r & 3) | 8).toString(16);
          });
      localStorage.setItem(UID, id);
    }
    return id;
  }
  getProfile() {
    try {
      return { username: 'Kolektor', bio: '', avatar: '', ...JSON.parse(localStorage.getItem(PROFILE) || '{}') };
    } catch {
      return { username: 'Kolektor', bio: '', avatar: '' };
    }
  }
  saveProfile(p) {
    localStorage.setItem(PROFILE, JSON.stringify(p)); // melempar error bila kuota penuh
    return p;
  }
}
export default new UserService();
