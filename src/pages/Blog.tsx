import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import blogs from '../data/json/others/blogs.json';
import { CalendarDays, User } from 'lucide-react';

type Blog = { id: number; title: string; author: string; category: string; image: string; excerpt: string };
const ALL_BLOGS = blogs as Blog[];
const CATEGORIES = ['All', ...Array.from(new Set(ALL_BLOGS.map((b) => b.category)))];

export default function Blog() {
  const [category, setCategory] = useState('All');

  const filtered = useMemo(
    () => (category === 'All' ? ALL_BLOGS : ALL_BLOGS.filter((b) => b.category === category)),
    [category]
  );

  const featured = ALL_BLOGS[0];
  const rest = filtered.filter((b) => b.id !== featured?.id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-3">Stories & Insights</span>
        <h1 className="text-4xl font-bold mb-4 text-brand-green">Latest Articles & Blogs</h1>
        <p className="text-body max-w-2xl mx-auto">Travel guides, cultural deep-dives, and stories from across Bangladesh.</p>
      </div>

      {/* Featured post */}
      {featured && (
        <article className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-0 bg-surface border border-line/10 rounded-3xl overflow-hidden">
          <div className="h-64 lg:h-full bg-surfacealt relative flex items-center justify-center text-muted text-sm">
            <span className="z-10">{featured.image}</span>
            <span className="absolute top-4 left-4 bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-full z-20">Featured</span>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <span className="text-xs text-brand-green font-semibold uppercase tracking-wide mb-2">{featured.category}</span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-heading">{featured.title}</h2>
            <p className="text-muted text-sm mb-5 leading-relaxed">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-muted mb-5">
              <span className="flex items-center gap-1.5"><User size={13} /> {featured.author}</span>
              <span className="flex items-center gap-1.5"><CalendarDays size={13} /> Bangladesh Travel Desk</span>
            </div>
            <Link to={`/blog/${featured.id}`} className="self-start text-brand-green font-semibold text-sm hover:underline">Read Full Story &rarr;</Link>
          </div>
        </article>
      )}

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              category === c
                ? 'bg-brand-green text-black border-brand-green'
                : 'bg-transparent text-body border-line/15 hover:border-brand-green/50 hover:text-brand-green'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((blog) => (
          <Link to={`/blog/${blog.id}`} key={blog.id} className="bg-surface rounded-2xl overflow-hidden border border-line/10 hover:border-brand-green/50 transition-colors group flex flex-col">
            <div className="h-48 bg-surfacealt relative flex items-center justify-center text-muted text-sm">
              <span className="z-10">{blog.image}</span>
              <img src={blog.image} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" onError={(e) => (e.currentTarget.style.opacity = '0')} alt={blog.title}/>
              <span className="absolute top-4 left-4 bg-brand-green text-black text-xs font-bold px-3 py-1 rounded-full z-20">{blog.category}</span>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h2 className="text-xl font-bold mb-3 text-heading group-hover:text-brand-green transition-colors">{blog.title}</h2>
              <p className="text-muted text-sm mb-4 flex-grow">{blog.excerpt}</p>
              <div className="text-xs text-muted flex justify-between items-center mt-auto pt-4 border-t border-line/10">
                <span>By {blog.author}</span><span className="text-brand-green font-semibold">Read More &rarr;</span>
              </div>
            </div>
          </Link>
        ))}
        {rest.length === 0 && (
          <p className="col-span-full text-center text-muted py-10">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}
