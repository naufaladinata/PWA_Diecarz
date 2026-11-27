import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/common/BottomNav';
import PWABadge from './components/PWABadge';
import Catalog from './pages/Catalog';
import FavoritesPage from './pages/FavoritesPage';
import CreateDiecastPage from './pages/CreateDiecastPage';
import EditDiecastPage from './pages/EditDiecastPage';
import ProfilePage from './pages/ProfilePage';
import About from './pages/About';
import AuthPage from './pages/AuthPage';
import DiecastDetail from './components/diecast/DiecastDetail';

// Navigasi berbasis state: route = { name, id, from }
export default function App() {
  const [route, setRoute] = useState({ name: 'catalog' });
  const [refreshKey, setRefreshKey] = useState(0);
  const go = (name, id, from) => { setRoute({ name, id, from }); window.scrollTo(0, 0); };
  const refreshAndHome = () => { setRefreshKey((k) => k + 1); go('catalog'); };

  const tab = route.name === 'detail' ? route.from || 'catalog' : route.name === 'edit' ? 'catalog' : route.name === 'auth' ? 'profile' : route.name;
  const hideNav = route.name === 'create' || route.name === 'edit';

  return (
    <div className="app">
      <Header />
      <PWABadge />
      <main className={hideNav ? 'main no-nav' : 'main'}>
        {/* Katalog tetap ter-mount agar filter tidak hilang saat kembali dari detail */}
        <div hidden={route.name !== 'catalog'}>
          <Catalog refreshKey={refreshKey} onOpen={(id) => go('detail', id, 'catalog')} />
        </div>
        {route.name === 'favorites' && <FavoritesPage onOpen={(id) => go('detail', id, 'favorites')} />}
        {route.name === 'detail' && (
          <DiecastDetail id={route.id} onLogin={() => go('auth', route.id, route.from || 'catalog')} onBack={() => go(route.from || 'catalog')} onEdit={(id) => go('edit', id)} onDeleted={refreshAndHome} />
        )}
        {route.name === 'create' && <CreateDiecastPage onDone={refreshAndHome} onCancel={() => go('catalog')} />}
        {route.name === 'edit' && <EditDiecastPage id={route.id} onDone={refreshAndHome} onCancel={() => go('detail', route.id, 'catalog')} />}
        {route.name === 'profile' && <ProfilePage onLogin={() => go('auth')} />}
        {route.name === 'auth' && (
          <AuthPage
            onDone={() => (route.id ? go('detail', route.id, route.from) : go('profile'))}
            onCancel={() => (route.id ? go('detail', route.id, route.from) : go('profile'))}
          />
        )}
        {route.name === 'about' && <About />}
      </main>
      {!hideNav && <BottomNav active={tab} onChange={(t) => go(t)} />}
    </div>
  );
}
