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
  { src: '../../public/images/gallery/photo1.jpg', number: 1, caption: 'Royel Bengal Tiger' },
  { src: '../../public/images/gallery/photo2.jpg', number: 2, caption: 'Photo 2' },
  { src: '../../public/images/gallery/photo3.jpg', number: 3, caption: 'Photo 3' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-4/900/650', number: 4, caption: 'Photo 4' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-5/900/650', number: 5, caption: 'Photo 5' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-6/900/650', number: 6, caption: 'Photo 6' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-7/900/650', number: 7, caption: 'Photo 7' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-8/900/650', number: 8, caption: 'Photo 8' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-9/900/650', number: 9, caption: 'Photo 9' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-10/900/650', number: 10, caption: 'Photo 10' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-11/900/650', number: 11, caption: 'Photo 11' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-12/900/650', number: 12, caption: 'Photo 12' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-13/900/650', number: 13, caption: 'Photo 13' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-14/900/650', number: 14, caption: 'Photo 14' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-15/900/650', number: 15, caption: 'Photo 15' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-16/900/650', number: 16, caption: 'Photo 16' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-17/900/650', number: 17, caption: 'Photo 17' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-18/900/650', number: 18, caption: 'Photo 18' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-19/900/650', number: 19, caption: 'Photo 19' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-20/900/650', number: 20, caption: 'Photo 20' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-21/900/650', number: 21, caption: 'Photo 21' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-22/900/650', number: 22, caption: 'Photo 22' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-23/900/650', number: 23, caption: 'Photo 23' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-24/900/650', number: 24, caption: 'Photo 24' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-25/900/650', number: 25, caption: 'Photo 25' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-26/900/650', number: 26, caption: 'Photo 26' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-27/900/650', number: 27, caption: 'Photo 27' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-28/900/650', number: 28, caption: 'Photo 28' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-29/900/650', number: 29, caption: 'Photo 29' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-30/900/650', number: 30, caption: 'Photo 30' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-31/900/650', number: 31, caption: 'Photo 31' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-32/900/650', number: 32, caption: 'Photo 32' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-33/900/650', number: 33, caption: 'Photo 33' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-34/900/650', number: 34, caption: 'Photo 34' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-35/900/650', number: 35, caption: 'Photo 35' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-36/900/650', number: 36, caption: 'Photo 36' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-37/900/650', number: 37, caption: 'Photo 37' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-38/900/650', number: 38, caption: 'Photo 38' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-39/900/650', number: 39, caption: 'Photo 39' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-40/900/650', number: 40, caption: 'Photo 40' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-41/900/650', number: 41, caption: 'Photo 41' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-42/900/650', number: 42, caption: 'Photo 42' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-43/900/650', number: 43, caption: 'Photo 43' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-44/900/650', number: 44, caption: 'Photo 44' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-45/900/650', number: 45, caption: 'Photo 45' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-46/900/650', number: 46, caption: 'Photo 46' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-47/900/650', number: 47, caption: 'Photo 47' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-48/900/650', number: 48, caption: 'Photo 48' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-49/900/650', number: 49, caption: 'Photo 49' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-50/900/650', number: 50, caption: 'Photo 50' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-51/900/650', number: 51, caption: 'Photo 51' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-52/900/650', number: 52, caption: 'Photo 52' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-53/900/650', number: 53, caption: 'Photo 53' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-54/900/650', number: 54, caption: 'Photo 54' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-55/900/650', number: 55, caption: 'Photo 55' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-56/900/650', number: 56, caption: 'Photo 56' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-57/900/650', number: 57, caption: 'Photo 57' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-58/900/650', number: 58, caption: 'Photo 58' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-59/900/650', number: 59, caption: 'Photo 59' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-60/900/650', number: 60, caption: 'Photo 60' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-61/900/650', number: 61, caption: 'Photo 61' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-62/900/650', number: 62, caption: 'Photo 62' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-63/900/650', number: 63, caption: 'Photo 63' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-64/900/650', number: 64, caption: 'Photo 64' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-65/900/650', number: 65, caption: 'Photo 65' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-66/900/650', number: 66, caption: 'Photo 66' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-67/900/650', number: 67, caption: 'Photo 67' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-68/900/650', number: 68, caption: 'Photo 68' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-69/900/650', number: 69, caption: 'Photo 69' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-70/900/650', number: 70, caption: 'Photo 70' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-71/900/650', number: 71, caption: 'Photo 71' },
  { src: 'https://picsum.photos/seed/bdpedia-bangladesh-72/900/650', number: 72, caption: 'Photo 72' },
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