import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useHashScroll from '../hooks/useHashScroll';

export default function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useHashScroll();

  // যেসব page-এ Hero image navbar-এর নিচ থেকে শুরু হবে না
  const noPaddingPages = [
    "/districts/",
    "/explore/",
    "/blog/",
  ];

  const removePadding = noPaddingPages.some(path =>
    location.pathname.startsWith(path)
  );

  // PlaceDetails ও DistrictDetails পেজে আলাদা navbar লাগবে না — breadcrumb
  // + back-link দিয়েই navigation হবে, তাই এখানে top navbar hide রাখা হচ্ছে।
  const noNavbarPages = ["/districts/", "/explore/"];
  const hideNavbar = noNavbarPages.some(path => location.pathname.startsWith(path));

  return (
    <>
      {!hideNavbar && <Navbar isHome={isHome} />}

      <main className={`flex-grow ${removePadding || isHome ? "" : "pt-24"}`}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}