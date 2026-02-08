import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { getBlogPosts } from '../lib/contentful';
import type { BlogPost } from '../types';
import MatrixBackground from '../components/MatrixBackground';
import PageHeader from '../components/PageHeader';

// 3D Tilt + Spotlight Card
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    const border = borderRef.current;
    if (!card || !glow || !border) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt: max 8 degrees
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Spotlight glow follows cursor
    glow.style.opacity = '1';
    glow.style.background = `radial-gradient(circle 300px at ${x}px ${y}px, rgba(99, 102, 241, 0.35), rgba(139, 92, 246, 0.1), transparent)`;

    // Gradient border follows cursor
    border.style.opacity = '1';
    border.style.background = `radial-gradient(circle 250px at ${x}px ${y}px, rgba(99, 102, 241, 1), rgba(139, 92, 246, 0.6), transparent)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    const border = borderRef.current;
    if (!card || !glow || !border) return;

    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    glow.style.opacity = '0';
    border.style.opacity = '0';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: 'transform 0.2s ease-out', transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Gradient border layer - behind content, follows cursor */}
      <div
        ref={borderRef}
        className="absolute -inset-[2px] rounded-xl z-0 pointer-events-none"
        style={{ opacity: 0, transition: 'opacity 0.3s ease-out' }}
      />
      {/* Inner wrapper for rounded clipping - isolated from 3D transform */}
      <div className="absolute inset-0 rounded-xl overflow-hidden z-[1]">
        {children}
      </div>
      {/* Spotlight overlay - on top */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-20 pointer-events-none rounded-xl"
        style={{ opacity: 0, transition: 'opacity 0.3s ease-out' }}
      />
    </div>
  );
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getBlogPosts();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = ['All', ...Array.from(new Set(posts.map(p => p.category)))];
  const filteredPosts = (filterCategory === 'All' ? posts : posts.filter(p => p.category === filterCategory))
    .sort((a, b) => {
      const diff = new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      return sortOrder === 'newest' ? diff : -diff;
    });

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
        {/* Category Filter + Sort */}
        <div className="flex items-center justify-between mt-8 border-b border-zinc-800">
          <div className="flex items-center gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`relative px-4 py-2.5 text-sm transition-colors ${
                  filterCategory === category
                    ? 'text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {category}
                {filterCategory === category && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
                )}
              </button>
            ))}
          </div>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-500 hover:text-white transition-colors"
          >
            {sortOrder === 'newest' ? <ArrowDownWideNarrow size={14} /> : <ArrowUpNarrowWide size={14} />}
            <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPosts.map((post) => (
            <TiltCard key={post.id} className="relative aspect-[3/4] rounded-xl">
              <Link
                to={`/blog/${post.slug}`}
                className="group absolute inset-0"
              >
                {/* Full Cover Image */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[10px]"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Edge glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-1 ring-accent/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs tracking-wide rounded-full">
                    {post.category}
                  </span>
                </div>

                {/* Content - floating on bottom */}
                <div className="absolute inset-x-0 bottom-0 p-5 z-10">
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-zinc-300/80 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(post.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </TiltCard>
          ))}
        </div>
      )}

      {/* No Posts Message */}
      {!loading && filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-zinc-500 text-base">No posts found in "{filterCategory}"</p>
        </div>
      )}

    </div>
  );
};

export default Blog;
