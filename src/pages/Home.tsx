import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Map, Mountain, Waves, Landmark, Users, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const sections = ['hero', 'about', 'facts', 'featured', 'video'];

  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.scrollY;
      let newActiveSection = sections[0];
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element && pageYOffset >= element.offsetTop - 300) {
          newActiveSection = section;
        }
      });
      setActiveSection(newActiveSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  const statsIcons = [
    { icon: <Map className="text-brand-green" size={28} />, count: "64", label: "Districts" },
    { icon: <Mountain className="text-brand-green" size={28} />, count: "600+", label: "Tourist Places" },
    { icon: <Waves className="text-brand-green" size={28} />, count: "700+", label: "Rivers" },
    { icon: <Landmark className="text-brand-green" size={28} />, count: "500+", label: "Historical Places" },
    { icon: <Users className="text-brand-green" size={28} />, count: "160M+", label: "Population" },
    { icon: <Leaf className="text-brand-green" size={28} />, count: "Natural", label: "Beauty" },
  ];

  return (
    <div className="relative bg-base">
      {/* Scroll Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {sections.map((sec) => (
          <button 
            key={sec} onClick={() => scrollTo(sec)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === sec ? 'bg-brand-green scale-125 shadow-[0_0_10px_#8EE656]' : 'border-[1.5px] border-line/70 hover:bg-line/50'}`}
            title={`Scroll to ${sec}`}
          />
        ))}
      </div>

      <section id="hero" className="relative min-h-[100svh] flex flex-col px-6 lg:px-24 pt-32 pb-10 lg:pb-14 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: "url('/images/hero/bg-image.jpg')" }}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#051005] via-transparent to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-extrabold text-white leading-[1.05] tracking-tight">
              Discover <br /> The Beauty of <br /> <span className="text-brand-green">Bangladesh</span>
            </h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-gray-200/90 max-w-lg leading-relaxed font-medium">
              From the mighty rivers to the green hills,<br />from rich history to diverse culture—<br />explore everything that makes Bangladesh unique.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="mt-8 md:mt-10 flex flex-wrap items-center gap-5">
              <Link to="/explore" className="group flex items-center gap-2 bg-brand-dark hover:bg-green-500 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                Explore Bangladesh <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1 }} className="relative z-10 mt-10 md:mt-14">
          <div className="bg-[#0f2110]/40 backdrop-blur-xl border border-line/10 rounded-[2rem] p-5 sm:p-6 lg:px-10 lg:py-8 shadow-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4 lg:divide-x divide-line/10">
              {statsIcons.map((stat, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} className="flex flex-col items-center justify-center text-center px-2 sm:px-4 group cursor-default">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="p-2 bg-line/5 rounded-lg group-hover:bg-line/10 transition-colors">{stat.icon}</div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">{stat.count}</h3>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="about" className="py-32 px-6 lg:px-24 bg-base">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-heading">Discover the Essence</h2>
            <div className="w-20 h-1 bg-brand-green mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Tourist Places", desc: "Explore 50+ destinations.", icon: <Mountain size={40} className="text-brand-green" />, link: "/explore" },
              { title: "64 Districts", desc: "Insights into every district.", icon: <Map size={40} className="text-brand-green" />, link: "/districts" },
              { title: "Rich History", desc: "From ancient to modern eras.", icon: <Landmark size={40} className="text-brand-green" />, link: "/history" },
              { title: "Culture", desc: "A melting pot of diversity.", icon: <Users size={40} className="text-brand-green" />, link: "/culture" }
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-surface p-8 rounded-2xl border border-line/5 hover:border-brand-green/30 transition-colors group">
                <div className="mb-6 bg-line/5 w-16 h-16 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-heading">{item.title}</h3>
                <p className="text-muted mb-6">{item.desc}</p>
                <Link to={item.link} className="text-brand-green text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">Learn more <ArrowRight size={14} /></Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="facts" className="py-32 px-6 lg:px-24 bg-base">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Know Bangladesh</span>
            <h2 className="text-4xl font-bold mb-4 text-heading">Quick Facts About Bangladesh</h2>
            <div className="w-20 h-1 bg-brand-green mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-5">
              {[
                { label: "Capital", value: "Dhaka" },
                { label: "Official Language", value: "Bangla" },
                { label: "Currency", value: "Bangladeshi Taka (৳)" },
                { label: "Independence Day", value: "26 March, 1971" },
                { label: "Victory Day", value: "16 December, 1971" },
                { label: "Area", value: "147,570 km²" },
                { label: "National Flower", value: "Water Lily (Shapla)" },
                { label: "National Fruit", value: "Jackfruit (Kathal)" },
                { label: "National Sport", value: "Kabaddi" },
                { label: "Longest Beach", value: "Cox's Bazar" },
                { label: "Main Religion", value: "Islam (majority)" },
                { label: "Time Zone", value: "GMT +6 (BST)" },
              ].map((fact) => (
                <div key={fact.label} className="bg-surface border border-line/10 rounded-2xl p-5 hover:border-brand-green/30 transition-colors">
                  <p className="text-[11px] uppercase tracking-wide text-muted mb-1">{fact.label}</p>
                  <p className="font-bold text-heading">{fact.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-brand-green/10 border border-brand-green/30 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-brand-green">Why Visit Bangladesh?</h3>
              <ul className="space-y-3 text-sm text-body leading-relaxed">
                <li>🌊 Home to the world's longest natural sea beach, Cox's Bazar.</li>
                <li>🌳 The Sundarbans — the largest mangrove forest and home of the Royal Bengal Tiger.</li>
                <li>🏞️ Endless tea gardens across Sylhet and the hill tracts.</li>
                <li>🕌 Centuries of Mughal, Sultanate, and colonial heritage sites.</li>
                <li>🍛 A vibrant food culture built around rice, fish, and legendary sweets.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="py-32 px-6 lg:px-24 bg-surface">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
             <motion.img initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} src="/images/hero/featured.jpg" alt="Featured" className="w-full rounded-2xl shadow-2xl border border-line/10 aspect-video object-cover bg-surfacealt" />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6 text-heading">A Land of Vibrant Culture & Diversity</h2>
            <p className="text-body mb-6 text-lg leading-relaxed">
              Bangladesh is home to numerous ethnic groups, each with their own unique traditions, languages, and festivals. From the bustling streets of Dhaka to the peaceful hills of Bandarban, every corner tells a story.
            </p>
            <Link to="/culture" className="inline-block border border-brand-green text-brand-green hover:bg-brand-green hover:text-black px-8 py-3 rounded-full font-semibold transition-colors">
              Read About Culture
            </Link>
          </div>
        </div>
      </section>

      <section id="video" className="relative h-[70vh] md:h-[85vh] overflow-hidden flex items-center justify-center">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/bangladesh-nature.mp4"
          poster="/images/hero/bg-image.jpg"
          autoPlay loop muted playsInline
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-black/40" />

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-4">Feel It Yourself</span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">Nature in Motion</h2>
          <p className="text-gray-200 text-lg mb-10 leading-relaxed">
            Rolling tea gardens, winding rivers and endless green &mdash; watch the natural beauty of Bangladesh come alive.
          </p>
          <Link to="/explore" className="inline-flex items-center gap-2 bg-brand-green text-black px-8 py-4 rounded-full font-semibold hover:bg-white transition-colors">
            <Play size={18} fill="currentColor" /> Start Exploring
          </Link>
        </motion.div>
      </section>
    </div>
  );
}