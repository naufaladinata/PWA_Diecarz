import { LayoutGrid, Heart, PlusCircle, User, Info } from 'lucide-react';

const TABS = [
  { id: 'catalog', label: 'Katalog', Icon: LayoutGrid },
  { id: 'favorites', label: 'Favorit', Icon: Heart },
  { id: 'create', label: 'Tambah', Icon: PlusCircle },
  { id: 'profile', label: 'Profil', Icon: User },
  { id: 'about', label: 'Tentang', Icon: Info },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${active === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
          aria-label={label}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
