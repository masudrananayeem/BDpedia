import { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import api from '../../lib/api';

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get('/contact');
      setMessages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (id: string) => {
    const data = await api.patch(`/contact/${id}/read`);
    setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: data.read } : m)));
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await api.del(`/contact/${id}`);
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-heading flex items-center gap-2">
          <Mail size={22} className="text-brand-green" /> Contact Messages
          {unreadCount > 0 && (
            <span className="text-xs bg-brand-green text-black font-bold px-2.5 py-1 rounded-full">{unreadCount} unread</span>
          )}
        </h2>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-muted py-10 justify-center"><Loader2 className="animate-spin" size={18} /> Loading...</div>
      ) : messages.length === 0 ? (
        <p className="text-center text-muted py-10">No messages received yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m._id}
              className={`bg-surface border rounded-2xl p-5 ${m.read ? 'border-line/10' : 'border-brand-green/40'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-heading">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-xs text-brand-green hover:underline">{m.email}</a>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleRead(m._id)} title={m.read ? 'Mark as unread' : 'Mark as read'} className="text-muted hover:text-brand-green">
                    {m.read ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <button onClick={() => remove(m._id)} title="Delete" className="text-muted hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-body whitespace-pre-wrap">{m.message}</p>
              <p className="text-[11px] text-muted mt-3">{new Date(m.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
