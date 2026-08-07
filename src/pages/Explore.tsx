import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, ArrowRight, Search, SlidersHorizontal, X, ArrowUpDown, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchPlaces, Place } from '../lib/contentApi';
import { withFeaturedFirst, FEATURED_PLACE_SLUGS } from '../lib/featured';

const PAGE_SIZE = 33;
const TOP_COUNT = 200;

type SortKey = 'default' | 'az' | 'za';
type ViewMode = 'all' | 'top';

export default function Explore() {
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeDistrict, setActiveDistrict] = useState<string>('All');
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1));
  // filter/sort পরিবর্তন হলে page 1-এ ফিরিয়ে নেওয়ার জন্য — মান তুলনা করে,
  // effect ক'বার চলেছে সেটা গুনে নয়, কারণ React.StrictMode dev-mode-এ
  // প্রতিটা effect mount-এ দু'বার চালায়; count-based flag হলে সেই দ্বিতীয়
  // বার-ই ভুলবশত page 1-এ রিসেট করে দিত।
  const filterSignature = `${searchTerm}|${activeCategory}|${activeDistrict}|${sortKey}|${viewMode}`;
  const prevFilterSignature = useRef(filterSignature);

  useEffect(() => {
    fetchPlaces().then(setAllPlaces).catch(() => setAllPlaces([]));
  }, []);

  const CATEGORIES = useMemo(() => Array.from(new Set(allPlaces.map((p) => p.category).filter(Boolean))) as string[], [allPlaces]);
  const DISTRICTS = useMemo(() => Array.from(new Set(allPlaces.map((p) => p.district).filter(Boolean))).sort() as string[], [allPlaces]);

  // "Top 200 Places": the curated/most-visited places first (see featured.ts),
  // padded out to 200 with the rest in their existing order. This is the base
  // list for Top view; search/category/district/sort below still apply on top of it.
  const topPlaces = useMemo(() => withFeaturedFirst(allPlaces, FEATURED_PLACE_SLUGS).slice(0, TOP_COUNT), [allPlaces]);

  const filteredPlaces = useMemo(() => {
    const base = viewMode === 'top' ? topPlaces : allPlaces;
    let list = base.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.district || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesDistrict = activeDistrict === 'All' || p.district === activeDistrict;
      return matchesSearch && matchesCategory && matchesDistrict;
    });

    if (sortKey === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortKey === 'za') list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    // "Featured" default: surface the most-visited places first, rest keep order.
    else if (viewMode !== 'top') list = withFeaturedFirst(list, FEATURED_PLACE_SLUGS);

    return list;
  }, [allPlaces, topPlaces, viewMode, searchTerm, activeCategory, activeDistrict, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredPlaces.length / PAGE_SIZE));
  const paginatedPlaces = useMemo(
    () => filteredPlaces.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredPlaces, page]
  );

  useEffect(() => {
    if (prevFilterSignature.current !== filterSignature) {
      prevFilterSignature.current = filterSignature;
      setPage(1);
    }
  }, [filterSignature]);

  useEffect(() => {
    if (allPlaces.length > 0 && page > totalPages) setPage(totalPages);
  }, [totalPages, page, allPlaces.length]);

  // পেজ নম্বর URL-এ রাখা হচ্ছে (?page=), যাতে কোনো place-এ ঢুকে "Back to
  // Places" ক্লিক করলে ইউজার ঠিক সেই পেজেই ফিরে আসতে পারে।
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (page > 1) next.set('page', String(page));
        else next.delete('page');
        return next;
      },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-heading">Tourist Places</h1>
        <p className="text-muted mb-8 max-w-2xl mx-auto text-lg">
          {allPlaces.length}+ handpicked destinations across the country &mdash; filter by category, district, or search for a place.
        </p>

        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setViewMode('all')}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
              viewMode === 'all'
                ? 'bg-brand-green text-black border-brand-green'
                : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-heading'
            }`}
          >
            All Places
          </button>
          <button
            onClick={() => setViewMode('top')}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
              viewMode === 'top'
                ? 'bg-brand-green text-black border-brand-green'
                : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-heading'
            }`}
          >
            Top {TOP_COUNT} Places
          </button>
        </div>

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
        Showing <span className="text-heading font-semibold">{paginatedPlaces.length}</span> of {filteredPlaces.length} places
        {totalPages > 1 && <span> &middot; Page {page} of {totalPages}</span>}
      </p>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {paginatedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedPlaces.map((place, index) => (
              <Link to={`/explore/${place.id}${page > 1 ? `?page=${page}` : ''}`} key={place.id}>
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: (index % 15) * 0.04 }}
                  className="bg-surface rounded-2xl overflow-hidden border border-line/5 hover:border-brand-green/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all group flex flex-col h-full"
                >
                  <div className="h-56 bg-surfacealt relative overflow-hidden flex items-center justify-center">
                    <ImageOff size={28} className="text-muted/50" />
                    <img
                      src={place.image}
                      alt={place.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => (e.currentTarget.style.opacity = '0')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    {place.category && (
                      <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-brand-green text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-green/30">
                        {place.category}
                      </span>
                    )}
                    {(place.featured || FEATURED_PLACE_SLUGS.includes(place.id)) && (
                      <span className="absolute top-4 right-4 bg-brand-green text-black text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        Popular
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
          <button
            onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-line/15 text-body hover:border-brand-green/50 hover:text-heading disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft size={15} /> Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-9 h-9 rounded-full text-sm font-medium border transition-all ${
                page === p
                  ? 'bg-brand-green text-black border-brand-green'
                  : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-heading'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium border border-line/15 text-body hover:border-brand-green/50 hover:text-heading disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}