import { useMemo, useState } from 'react';
import placesIndex from '../data/json/places/index.json';
import { MapPin, ArrowRight, Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

type Place = {
  id: string;
  name: string;
  image: string;
  description: string;
  category?: string;
  district?: string;
};

const ALL_PLACES = placesIndex as Place[];

const CATEGORIES = Array.from(new Set(ALL_PLACES.map((p) => p.category).filter(Boolean))) as string[];
const DISTRICTS = Array.from(new Set(ALL_PLACES.map((p) => p.district).filter(Boolean))).sort() as string[];

type SortKey = 'default' | 'az' | 'za';

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeDistrict, setActiveDistrict] = useState<string>('All');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredPlaces = useMemo(() => {
    let list = ALL_PLACES.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.district || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesDistrict = activeDistrict === 'All' || p.district === activeDistrict;
      return matchesSearch && matchesCategory && matchesDistrict;
    });

    if (sortKey === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortKey === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [searchTerm, activeCategory, activeDistrict, sortKey]);

  const activeFilterCount = (activeCategory !== 'All' ? 1 : 0) + (activeDistrict !== 'All' ? 1 : 0) + (searchTerm ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
    setActiveDistrict('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Explore Bangladesh</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Tourist Places</h1>
        <p className="text-muted mb-8 max-w-2xl mx-auto text-lg">
          {ALL_PLACES.length}+ handpicked destinations across the country &mdash; filter by category, district, or search for a place.
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text"
            placeholder="Search by place or district..."
            value={searchTerm}
            className="bg-surface border border-line/15 rounded-full pl-14 pr-6 py-4 w-full focus:outline-none focus:border-brand-green text-heading shadow-xl transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-10 bg-surface border border-line/10 rounded-2xl p-4 md:p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-heading md:hidden"
          >
            <SlidersHorizontal size={16} className="text-brand-green" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-heading">
            <SlidersHorizontal size={16} className="text-brand-green" /> Filter Places
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="appearance-none bg-black/40 border border-line/15 rounded-full pl-4 pr-9 py-2 text-xs md:text-sm text-body focus:outline-none focus:border-brand-green cursor-pointer"
              >
                <option value="default">Sort: Featured</option>
                <option value="az">Name: A &rarr; Z</option>
                <option value="za">Name: Z &rarr; A</option>
              </select>
              <ArrowUpDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs md:text-sm text-muted hover:text-brand-green transition-colors">
                <X size={14} /> Clear
              </button>
            )}
          </div>
        </div>

        <div className={`${filtersOpen ? 'block' : 'hidden'} md:block`}>
          <div className="mb-4">
            <p className="text-xs uppercase tracking-wider text-muted mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium border transition-all ${
                    activeCategory === cat
                      ? 'bg-brand-green text-black border-brand-green'
                      : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-heading'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted mb-2">District</p>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
              {['All', ...DISTRICTS].map((dist) => (
                <button
                  key={dist}
                  onClick={() => setActiveDistrict(dist)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium border transition-all ${
                    activeDistrict === dist
                      ? 'bg-brand-green text-black border-brand-green'
                      : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-heading'
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted mb-6">
        Showing <span className="text-heading font-semibold">{filteredPlaces.length}</span> of {ALL_PLACES.length} places
      </p>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlaces.map((place, index) => (
              <Link to={`/explore/${place.id}`} key={place.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: (index % 15) * 0.04 }}
                  className="bg-surface rounded-2xl overflow-hidden border border-line/5 hover:border-brand-green/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all group flex flex-col h-full"
                >
                  <div className="h-56 bg-surfacealt relative overflow-hidden flex items-center justify-center">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      onError={(e) => (e.currentTarget.style.opacity = '0')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                    {place.category && (
                      <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-brand-green text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-green/30">
                        {place.category}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold mb-1 flex items-center gap-2 text-heading group-hover:text-brand-green transition-colors">
                      <MapPin size={20} className="shrink-0" /> {place.name}
                    </h2>
                    {place.district && <p className="text-xs text-muted mb-3 ml-7">{place.district} District</p>}
                    <p className="text-muted text-sm line-clamp-3 mb-6 flex-grow">{place.description}</p>
                    <div className="text-brand-green text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      View Details <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 border border-dashed border-line/10 rounded-2xl">
            <p className="text-xl font-semibold text-body mb-2">No places found</p>
            <p className="text-muted mb-6">Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="bg-brand-dark hover:bg-green-500 text-heading px-6 py-3 rounded-full font-semibold transition-all">
              Clear all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
