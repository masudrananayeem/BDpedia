import { motion } from 'framer-motion';
import { Target, Heart, Users2 } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Our Story</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-heading">About BDpedia</h1>
        <p className="text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          BDpedia is a community-driven guide to Bangladesh &mdash; built to help travelers, students and curious minds
          discover the country's districts, tourist places, rivers, history and culture, all in one place.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Target className="text-brand-green" size={32} />, title: 'Our Mission', desc: 'Make accurate, accessible information about every corner of Bangladesh available to everyone.' },
          { icon: <Heart className="text-brand-green" size={32} />, title: 'Our Passion', desc: 'A deep love for the rivers, hills, forests and heritage that make Bangladesh unique.' },
          { icon: <Users2 className="text-brand-green" size={32} />, title: 'Our Community', desc: 'Built with insight from travelers, vloggers and local communities across the country.' },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-surface p-8 rounded-2xl border border-line/5 text-center">
            <div className="mb-4 flex justify-center">{item.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-heading">{item.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
