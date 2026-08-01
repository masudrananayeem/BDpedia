import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music4, Utensils, Shirt, PartyPopper, Languages, Palette, Trophy, BookOpen } from 'lucide-react';

const categories = [
  { key:'heritage', title:'Bengali Heritage', icon:<BookOpen size={22}/>, desc:'Bangladesh’s Bengali heritage is rooted in literature, music, river life, village traditions and a long history of artistic expression.' },
  { key:'language', title:'Language & Literature', icon:<Languages size={22}/>, desc:'Bangla is the state language. The Language Movement of 1952 remains a defining part of national identity and is commemorated on 21 February.' },
  { key:'festivals', title:'Festivals', icon:<PartyPopper size={22}/>, desc:'Pahela Baishakh, Eid celebrations, Durga Puja, Nabanna and national days bring communities together with fairs, food, music and colourful processions.' },
  { key:'cuisine', title:'Cuisine', icon:<Utensils size={22}/>, desc:'Rice, fish, bhorta, pitha, biryani, hilsa and sweets are central to Bangladeshi food culture, with distinctive regional flavours across the country.' },
  { key:'music', title:'Music & Dance', icon:<Music4 size={22}/>, desc:'Baul, Bhatiyali, Rabindra Sangeet, Nazrul Geeti and many regional folk traditions reflect the country’s spiritual and riverine character.' },
  { key:'attire', title:'Attire', icon:<Shirt size={22}/>, desc:'Saree, panjabi, lungi and salwar kameez remain familiar forms of dress, while Jamdani and handloom textiles showcase exceptional craftsmanship.' },
  { key:'crafts', title:'Arts & Crafts', icon:<Palette size={22}/>, desc:'Nakshi Kantha, pottery, bamboo and cane work, terracotta, weaving and rickshaw art preserve generations of local creativity.' },
  { key:'sports', title:'Sports', icon:<Trophy size={22}/>, desc:'Cricket and football are hugely popular, while kabaddi, boat racing, boli khela and traditional village games remain important cultural traditions.' },
  { key:'architecture', title:'Folk Architecture', icon:<BookOpen size={22}/>, desc:'Terracotta temples, sultanate mosques, zamindar houses, courtyards and traditional homesteads reveal layers of Bengal’s architectural history.' },
  { key:'theatre', title:'Theatre & Storytelling', icon:<PartyPopper size={22}/>, desc:'Jatra, pala gaan, putul naach and oral storytelling carry myths, social stories and local history from one generation to another.' },
  { key:'riverlife', title:'River Life', icon:<Music4 size={22}/>, desc:'Fishing, boat building, river markets, ferries and monsoon traditions have deeply shaped the everyday culture and imagination of deltaic Bangladesh.' },
];

