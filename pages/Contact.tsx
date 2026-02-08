import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Send } from 'lucide-react';
import { getSiteProfile } from '../lib/contentful';
import type { SiteProfile } from '../types';

const BASE_URL = import.meta.env.BASE_URL || '/';

const Contact: React.FC = () => {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getSiteProfile();
        if (data) setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    const subject = `Inquiry from ${formData.name || 'Portfolio Contact'}`;
    const body = `${formData.message}\n\n---\nFrom: ${formData.name}\nEmail: ${formData.email}`;

    window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  const socialLinks = [
    { id: 'xiaohongshu', name: 'XiaoHongShu', icon: `${BASE_URL}icons/xiaohongshu.svg`, href: '#' },
    { id: 'dribbble', name: 'Dribbble', icon: `${BASE_URL}icons/dribbble.svg`, href: '#' },
    { id: 'behance', name: 'Behance', icon: `${BASE_URL}icons/behance.svg`, href: '#' },
  ];

  const contactInfo = [
    {
      label: 'General Inquiries',
      items: ['hello@example.com'],
    },
    {
      label: 'Social',
      items: socialLinks.map(s => s.name),
      links: socialLinks,
    },
    {
      label: 'Based in',
      items: ['Shanghai, China'],
    },
    {
      label: 'Availability',
      items: ['Open for freelance', '& full-time roles'],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-pulse text-zinc-500 text-sm tracking-widest uppercase">Loading</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background relative flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-20">

        {/* ── Top Section: Title + Contact Info Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Left: Title Block */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Section Label */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-accent" />
                <span className="text-xs tracking-[0.3em] uppercase text-zinc-500">Contact</span>
              </div>

              {/* Large Title - Swiss Style */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight mb-6">
                Let's<br />
                work<br />
                together
              </h1>

              {/* Subtitle */}
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-sm">
                Get in touch for collaborations, inquiries, or just to say hello.
              </p>
            </div>
          </div>

          {/* Right: Contact Info Grid */}
          <div className="lg:col-span-7">
            {/* Horizontal rule */}
            <div className="h-px bg-zinc-800 mb-8 lg:mt-12" />

            <div className="grid grid-cols-2 gap-x-8 md:gap-x-16 gap-y-10">
              {contactInfo.map((block) => (
                <div key={block.label}>
                  <span className="text-xs tracking-[0.2em] uppercase text-zinc-500 block mb-3">
                    {block.label}
                  </span>
                  {block.links ? (
                    <div className="flex flex-col gap-1.5">
                      {block.links.map((link) => (
                        <a
                          key={link.id}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 text-white hover:text-accent transition-colors text-sm md:text-base"
                        >
                          <img src={link.icon} alt={link.name} className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <span>{link.name}</span>
                          <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-px" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {block.items.map((item, i) => (
                        <span key={i} className="text-white text-sm md:text-base">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-zinc-800 my-12 md:my-16" />

        {/* ── Bottom Section: Form ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Left: Form Label */}
          <div className="lg:col-span-5">
            <span className="text-xs tracking-[0.3em] uppercase text-zinc-500 block mb-3">Send a message</span>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Fill out the form and I'll get back to you as soon as possible.
            </p>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name + Email row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs tracking-[0.2em] uppercase text-zinc-500 block">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 focus:border-white focus:outline-none transition-colors text-white placeholder-zinc-600 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs tracking-[0.2em] uppercase text-zinc-500 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 focus:border-white focus:outline-none transition-colors text-white placeholder-zinc-600 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs tracking-[0.2em] uppercase text-zinc-500 block">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="w-full px-0 py-3 bg-transparent border-b border-zinc-700 focus:border-white focus:outline-none transition-colors text-white placeholder-zinc-600 text-sm resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="group flex items-center gap-3 text-sm tracking-[0.15em] uppercase text-white hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {formStatus === 'submitting' ? (
                    <span>Sending...</span>
                  ) : formStatus === 'success' ? (
                    <span className="text-accent">Message sent</span>
                  ) : (
                    <>
                      <span>Send message</span>
                      <span className="inline-flex items-center justify-center w-8 h-8 border border-zinc-700 group-hover:border-accent group-hover:bg-accent/10 transition-all">
                        <Send size={14} />
                      </span>
                    </>
                  )}
                </button>

                {formStatus === 'success' && (
                  <span className="text-xs text-accent tracking-wide">
                    Check your email client
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ── Footer Divider + Social ── */}
        <div className="h-px bg-zinc-800 mt-12 md:mt-16 mb-8" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Social Links - Swiss minimal style */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <span className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
