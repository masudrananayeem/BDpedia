import { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/contact', { name, email, message });
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Message could not be sent, please try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Get In Touch</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-heading">Contact Us</h1>
        <p className="text-muted max-w-xl mx-auto">Have a question, correction, or want to collaborate? Reach out anytime.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <div className="bg-surface p-6 rounded-2xl border border-line/5 text-center">
          <Mail className="text-brand-green mx-auto mb-3" size={26} />
          <p className="text-sm text-muted">Email</p>
          <p className="text-heading font-semibold">info@bdpedia.com</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-line/5 text-center">
          <Phone className="text-brand-green mx-auto mb-3" size={26} />
          <p className="text-sm text-muted">Tourist Helpline</p>
          <p className="text-heading font-semibold">999 / +8801320222222</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-line/5 text-center">
          <MapPin className="text-brand-green mx-auto mb-3" size={26} />
          <p className="text-sm text-muted">Based in</p>
          <p className="text-heading font-semibold">Dhaka, Bangladesh</p>
        </div>
      </div>

      {sent ? (
        <div className="bg-surface p-10 rounded-2xl border border-brand-green/30 text-center">
          <CheckCircle2 className="text-brand-green mx-auto mb-4" size={40} />
          <h3 className="text-xl font-bold text-heading mb-2">Message পাঠানো হয়েছে!</h3>
          <p className="text-muted mb-6">ধন্যবাদ যোগাযোগ করার জন্য — যত দ্রুত সম্ভব রিপ্লাই দেওয়া হবে।</p>
          <button onClick={() => setSent(false)} className="text-brand-green font-semibold hover:underline">
            আরেকটা message পাঠান
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-2xl border border-line/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            required
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-base border border-line/20 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green text-heading placeholder:text-muted md:col-span-1"
          />
          <input
            type="email"
            required
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-base border border-line/20 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green text-heading placeholder:text-muted md:col-span-1"
          />
          <textarea
            required
            placeholder="Your Message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-base border border-line/20 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green text-heading placeholder:text-muted md:col-span-2"
          />

          {error && <p className="text-sm text-red-400 md:col-span-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-brand-green hover:brightness-110 text-black px-8 py-3 rounded-full font-semibold transition-all md:col-span-2 md:w-fit disabled:opacity-60"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {submitting ? 'পাঠানো হচ্ছে...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}
