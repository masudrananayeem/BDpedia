import { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, Waves, BedDouble, Info, Mail, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ isHome }: { isHome: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { mode, toggleMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' }, { name: 'Explore', path: '/explore' },
    { name: 'Districts', path: '/districts' }, { name: 'History', path: '/history' },
    { name: 'Culture', path: '/culture' }, { name: 'Blog', path: '/blog' }, { name: 'Gallery', path: '/gallery' },
  ];

  const guideLinks = [
    { name: 'Travel Guide', path: '/guide', icon: <Waves size={15} /> },
    { name: 'Hotels & Stay', path: '/guide#hotels', icon: <BedDouble size={15} /> },
  ];

  const moreLinks = [
    { name: 'Rivers of BD', path: '/rivers', icon: <Waves size={15} /> },
    { name: 'About Us', path: '/about', icon: <Info size={15} /> },
    { name: 'Contact', path: '/contact', icon: <Mail size={15} /> },
  ];

  const overHero = isHome && !scrolled;
  const bgClass = overHero ? 'bg-transparent' : 'bg-navbar/90 backdrop-blur-md border-b border-line/10';
  const linkColor = overHero ? 'text-gray-200' : 'text-body';
  const headingColor = overHero ? 'text-white' : 'text-heading';

  return (
    <nav className={`fixed top-0 w-full z-50 px-6 py-4 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-green text-black flex items-center justify-center rounded-full font-bold text-xl">BD</div>
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${headingColor}`}>BDpedia</h1>
            <p className={`text-[10px] uppercase tracking-[0.2em] ${linkColor}`}>Discover • Learn • Experience</p>
          </div>
        </Link>

        <div className="hidden xl:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
             <Link key={link.name} to={link.path} className={`hover:text-brand-green transition-colors ${location.pathname === link.path ? 'text-brand-green' : linkColor}`}>
              {link.name}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setGuideOpen(true)} onMouseLeave={() => setGuideOpen(false)}>
            <button className={`flex items-center gap-1 transition-colors ${location.pathname.startsWith('/guide') ? 'text-brand-green' : `${linkColor} hover:text-brand-green`}`}>
              Guide <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {guideOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 w-56 bg-surface border border-line/10 rounded-lg shadow-xl overflow-hidden">
                  {guideLinks.map((l) => (
                    <Link key={l.name} to={l.path} className="flex items-center gap-2 px-4 py-3 text-sm text-body hover:bg-line/5 hover:text-brand-green">
                      {l.icon} {l.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
            <button className={`flex items-center gap-1 ${linkColor} hover:text-brand-green transition-colors`}>
              More <ChevronDown size={14} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 mt-2 w-52 bg-surface border border-line/10 rounded-lg shadow-xl overflow-hidden">
                  {moreLinks.map((l) => (
                    <Link key={l.name} to={l.path} className="flex items-center gap-2 px-4 py-3 text-sm text-body hover:bg-line/5 hover:text-brand-green">
                      {l.icon} {l.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={toggleMode}
            aria-label={mode === 'night' ? 'Switch to day mode' : 'Switch to night mode'}
            title={mode === 'night' ? 'Day mode' : 'Night mode'}
            className={`relative flex items-center w-14 h-8 rounded-full border transition-colors duration-300 ${
              mode === 'night' ? 'bg-white/10 border-line/20' : 'bg-brand-green/20 border-brand-green/40'
            }`}
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`absolute top-0.5 flex items-center justify-center w-6 h-6 rounded-full ${mode === 'night' ? 'left-0.5 bg-[#1f2937] text-brand-green' : 'left-6 bg-brand-green text-black'}`}
            >
              {mode === 'night' ? <Moon size={13} /> : <Sun size={13} />}
            </motion.span>
          </button>
          <button className={`${linkColor} hover:text-brand-green transition-colors`}><Search size={22} /></button>
          <button className={`${linkColor} hover:text-brand-green xl:hidden`} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="xl:hidden mt-4 bg-base border border-line/10 rounded-2xl overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-1">
              {[...navLinks, ...guideLinks, ...moreLinks].map((link) => (
                <Link key={link.name} to={link.path} className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-brand-green bg-line/5' : 'text-body hover:bg-line/5'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
