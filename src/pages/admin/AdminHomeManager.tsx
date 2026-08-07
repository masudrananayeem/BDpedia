import { useEffect, useState, FormEvent } from 'react';
import { Video, ImagePlus, Trash2, Save, Loader2, Star, Eye } from 'lucide-react';
import api from '../../lib/api';

export default function AdminHomeManager() {
  const [home, setHome] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [captionDrafts, setCaptionDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const data = await api.get('/home');
    setHome(data);
    setHeadline(data.headline || '');
    setSubheadline(data.subheadline || '');
    const drafts: Record<string, string> = {};
    (data.heroImages || []).forEach((img: any) => { drafts[img._id] = img.caption || ''; });
    setCaptionDrafts(drafts);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveText = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = await api.put('/home', { headline, subheadline });
      setHome(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return;
    setUploadingVideo(true);
    setError('');
    try {
      const form = new FormData();
      form.append('video', videoFile);
      const data = await api.put('/home/video', form);
      setHome(data);
      setVideoFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const uploadImages = async () => {
    if (!imageFiles?.length) return;
    setUploadingImages(true);
    setError('');
    try {
      const form = new FormData();
      Array.from(imageFiles).forEach((f) => form.append('images', f));
      const data = await api.post('/home/images', form);
      setHome(data);
      setImageFiles(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImages(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    const data = await api.del(`/home/images/${imageId}`);
    setHome(data);
  };

  const setActive = async (imageId: string) => {
    const data = await api.patch(`/home/images/${imageId}/activate`);
    setHome(data);
  };

  const saveCaption = async (imageId: string) => {
    const data = await api.put(`/home/images/${imageId}/caption`, { caption: captionDrafts[imageId] || '' });
    setHome(data);
  };

  if (loading) return <div className="flex items-center gap-2 text-muted py-10 justify-center"><Loader2 className="animate-spin" size={18} /> Loading...</div>;

  const activeImage = home?.heroImages?.[0]?.url;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-heading">Home Page</h2>

      {/* Live preview so admin can see exactly what visitors will see */}
      <div className="bg-surface border border-line/10 rounded-2xl p-6">
        <h3 className="font-semibold text-heading mb-3 flex items-center gap-2"><Eye size={18} className="text-brand-green" /> Live Hero Preview</h3>
        <div
          className="relative w-full h-56 rounded-xl overflow-hidden bg-cover bg-center flex items-end p-5"
          style={{ backgroundImage: `url('${activeImage || '/images/hero/bg-image.jpg'}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
          <div className="relative z-10 text-white">
            <p className="text-2xl font-extrabold leading-tight whitespace-pre-line">{headline || 'Discover\nThe Beauty of\nBangladesh'}</p>
            {subheadline && <p className="text-sm opacity-80 mt-1">{subheadline}</p>}
          </div>
        </div>
        <p className="text-[11px] text-muted mt-2">Ei preview-ta approximate — actual site-e font/size ektu alada dekhabe.</p>
      </div>

      <form onSubmit={saveText} className="bg-surface border border-line/10 rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-xs text-muted mb-1 block">Headline (notun line-er jonno Enter chapun)</label>
          <textarea
            rows={3}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder={'Discover\nThe Beauty of\nBangladesh'}
            className="w-full bg-base border border-line/15 rounded-xl px-3 py-2.5 outline-none text-heading text-sm"
          />
          <p className="text-[11px] text-muted mt-1">Khali rakhle default "Discover The Beauty of Bangladesh" dekhabe.</p>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Sub-headline</label>
          <textarea rows={2} value={subheadline} onChange={(e) => setSubheadline(e.target.value)} className="w-full bg-base border border-line/15 rounded-xl px-3 py-2.5 outline-none text-heading text-sm" />
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-brand-green text-black font-semibold px-4 py-2.5 rounded-xl hover:brightness-110 disabled:opacity-60">
          <Save size={16} /> {saving ? 'Saving...' : 'Save text'}
        </button>
      </form>

      <div className="bg-surface border border-line/10 rounded-2xl p-6">
        <h3 className="font-semibold text-heading mb-3 flex items-center gap-2"><Video size={18} className="text-brand-green" /> Hero Video</h3>
        {home?.heroVideo && (
          <video src={home.heroVideo} controls className="w-full max-h-64 rounded-xl mb-4 bg-black" />
        )}
        <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="text-sm text-body mb-3" />
        <button onClick={uploadVideo} disabled={!videoFile || uploadingVideo} className="flex items-center gap-2 bg-brand-green text-black font-semibold px-4 py-2.5 rounded-xl hover:brightness-110 disabled:opacity-60">
          {uploadingVideo ? <Loader2 size={16} className="animate-spin" /> : <Video size={16} />} {uploadingVideo ? 'Uploading...' : 'Upload video'}
        </button>
      </div>

      <div className="bg-surface border border-line/10 rounded-2xl p-6">
        <h3 className="font-semibold text-heading mb-3 flex items-center gap-2"><ImagePlus size={18} className="text-brand-green" /> Hero Images</h3>
        <p className="text-[11px] text-muted mb-4">The first image (marked with a star) is used as the background on the website. Click "Set as background" to make another image active.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {home?.heroImages?.map((img: any, i: number) => (
            <div key={img._id} className={`relative rounded-xl overflow-hidden border-2 ${i === 0 ? 'border-brand-green' : 'border-transparent'}`}>
              <img src={img.url} className="w-full h-32 object-cover" />
              {i === 0 && (
                <span className="absolute top-2 left-2 flex items-center gap-1 bg-brand-green text-black text-[10px] font-bold px-2 py-1 rounded-full">
                  <Star size={10} fill="black" /> ACTIVE
                </span>
              )}
              <button onClick={() => deleteImage(img._id)} className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500/80">
                <Trash2 size={12} />
              </button>
              <div className="bg-base p-2.5 space-y-2">
                <input
                  placeholder="Caption (optional)"
                  value={captionDrafts[img._id] ?? ''}
                  onChange={(e) => setCaptionDrafts((prev) => ({ ...prev, [img._id]: e.target.value }))}
                  onBlur={() => saveCaption(img._id)}
                  className="w-full bg-surface border border-line/15 rounded-lg px-2.5 py-1.5 text-xs outline-none text-heading"
                />
                {i !== 0 && (
                  <button onClick={() => setActive(img._id)} className="w-full flex items-center justify-center gap-1 text-xs bg-line/5 hover:bg-brand-green/15 hover:text-brand-green text-body py-1.5 rounded-lg transition-colors">
                    <Star size={11} /> Set as background
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(e.target.files)} className="text-sm text-body mb-3" />
        <button onClick={uploadImages} disabled={!imageFiles?.length || uploadingImages} className="flex items-center gap-2 bg-brand-green text-black font-semibold px-4 py-2.5 rounded-xl hover:brightness-110 disabled:opacity-60">
          {uploadingImages ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />} {uploadingImages ? 'Uploading...' : 'Add images'}
        </button>
        <p className="text-[11px] text-muted mt-2">JPG/JPEG/PNG uploads are automatically converted to WebP.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
