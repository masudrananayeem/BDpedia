import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchGallery, SimpleItem } from '../lib/contentApi';

const PAGE_SIZE = 24;
const TOTAL_IMAGES = 72;

export default function Gallery() {
  const [page, setPage] = useState(1);
  const [adminItems, setAdminItems] = useState<SimpleItem[]>([]);

  useEffect(() => {
    fetchGallery().then(setAdminItems).catch(() => setAdminItems([]));
  }, []);

  const images = useMemo(() => Array.from({ length: TOTAL_IMAGES }, (_, i) => ({
    src: `https://picsum.photos/seed/bdpedia-bangladesh-${i + 1}/900/650`,
    number: i + 1,
  })), []);
  const totalPages = Math.ceil(images.length / PAGE_SIZE);
  const visible = images.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goTo = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-heading">Photo Gallery</h1>
        <p className="text-muted">Explore Bangladesh through a clean 3-column gallery — 24 photos per page.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {visible.map(({ src, number }) => (
          <div key={number} className="relative group rounded-2xl overflow-hidden bg-surfacealt aspect-[4/3] border border-line/10">
            <img src={src} alt={`Bangladesh gallery ${number}`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 text-white text-sm font-semibold">Photo {number}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 mt-12">
        <button onClick={() => goTo(page - 1)} disabled={page === 1} className="p-2.5 rounded-full border border-line/15 text-body disabled:opacity-30 hover:border-brand-green"><ChevronLeft size={18}/></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => goTo(p)} className={`w-10 h-10 rounded-full text-sm font-semibold border ${page === p ? 'bg-brand-green text-black border-brand-green' : 'border-line/15 text-body hover:border-brand-green'}`}>{p}</button>
        ))}
        <button onClick={() => goTo(page + 1)} disabled={page === totalPages} className="p-2.5 rounded-full border border-line/15 text-body disabled:opacity-30 hover:border-brand-green"><ChevronRight size={18}/></button>
      </div>
      <p className="text-center text-xs text-muted mt-4">Page {page} of {totalPages} · Showing {visible.length} photos</p>

      {adminItems.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-heading">Featured by BDpedia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {adminItems.map((item) => (
              <div key={item._id} className="relative group rounded-2xl overflow-hidden bg-surfacealt aspect-[4/3] border border-line/10">
                {item.coverImage && <img src={item.coverImage} alt={item.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-white text-sm font-semibold">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
