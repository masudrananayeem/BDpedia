import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone, ArrowUp, Send } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-navbar border-t border-line/10 pt-16 pb-6 px-6 lg:px-24 text-muted mt-20">
      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className="absolute -top-6 right-6 lg:right-24 w-12 h-12 rounded-full bg-brand-green text-black flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110 transition-transform"
      >
        <ArrowUp size={20} />
      </button>

      <div className="max-w-7xl mx-auto">
        {/* Newsletter */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-line/5 border border-line/10 rounded-2xl p-8 mb-14">
          <div>
            <h3 className="text-heading text-xl font-bold mb-1">Stay in the loop</h3>
            <p className="text-sm text-muted">Get new destinations, travel tips and district guides in your inbox.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex w-full lg:w-auto gap-3">
            <input
              type="email" required placeholder="Enter your email"
              className="flex-1 lg:w-72 bg-black/40 border border-line/15 rounded-full px-5 py-3 text-sm text-heading focus:outline-none focus:border-brand-green"
            />
            <button type="submit" className="bg-brand-green text-black px-5 py-3 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-green-400 transition-colors shrink-0">
              <Send size={15} /> Subscribe
            </button>
          </form>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-brand-green text-black flex items-center justify-center rounded-full font-bold">BD</div>
              <h1 className="text-2xl font-bold text-heading">BDpedia</h1>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">Your ultimate guide to exploring the beauty, history, culture, and nature of Bangladesh. Discover the unexplored.</p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Facebook size={17} />, href: '#' },
                { icon: <Twitter size={17} />, href: '#' },
                { icon: <Instagram size={17} />, href: '#' },
                { icon: <Youtube size={17} />, href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className="w-9 h-9 rounded-full bg-line/5 border border-line/10 flex items-center justify-center hover:bg-brand-green hover:text-black hover:border-brand-green transition-all">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-heading font-semibold text-base mb-5">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/explore" className="hover:text-brand-green transition-colors">Tourist Places</Link></li>
              <li><Link to="/districts" className="hover:text-brand-green transition-colors">64 Districts</Link></li>
              <li><Link to="/rivers" className="hover:text-brand-green transition-colors">Rivers of BD</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-green transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-heading font-semibold text-base mb-5">Learn</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/history" className="hover:text-brand-green transition-colors">History of BD</Link></li>
              <li><Link to="/culture" className="hover:text-brand-green transition-colors">Culture</Link></li>
              <li><Link to="/blog" className="hover:text-brand-green transition-colors">Blog</Link></li>
              <li><Link to="/guide" className="hover:text-brand-green transition-colors">Travel Guide</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-heading font-semibold text-base mb-5">Company</h3>
            <ul className="space-y-3 text-sm mb-5">
              <li><Link to="/about" className="hover:text-brand-green transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-green transition-colors">Contact</Link></li>
            </ul>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3"><MapPin size={16} className="text-brand-green shrink-0 mt-0.5" /> <span>Dhaka, Bangladesh</span></li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-brand-green shrink-0" /> <span>info@bdpedia.com</span></li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-brand-green shrink-0" /> <span>+8801320222222</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-line/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>&copy; {year} BDpedia. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-brand-green transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-green transition-colors">Terms of Service</a>
          </div>
          <p>Made with <span className="text-brand-green">♥</span> for Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
