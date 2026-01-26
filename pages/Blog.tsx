import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { getBlogPosts } from '../lib/contentful';
import type { BlogPost } from '../types';
import MatrixBackground from '../components/MatrixBackground';
import PageHeader from '../components/PageHeader';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getBlogPosts();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const filteredPosts = filterCategory === 'All' ? posts : posts.filter(p => p.category === filterCategory);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen">
      <MatrixBackground opacity={0.08} />

      {/* Header */}
      <PageHeader
        title="Blog"
        description="Thoughts on design, development, and everything in between."
      >
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mt-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all border-2 ${
                filterCategory === category
                  ? 'bg-accent text-black border-accent'
                  : 'bg-zinc-900/50 text-zinc-400 border-zinc-700 hover:border-accent hover:text-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-zinc-900/30 rounded-xl overflow-hidden animate-pulse">
              <div className="h-48 bg-zinc-800/50"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-zinc-800/50 rounded w-3/4"></div>
                <div className="h-3 bg-zinc-800/50 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-zinc-800/50 rounded"></div>
                  <div className="h-3 bg-zinc-800/50 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-accent/90 text-black text-xs font-bold rounded-full font-mono">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="pixel-font text-xl text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-zinc-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(post.publishDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag size={14} className="text-zinc-500" />
                    {post.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-zinc-500 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More Arrow */}
                <div className="mt-4 flex items-center gap-2 text-accent text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>READ MORE</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pixel Corner Decorations */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      )}

      {/* No Posts Message */}
      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-lg font-mono">No posts found in {filterCategory}</p>
        </div>
      )}

    </div>
  );
};

export default Blog;
