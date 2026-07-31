import { useMemo, useState } from 'react';
import districtsIndex from '../data/json/districts/index.json';
import { ArrowRight, MapPin, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

type District = { id: string; name: string; image: string; history: string; division?: string };
const ALL_DISTRICTS = districtsIndex as District[];
const DIVISIONS = Array.from(new Set(ALL_DISTRICTS.map((d) => d.division).filter(Boolean))) as string[];

export default function Districts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDivision, setActiveDivision] = useState('All');

  const filteredDistricts = useMemo(() => {
    return ALL_DISTRICTS.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDivision = activeDivision === 'All' || d.division === activeDivision;
      return matchesSearch && matchesDivision;
    });
  }, [searchTerm, activeDivision]);

  const activeFilterCount = (activeDivision !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Administrative Map</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-heading">64 Districts of Bangladesh</h1>
        <p className="text-muted mb-8 max-w-2xl mx-auto text-lg">Click on any district to explore its rich history and popular tourist destinations.</p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text" placeholder="Search a district..."
            value={searchTerm}
            className="bg-surface border border-line/15 rounded-full pl-14 pr-6 py-4 w-full focus:outline-none focus:border-brand-green text-heading shadow-xl transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-10 bg-surface border border-line/10 rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-wider text-muted">Filter by Division</p>
          {activeFilterCount > 0 && (
            <button onClick={() => { setSearchTerm(''); setActiveDivision('All'); }} className="flex items-center gap-1 text-xs text-muted hover:text-brand-green transition-colors">
              <X size={13} /> Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...DIVISIONS].map((div) => (
            <button
              key={div}
              onClick={() => setActiveDivision(div)}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium border transition-all ${
                activeDivision === div
                  ? 'bg-brand-green text-black border-brand-green'
                  : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-heading'
              }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted mb-6">
        Showing <span className="text-heading font-semibold">{filteredDistricts.length}</span> of {ALL_DISTRICTS.length} districts
      </p>

      <AnimatePresence mode="popLayout">
        {filteredDistricts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDistricts.map((district, index) => (
              <Link to={`/districts/${district.id}`} key={district.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: (index % 15) * 0.04 }}
                  className="bg-surface rounded-2xl overflow-hidden border border-line/5 hover:border-brand-green/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all group flex flex-col h-full"
                >
                  <div className="h-40 bg-surfacealt relative overflow-hidden flex items-center justify-center">
                    <img src={district.image} alt={district.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" onError={(e) => (e.currentTarget.style.opacity = '0')} />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
                    {district.division && (
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-brand-green text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-brand-green/30">
                        {district.division}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-heading mb-2 group-hover:text-brand-green transition-colors flex items-center gap-2"><MapPin size={18}/>{district.name}</h2>
                    <p className="text-muted text-sm line-clamp-2 mb-4 flex-grow">{district.history}</p>
                    <div className="text-brand-green text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Explore District <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 border border-dashed border-line/10 rounded-2xl">
            <p className="text-xl font-semibold text-body mb-2">No districts found</p>
            <p className="text-muted">Try a different search or division.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
