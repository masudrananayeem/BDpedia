import { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ isHome }: { isHome: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' }, { name: 'Explore', path: '/explore' },
    { name: 'Districts', path: '/districts' }, { name: 'History', path: '/history' },
    { name: 'Culture', path: '/culture' }, { name: 'Guide', path: '/guide' },
    { name: 'Blog', path: '/blog' }, { name: 'Gallery', path: '/gallery' },
  ];

  const bgClass = (isHome && !scrolled) ? 'bg-transparent' : 'bg-[#050505]/90 backdrop-blur-md border-b border-white/10';

  return (
    <nav className={`fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green text-black flex items-center justify-center rounded-full font-bold text-xl">BD</div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">BDpedia</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-300">Discover • Learn • Experience</p>
          </div>
        </Link>

        <div className="hidden xl:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
             <Link key={link.name} to={link.path} className={`hover:text-brand-green transition-colors ${location.pathname === link.path ? 'text-brand-green' : 'text-gray-200'}`}>
              {link.name}
            </Link>
          ))}
          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className="flex items-center gap-1 text-gray-200 hover:text-brand-green transition-colors">
              More <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-40 bg-[#111] border border-white/10 rounded-lg shadow-xl overflow-hidden">
                  <a href="#" className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white">About Us</a>
                  <a href="#" className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white">Contact</a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-gray-200 hover:text-brand-green transition-colors"><Search size={22} /></button>
          <button className="text-gray-200 hover:text-brand-green xl:hidden" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
    </nav>
  );
}