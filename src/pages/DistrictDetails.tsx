import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  BookOpen, Map, History, Camera, ChevronRight, Compass,
  Navigation, BedDouble, UtensilsCrossed, CalendarClock, Tag,
  BookmarkPlus, BookmarkCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchDistrict, fetchPlaces, District, Place } from '../lib/contentApi';
import { useItinerary } from '../context/ItineraryContext';

export default function DistrictDetails() {
  const { slug } = useParams();
  const [district, setDistrict] = useState<District | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSaved, toggleItem } = useItinerary();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    setLoading(true);
    Promise.all([fetchDistrict(slug), fetchPlaces()])
      .then(([d, places]) => {
        setDistrict(d);
        setNearbyPlaces(places.filter((p) => p.district === d.name).slice(0, 6));
      })
      .catch((err) => {
        console.error('Failed to load district data', err);
        setDistrict(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="text-center py-32 text-xl text-muted">Loading details...</div>;
  if (!district) return (
    <div className="text-center py-32">
      <p className="text-2xl mb-4">District not found</p>
      <Link to="/districts" className="text-brand-green hover:underline">Back to Districts</Link>
    </div>
  );

  const extraSections = [
    { key: 'howToReach', title: 'How to Reach', icon: Navigation, value: district.howToReach },
    { key: 'whereToStay', title: 'Where to Stay', icon: BedDouble, value: district.whereToStay },
    { key: 'whatToEat', title: 'What to Eat', icon: UtensilsCrossed, value: district.whatToEat },
  ].filter((s) => s.value && s.value.trim().length > 0);

  return (
    <div>
      {/* Full-screen hero */}
      <div className="relative w-full h-[85vh] md:h-[92vh] min-h-[560px] bg-surfacealt overflow-hidden">
        <motion.img
          initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }}
          src={district.image || '/images/hero/bg-image.jpg'} alt={district.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/hero/bg-image.jpg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Breadcrumb, overlaid on the image (navbar hidden on this page, so sits near the top) */}
        <div className="absolute top-6 md:top-8 left-0 right-0 px-6 lg:px-16 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-white/70">
              <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link to="/districts" className="hover:text-brand-green transition-colors">Districts</Link>
              <ChevronRight size={14} />
              <span className="text-white/90">{district.name}</span>
            </div>
          </div>
        </div>

        {/* District identity — glass card, aligned right */}
        <div className="absolute inset-x-0 bottom-0 pb-10 md:pb-16 px-6 lg:px-16 z-10">
          <div className="max-w-7xl mx-auto flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
              className="relative text-right max-w-xl rounded-3xl shadow-2xl isolate"
            >
              <div className="absolute inset-0 bg-black/25 backdrop-blur-md border border-white/10 rounded-3xl -z-10" />
              <div className="p-6 md:p-8">
                {district.division && (
                  <span className="inline-block bg-brand-green text-black px-4 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-4">
                    {district.division} Division
                  </span>
                )}
                <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg leading-none mb-4">{district.name}</h1>
                <p className="text-white/85 text-sm md:text-base leading-relaxed line-clamp-3 ml-auto">
                  {district.tourist_places || district.history}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-3xl overflow-hidden border border-line/10 shadow-2xl">
          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-heading">
                  <span className="p-2.5 bg-brand-green/10 rounded-xl text-brand-green"><History size={20} /></span> History
                </h2>
                <p className="text-body leading-relaxed text-lg">{district.history}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-heading">
                  <span className="p-2.5 bg-brand-green/10 rounded-xl text-brand-green"><Camera size={20} /></span> Tourist Attractions
                </h2>
                <div className="bg-line/5 p-6 rounded-2xl border border-line/5">
                  <p className="text-body leading-relaxed mb-4">{district.tourist_places}</p>
                  <div className="flex items-center gap-2 text-sm text-muted mt-4 pt-4 border-t border-line/10">
                    <Map size={16} /> Explore the hidden gems of {district.name}.
                  </div>
                </div>
              </div>

              {extraSections.map(({ key, title, icon: Icon, value }) => (
                <div key={key}>
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-heading">
                    <span className="p-2.5 bg-brand-green/10 rounded-xl text-brand-green"><Icon size={20} /></span> {title}
                  </h2>
                  <p className="text-body leading-relaxed">{value}</p>
                </div>
              ))}

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => toggleItem({ type: 'district', slug: district.id, name: district.name, image: district.image, meta: district.division })}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
                    isSaved('district', district.id)
                      ? 'bg-brand-green/15 border border-brand-green text-brand-green'
                      : 'bg-brand-dark hover:bg-green-500 text-heading'
                  }`}
                >
                  {isSaved('district', district.id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                  {isSaved('district', district.id) ? 'Added to Itinerary' : 'Add to Travel Itinerary'}
                </button>

                {district.wiki && (
                  <a
                    href={district.wiki} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-line/20 hover:border-brand-green text-body hover:text-brand-green px-8 py-3 rounded-full font-semibold transition-all"
                  >
                    <BookOpen size={18} /> Read full history on Wikipedia
                  </a>
                )}
              </div>
            </div>

            <div>
              <div className="bg-line/5 border border-line/10 rounded-2xl p-6 sticky top-28">
                <h3 className="text-sm uppercase tracking-wider text-muted mb-4 flex items-center gap-2"><Tag size={16} className="text-brand-green" /> Quick Facts</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between border-b border-line/5 pb-3">
                    <span className="text-muted">Division</span>
                    <span className="text-heading font-medium">{district.division || '—'}</span>
                  </li>
                  <li className="flex justify-between border-b border-line/5 pb-3">
                    <span className="text-muted flex items-center gap-1"><CalendarClock size={14} /> Best time</span>
                    <span className="text-heading font-medium text-right">{district.bestTimeToVisit || 'Oct – Mar'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted">Places nearby</span>
                    <span className="text-heading font-medium">{nearbyPlaces.length}</span>
                  </li>
                </ul>
                
              </div>
            </div>
          </div>
        </motion.div>

        {nearbyPlaces.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-heading"><Compass className="text-brand-green" /> Places to visit in {district.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyPlaces.map((p) => (
                <Link to={`/explore/${p.id}`} key={p.id} className="group bg-surface rounded-2xl overflow-hidden border border-line/5 hover:border-brand-green/50 transition-all">
                  <div className="h-40 bg-surfacealt relative overflow-hidden">
                    <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => (e.currentTarget.style.opacity = '0')} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-heading group-hover:text-brand-green transition-colors">{p.name}</h3>
                    <p className="text-xs text-muted">{p.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}