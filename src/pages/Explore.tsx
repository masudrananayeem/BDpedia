import { useState } from 'react';
import placesIndex from '../data/json/places/index.json';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPlaces = placesIndex.filter((p:any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Top 50 Tourist Places</h1>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">Click on a place to view more details and breathtaking views.</p>
        <input 
          type="text" placeholder="Search places..." 
          className="bg-[#111] border border-white/20 rounded-full px-6 py-4 w-full max-w-md focus:outline-none focus:border-brand-green text-white shadow-xl"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPlaces.map((place:any, index:number) => (
          <Link to={`/explore/${place.id}`} key={place.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index % 15) * 0.05 }}
              className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-green/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all group flex flex-col h-full"
            >
              <div className="h-56 bg-gray-800 relative overflow-hidden flex items-center justify-center">
                <span className="text-xs text-gray-500 absolute z-10">{place.image}</span>
                <img src={place.image} alt={place.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" onError={(e) => (e.currentTarget.style.opacity = '0')} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white group-hover:text-brand-green transition-colors"><MapPin size={20}/> {place.name}</h2>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{place.description}</p>
                <div className="text-brand-green text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                  View Details <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}