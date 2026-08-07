import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, MapPin, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import districtsIndex from '../data/json/districts/index.json';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const districtNames: string[] = Array.isArray(districtsIndex)
    ? (districtsIndex as any[]).map((d) => d.name || d.id).filter(Boolean)
    : [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password, district);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Join BDpedia</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-heading">Create an account</h1>
      </div>

      <div className="bg-surface border border-line/10 rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <GoogleLoginButton onDone={() => navigate('/', { replace: true })} />
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-line/15" />
          <span className="text-xs text-muted uppercase tracking-wider">or</span>
          <div className="h-px flex-1 bg-line/15" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted mb-1 block">Full Name</label>
            <div className="flex items-center gap-2 bg-base border border-line/15 rounded-xl px-4 py-3">
              <User size={16} className="text-muted" />
              <input required value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent outline-none flex-1 text-heading" placeholder="Your name" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">Email</label>
            <div className="flex items-center gap-2 bg-base border border-line/15 rounded-xl px-4 py-3">
              <Mail size={16} className="text-muted" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none flex-1 text-heading" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">District (optional)</label>
            <div className="flex items-center gap-2 bg-base border border-line/15 rounded-xl px-4 py-3">
              <MapPin size={16} className="text-muted" />
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="bg-transparent outline-none flex-1 text-heading">
                <option value="">Select district</option>
                {districtNames.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">Password</label>
            <div className="flex items-center gap-2 bg-base border border-line/15 rounded-xl px-4 py-3">
              <Lock size={16} className="text-muted" />
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent outline-none flex-1 text-heading" placeholder="At least 6 characters" />
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-brand-green text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
            <UserPlus size={18} /> {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account? <Link to="/login" className="text-brand-green font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}
