import blogs from '../data/json/others/blogs.json';

export default function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-12 text-center text-brand-green">Latest Articles & Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog:any) => (
          <article key={blog.id} className="bg-[#111] rounded-2xl overflow-hidden border border-white/10 hover:border-brand-green/50 transition-colors group flex flex-col">
            <div className="h-48 bg-gray-800 relative flex items-center justify-center text-gray-500 text-sm">
              <span className="z-10">{blog.image}</span>
              <img src={blog.image} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" onError={(e) => (e.currentTarget.style.opacity = '0')} alt={blog.title}/>
              <span className="absolute top-4 left-4 bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-full z-20">{blog.category}</span>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h2 className="text-xl font-bold mb-3 text-white group-hover:text-brand-green transition-colors">{blog.title}</h2>
              <p className="text-gray-400 text-sm mb-4 flex-grow">{blog.excerpt}</p>
              <div className="text-xs text-gray-500 flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                <span>By {blog.author}</span><button className="text-brand-green font-semibold">Read More &rarr;</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}