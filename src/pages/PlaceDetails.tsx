import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlaceDetails() {
  const { slug } = useParams();
  const [place, setPlace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlace = async () => {
      try {
        const module = await import(`../data/json/places/${slug}.json`);
        setPlace(module.default || module);
      } catch (err) {
        console.error("Failed to load place data", err);
      } finally {
        setLoading(false);
      }
    };
    loadPlace();
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-xl text-gray-400">Loading details...</div>;
  if (!place) return <div className="text-center py-20 text-2xl">Place not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/explore" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-green transition-colors mb-8">
        <ArrowLeft size={20} /> Back to Places
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="h-72 md:h-[500px] bg-gray-800 relative flex items-center justify-center">
           <span className="absolute z-10 text-gray-400">{place.image}</span>
           <img src={place.image} alt={place.name} className="absolute inset-0 w-full h-full object-cover opacity-80" onError={(e) => (e.currentTarget.style.opacity = '0')} />
           <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/20 to-transparent"></div>
           <div className="absolute bottom-8 left-8 right-8">
             <span className="bg-brand-green text-black px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block">Must Visit</span>
             <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg flex items-center gap-4"><MapPin size={40} className="text-brand-green"/> {place.name}</h1>
           </div>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-green"><Compass /> About this Place</h2>
          <p className="text-gray-300 leading-relaxed text-lg mb-8 max-w-3xl">{place.description}</p>
          <button className="bg-brand-dark hover:bg-green-500 text-white px-8 py-3 rounded-full font-semibold transition-all">
            Add to Travel Itinerary
          </button>
        </div>
      </motion.div>
    </div>
  );
}