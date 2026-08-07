import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, User as UserIcon, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthNavItem({ linkColor }: { linkColor: string }) {
  const { user, isAuthenticated, isAdmin, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Click-to-open dropdown (instead of hover) so it doesn't accidentally
  // close while moving the mouse from the avatar down into the menu.
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <Link to="/login" className={`flex items-center gap-1.5 ${linkColor} hover:text-brand-green transition-colors text-sm font-medium`}>
        <LogIn size={18} /> <span className="hidden sm:inline">Login</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button onClick={() => setOpen((v) => !v)} className={`flex items-center gap-2 ${linkColor} hover:text-brand-green transition-colors`}>
        <img
          src={user?.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'U')}`}
          alt={user?.name}
          className="w-8 h-8 rounded-full object-cover border border-brand-green/40"
        />
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 pt-2 w-48 z-50">
          <div className="bg-surface border border-line/10 rounded-lg shadow-xl overflow-hidden">
            <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-body hover:bg-line/5 hover:text-brand-green">
              <UserIcon size={14} /> Profile
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm text-body hover:bg-line/5 hover:text-brand-green">
                <ShieldCheck size={14} /> Admin Panel
              </Link>
            )}
            <button
              onClick={() => { setOpen(false); logout(); navigate('/'); }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-line/5"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
