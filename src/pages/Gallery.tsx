export default function Gallery() {
  const images = Array.from({ length: 25 }, (_, i) => `/images/gallery/image_${i + 1}.jpg`);
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-heading">Photo Gallery</h1>
        <p className="text-muted">A collection of 25 breathtaking views of Bangladesh.</p>
      </div>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {images.map((src, index) => (
          <div key={index} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-surfacealt aspect-[3/4] flex items-center justify-center text-center p-4">
            <span className="text-xs text-muted relative z-10">{src}</span>
            <img src={src} alt={`Gallery ${index + 1}`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" onError={(e) => (e.currentTarget.style.opacity = '0')} />
          </div>
        ))}
      </div>
    </div>
  );
}