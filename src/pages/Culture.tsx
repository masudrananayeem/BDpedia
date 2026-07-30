export default function Culture() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 text-brand-green">Culture & People</h1>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg">A melting pot of diverse ethnicities, religions, and traditions.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-[#111] p-8 rounded-3xl border border-white/10">
          <h2 className="text-3xl font-bold mb-4">Bengali Culture</h2>
          <p className="text-gray-400 mb-4 leading-relaxed">The heart of Bangladesh lies in its rich Bengali heritage, rooted in literature, music, dance, and festivals like Pahela Baishakh.</p>
        </div>
        <div className="bg-gray-800 rounded-3xl overflow-hidden relative flex items-center justify-center text-gray-500 min-h-[300px]">
           <span className="z-10">Add image: public/images/culture/bengali.jpg</span>
           <div className="absolute inset-0 bg-black/50"></div>
        </div>
      </div>
    </div>
  );
}