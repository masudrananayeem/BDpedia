import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, Swords, Crown, Flag, Sparkles, ScrollText } from 'lucide-react';

type Era = 'All' | 'Ancient' | 'Medieval' | 'Colonial' | 'Modern';

const periods = [
  {
    era: 'Ancient' as Era,
    icon: <ScrollText size={18} />,
    title: 'Ancient Period (Pre-1204)',
    range: 'Before 1204 CE',
    content: 'The land now known as Bangladesh was part of the ancient Bengal region, ruled successively by the Maurya, Gupta, Pala, and Sena dynasties. The Pala Empire (8th-12th century) made Bengal a centre of Buddhist learning, while the Sena dynasty revived Hindu traditions. Ancient Bengal was renowned for its muslin trade and river-based civilisation.',
    highlights: ['Pundravardhana, one of the earliest urban centres of Bengal', 'Somapura Mahavihara — a UNESCO World Heritage Buddhist monastery', 'Flourishing river trade with Southeast Asia and the Roman world'],
  },
  {
    era: 'Medieval' as Era,
    icon: <Crown size={18} />,
    title: 'Islamic Rule (1204 - 1757)',
    range: '1204 CE - 1757 CE',
    content: 'Bakhtiyar Khalji\'s conquest in 1204 began centuries of Muslim rule. The independent Bengal Sultanate (1352-1576) became one of the wealthiest trading nations in the world, followed by Mughal rule which turned Dhaka into a major provincial capital famous for its fine muslin cloth.',
    highlights: ['Bengal Sultanate minted its own coinage and built the Sixty Dome Mosque', 'Dhaka (Jahangirnagar) served as the Mughal capital of Bengal', 'Bengal muslin became a prized export across the world'],
  },
  {
    era: 'Colonial' as Era,
    icon: <Swords size={18} />,
    title: 'British Era (1757 - 1947)',
    range: '1757 CE - 1947 CE',
    content: 'The Battle of Plassey in 1757 marked the start of British East India Company rule. Bengal underwent sweeping economic and social change, including the Bengal Renaissance, while also suffering colonial exploitation and famine. The 1947 Partition split Bengal along religious lines.',
    highlights: ['Battle of Plassey (1757) and the rise of Company rule', 'The Bengal Renaissance in literature, science, and social reform', 'Partition of Bengal (1947) creating East Pakistan'],
  },
  {
    era: 'Modern' as Era,
    icon: <Flag size={18} />,
    title: 'Pakistan Period (1947 - 1971)',
    range: '1947 CE - 1971 CE',
    content: 'East Bengal became East Pakistan, geographically separated from West Pakistan by 1,600 km of Indian territory. Political and economic marginalisation, along with the 1952 Language Movement defending Bangla, sowed the seeds of Bengali nationalism.',
    highlights: ['Language Movement of 1952 — Ekushey February', 'Six-Point Movement of 1966 for regional autonomy', 'Growing Bengali nationalist and cultural identity'],
  },
  {
    era: 'Modern' as Era,
    icon: <Swords size={18} />,
    title: 'Liberation War (1971)',
    range: '26 March - 16 December 1971',
    content: 'Under the leadership of Bangabandhu Sheikh Mujibur Rahman, Bangladesh fought a nine-month war of independence against Pakistan. Millions of freedom fighters (Mukti Bahini) and civilians sacrificed their lives, culminating in victory on 16 December 1971.',
    highlights: ['Declaration of Independence — 26 March 1971', 'Mukti Bahini freedom-fighter resistance', 'Victory Day — 16 December 1971'],
  },
  {
    era: 'Modern' as Era,
    icon: <Landmark size={18} />,
    title: 'Modern Bangladesh (1971 - Present)',
    range: '1971 CE - Present',
    content: 'Since independence, Bangladesh has rebuilt from war-torn beginnings into one of the fastest-growing economies in South Asia, driven by its garments industry, agriculture, and a resilient, entrepreneurial population — while preserving its rich Bengali cultural identity.',
    highlights: ['One of the world\'s fastest-growing economies', 'Global leader in the ready-made garments industry', 'Major strides in health, education, and disaster resilience'],
  },
];

const quickFacts = [
  { label: 'Independence Declared', value: '26 March 1971' },
  { label: 'Victory Day', value: '16 December 1971' },
  { label: 'Founding Leader', value: 'Bangabandhu Sheikh Mujibur Rahman' },
  { label: 'War Duration', value: '9 Months' },
  { label: 'Language Movement', value: '21 February 1952' },
  { label: 'UNESCO Heritage Sites', value: '3 in Bangladesh' },
];

const eras: Era[] = ['All', 'Ancient', 'Medieval', 'Colonial', 'Modern'];

export default function History() {
  const [activeEra, setActiveEra] = useState<Era>('All');

  const filtered = useMemo(
    () => (activeEra === 'All' ? periods : periods.filter((p) => p.era === activeEra)),
    [activeEra]
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Our Journey</span>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brand-green">History of Bangladesh</h1>
        <p className="text-body max-w-2xl mx-auto leading-relaxed">
          From ancient river civilisations to a hard-won independence, Bangladesh's history spans dynasties, sultanates,
          colonial struggle, and a defining Liberation War that forged a nation of over 160 million people.
        </p>
      </div>

      {/* Quick facts strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
        {quickFacts.map((f) => (
          <div key={f.label} className="bg-surface border border-line/10 rounded-2xl p-4 text-center">
            <p className="text-brand-green font-bold text-sm mb-1">{f.value}</p>
            <p className="text-[11px] text-muted uppercase tracking-wide">{f.label}</p>
          </div>
        ))}
      </div>

      {/* Era filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {eras.map((era) => (
          <button
            key={era}
            onClick={() => setActiveEra(era)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              activeEra === era
                ? 'bg-brand-green text-black border-brand-green'
                : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-brand-green'
            }`}
          >
            {era}
          </button>
        ))}
      </div>

      <div className="space-y-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-brand-green/20">
        {filtered.map((period, i) => (
          <motion.div
            key={period.title}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-base bg-brand-green text-black shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              {period.icon}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface border border-line/5 hover:border-brand-green/30 transition-colors">
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <h3 className="font-bold text-xl text-heading">{period.title}</h3>
                <span className="text-[11px] text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full whitespace-nowrap">{period.range}</span>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-4">{period.content}</p>
              <ul className="space-y-1.5">
                {period.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-xs text-body">
                    <Sparkles size={12} className="text-brand-green shrink-0 mt-0.5" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
