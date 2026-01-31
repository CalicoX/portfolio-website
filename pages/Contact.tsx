import React, { useEffect, useState } from 'react';
import { Send, ArrowRight } from 'lucide-react';
import { getSiteProfile } from '../lib/contentful';
import type { SiteProfile } from '../types';

// Get base URL for assets
const BASE_URL = import.meta.env.BASE_URL || '/';

// Looping typewriter with glowing and shaking cursor
const TypewriterLoop: React.FC<{ text: string; delay?: number; speed?: number }> = ({
  text,
  delay = 500,
  speed = 50
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      let currentIndex = 0;
      let deleteTimer: NodeJS.Timeout | null = null;

      const typeText = () => {
        setIsDeleting(false);
        setDisplayText('');
        currentIndex = 0;

        const typeTimer = setInterval(() => {
          if (currentIndex < text.length) {
            setDisplayText(text.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typeTimer);
            deleteTimer = setTimeout(() => {
              deleteText();
            }, 2000);
          }
        }, speed);

        return () => clearInterval(typeTimer);
      };

      const deleteText = () => {
        setIsDeleting(true);

        const deleteInterval = setInterval(() => {
          if (currentIndex > 0) {
            setDisplayText(text.slice(0, currentIndex - 1));
            currentIndex--;
          } else {
            clearInterval(deleteInterval);
            setDisplayText('');
            setTimeout(() => {
              typeText();
            }, 500);
          }
        }, 20);

        return () => clearInterval(deleteInterval);
      };

      typeText();

      return () => {
        if (deleteTimer) clearTimeout(deleteTimer);
      };
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, delay, speed]);

  return (
    <span className="relative inline">
      <span>{displayText}</span>
      {!isDeleting && (
        <span
          className="inline-block animate-shake-glow ml-1"
          style={{
            textShadow: '0 0 10px #22c55e, 0 0 20px #22c55e, 0 0 30px #22c55e',
          }}
        >
          |
        </span>
      )}
    </span>
  );
};

