import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, SendHorizonal, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';

// Feature: "Forgot password" — sends a Firebase-hosted password reset email.
// Firebase already owns local (email/password) auth for this app (see
// AuthContext), so no backend route is needed here; Firebase verifies the
// email and lets the user set a new password on its own reset page.
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      // Firebase's own message ("auth/user-not-found" etc.) isn't very
      // user-friendly, and revealing whether an email exists is a mild
      // privacy leak — so show a generic, safe message either way.
      if (err?.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setSent(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Account Recovery</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-heading">Forgot Password</h1>
        <p className="text-body mt-3 text-sm">Enter the email you used to sign up and we'll send you a link to reset your password.</p>
      </div>

      <div className="bg-surface border border-line/10 rounded-2xl p-8 shadow-xl">
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="mx-auto text-brand-green mb-4" />
            <p className="text-heading font-semibold mb-2">Check your inbox</p>
            <p className="text-body text-sm">
              If an account exists for <span className="text-heading font-medium">{email}</span>, a password reset link is on its way. Don't forget to check your spam folder.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 text-brand-green font-semibold mt-6 hover:underline">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Email</label>
              <div className="flex items-center gap-2 bg-base border border-line/15 rounded-xl px-4 py-3">
                <Mail size={16} className="text-muted" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none flex-1 text-heading" placeholder="you@example.com" />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-brand-green text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
              <SendHorizonal size={18} /> {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center text-sm text-muted pt-2">
              <Link to="/login" className="inline-flex items-center gap-1 text-brand-green font-semibold hover:underline">
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
