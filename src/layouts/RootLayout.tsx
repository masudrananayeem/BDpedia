import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <Navbar isHome={isHome} />
      <main className={`flex-grow ${!isHome ? 'pt-24' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}