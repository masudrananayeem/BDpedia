import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Map, History, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DistrictDetails() {
  const { slug } = useParams();
  const [district, setDistrict] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDistrict = async () => {
      try {
        const module = await import(`../data/json/districts/${slug}.json`);
        setDistrict(module.default || module);
      } catch (err) {
        console.error("Failed to load district data", err);
      } finally {
        setLoading(false);
      }
    };
    loadDistrict();
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-xl text-gray-400">Loading details...</div>;
  if (!district) return <div className="text-center py-20 text-2xl">District not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to="/districts" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-green transition-colors mb-8">
        <ArrowLeft size={20} /> Back to all districts
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="h-64 md:h-96 bg-gray-800 relative flex items-center justify-center">
           <span className="absolute z-10 text-gray-400">{district.image}</span>
           <img src={district.image} alt={district.name} className="absolute inset-0 w-full h-full object-cover opacity-60" onError={(e) => (e.currentTarget.style.opacity = '0')} />
           <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
           <h1 className="absolute bottom-8 left-8 text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">{district.name}</h1>
        </div>

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-green"><History /> History</h2>
              <p className="text-gray-300 leading-relaxed mb-8">{district.history}</p>
              
              <a href={district.wiki} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-brand-dark hover:bg-green-500 text-white px-6 py-3 rounded-full font-semibold transition-all">
                <BookOpen size={18} /> Read full history on Wikipedia
              </a>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-brand-green"><Camera /> Tourist Attractions</h2>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-gray-300 leading-relaxed mb-4">{district.tourist_places}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-4 pt-4 border-t border-white/10">
                  <Map size={16} /> Explore the hidden gems of {district.name}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}