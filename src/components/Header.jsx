import { Car } from 'lucide-react';

// Header hanya berisi logo dan nama aplikasi
export default function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-logo" aria-hidden="true"><Car size={20} /></span>
        <h1>DieCarz</h1>
      </div>
      <div className="checker" aria-hidden="true" />
    </header>
  );
}
