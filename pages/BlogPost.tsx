import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { getBlogPostBySlug, getBlogPosts } from '../lib/contentful';
import type { BlogPost } from '../types';
import MatrixBackground from '../components/MatrixBackground';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      const postData = await getBlogPostBySlug(slug);
      setPost(postData);

      if (postData) {
        const allPosts = await getBlogPosts();
        const related = allPosts
          .filter(p => p.id !== postData.id && (p.category === postData.category || p.tags?.some(t => postData.tags?.includes(t))))
          .slice(0, 3);
        setRelatedPosts(related);
      }

      setLoading(false);
    };
    fetchData();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Post not found</h2>
          <Link to="/blog" className="text-accent hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MatrixBackground opacity={0.08} />

      {/* Back Button */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors mb-8 font-mono text-sm"
      >
        <ArrowLeft size={16} />
        <span>BACK TO BLOG</span>
      </Link>

      {/* Header Section */}
      <div className="mb-8">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-accent/90 text-black text-xs font-bold rounded-full font-mono mb-4">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="pixel-font text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" style={{ textShadow: '2px 2px 0px #22c55e' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 font-mono mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{formatDate(post.publishDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">By</span>
            <span className="text-white">{post.author}</span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={16} className="text-zinc-500" />
            {post.tags.map((tag, i) => (
              <span key={i} className="text-sm text-zinc-500 font-mono hover:text-accent transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-12 border-2 border-zinc-800">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Pixel corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-accent" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-accent" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-accent" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-accent" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto">
        <article className="prose prose-invert prose-lg max-w-none">
          <div
            className="text-zinc-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
          />
        </article>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <Share2 size={20} />
              <span className="font-mono text-sm">Share this post</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-400 hover:text-accent hover:border-accent transition-all font-mono text-sm">
                Twitter
              </button>
              <button className="px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-400 hover:text-accent hover:border-accent transition-all font-mono text-sm">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-zinc-800">
          <h2 className="pixel-font text-2xl text-white mb-8">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                to={`/blog/${related.slug}`}
                className="group bg-zinc-900/40 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-accent/50 transition-all"
              >
                <div className="relative h-36">
                  <img
                    src={related.coverImage}
                    alt={related.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="pixel-font text-sm text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <Clock size={12} />
                    <span>{related.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');
        .pixel-font { font-family: 'Silkscreen', monospace; }
      `}</style>
    </div>
  );
};

export default BlogPost;
