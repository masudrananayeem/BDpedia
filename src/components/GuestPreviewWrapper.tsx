import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Feature #3: a visitor who hasn't logged in still gets to see a good chunk
// of every section (so it's inviting / builds curiosity), but past a certain
// height the content fades out under a blurred overlay with a "Show more"
// button that sends them to /login. Logged-in users (and while auth is still
// being checked) see the page completely normally -- nothing about the
// underlying page itself is changed, this only wraps it.
export default function GuestPreviewWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading || isAuthenticated) return <>{children}</>;

  return (
    <div className="relative overflow-hidden" style={{ maxHeight: '155vh' }}>
      {children}
      <div className="absolute inset-x-0 bottom-0 h-72 md:h-80 bg-gradient-to-t from-base via-base/95 to-transparent backdrop-blur-[2px] flex items-end justify-center pb-10 z-10">
        <button
          onClick={() => navigate('/login', { state: { from: location } })}
          className="flex items-center gap-2 bg-brand-green text-black font-semibold px-6 py-3 rounded-full shadow-xl hover:brightness-110 transition-all"
        >
          <LogIn size={18} /> Show More &mdash; Login
        </button>
      </div>
    </div>
  );
}
