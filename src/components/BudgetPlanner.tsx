import { useState, FormEvent } from 'react';
import { Wallet, MapPinned, Loader2, Bus, BedDouble, Utensils, CalendarDays } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import districtsIndex from '../data/json/districts/index.json';

type Recommendation = {
  district: string;
  slug: string;
  division: string;
  coverImage: string;
  isOwnDistrict?: boolean;
  maxDays: number;
  dailyCostEstimate: number;
  transportCostEstimate: number;
  totalEstimatedCost: number;
  howToReach?: string;
  whereToStay?: string;
  whatToEat?: string;
  bestTimeToVisit?: string;
  topPlaces: { title: string; slug: string; coverImage: string; category: string }[];
};

const districtNames: string[] = Array.isArray(districtsIndex)
  ? (districtsIndex as any[]).map((d) => d.name || d.id).filter(Boolean)
  : [];

// Feature #8: traveller tells us their current district + total budget, and
// we suggest which other district(s) they can afford, how many days they
// could stay, and the essentials (transport / stay / food) for that trip.
export default function BudgetPlanner() {
  const { user } = useAuth();
  const [origin, setOrigin] = useState(user?.district || '');
  const [budget, setBudget] = useState('');
  const [tier, setTier] = useState<'low' | 'mid'>('low');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Recommendation[] | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);
    if (!origin) return setError('Please select your district');
    if (!budget || Number(budget) <= 0) return setError('Please enter a valid budget');

    setLoading(true);
    try {
      const data = await api.post('/guide/suggest', { originDistrict: origin, budget: Number(budget), tier });
      setResults(data.recommendations);
    } catch (err: any) {
      setError(err.message || 'Failed to load recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="budget-planner" className="bg-surface rounded-2xl border border-line/10 p-6 md:p-8 scroll-mt-28">
      <div className="flex items-center gap-2 mb-2">
        <Wallet className="text-brand-green" />
        <h2 className="text-2xl font-bold text-heading">Budget Travel Planner</h2>
      </div>
      <p className="text-sm text-body mb-6">Enter your home district and total budget, and we'll show you which districts you can afford and for how many days.</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="text-xs text-muted mb-1 block flex items-center gap-1"><MapPinned size={12} /> Your District</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full bg-base border border-line/15 rounded-xl px-3 py-3 outline-none text-heading text-sm">
            <option value="">Select</option>
            {districtNames.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Total Budget (৳)</label>
          <input
            type="number"
            min={0}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full bg-base border border-line/15 rounded-xl px-3 py-3 outline-none text-heading text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Hotel Tier</label>
          <select value={tier} onChange={(e) => setTier(e.target.value as 'low' | 'mid')} className="w-full bg-base border border-line/15 rounded-xl px-3 py-3 outline-none text-heading text-sm">
            <option value="low">Budget / Backpacker</option>
            <option value="mid">Mid-range</option>
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-brand-green text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Wallet size={18} />} {loading ? 'Searching...' : 'Suggest'}
          </button>
        </div>
      </form>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {results && results.length === 0 && (
        <p className="text-sm text-muted text-center py-6">No district matched an itinerary within this budget. Try increasing your budget.</p>
      )}

      {results && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.map((r) => (
            <div key={r.slug} className="bg-base rounded-2xl border border-line/10 overflow-hidden hover:border-brand-green/40 transition-all">
              {r.coverImage && <img src={r.coverImage} alt={r.district} className="w-full h-36 object-cover" />}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h3 className="font-bold text-heading text-lg flex items-center gap-2">
                    {r.district}
                    {r.isOwnDistrict && (
                      <span className="text-[10px] font-semibold bg-brand-green text-black px-2 py-0.5 rounded-full">Your District</span>
                    )}
                  </h3>
                  <span className="flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full shrink-0">
                    <CalendarDays size={12} /> {r.maxDays} days
                  </span>
                </div>
                <p className="text-xs text-muted mb-3">{r.division} Division &middot; Total estimate &#2547;{r.totalEstimatedCost.toLocaleString()}</p>

                <div className="grid grid-cols-3 gap-2 text-[11px] mb-3">
                  <div className="bg-surface rounded-lg p-2 text-center">
                    <Bus size={14} className="mx-auto text-brand-green mb-1" />
                    &#2547;{r.transportCostEstimate.toLocaleString()}<br /><span className="text-muted">transport</span>
                  </div>
                  <div className="bg-surface rounded-lg p-2 text-center">
                    <BedDouble size={14} className="mx-auto text-brand-green mb-1" />
                    &#2547;{r.dailyCostEstimate.toLocaleString()}<br /><span className="text-muted">per day</span>
                  </div>
                  <div className="bg-surface rounded-lg p-2 text-center">
                    <Utensils size={14} className="mx-auto text-brand-green mb-1" />
                    <span className="line-clamp-1">{r.whatToEat || 'Local food'}</span>
                  </div>
                </div>

                {r.topPlaces?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {r.topPlaces.slice(0, 4).map((p) => (
                      <span key={p.slug} className="text-[10px] bg-line/5 border border-line/10 text-body px-2 py-1 rounded-full">{p.title}</span>
                    ))}
                  </div>
                )}
                {r.howToReach && <p className="text-xs text-muted line-clamp-2">{r.howToReach}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
