import { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, Waves, BedDouble, Info, Mail, Sun, Moon } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import places from '../data/json/places/index.json';
import districts from '../data/json/districts/index.json';
import rivers from '../data/json/others/rivers.json';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ isHome }: { isHome: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
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

  const searchResults = query.trim().length < 2 ? [] : [
    ...(places as any[]).filter(p => `${p.name} ${p.district || ''} ${p.category || ''}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6).map(p => ({ label: p.name, meta: `Place · ${p.district || 'Bangladesh'}`, path: `/explore/${p.id}` })),
    ...(districts as any[]).filter(d => `${d.name} ${d.division || ''}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4).map(d => ({ label: d.name, meta: `District · ${d.division || 'Bangladesh'}`, path: `/districts/${d.id || d.slug}` })),
    ...(rivers as any[]).filter(r => `${r.name} ${(r.districts || []).join(' ')}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4).map(r => ({ label: r.name, meta: 'River', path: `/rivers?search=${encodeURIComponent(r.name)}` })),
  ].slice(0, 10);

  const openResult = (path: string) => { setSearchOpen(false); setQuery(''); navigate(path); };

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
          <button onClick={() => setSearchOpen(true)} aria-label="Search BDpedia" className={`${linkColor} hover:text-brand-green transition-colors`}><Search size={22} /></button>
          <button className={`${linkColor} hover:text-brand-green xl:hidden`} onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md p-4 md:p-10" onMouseDown={() => setSearchOpen(false)}>
            <motion.div initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} onMouseDown={(e)=>e.stopPropagation()} className="max-w-2xl mx-auto mt-16 bg-surface border border-line/15 rounded-3xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 p-5 border-b border-line/10"><Search className="text-brand-green" size={22}/><input autoFocus value={query} onChange={(e)=>setQuery(e.target.value)} onKeyDown={(e)=>{if(e.key==='Escape')setSearchOpen(false); if(e.key==='Enter'&&searchResults[0])openResult(searchResults[0].path)}} placeholder="Search places, districts or rivers..." className="flex-1 bg-transparent outline-none text-heading text-lg"/><button onClick={()=>setSearchOpen(false)} className="text-muted hover:text-heading"><X size={22}/></button></div>
              <div className="max-h-[55vh] overflow-y-auto p-3">
                {query.trim().length < 2 && <p className="text-sm text-muted p-5 text-center">Type at least 2 characters to search across BDpedia.</p>}
                {query.trim().length >= 2 && searchResults.length === 0 && <p className="text-sm text-muted p-5 text-center">No matching place, district or river found.</p>}
                {searchResults.map((r,i)=><button key={`${r.path}-${i}`} onClick={()=>openResult(r.path)} className="w-full text-left px-5 py-3 rounded-xl hover:bg-line/5 transition-colors"><p className="font-semibold text-heading">{r.label}</p><p className="text-xs text-muted">{r.meta}</p></button>)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