const Contact: React.FC = () => {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    company: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getSiteProfile();
        if (data) {
          setProfile(data);
        }
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

    const subject = `Project Inquiry - ${formData.company || 'New Contact'}`;
    const body = `
Phone: ${formData.phone}
Email: ${formData.email}
Company: ${formData.company}

---
Message sent from portfolio contact form
    `.trim();

    window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setFormStatus('success');
    setTimeout(() => setFormStatus('idle'), 3000);
  };

  const socialLinks = [
    { id: 'xiaohongshu', name: '小红书', icon: `${BASE_URL}icons/xiaohongshu.svg`, href: '#' },
    { id: 'dribbble', name: 'Dribbble', icon: `${BASE_URL}icons/dribbble.svg`, href: '#' },
    { id: 'behance', name: 'Behance', icon: `${BASE_URL}icons/behance.svg`, href: '#' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  const profileImageUrl = profile?.profileImageUrl || 'https://picsum.photos/400/400?random=100';

  return (
    <div className="min-h-screen w-full bg-background relative flex flex-col">
      {/* Pixel Grid Background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #22c55e 1px, transparent 1px),
            linear-gradient(to bottom, #22c55e 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Scanline Effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.02) 2px, rgba(34, 197, 94, 0.02) 4px)',
        }}
      />

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 lg:px-8 max-w-6xl mx-auto w-full relative z-10 py-24 my-auto">
        {/* Left Side - Profile */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-64 lg:w-80 flex-shrink-0">
          {/* Profile Image with Pixel Border */}
          <div className="relative mb-6">
            {/* Pixel corner decorations */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-accent" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-accent" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-accent" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-accent" />

            <div className="relative w-32 h-32 lg:w-40 lg:h-40">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-accent/20 to-purple-500/20 blur-xl animate-pulse-slow" />
              <img
                src={profileImageUrl}
                alt="Profile"
                className="relative w-full h-full object-cover rounded-lg border-4 border-accent/30 shadow-2xl z-10"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>

          {/* Title with Pixel Font */}
          <h1 className="text-2xl lg:text-3xl font-bold mb-3 pixel-font text-white" style={{ textShadow: '2px 2px 0px #22c55e' }}>
            Let's Connect
          </h1>

          {/* Typewriter Text */}
          <p className="text-secondary mb-6 leading-relaxed min-h-[3rem] w-full text-left font-mono text-sm">
            <TypewriterLoop text="Have a project in mind? Let's build something amazing together." />
          </p>

          {/* Social Links with Pixel Buttons */}
          <div className="flex gap-3 justify-center">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center w-12 h-12 bg-zinc-900/80 border-2 border-zinc-700 hover:border-accent transition-all group"
                title={social.name}
              >
                {/* Pixel corners for social buttons */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-600 group-hover:border-accent" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-zinc-600 group-hover:border-accent" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-zinc-600 group-hover:border-accent" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-600 group-hover:border-accent" />
                <img src={social.icon} alt={social.name} className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Side - Contact Form - Terminal Style */}
        <div className="w-full max-w-md">
          {/* Terminal Window */}
          <div className="bg-zinc-900/80 border-2 border-zinc-700 rounded-lg overflow-hidden backdrop-blur-md shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/90 border-b-2 border-zinc-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-sm bg-red-500/80" />
                <div className="w-3 h-3 rounded-sm bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-sm bg-green-500/80" />
              </div>
              <div className="flex-1 px-3">
                <div className="h-4 bg-zinc-900/50 rounded font-mono text-xs text-zinc-500 flex items-center">
                  <span className="text-accent">▶</span> contact_form.exe
                </div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono">
              <div className="mb-4 text-sm text-zinc-500">
                <span className="text-accent">root@portfolio</span>:<span className="text-zinc-400">~</span>$ ./contact --init
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Phone Input - Terminal Style */}
                <div className="space-y-2">
                  <label className="text-sm text-accent flex items-center gap-2">
                    <span className="text-accent">▶</span>
                    <span className="text-zinc-400">PHONE</span>
                    <span className="animate-pulse">_</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent">&gt;</span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number..."
                      className="w-full pl-8 pr-4 py-3 bg-zinc-950/50 border-2 border-zinc-800 focus:border-accent focus:outline-none rounded-none transition-all text-white placeholder-zinc-600 font-mono text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Email Input - Terminal Style */}
                <div className="space-y-2">
                  <label className="text-sm text-accent flex items-center gap-2">
                    <span className="text-accent">▶</span>
                    <span className="text-zinc-400">EMAIL</span>
                    <span className="animate-pulse">_</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent">&gt;</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email address..."
                      className="w-full pl-8 pr-4 py-3 bg-zinc-950/50 border-2 border-zinc-800 focus:border-accent focus:outline-none rounded-none transition-all text-white placeholder-zinc-600 font-mono text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Company Input - Terminal Style */}
                <div className="space-y-2">
                  <label className="text-sm text-accent flex items-center gap-2">
                    <span className="text-accent">▶</span>
                    <span className="text-zinc-400">COMPANY</span>
                    <span className="text-zinc-600">[optional]</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent">&gt;</span>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Enter company name..."
                      className="w-full pl-8 pr-4 py-3 bg-zinc-950/50 border-2 border-zinc-800 focus:border-accent focus:outline-none rounded-none transition-all text-white placeholder-zinc-600 font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Submit Button - Pixel Style */}
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="relative w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-black font-bold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-mono text-sm border-4 border-accent hover:border-accent/80"
                  style={{ imageRendering: 'pixelated' }}
                >
                  {/* Pixel corners */}
                  <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-black/20" />
                  <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-black/20" />
                  <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-black/20" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-black/20" />

                  {formStatus === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-3 border-black/30 border-t-black rounded-sm animate-spin" style={{ borderWidth: '3px' }} />
                      <span>SENDING...</span>
                    </>
                  ) : formStatus === 'success' ? (
                    <>
                      <span className="text-black">✓ SENT!</span>
                      <ArrowRight size={18} />
                    </>
                  ) : (
                    <>
                      <span>[ SEND MESSAGE ]</span>
                      <Send size={18} />
                    </>
                  )}
                </button>

                {/* Form Status Message - Terminal Style */}
                {formStatus === 'success' && (
                  <div className="mt-3 p-3 bg-green-900/20 border-2 border-green-700/50 rounded-none font-mono text-sm">
                    <span className="text-green-400">✓</span>
                    <span className="text-green-300 ml-2">Message sent successfully!</span>
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="mt-3 p-3 bg-red-900/20 border-2 border-red-700/50 rounded-none font-mono text-sm">
                    <span className="text-red-400">✗</span>
                    <span className="text-red-300 ml-2">Error sending message. Please try again.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Pixel Font Style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap');
        .pixel-font {
          font-family: 'Silkscreen', 'Press Start 2P', monospace;
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
};

export default Contact;
