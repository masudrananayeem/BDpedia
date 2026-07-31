import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Get In Touch</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contact Us</h1>
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

      <form className="bg-surface p-8 rounded-2xl border border-line/10 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Your Name" className="bg-black/40 border border-line/15 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green text-heading md:col-span-1" />
        <input type="email" placeholder="Your Email" className="bg-black/40 border border-line/15 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green text-heading md:col-span-1" />
        <textarea placeholder="Your Message" rows={5} className="bg-black/40 border border-line/15 rounded-xl px-5 py-3 focus:outline-none focus:border-brand-green text-heading md:col-span-2" />
        <button type="submit" className="bg-brand-dark hover:bg-green-500 text-heading px-8 py-3 rounded-full font-semibold transition-all md:col-span-2 md:w-fit">
          Send Message
        </button>
      </form>
    </div>
  );
}
