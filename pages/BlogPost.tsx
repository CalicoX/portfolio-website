import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Calendar, Clock, Tag, ArrowLeft, Share2, MessageCircle, Send, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getBlogPostBySlug, getBlogPosts } from '../lib/contentful';
import { getNotionBlogComments, postNotionBlogComment } from '../lib/notion';
import type { BlogPost, BlogComment } from '../types';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setShowScrollTop(scrollY > 400);
    };

    // Initial check
    handleScroll();

    // Use scroll event with capture to ensure it fires
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    // Also listen on document for hash router scenarios
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    // Fallback: check periodically
    const interval = setInterval(handleScroll, 200);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      // Fetch post, related posts, and comments in parallel
      const [postData, allPosts, postComments] = await Promise.all([
        getBlogPostBySlug(slug),
        getBlogPosts(),
        getNotionBlogComments(slug),
      ]);

      setPost(postData);
      setComments(postComments);

      if (postData) {
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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !commentAuthor.trim() || !commentContent.trim()) return;

    setSubmitting(true);
    const success = await postNotionBlogComment(slug, commentAuthor.trim(), commentContent.trim());
    if (success) {
      setCommentAuthor('');
      setCommentContent('');
      const updated = await getNotionBlogComments(slug);
      setComments(updated);
    }
    setSubmitting(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen max-w-[950px] mx-auto animate-pulse">
        {/* Back button skeleton */}
        <div className="h-4 w-32 bg-zinc-800 rounded mb-8" />
        {/* Category skeleton */}
        <div className="h-5 w-20 bg-zinc-800 rounded-full mb-4" />
        {/* Title skeleton */}
        <div className="h-10 w-3/4 bg-zinc-800 rounded mb-4" />
        <div className="h-10 w-1/2 bg-zinc-800 rounded mb-6" />
        {/* Meta skeleton */}
        <div className="flex gap-6 mb-8">
          <div className="h-4 w-32 bg-zinc-800 rounded" />
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="h-4 w-20 bg-zinc-800 rounded" />
        </div>
        {/* Cover image skeleton */}
        <div className="w-full h-64 md:h-96 bg-zinc-800 rounded-xl mb-12" />
        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-5/6" />
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-4/6" />
          <div className="h-4 bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
        </div>
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
    <>
      {/* Back to Top Button - rendered to body via Portal */}
      {showScrollTop && typeof document !== 'undefined' && createPortal(
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-accent text-black rounded-full flex items-center justify-center shadow-lg hover:bg-accent/80 transition-all duration-300 hover:scale-110 z-[9999]"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>,
        document.body
      )}

      <div className="min-h-screen max-w-[950px] mx-auto">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-accent transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          <span>BACK TO BLOG</span>
        </Link>

      {/* Header Section */}
      <div className="mb-8">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-accent/90 text-black text-xs font-bold rounded-full mb-4">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-6">
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
              <span key={i} className="text-sm text-zinc-500 hover:text-accent transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-64 md:h-96 lg:h-[500px] rounded-xl overflow-hidden mb-12">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-[950px] mx-auto">
        <article className="prose prose-invert prose-lg max-w-none blog-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {typeof post.content === 'string' ? post.content : ''}
          </ReactMarkdown>
        </article>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-400">
              <Share2 size={20} />
              <span className="text-sm">Share this post</span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-400 hover:text-accent hover:border-accent transition-all text-sm">
                Twitter
              </button>
              <button className="px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-zinc-400 hover:text-accent hover:border-accent transition-all text-sm">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12 pt-8 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle size={20} className="text-accent" />
          <h2 className="text-xl font-bold text-white">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-zinc-900/40 border border-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium">{comment.author}</span>
                    <span className="text-zinc-500 text-xs ml-2">
                      {formatDate(comment.createdTime)}
                    </span>
                  </div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed pl-11">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-sm">No comments yet.</p>
        )}

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            maxLength={50}
            required
            className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-accent transition-colors"
          />
          <textarea
            placeholder="Write a comment..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            maxLength={2000}
            required
            rows={3}
            className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !commentAuthor.trim() || !commentContent.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 bg-accent text-black text-sm font-bold rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-8">Related Posts</h2>
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
                  <h3 className="text-sm font-medium text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock size={12} />
                    <span>{related.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default BlogPostPage;
