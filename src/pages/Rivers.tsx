import { useMemo, useState } from 'react';
import rivers from '../data/json/others/rivers.json';
import { Search, Waves, MapPin, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';

type River = {
  id: string;
  name: string;
  localName?: string;
  length_km: number;
  origin: string;
  districts: string[];
  description: string;
  image?: string;
};

const ALL_RIVERS = rivers as River[];

export default function Rivers() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return ALL_RIVERS.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.districts.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Land of Rivers</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Rivers of Bangladesh</h1>
        <p className="text-muted mb-8 max-w-2xl mx-auto text-lg">
          Bangladesh is crisscrossed by {ALL_RIVERS.length}+ major rivers that shape its land, livelihood and culture.
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

      <p className="text-sm text-muted mb-6">
        Showing <span className="text-heading font-semibold">{filtered.length}</span> of {ALL_RIVERS.length} rivers
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((river, index) => (
          <motion.div
            key={river.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index % 10) * 0.05 }}
            className="bg-surface rounded-2xl border border-line/5 hover:border-brand-green/40 transition-all p-6 md:p-7"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className="text-2xl font-bold text-heading flex items-center gap-2">
                  <Waves size={20} className="text-brand-green shrink-0" /> {river.name}
                </h2>
                {river.localName && <p className="text-sm text-muted ml-7">{river.localName}</p>}
              </div>
              <span className="flex items-center gap-1 bg-brand-green/10 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
                <Ruler size={13} /> {river.length_km} km
              </span>
            </div>

            <p className="text-muted text-sm leading-relaxed mb-4">{river.description}</p>

            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-muted mb-1">Origin</p>
              <p className="text-sm text-body">{river.origin}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted mb-2 flex items-center gap-1"><MapPin size={12} /> Flows through</p>
              <div className="flex flex-wrap gap-2">
                {river.districts.map((d) => (
                  <span key={d} className="text-xs bg-line/5 border border-line/10 text-body px-3 py-1 rounded-full">{d}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
