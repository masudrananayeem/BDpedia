import { useMemo, useState } from 'react';
import fbGroups from '../data/json/others/fbGroups.json';
import vloggers from '../data/json/others/vloggers.json';
import hotels from '../data/json/others/hotels.json';
import { Youtube, Users, Building, Phone, Star, BedDouble, Wifi, CalendarClock, Bus, Wallet, ShieldCheck, Backpack, Landmark as LandmarkIcon } from 'lucide-react';

type Hotel = {
  id: string; name: string; district: string; category: string;
  priceRange: string; rating: number; amenities: string[]; description: string;
};
const ALL_HOTELS = hotels as Hotel[];
const HOTEL_DISTRICTS = Array.from(new Set(ALL_HOTELS.map((h) => h.district)));

const planningCards = [
  {
    icon: <CalendarClock className="text-brand-green" />,
    title: 'Best Time to Visit',
    body: 'October to March offers cool, dry weather — ideal for Cox\'s Bazar, the Sundarbans, and hill tracts. Monsoon (June-September) is lush and green, perfect for waterfalls in Sylhet, but travel can be slower.',
  },
  {
    icon: <Bus className="text-brand-green" />,
    title: 'Getting Around',
    body: 'Intercity trains and AC buses connect major districts affordably. Domestic flights link Dhaka with Cox\'s Bazar, Sylhet, Jashore, and Saidpur. Rickshaws and CNG auto-rickshaws are best for short city trips.',
  },
  {
    icon: <Wallet className="text-brand-green" />,
    title: 'Visa & Money',
    body: 'Most nationalities can apply for a Bangladesh e-Visa or visa-on-arrival. The local currency is the Bangladeshi Taka (৳); cards are accepted in cities, but carry cash for rural areas and local markets.',
  },
  {
    icon: <Backpack className="text-brand-green" />,
    title: 'Travel Essentials',
    body: 'Pack light, breathable clothing, a rain jacket in monsoon season, modest attire for religious sites, and a power bank — mobile data (Grameenphone, Robi, Banglalink) is cheap and widely available.',
  },
  {
    icon: <ShieldCheck className="text-brand-green" />,
    title: 'Safety Tips',
    body: 'Bangladesh is generally safe for travellers. Stick to bottled or filtered water, keep copies of your documents, use registered transport at night, and check local advisories before visiting border areas.',
  },
  {
    icon: <LandmarkIcon className="text-brand-green" />,
    title: 'Local Etiquette',
    body: 'A warm "Assalamu Alaikum" or "Nomoshkar" goes a long way. Remove shoes before entering homes and religious sites, and ask permission before photographing people.',
  },
];

export default function TravelGuide() {
  const [hotelDistrict, setHotelDistrict] = useState('All');

  const filteredHotels = useMemo(
    () => (hotelDistrict === 'All' ? ALL_HOTELS : ALL_HOTELS.filter((h) => h.district === hotelDistrict)),
    [hotelDistrict]
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Plan Your Trip</span>
        <h1 className="text-4xl md:text-5xl font-extrabold">Ultimate Travel Guide</h1>
        <p className="text-body max-w-2xl mx-auto mt-4">Everything you need before you go — timing, transport, budgeting, communities, and where to stay.</p>
      </div>

      {/* Trip planning essentials */}
      <div id="essentials" className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-heading">Trip Essentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {planningCards.map((card) => (
            <div key={card.title} className="bg-surface p-6 rounded-2xl border border-line/10 hover:border-brand-green/30 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4">{card.icon}</div>
              <h3 className="font-bold text-heading mb-2">{card.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Communities & Vloggers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-surface p-6 rounded-2xl border border-line/10">
          <h2 className="text-2xl font-bold mb-6 border-b border-line/10 pb-4 flex items-center gap-2 text-heading"><Users className="text-brand-green"/> FB Travel Communities</h2>
          <ul className="space-y-4">
            {fbGroups.map((group: any, i: any) => (
              <li key={i}>
                <a href={group.link} target="_blank" rel="noreferrer" className="block p-4 bg-line/5 rounded-xl hover:bg-line/10">
                  <h3 className="font-bold text-heading mb-1">{group.name}</h3>
                  <p className="text-xs text-brand-green">{group.members} Members</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-line/10">
          <h2 className="text-2xl font-bold mb-6 border-b border-line/10 pb-4 flex items-center gap-2 text-heading"><Youtube className="text-brand-green"/> Top Travel Vloggers</h2>
          <div className="flex flex-col gap-3">
            {vloggers.map((v: any, i: any) => (
              <a key={i} href={v.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-line/5 rounded-lg hover:bg-line/10">
                <span className="font-medium text-body">{v.name}</span><Youtube size={16} className="text-red-500" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Hotels & Stay */}
      <div id="hotels" className="mb-16 scroll-mt-28">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-heading"><BedDouble className="text-brand-green" /> Hotels &amp; Stay</h2>
          <div className="flex flex-wrap gap-2">
            {['All', ...HOTEL_DISTRICTS].map((d) => (
              <button
                key={d}
                onClick={() => setHotelDistrict(d)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  hotelDistrict === d
                    ? 'bg-brand-green text-black border-brand-green'
                    : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-heading'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-surface rounded-2xl border border-line/5 hover:border-brand-green/40 transition-all p-6 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-heading text-lg leading-tight">{hotel.name}</h3>
                <span className="flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                  <Star size={12} fill="currentColor" /> {hotel.rating}
                </span>
              </div>
              <p className="text-xs text-muted mb-3">{hotel.district} &middot; {hotel.category} &middot; <span className="text-brand-green font-semibold">{hotel.priceRange}</span></p>
              <p className="text-sm text-muted mb-4 flex-grow">{hotel.description}</p>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((a) => (
                  <span key={a} className="text-[11px] bg-line/5 border border-line/10 text-body px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Wifi size={10} /> {a}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {filteredHotels.length === 0 && (
            <p className="col-span-full text-center text-muted py-10">No listed hotels for this district yet.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
        <div className="bg-brand-green/10 p-6 rounded-2xl border border-brand-green/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-brand-green"><Building /> Accommodation Tips</h2>
          <p className="text-sm text-body mb-6 leading-relaxed">Accommodations range from 5-star hotels in Dhaka and Cox's Bazar to eco-resorts in Sylhet and Sajek.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-black/40 p-4 rounded-lg"><h4 className="font-bold text-white mb-1">Cox's Bazar</h4><p className="text-xs text-gray-300">Ocean Paradise, Sayeman Beach Resort, Seagull Hotel</p></div>
             <div className="bg-black/40 p-4 rounded-lg"><h4 className="font-bold text-white mb-1">Emergency Tourist Police</h4><p className="text-sm text-red-400 font-bold flex items-center gap-2 mt-1"><Phone size={14}/> 999 or +8801320222222</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
