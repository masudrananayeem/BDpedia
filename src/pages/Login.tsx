import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname?: string } } };
  const redirectTo = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Welcome Back</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-heading">Login to BDpedia</h1>
        <p className="text-body mt-3 text-sm">Admin account holders also log in here &mdash; you'll land on the admin panel automatically.</p>
      </div>

      <div className="bg-surface border border-line/10 rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <GoogleLoginButton onDone={() => navigate(redirectTo, { replace: true })} />
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-line/15" />
          <span className="text-xs text-muted uppercase tracking-wider">or</span>
          <div className="h-px flex-1 bg-line/15" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted mb-1 block">Email</label>
            <div className="flex items-center gap-2 bg-base border border-line/15 rounded-xl px-4 py-3">
              <Mail size={16} className="text-muted" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none flex-1 text-heading" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-muted block">Password</label>
              <Link to="/forgot-password" className="text-xs text-brand-green hover:underline">Forgot password?</Link>
            </div>
            <div className="flex items-center gap-2 bg-base border border-line/15 rounded-xl px-4 py-3">
              <Lock size={16} className="text-muted" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent outline-none flex-1 text-heading" placeholder="••••••••" />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-brand-green text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
            <LogIn size={18} /> {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account? <Link to="/register" className="text-brand-green font-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
