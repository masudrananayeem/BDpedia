import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 px-6 lg:px-24 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-white">BDpedia</h1>
          </div>
          <p className="text-sm leading-relaxed mb-6">Your ultimate guide to exploring the beauty, history, culture, and nature of Bangladesh. Discover the unexplored.</p>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/explore" className="hover:text-brand-green transition-colors">Tourist Places</Link></li>
            <li><Link to="/districts" className="hover:text-brand-green transition-colors">64 Districts</Link></li>
            <li><Link to="/history" className="hover:text-brand-green transition-colors">History of BD</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3"><MapPin size={18} className="text-brand-green shrink-0 mt-0.5" /> <span>Dhaka, Bangladesh</span></li>
            <li className="flex items-center gap-3"><Mail size={18} className="text-brand-green shrink-0" /> <span>info@bdpedia.com</span></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}