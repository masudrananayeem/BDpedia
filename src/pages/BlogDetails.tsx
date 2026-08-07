import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronRight, User, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchBlog, fetchBlogs, BlogPost } from '../lib/contentApi';

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    setLoading(true);
    Promise.all([fetchBlog(id), fetchBlogs()])
      .then(([b, all]) => {
        setBlog(b);
        setRelated(all.filter((x) => x.id !== b.id && x.category === b.category).slice(0, 3));
      })
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-32 text-xl text-muted">Loading details...</div>;

  if (!blog) {
    return (
      <div className="text-center py-32">
        <p className="text-2xl mb-4 text-heading">Article not found</p>
        <Link to="/blog" className="text-brand-green hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center flex-wrap gap-2 text-xs md:text-sm text-muted mb-6">
        <Link to="/" className="hover:text-brand-green transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link to="/blog" className="hover:text-brand-green transition-colors">Blog</Link>
        <ChevronRight size={14} />
        <span className="text-body">{blog.title}</span>
      </div>

      <Link to="/blog" className="inline-flex items-center gap-2 text-muted hover:text-brand-green transition-colors mb-6">
        <ArrowLeft size={18} /> Back to Blog
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-brand-green mb-4">{blog.category}</span>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-heading leading-tight">{blog.title}</h1>

        <div className="flex items-center gap-5 text-sm text-muted mb-8 pb-8 border-b border-line/10">
          <span className="flex items-center gap-1.5"><User size={14} /> {blog.author}</span>
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> Bangladesh Travel Desk</span>
        </div>

        <div className="h-64 md:h-96 bg-surfacealt rounded-3xl overflow-hidden relative mb-10 flex items-center justify-center text-muted text-sm">
          <span className="z-10">{blog.image}</span>
          <img src={blog.image} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-0" onLoad={(e) => (e.currentTarget.style.opacity = '1')} onError={(e) => (e.currentTarget.style.opacity = '0')} alt={blog.title} />
        </div>

        <div className="prose-none space-y-5">
          {(blog.content && blog.content.length > 0 ? blog.content : [blog.excerpt]).map((para, i) => (
            <p key={i} className="text-body text-lg leading-relaxed">{para}</p>
          ))}
        </div>
      </motion.div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-heading">More in {blog.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((b) => (
              <Link to={`/blog/${b.id}`} key={b.id} className="group bg-surface rounded-2xl overflow-hidden border border-line/5 hover:border-brand-green/50 transition-all">
                <div className="h-32 bg-surfacealt relative overflow-hidden flex items-center justify-center text-muted text-xs">
                  <span className="z-10">{b.image}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-heading group-hover:text-brand-green transition-colors line-clamp-2">{b.title}</h3>
                  <p className="text-xs text-muted mt-1">By {b.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
