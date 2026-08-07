import { useEffect, useMemo, useState } from 'react';
import { fetchRivers, River } from '../lib/contentApi';
import { Search, Waves, MapPin, Ruler, ExternalLink, BookOpen, ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { withFeaturedFirst, FEATURED_RIVER_SLUGS } from '../lib/featured';

export default function Rivers() {
  const [allRivers, setAllRivers] = useState<River[]>([]);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const RIVERS_PER_PAGE = 25;

  useEffect(() => {
    fetchRivers().then(setAllRivers).catch(() => setAllRivers([]));
  }, []);

  const filtered = useMemo(() => {
    const matches = allRivers.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.districts.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    // Show the major, most-searched rivers first (same pattern as Districts
    // and Explore); the rest follow in their existing order so all 250+
    // rivers stay searchable below.
    return withFeaturedFirst(matches, FEATURED_RIVER_SLUGS);
  }, [allRivers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / RIVERS_PER_PAGE));
  const paginatedRivers = filtered.slice(
    (currentPage - 1) * RIVERS_PER_PAGE,
    currentPage * RIVERS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Land of Rivers</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-heading">Rivers of Bangladesh</h1>
        <p className="text-muted mb-8 max-w-2xl mx-auto text-lg">
          Bangladesh is crisscrossed by {allRivers.length}+ major rivers that shape its land, livelihood and culture.
        </p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text" placeholder="Search a river or district..."
            value={searchTerm}
            className="bg-surface border border-line/15 rounded-full pl-14 pr-6 py-4 w-full focus:outline-none focus:border-brand-green text-heading shadow-xl transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-brand-green/20 bg-brand-green/5 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-brand-green font-bold mb-1"><BookOpen size={18} /> Complete River Reference</div>
          <p className="text-sm text-muted max-w-3xl">River counts vary by source and season. For a broader reference, open Wikipedia’s maintained list of rivers of Bangladesh, including major systems and district-based river lists.</p>
        </div>
        <a href="https://en.wikipedia.org/wiki/List_of_rivers_of_Bangladesh" target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-green text-black font-semibold hover:opacity-90 transition-opacity">View all on Wikipedia <ExternalLink size={16} /></a>
      </div>

      <p className="text-sm text-muted mb-6">
        Showing <span className="text-heading font-semibold">{filtered.length === 0 ? 0 : (currentPage - 1) * RIVERS_PER_PAGE + 1}–{Math.min(currentPage * RIVERS_PER_PAGE, filtered.length)}</span> of {filtered.length} rivers
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedRivers.map((river, index) => (
          <motion.div
            key={river.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index % 10) * 0.05 }}
            className="bg-surface rounded-2xl border border-line/5 hover:border-brand-green/40 transition-all overflow-hidden flex flex-col"
          >
            <div className="h-44 bg-surfacealt relative overflow-hidden flex items-center justify-center">
              <ImageOff size={26} className="text-muted/50" />
              <img
                src={river.image || `/images/rivers/${river.id}.jpg`}
                alt={river.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.opacity = '0')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <span className="absolute bottom-3 right-3 flex items-center gap-1 bg-brand-green/90 text-black text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                <Ruler size={13} /> {river.length_km ? `${river.length_km} km` : `Regional river`}
              </span>
              {(river.featured || FEATURED_RIVER_SLUGS.includes(river.id)) && (
                <span className="absolute top-3 left-3 bg-brand-green text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <div className="p-6 md:p-7">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-2xl font-bold text-heading flex items-center gap-2">
                  <Waves size={20} className="text-brand-green shrink-0" /> {river.name}
                </h2>
                {river.localName && <p className="text-sm text-muted ml-7">{river.localName}</p>}
              </div>
            </div>

            <p className="text-muted text-sm leading-relaxed mb-4">{river.description}</p>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-muted mb-1">Origin</p>
              <p className="text-sm text-body">{river.origin}</p>
            </div>

            <div className="mb-5">
              <p className="text-xs uppercase tracking-wider text-muted mb-2 flex items-center gap-1"><MapPin size={12} /> Flows through</p>
              <div className="flex flex-wrap gap-2">
                {river.districts.map((d) => (
                  <span key={d} className="text-xs bg-line/5 border border-line/10 text-body px-3 py-1 rounded-full">{d}</span>
                ))}
              </div>
            </div>

            <a
              href={river.wiki || `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(river.name)}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-heading transition-colors"
            >
              <BookOpen size={16} /> Read more on Wikipedia <ExternalLink size={13} />
            </a>
            </div>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            type="button"
            onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-full border border-line/15 bg-surface text-heading disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-green transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-10 h-10 rounded-full border transition-colors ${currentPage === page ? 'bg-brand-green text-black border-brand-green font-bold' : 'bg-surface text-heading border-line/15 hover:border-brand-green'}`}
              aria-label={`Go to river page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-full border border-line/15 bg-surface text-heading disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-green transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
