import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the element matching the URL hash whenever the route/hash changes. */
export default function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const attempt = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };
      if (!attempt()) {
        const timer = setTimeout(attempt, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);
}