const cultureStories = [
  { title:'Pahela Baishakh', subtitle:'Bengali New Year', image:'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', detail:'Celebrated on 14 April with colourful processions, fairs, music, traditional dress and seasonal foods.' },
  { title:'Jamdani Weaving', subtitle:'Living textile heritage', image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80', detail:'The delicate motifs of Jamdani are handwoven by skilled artisans and represent one of Bengal’s most celebrated textile traditions.' },
  { title:'Bengali Cuisine', subtitle:'Flavours of river and delta', image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80', detail:'Rice, fish, vegetables, bhorta, pitha and sweets create a cuisine shaped by seasons, rivers and regional ingredients.' },
  { title:'Baul Music', subtitle:'Songs of the wandering mystics', image:'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80', detail:'Baul songs combine music, poetry and spiritual philosophy and remain one of rural Bengal’s most distinctive folk traditions.' },
  { title:'Nakshi Kantha', subtitle:'Stories stitched by hand', image:'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?auto=format&fit=crop&w=1200&q=80', detail:'Decorative embroidered quilts turn everyday cloth into vivid stories of village life, nature and family memory.' },
  { title:'Nouka Baich', subtitle:'Traditional boat racing', image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', detail:'Boat races animate rivers during festivals and monsoon seasons, combining teamwork, rhythm and intense local competition.' },
  { title:'Indigenous Traditions', subtitle:'Hill and plains communities', image:'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80', detail:'Chakma, Marma, Garo, Santal, Tripura and other communities enrich Bangladesh with distinct languages, textiles, foods and festivals.' },
  { title:'Rickshaw Art', subtitle:'Colour on the move', image:'https://images.unsplash.com/photo-1533639329317-44f38e66c4c5?auto=format&fit=crop&w=1200&q=80', detail:'Bright hand-painted motifs on rickshaws turn everyday transport into a distinctive form of popular urban art.' },
  { title:'Pitha Tradition', subtitle:'Seasonal cakes of Bengal', image:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80', detail:'Bhapa, patishapta, chitoi and many regional pithas are especially associated with winter, harvests and family gatherings.' },
  { title:'Jatra & Folk Theatre', subtitle:'Stories on the village stage', image:'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80', detail:'Open-air folk theatre combines music, dramatic storytelling and social themes in a performance tradition familiar across Bengal.' },
  { title:'Terracotta Heritage', subtitle:'Stories shaped in clay', image:'https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=1200&q=80', detail:'Historic temples and monuments preserve intricate terracotta panels depicting floral forms, daily life and narrative scenes.' },
  { title:'Village Fairs', subtitle:'Mela and community life', image:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', detail:'Seasonal melas bring together handicrafts, food, music, toys, performances and community celebration.' },
];

const ethnicGroups = [
  { name:'Bengali', note:'The majority community, with a shared language and diverse regional traditions.' },
  { name:'Chakma', note:'A major indigenous community of the Chittagong Hill Tracts with distinctive language, textiles and festivals.' },
  { name:'Marma', note:'A Buddhist indigenous community with strong cultural traditions in the Hill Tracts.' },
  { name:'Santal', note:'An indigenous community mainly found in northern and northwestern Bangladesh.' },
  { name:'Garo', note:'A matrilineal indigenous community concentrated around Mymensingh and Netrokona.' },
  { name:'Tripura', note:'An indigenous community of the Chittagong Hill Tracts with its own language and cultural practices.' },
  { name:'Mro', note:'An indigenous community of the Bandarban hills known for distinctive language, dress and cultural traditions.' },
  { name:'Khumi', note:'A smaller indigenous community of the southeastern hill region with its own language and customary practices.' },
  { name:'Manipuri', note:'A community especially associated with the Sylhet region, celebrated for weaving, dance and festival traditions.' },
  { name:'Rakhine', note:'A Buddhist community of the coastal south and southeast with distinctive language, food, textiles and festivals.' },
  { name:'Khasia', note:'An indigenous community of the Sylhet hills, traditionally associated with betel-leaf cultivation and matrilineal social customs.' },
];

export default function Culture() {
  const [active, setActive] = useState<string | null>(null);
  return <div className="max-w-6xl mx-auto px-6 py-12">
    <div className="text-center mb-14"><span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Melting Pot</span><h1 className="text-4xl md:text-5xl font-bold mb-6 text-brand-green">Culture & People</h1><p className="text-body max-w-3xl mx-auto text-lg leading-relaxed">A living mosaic of language, festivals, food, music, crafts and communities — discover the traditions that give Bangladesh its unique identity.</p></div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {[['11','Culture themes'],['12','Visual stories'],['11','Communities'],['6+','Living traditions']].map(([n,label])=><div key={label} className="bg-surface border border-line/10 rounded-2xl p-5 text-center"><div className="text-2xl font-extrabold text-brand-green">{n}</div><div className="text-xs text-muted mt-1">{label}</div></div>)}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
      <div className="bg-surface p-8 rounded-3xl border border-line/10 flex flex-col justify-center"><h2 className="text-3xl font-bold mb-4 text-heading">Bengali Culture</h2><p className="text-muted leading-relaxed">The heart of Bangladesh lies in its Bengali heritage, shaped by the Language Movement, literature, river life, folk traditions and festivals. Alongside it, indigenous communities contribute their own languages, clothing, music, food and celebrations.</p></div>
      <div className="rounded-3xl overflow-hidden min-h-[300px]"><img src={cultureStories[0].image} alt="Bengali culture" className="w-full h-full object-cover"/></div>
    </div>

    <div className="mb-16"><h2 className="text-2xl font-bold mb-6 text-heading">Culture in Pictures</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{cultureStories.slice(1).map((item)=><article key={item.title} className="bg-surface border border-line/10 rounded-2xl overflow-hidden hover:border-brand-green/30 transition-colors"><div className="h-48 overflow-hidden"><img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"/></div><div className="p-5"><p className="text-xs text-brand-green uppercase tracking-wider mb-1">{item.subtitle}</p><h3 className="text-xl font-bold text-heading mb-2">{item.title}</h3><p className="text-sm text-muted leading-relaxed">{item.detail}</p></div></article>)}</div></div>

    <div className="mb-16"><h2 className="text-2xl font-bold mb-6 text-heading">Explore Bengali Culture</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{categories.map(c=><button key={c.key} onClick={()=>setActive(active===c.key?null:c.key)} className={`text-left p-6 rounded-2xl border transition-all bg-surface ${active===c.key?'border-brand-green/60':'border-line/10 hover:border-brand-green/30'}`}><div className="w-11 h-11 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-4">{c.icon}</div><h3 className="font-bold text-heading mb-1">{c.title}</h3><AnimatePresence>{active===c.key&&<motion.p initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="text-xs text-muted leading-relaxed mt-2 overflow-hidden">{c.desc}</motion.p>}</AnimatePresence>{active!==c.key&&<p className="text-xs text-muted">Tap to read more</p>}</button>)}</div></div>

    <div><h2 className="text-2xl font-bold mb-6 text-heading">Ethnic & Indigenous Communities</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{ethnicGroups.map(g=><div key={g.name} className="bg-surface border border-line/10 rounded-2xl p-5 hover:border-brand-green/30 transition-colors"><h3 className="font-bold text-heading mb-1">{g.name}</h3><p className="text-xs text-muted leading-relaxed">{g.note}</p></div>)}</div></div>
  </div>;
}
