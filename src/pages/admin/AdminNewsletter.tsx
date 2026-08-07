import { useEffect, useState } from 'react';
import { Users, Trash2, Loader2, Download } from 'lucide-react';
import api from '../../lib/api';

type Subscriber = { _id: string; email: string; createdAt: string };

export default function AdminNewsletter() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setSubs(await api.get('/newsletter'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    await api.del(`/newsletter/${id}`);
    setSubs((prev) => prev.filter((s) => s._id !== id));
  };

  const downloadCsv = () => {
    const csv = 'email,subscribed_at\n' + subs.map((s) => `${s.email},${s.createdAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bdpedia-newsletter-subscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-heading flex items-center gap-2">
          <Users size={22} className="text-brand-green" /> Newsletter Subscribers
          <span className="text-xs bg-line/10 text-body font-semibold px-2.5 py-1 rounded-full">{subs.length}</span>
        </h2>
        {subs.length > 0 && (
          <button onClick={downloadCsv} className="flex items-center gap-2 text-sm bg-line/5 hover:bg-line/10 text-body px-4 py-2 rounded-xl">
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-muted py-10 justify-center"><Loader2 className="animate-spin" size={18} /> Loading...</div>
      ) : subs.length === 0 ? (
        <p className="text-center text-muted py-10">No subscribers yet.</p>
      ) : (
        <div className="bg-surface border border-line/10 rounded-2xl overflow-hidden">
          {subs.map((s) => (
            <div key={s._id} className="flex items-center justify-between px-5 py-3 border-b border-line/5 last:border-b-0 hover:bg-line/5">
              <div>
                <p className="text-sm text-heading font-medium">{s.email}</p>
                <p className="text-[11px] text-muted">{new Date(s.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => remove(s._id)} className="text-muted hover:text-red-400">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
