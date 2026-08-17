import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchGallery, SimpleItem } from '../lib/contentApi';

const PAGE_SIZE = 24;

// --- ছবি এখানে যোগ/পরিবর্তন করো ---
// প্রতিটা লাইন একটা ছবি। নিজের ছবি যোগ করতে চাইলে শুধু ওই লাইনের src বদলে দাও:
//   ১) ছবিটা repo-র public/gallery/ ফোল্ডারে রাখো (যেমন public/gallery/photo1.jpg)
//   ২) src বদলে দাও: '/gallery/photo1.jpg'
//   ৩) caption-এ যা লেখা দেখাতে চাও তা বসাও
// আপাতত সবগুলো placeholder ছবি (picsum.photos) — নিজেরটা বসালেই বদলে যাবে।
const GALLERY_IMAGES: { src: string; number: number; caption: string }[] = [
  { src: '/images/gallery/photo1.jpg', number: 1, caption: 'Photo 1' },
  { src: '/images/gallery/photo2.jpg', number: 2, caption: 'Photo 2' },
  { src: '/images/gallery/photo3.jpg', number: 3, caption: 'Photo 3' },
  { src: '/images/gallery/photo4.jpg', number: 4, caption: 'Photo 4' },
  { src: '/images/gallery/photo5.jpg', number: 5, caption: 'Photo 5' },
  { src: '/images/gallery/photo6.jpg', number: 6, caption: 'Photo 6' },
  { src: '/images/gallery/photo7.jpg', number: 7, caption: 'Photo 7' },
  { src: '/images/gallery/photo8.jpg', number: 8, caption: 'Photo 8' },
  { src: '/images/gallery/photo9.jpg', number: 9, caption: 'Photo 9' },
  { src: '/images/gallery/photo10.jpg', number: 10, caption: 'Photo 10' },
  { src: '/images/gallery/photo11.jpg', number: 11, caption: 'Photo 11' },
  { src: '/images/gallery/photo12.jpg', number: 12, caption: 'Photo 12' },
  { src: '/images/gallery/photo13.jpg', number: 13, caption: 'Photo 13' },
  { src: '/images/gallery/photo14.jpg', number: 14, caption: 'Photo 14' },
  { src: '/images/gallery/photo15.jpg', number: 15, caption: 'Photo 15' },
  { src: '/images/gallery/photo16.jpg', number: 16, caption: 'Photo 16' },
  { src: '/images/gallery/photo17.jpg', number: 17, caption: 'Photo 17' },
  { src: '/images/gallery/photo18.jpg', number: 18, caption: 'Photo 18' },
  { src: '/images/gallery/photo19.jpg', number: 19, caption: 'Photo 19' },
  { src: '/images/gallery/photo20.jpg', number: 20, caption: 'Photo 20' },
  { src: '/images/gallery/photo21.jpg', number: 21, caption: 'Photo 21' },
  { src: '/images/gallery/photo22.jpg', number: 22, caption: 'Photo 22' },
  { src: '/images/gallery/photo23.jpg', number: 23, caption: 'Photo 23' },
  { src: '/images/gallery/photo24.jpg', number: 24, caption: 'Photo 24' },
  { src: '/images/gallery/photo25.jpg', number: 25, caption: 'Photo 25' },
  { src: '/images/gallery/photo26.jpg', number: 26, caption: 'Photo 26' },
  { src: '/images/gallery/photo27.jpg', number: 27, caption: 'Photo 27' },
  { src: '/images/gallery/photo28.jpg', number: 28, caption: 'Photo 28' },
  { src: '/images/gallery/photo29.jpg', number: 29, caption: 'Photo 29' },
  { src: '/images/gallery/photo30.jpg', number: 30, caption: 'Photo 30' },
  { src: '/images/gallery/photo31.jpg', number: 31, caption: 'Photo 31' },
  { src: '/images/gallery/photo32.jpg', number: 32, caption: 'Photo 32' },
  { src: '/images/gallery/photo33.jpg', number: 33, caption: 'Photo 33' },
  { src: '/images/gallery/photo34.jpg', number: 34, caption: 'Photo 34' },
  { src: '/images/gallery/photo35.jpg', number: 35, caption: 'Photo 35' },
  { src: '/images/gallery/photo36.jpg', number: 36, caption: 'Photo 36' },
  { src: '/images/gallery/photo37.jpg', number: 37, caption: 'Photo 37' },
  { src: '/images/gallery/photo38.jpg', number: 38, caption: 'Photo 38' },
  { src: '/images/gallery/photo39.jpg', number: 39, caption: 'Photo 39' },
  { src: '/images/gallery/photo40.jpg', number: 40, caption: 'Photo 40' },
  { src: '/images/gallery/photo41.jpg', number: 41, caption: 'Photo 41' },
  { src: '/images/gallery/photo42.jpg', number: 42, caption: 'Photo 42' },
  { src: '/images/gallery/photo43.jpg', number: 43, caption: 'Photo 43' },
  { src: '/images/gallery/photo44.jpg', number: 44, caption: 'Photo 44' },
  { src: '/images/gallery/photo45.jpg', number: 45, caption: 'Photo 45' },
  { src: '/images/gallery/photo46.jpg', number: 46, caption: 'Photo 46' },
  { src: '/images/gallery/photo47.jpg', number: 47, caption: 'Photo 47' },
  { src: '/images/gallery/photo48.jpg', number: 48, caption: 'Photo 48' },
  { src: '/images/gallery/photo49.jpg', number: 49, caption: 'Photo 49' },
  { src: '/images/gallery/photo50.jpg', number: 50, caption: 'Photo 50' },
  { src: '/images/gallery/photo51.jpg', number: 51, caption: 'Photo 51' },
  { src: '/images/gallery/photo52.jpg', number: 52, caption: 'Photo 52' },
  { src: '/images/gallery/photo53.jpg', number: 53, caption: 'Photo 53' },
  { src: '/images/gallery/photo54.jpg', number: 54, caption: 'Photo 54' },
  { src: '/images/gallery/photo55.jpg', number: 55, caption: 'Photo 55' },
  { src: '/images/gallery/photo56.jpg', number: 56, caption: 'Photo 56' },
  { src: '/images/gallery/photo57.jpg', number: 57, caption: 'Photo 57' },
  { src: '/images/gallery/photo58.jpg', number: 58, caption: 'Photo 58' },
  { src: '/images/gallery/photo59.jpg', number: 59, caption: 'Photo 59' },
  { src: '/images/gallery/photo60.jpg', number: 60, caption: 'Photo 60' },
  { src: '/images/gallery/photo61.jpg', number: 61, caption: 'Photo 61' },
  { src: '/images/gallery/photo62.jpg', number: 62, caption: 'Photo 62' },
  { src: '/images/gallery/photo63.jpg', number: 63, caption: 'Photo 63' },
  { src: '/images/gallery/photo64.jpg', number: 64, caption: 'Photo 64' },
  { src: '/images/gallery/photo65.jpg', number: 65, caption: 'Photo 65' },
  { src: '/images/gallery/photo66.jpg', number: 66, caption: 'Photo 66' },
  { src: '/images/gallery/photo67.jpg', number: 67, caption: 'Photo 67' },
  { src: '/images/gallery/photo68.jpg', number: 68, caption: 'Photo 68' },
  { src: '/images/gallery/photo69.jpg', number: 69, caption: 'Photo 69' },
  { src: '/images/gallery/photo70.jpg', number: 70, caption: 'Photo 70' },
  { src: '/images/gallery/photo71.jpg', number: 71, caption: 'Photo 71' },
  { src: '/images/gallery/photo72.jpg', number: 72, caption: 'Photo 72' },
];

export default function Gallery() {
  const [page, setPage] = useState(1);
  const [adminItems, setAdminItems] = useState<SimpleItem[]>([]);

  useEffect(() => {
    fetchGallery().then(setAdminItems).catch(() => setAdminItems([]));
  }, []);

  const images = useMemo(() => GALLERY_IMAGES, []);
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
        {visible.map(({ src, number, caption }) => (
          <div key={number} className="relative group rounded-2xl overflow-hidden bg-surfacealt aspect-[4/3] border border-line/10">
            <img src={src} alt={caption || `Bangladesh gallery ${number}`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-4 text-white text-sm font-semibold">{caption || `Photo ${number}`}</span>
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