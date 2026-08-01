import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Compass, ChevronRight, Tag, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import placesIndex from '../data/json/places/index.json';

export default function PlaceDetails() {
  const { slug } = useParams();
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadPlace = async () => {
      setLoading(true);
      try {
        const module = await import(`../data/json/places/${slug}.json`);
        setPlace(module.default || module);
      } catch (err) {
        const fallback = (placesIndex as any[]).find((p) => p.id === slug);
        setPlace(fallback || null);
      } finally {
        setLoading(false);
      }
    };
    loadPlace();
  }, [slug]);

  if (loading) return <div className="text-center py-32 text-xl text-muted">Loading details...</div>;
  if (!place) return (
    <div className="text-center py-32">
      <p className="text-2xl mb-4">Place not found</p>
      <Link to="/explore" className="text-brand-green hover:underline">Back to Explore</Link>
    </div>
  );

  const related = (placesIndex as any[])
    .filter((p) => p.id !== place.id && (p.district === place.district || p.category === place.category))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-muted mb-6">
        <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/explore" className="hover:text-brand-green transition-colors">Explore</Link>
        <ChevronRight size={14} />
        <span className="text-body">{place.name}</span>
      </div>

      <Link to="/explore" className="inline-flex items-center gap-2 text-muted hover:text-brand-green transition-colors mb-6">
        <ArrowLeft size={18} /> Back to Places
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl overflow-hidden border border-line/10 shadow-2xl">
        <div className="h-72 md:h-[480px] bg-surfacealt relative flex items-center justify-center">
          <img src={place.image} alt={place.name} className="absolute inset-0 w-full h-full object-cover opacity-85" onError={(e) => (e.currentTarget.style.opacity = '0')} />
          <div className="absolute inset-0 bg-gradient-to-t from-base via-base/30 to-transparent" />
          <div className="absolute bottom-8 left-6 right-6 md:left-10 md:right-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {place.category && (
                <span className="bg-brand-green text-black px-4 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider">
                  {place.category}
                </span>
              )}
              {place.district && (
                <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-body px-4 py-1 rounded-full text-xs md:text-sm border border-line/10">
                  <MapPin size={14} className="text-brand-green" /> {place.district} District
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-heading drop-shadow-lg">{place.name}</h1>
          </div>
        </div>

        <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-10 bg-surface">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-green"><Compass /> About this Place</h2>
            <p className="text-body leading-relaxed text-lg mb-8">{place.description}</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-brand-dark hover:bg-green-500 text-heading px-8 py-3 rounded-full font-semibold transition-all">
                Add to Travel Itinerary
              </button>
              {place.district && (
                <Link
                  to={`/districts/${place.district.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                  className="inline-flex items-center gap-2 border border-line/20 hover:border-brand-green text-body hover:text-brand-green px-8 py-3 rounded-full font-semibold transition-all"
                >
                  <Navigation size={18} /> Explore {place.district} District
                </Link>
              )}
            </div>
          </div>

          <div>
            <div className="bg-line/5 border border-line/10 rounded-2xl p-6 sticky top-28">
              <h3 className="text-sm uppercase tracking-wider text-muted mb-4 flex items-center gap-2"><Tag size={16} className="text-brand-green" /> Quick Facts</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-line/5 pb-3">
                  <span className="text-muted">Category</span>
                  <span className="text-heading font-medium">{place.category || 'General'}</span>
                </li>
                <li className="flex justify-between border-b border-line/5 pb-3">
                  <span className="text-muted">District</span>
                  <span className="text-heading font-medium">{place.district || '—'}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted">Best time</span>
                  <span className="text-heading font-medium">Oct – Mar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-heading">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link to={`/explore/${p.id}`} key={p.id} className="group bg-surface rounded-2xl overflow-hidden border border-line/5 hover:border-brand-green/50 transition-all">
                <div className="h-36 bg-surfacealt relative overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => (e.currentTarget.style.opacity = '0')} />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-heading group-hover:text-brand-green transition-colors">{p.name}</h3>
                  <p className="text-xs text-muted">{p.district}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
