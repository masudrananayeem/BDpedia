import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music4, Utensils, Shirt, PartyPopper, Languages, Palette, Trophy, BookOpen } from 'lucide-react';

const categories = [
  {
    key: 'heritage',
    title: 'Bengali Heritage',
    icon: <BookOpen size={22} />,
    desc: 'The heart of Bangladesh lies in its rich Bengali heritage, rooted in literature, music, dance, and centuries-old traditions. Nobel laureate Rabindranath Tagore and national poet Kazi Nazrul Islam are cornerstones of Bengali literary identity.',
  },
  {
    key: 'language',
    title: 'Language & Literature',
    icon: <Languages size={22} />,
    desc: 'Bangla (Bengali) is the state language, for which the nation fought and won the Language Movement of 1952 — commemorated globally as International Mother Language Day on 21 February.',
  },
  {
    key: 'festivals',
    title: 'Festivals',
    icon: <PartyPopper size={22} />,
    desc: 'Pahela Baishakh (Bengali New Year), Eid-ul-Fitr, Eid-ul-Adha, Durga Puja, and Victory & Independence Days bring the country together in colourful, nationwide celebration.',
  },
  {
    key: 'cuisine',
    title: 'Cuisine',
    icon: <Utensils size={22} />,
    desc: 'Rice and fish (Bhat-Machh) form the backbone of Bengali cuisine, alongside beloved dishes like Hilsa curry, Biryani, Panta Bhat, and an endless variety of sweets such as Roshogolla and Mishti Doi.',
  },
  {
    key: 'music',
    title: 'Music & Dance',
    icon: <Music4 size={22} />,
    desc: 'From the mystic Baul folk songs of Lalon Fokir to Rabindra Sangeet and Nazrul Geeti, music runs deep in Bengali life, complemented by regional folk dances across the country.',
  },
  {
    key: 'attire',
    title: 'Attire',
    icon: <Shirt size={22} />,
    desc: 'The saree and panjabi remain iconic everyday and festive wear, while the fine muslin and Jamdani textiles of Bengal — a UNESCO Intangible Cultural Heritage — are celebrated worldwide.',
  },
  {
    key: 'crafts',
    title: 'Arts & Crafts',
    icon: <Palette size={22} />,
    desc: 'Nakshi Kantha embroidery, terracotta work, and traditional pottery reflect generations of rural artistry passed down through Bengali households.',
  },
  {
    key: 'sports',
    title: 'Sports',
    icon: <Trophy size={22} />,
    desc: 'Cricket is a national obsession, while traditional games like Kabaddi (the national sport), Boli Khela wrestling, and boat racing remain deeply woven into rural life.',
  },
];

const ethnicGroups = [
  { name: 'Bengali', note: 'The majority population, over 98% of the country' },
  { name: 'Chakma', note: 'Largest indigenous group of the Chittagong Hill Tracts' },
  { name: 'Marma', note: 'Buddhist community of the Hill Tracts region' },
  { name: 'Santal', note: 'Indigenous community mainly in the northern plains' },
  { name: 'Garo', note: 'Matrilineal indigenous community of Mymensingh/Netrokona' },
  { name: 'Tripura', note: 'Indigenous group of the Chittagong Hill Tracts' },
];

export default function Culture() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-14">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Melting Pot</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brand-green">Culture & People</h1>
        <p className="text-body max-w-3xl mx-auto text-lg leading-relaxed">
          A melting pot of diverse ethnicities, religions, and traditions — Bangladesh's culture is woven from Bengali
          heritage, indigenous communities, and centuries of shared history.
        </p>
      </div>

      {/* Intro highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-surface p-8 rounded-3xl border border-line/10">
          <h2 className="text-3xl font-bold mb-4 text-heading">Bengali Culture</h2>
          <p className="text-muted mb-4 leading-relaxed">
            The heart of Bangladesh lies in its rich Bengali heritage, rooted in literature, music, dance, and festivals
            like Pahela Baishakh. Bengali identity, forged through the Language Movement, is central to the nation's soul.
          </p>
        </div>
        <div className="bg-surfacealt rounded-3xl overflow-hidden relative flex items-center justify-center text-muted min-h-[260px]">
          <span className="z-10">Add image: public/images/culture/bengali.jpg</span>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Category grid */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-heading">Explore Bengali Culture</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(active === c.key ? null : c.key)}
              className={`text-left p-6 rounded-2xl border transition-all bg-surface ${
                active === c.key ? 'border-brand-green/60' : 'border-line/10 hover:border-brand-green/30'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-4">{c.icon}</div>
              <h3 className="font-bold text-heading mb-1">{c.title}</h3>
              <AnimatePresence>
                {active === c.key && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted leading-relaxed mt-2 overflow-hidden"
                  >
                    {c.desc}
                  </motion.p>
                )}
              </AnimatePresence>
              {active !== c.key && <p className="text-xs text-muted">Tap to read more</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Ethnic groups */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-heading">Ethnic & Indigenous Communities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ethnicGroups.map((g) => (
            <div key={g.name} className="bg-surface border border-line/10 rounded-2xl p-5 hover:border-brand-green/30 transition-colors">
              <h3 className="font-bold text-heading mb-1">{g.name}</h3>
              <p className="text-xs text-muted leading-relaxed">{g.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
