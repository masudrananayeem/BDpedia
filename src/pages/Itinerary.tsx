import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Trash2, Compass, ListChecks, Building2 } from 'lucide-react';
import { useItinerary } from '../context/ItineraryContext';

export default function Itinerary() {
  const { items, removeItem, clearAll } = useItinerary();

  const places = items.filter((i) => i.type === 'place');
  const districts = items.filter((i) => i.type === 'district');

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Your Plan</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-heading flex items-center justify-center gap-3">
          <ListChecks className="text-brand-green" /> My Travel Itinerary
        </h1>
        <p className="text-body mt-3 text-sm max-w-xl mx-auto">
          Places and districts you've saved while exploring BDpedia. Saved right here on this browser — build your Bangladesh trip plan as you go.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-line/10 rounded-2xl">
          <Compass size={40} className="mx-auto text-brand-green mb-4" />
          <p className="text-xl font-semibold text-heading mb-2">Your itinerary is empty</p>
          <p className="text-body text-sm mb-6">Browse places and districts, then hit &ldquo;Add to Travel Itinerary&rdquo; to save them here.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/explore" className="bg-brand-dark hover:bg-green-500 text-heading px-6 py-3 rounded-full font-semibold transition-all">Explore Places</Link>
            <Link to="/districts" className="border border-line/20 hover:border-brand-green text-body hover:text-brand-green px-6 py-3 rounded-full font-semibold transition-all">Browse Districts</Link>
          </div>
        </div>
      ) : (
        <div className="space-y-14">
          <div className="flex justify-end">
            <button onClick={clearAll} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={14} /> Clear all
            </button>
          </div>

          {places.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-heading"><Compass className="text-brand-green" /> Places ({places.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {places.map((item) => (
                    <motion.div
                      key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-surface rounded-2xl overflow-hidden border border-line/5 hover:border-brand-green/50 transition-all relative"
                    >
                      <Link to={`/explore/${item.slug}`}>
                        <div className="h-40 bg-surfacealt relative overflow-hidden">
                          <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => (e.currentTarget.style.opacity = '0')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-heading group-hover:text-brand-green transition-colors">{item.name}</h3>
                          {item.meta && <p className="text-xs text-muted flex items-center gap-1 mt-1"><MapPin size={12} /> {item.meta}</p>}
                        </div>
                      </Link>
                      <button
                        onClick={() => removeItem('place', item.slug)}
                        title="Remove from itinerary"
                        className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white/80 hover:text-red-400 hover:bg-black/70 p-2 rounded-full transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          {districts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-heading"><Building2 className="text-brand-green" /> Districts ({districts.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {districts.map((item) => (
                    <motion.div
                      key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-surface rounded-2xl overflow-hidden border border-line/5 hover:border-brand-green/50 transition-all relative"
                    >
                      <Link to={`/districts/${item.slug}`}>
                        <div className="h-40 bg-surfacealt relative overflow-hidden">
                          <img src={item.image} alt={item.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => (e.currentTarget.style.opacity = '0')} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-heading group-hover:text-brand-green transition-colors">{item.name}</h3>
                          {item.meta && <p className="text-xs text-muted flex items-center gap-1 mt-1"><MapPin size={12} /> {item.meta} Division</p>}
                        </div>
                      </Link>
                      <button
                        onClick={() => removeItem('district', item.slug)}
                        title="Remove from itinerary"
                        className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white/80 hover:text-red-400 hover:bg-black/70 p-2 rounded-full transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
