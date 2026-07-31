import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useHashScroll from '../hooks/useHashScroll';

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  useHashScroll();
  return (
    <div className="flex flex-col min-h-screen bg-base">
      <Navbar isHome={isHome} />
      <main className={`flex-grow ${!isHome ? 'pt-24' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}