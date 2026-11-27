// Draft form tambah diecast (opsional)
const KEY = 'diecarz_draft';
export const draftStorage = {
  load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } },
  save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* abaikan */ } },
  clear() { localStorage.removeItem(KEY); },
};
