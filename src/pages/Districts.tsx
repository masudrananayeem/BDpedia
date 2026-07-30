import { useState } from 'react';
import districtsIndex from '../data/json/districts/index.json';
import { ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Districts() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredDistricts = districtsIndex.filter((d:any) => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">64 Districts of Bangladesh</h1>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg">Click on any district to explore its rich history and popular tourist destinations.</p>
        <input 
          type="text" placeholder="Search a district..." 
          className="bg-[#111] border border-white/20 rounded-full px-6 py-4 w-full max-w-md focus:outline-none focus:border-brand-green text-white shadow-xl"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredDistricts.map((district:any, index:number) => (
          <Link to={`/districts/${district.id}`} key={district.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index % 15) * 0.05 }}
              className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-brand-green/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all group flex flex-col h-full"
            >
              <div className="h-40 bg-gray-800 relative overflow-hidden flex items-center justify-center">
                <span className="text-xs text-gray-500 absolute z-10">{district.image}</span>
                <img src={district.image} alt={district.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" onError={(e) => (e.currentTarget.style.opacity = '0')} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-brand-green transition-colors flex items-center gap-2"><MapPin size={18}/>{district.name}</h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{district.history}</p>
                <div className="text-brand-green text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                  Explore District <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}