import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Map, History, Camera, ChevronRight, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import placesIndex from '../data/json/places/index.json';

export default function DistrictDetails() {
  const { slug } = useParams();
  const [district, setDistrict] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadDistrict = async () => {
      setLoading(true);
      try {
        const module = await import(`../data/json/districts/${slug}.json`);
        setDistrict(module.default || module);
      } catch (err) {
        console.error("Failed to load district data", err);
        setDistrict(null);
      } finally {
        setLoading(false);
      }
    };
    loadDistrict();
  }, [slug]);

  if (loading) return <div className="text-center py-32 text-xl text-muted">Loading details...</div>;
  if (!district) return (
    <div className="text-center py-32">
      <p className="text-2xl mb-4">District not found</p>
      <Link to="/districts" className="text-brand-green hover:underline">Back to Districts</Link>
    </div>
  );

  const nearbyPlaces = (placesIndex as any[]).filter((p) => p.district === district.name).slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-muted mb-6">
        <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/districts" className="hover:text-brand-green transition-colors">Districts</Link>
        <ChevronRight size={14} />
        <span className="text-body">{district.name}</span>
      </div>

      <Link to="/districts" className="inline-flex items-center gap-2 text-muted hover:text-brand-green transition-colors mb-6">
        <ArrowLeft size={18} /> Back to all districts
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-3xl overflow-hidden border border-line/10 shadow-2xl">
        <div className="h-64 md:h-96 bg-surfacealt relative flex items-center justify-center">
           <img src={district.image} alt={district.name} className="absolute inset-0 w-full h-full object-cover opacity-60" onError={(e) => (e.currentTarget.style.opacity = '0')} />
           <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
           <div className="absolute bottom-8 left-8 right-8">
             {district.division && (
               <span className="inline-block bg-brand-green text-black px-4 py-1 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-4">
                 {district.division} Division
               </span>
             )}
             <h1 className="text-5xl md:text-7xl font-extrabold text-heading drop-shadow-lg">{district.name}</h1>
           </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-green"><History /> History</h2>
              <p className="text-body leading-relaxed mb-8">{district.history}</p>
              
              <a href={district.wiki} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-brand-dark hover:bg-green-500 text-heading px-6 py-3 rounded-full font-semibold transition-all">
                <BookOpen size={18} /> Read full history on Wikipedia
              </a>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-green"><Camera /> Tourist Attractions</h2>
              <div className="bg-line/5 p-6 rounded-2xl border border-line/5">
                <p className="text-body leading-relaxed mb-4">{district.tourist_places}</p>
                <div className="flex items-center gap-2 text-sm text-muted mt-4 pt-4 border-t border-line/10">
                  <Map size={16} /> Explore the hidden gems of {district.name}.
                </div>
              </div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
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
  );
}
