import { useEffect, useState, FormEvent } from 'react';
import { Plus, Pencil, Trash2, X, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import type { SectionConfig } from './sectionConfigs';

type Item = Record<string, any> & { _id: string };
type ExtraPair = { key: string; value: string };

function getNested(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
function setNested(obj: any, path: string, value: any) {
  const keys = path.split('.');
  const last = keys.pop()!;
  let cur = obj;
  for (const k of keys) {
    if (!cur[k]) cur[k] = {};
    cur = cur[k];
  }
  cur[last] = value;
}

export default function AdminSectionManager({ config }: { config: SectionConfig }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [extraPairs, setExtraPairs] = useState<ExtraPair[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.get(config.apiPath);
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiPath]);

  const openCreate = () => {
    setEditing(null);
    const initial: Record<string, any> = {};
    config.fields.forEach((f) => setNested(initial, f.name, f.type === 'boolean' ? false : ''));
    setFormValues(initial);
    setExtraPairs([]);
    setCoverFile(null);
    setImageFiles(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (item: Item) => {
    setEditing(item);
    const initial: Record<string, any> = {};
    config.fields.forEach((f) => {
      const raw = getNested(item, f.name);
      // 'tags' fields are stored as an array in the DB but edited as a
      // comma-separated string in the form.
      const value =
        f.type === 'tags' && Array.isArray(raw) ? raw.join(', ')
        : f.type === 'boolean' ? Boolean(raw)
        : raw ?? '';
      setNested(initial, f.name, value);
    });
    setFormValues(initial);
    const extras = item.extra && typeof item.extra === 'object' ? Object.entries(item.extra).map(([key, value]) => ({ key, value: String(value) })) : [];
    setExtraPairs(extras);
    setCoverFile(null);
    setImageFiles(null);
    setError('');
    setShowForm(true);
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormValues((prev) => {
      const next = { ...prev };
      setNested(next, name, value);
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const form = new FormData();
      config.fields.forEach((f) => {
        const val = getNested(formValues, f.name);
        if (f.name.includes('.')) return; // nested (e.g. budget.*) handled below as JSON blob
        if (f.type === 'tags') {
          // Comma-separated string -> JSON array string, which is what the
          // backend (crudFactory) expects for array fields like River.districts.
          const arr = String(val ?? '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          form.append(f.name, JSON.stringify(arr));
          return;
        }
        form.append(f.name, val ?? '');
      });
      // collect any nested groups (e.g. "budget") into one JSON field
      const nestedGroups = new Set(config.fields.filter((f) => f.name.includes('.')).map((f) => f.name.split('.')[0]));
      nestedGroups.forEach((group) => {
        form.append(group, JSON.stringify(formValues[group] || {}));
      });

      const extraObj: Record<string, string> = {};
      extraPairs.forEach((p) => {
        if (p.key.trim()) extraObj[p.key.trim()] = p.value;
      });
      form.append('extra', JSON.stringify(extraObj));

      if (coverFile) form.append('coverImage', coverFile);
      if (imageFiles) Array.from(imageFiles).forEach((f) => form.append('images', f));

      if (editing) {
        await api.put(`${config.apiPath}/${editing._id}`, form);
      } else {
        await api.post(config.apiPath, form);
      }
      setShowForm(false);
      await load();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Item) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await api.del(`${config.apiPath}/${item._id}`);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-heading">{config.label}</h2>
        <button onClick={openCreate} className="flex items-center gap-2 bg-brand-green text-black font-semibold px-4 py-2.5 rounded-xl hover:brightness-110">
          <Plus size={18} /> New {config.label}
        </button>
      </div>

      {error && !showForm && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-muted py-10 justify-center"><Loader2 className="animate-spin" size={18} /> Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id} className="bg-surface border border-line/10 rounded-2xl overflow-hidden">
              {item.coverImage ? (
                <img src={item.coverImage} alt={item.title} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-base flex items-center justify-center text-muted"><ImageIcon size={28} /></div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-heading mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-muted line-clamp-2 mb-3">{item.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="flex-1 flex items-center justify-center gap-1 text-xs bg-line/5 hover:bg-line/10 text-body py-2 rounded-lg">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(item)} className="flex-1 flex items-center justify-center gap-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="col-span-full text-center text-muted py-10">No {config.label} items added yet.</p>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onMouseDown={() => setShowForm(false)}>
          <div onMouseDown={(e) => e.stopPropagation()} className="bg-surface border border-line/10 rounded-2xl max-w-2xl w-full my-10 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-line/10">
              <h3 className="text-xl font-bold text-heading">{editing ? `Edit: ${editing.title}` : `New ${config.label}`}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-heading"><X size={22} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {config.fields.map((f) => (
                <div key={f.name}>
                  {f.type === 'boolean' ? (
                    <label className="flex items-center gap-2 text-sm text-heading cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(getNested(formValues, f.name))}
                        onChange={(e) => handleFieldChange(f.name, e.target.checked)}
                        className="w-4 h-4 accent-brand-green"
                      />
                      {f.label}
                    </label>
                  ) : (
                    <>
                      <label className="text-xs text-muted mb-1 block">{f.label}</label>
                      {f.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={getNested(formValues, f.name) ?? ''}
                          onChange={(e) => handleFieldChange(f.name, e.target.value)}
                          className="w-full bg-base border border-line/15 rounded-xl px-3 py-2.5 outline-none text-heading text-sm"
                        />
                      ) : (
                        <input
                          type={f.type === 'number' ? 'number' : 'text'}
                          value={getNested(formValues, f.name) ?? ''}
                          onChange={(e) => handleFieldChange(f.name, e.target.value)}
                          placeholder={f.type === 'tags' ? 'e.g. Dhaka, Munshiganj, Chandpur' : undefined}
                          className="w-full bg-base border border-line/15 rounded-xl px-3 py-2.5 outline-none text-heading text-sm"
                        />
                      )}
                    </>
                  )}
                </div>
              ))}

              <div>
                <label className="text-xs text-muted mb-1 block">Cover Image {editing?.coverImage ? '(replace)' : ''}</label>
                <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="text-sm text-body" />
                <p className="text-[11px] text-muted mt-1">JPG/JPEG/PNG uploads are automatically converted to WebP.</p>
              </div>

              {config.hasMultipleImages && (
                <div>
                  <label className="text-xs text-muted mb-1 block">Additional Images (gallery)</label>
                  <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(e.target.files)} className="text-sm text-body" />
                  {editing?.images?.length > 0 && (
                    <p className="text-[11px] text-muted mt-1">Already {editing.images.length}টা image আছে — নতুন gুলো যোগ হবে।</p>
                  )}
                </div>
              )}

              <div className="border-t border-line/10 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-muted">Custom / New Fields (extra)</label>
                  <button type="button" onClick={() => setExtraPairs((p) => [...p, { key: '', value: '' }])} className="text-xs text-brand-green flex items-center gap-1">
                    <Plus size={12} /> Add field
                  </button>
                </div>
                {extraPairs.map((pair, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      placeholder="Field name"
                      value={pair.key}
                      onChange={(e) => setExtraPairs((p) => p.map((x, i) => (i === idx ? { ...x, key: e.target.value } : x)))}
                      className="flex-1 bg-base border border-line/15 rounded-lg px-3 py-2 text-xs outline-none text-heading"
                    />
                    <input
                      placeholder="Value"
                      value={pair.value}
                      onChange={(e) => setExtraPairs((p) => p.map((x, i) => (i === idx ? { ...x, value: e.target.value } : x)))}
                      className="flex-1 bg-base border border-line/15 rounded-lg px-3 py-2 text-xs outline-none text-heading"
                    />
                    <button type="button" onClick={() => setExtraPairs((p) => p.filter((_, i) => i !== idx))} className="text-red-400 px-2"><X size={16} /></button>
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-brand-green text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all disabled:opacity-60">
                <Save size={18} /> {saving ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
