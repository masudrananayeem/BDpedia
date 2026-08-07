import { NavLink, Outlet, Link } from 'react-router-dom';
import { Home, ShieldCheck, ArrowLeft, Mail, Users } from 'lucide-react';
import { sectionConfigs } from './sectionConfigs';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-green/15 text-brand-green' : 'text-body hover:bg-line/5'
    }`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-brand-green" size={26} />
          <div>
            <h1 className="text-2xl font-extrabold text-heading">Admin Panel</h1>
            <p className="text-xs text-muted">Logged in as {user?.name} ({user?.email})</p>
          </div>
        </div>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-brand-green">
          <ArrowLeft size={16} /> Back to site
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible bg-surface border border-line/10 rounded-2xl p-3 h-fit">
          <NavLink to="/admin" end className={navItemClass}>
            <Home size={16} /> Home Page
          </NavLink>
          {sectionConfigs.map((s) => (
            <NavLink key={s.key} to={`/admin/${s.key}`} className={navItemClass}>
              {s.label}
            </NavLink>
          ))}
          <NavLink to="/admin/messages" className={navItemClass}>
            <Mail size={16} /> Messages
          </NavLink>
          <NavLink to="/admin/newsletter" className={navItemClass}>
            <Users size={16} /> Newsletter
          </NavLink>
        </nav>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
