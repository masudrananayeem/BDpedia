import fbGroups from '../data/json/others/fbGroups.json';
import vloggers from '../data/json/others/vloggers.json';
import { Youtube, Users, Building, Phone } from 'lucide-react';

export default function TravelGuide() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center">Ultimate Travel Guide</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="bg-[#111] p-6 rounded-2xl border border-white/10 mb-8">
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-2"><Users className="text-brand-green"/> FB Communities</h2>
            <ul className="space-y-4">
              {fbGroups.map((group:any, i:any) => (
                <li key={i}><a href={group.link} target="_blank" rel="noreferrer" className="block p-4 bg-white/5 rounded-xl hover:bg-white/10"><h3 className="font-bold text-white mb-1">{group.name}</h3><p className="text-xs text-brand-green">{group.members} Members</p></a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4 flex items-center gap-2"><Youtube className="text-brand-green"/> Top Vloggers</h2>
            <div className="flex flex-col gap-3">
              {vloggers.map((v:any, i:any) => (
                <a key={i} href={v.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10"><span className="font-medium text-gray-200">{v.name}</span><Youtube size={16} className="text-red-500" /></a>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-brand-green/10 p-6 rounded-2xl border border-brand-green/30">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-brand-green"><Building /> Accommodation</h2>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">Accommodations range from 5-star hotels in Dhaka and Cox's Bazar to eco-resorts in Sylhet and Sajek.</p>
            <div className="space-y-4">
               <div className="bg-black/40 p-4 rounded-lg"><h4 className="font-bold text-white mb-1">Cox's Bazar</h4><p className="text-xs text-gray-400">Ocean Paradise, Sayeman Beach Resort, Seagull Hotel</p></div>
               <div className="bg-black/40 p-4 rounded-lg"><h4 className="font-bold text-white mb-1">Emergency Tourist Police</h4><p className="text-sm text-red-400 font-bold flex items-center gap-2 mt-1"><Phone size={14}/> 999 or +8801320222222</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}