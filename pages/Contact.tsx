import React, { useEffect, useState } from 'react';
import { Mail, Phone, Building2, Send, ArrowRight } from 'lucide-react';
import { getSiteProfile } from '../lib/contentful';
import type { SiteProfile } from '../types';

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

  // Disable body scroll when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

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
    { id: 'xiaohongshu', name: '小红书', icon: '/icons/xiaohongshu.svg', href: '#' },
    { id: 'dribbble', name: 'Dribbble', icon: '/icons/dribbble.svg', href: '#' },
    { id: 'behance', name: 'Behance', icon: '/icons/behance.svg', href: '#' },
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
    <div className="flex items-center justify-center h-screen w-screen bg-background">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 px-4 lg:px-12 max-w-5xl mx-auto w-full">
        {/* Left Side - Profile */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-64 lg:w-80 flex-shrink-0">
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/30 to-purple-500/30 blur-2xl animate-pulse-slow" />
            <img
              src={profileImageUrl}
              alt="Profile"
              className="relative w-full h-full object-cover rounded-full border-2 border-white/10 shadow-xl z-10"
            />
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-3">Let's Work Together</h1>
          <p className="text-secondary mb-6 leading-relaxed min-h-[3rem] w-full text-left">
            <TypewriterLoop text="Have a project in mind? I'm always excited to collaborate on new and creative endeavors." />
          </p>

          {/* Social Links - No background */}
          <div className="flex gap-3 justify-center">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center hover:scale-110 transition-all"
                title={social.name}
              >
                <img src={social.icon} alt={social.name} className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="w-64 lg:w-80 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-md shadow-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mail className="text-accent" size={20} />
            Get in Touch
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Phone size={16} />
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Your phone number"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-accent/50 transition-all text-white placeholder-zinc-500"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-accent/50 transition-all text-white placeholder-zinc-500"
                required
              />
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400 flex items-center gap-2">
                <Building2 size={16} />
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Your company name"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg focus:outline-none focus:border-accent/50 transition-all text-white placeholder-zinc-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formStatus === 'submitting'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-black font-semibold hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-lg"
            >
              {formStatus === 'submitting' ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Sending...
                </>
              ) : formStatus === 'success' ? (
                <>
                  <span className="text-green-600">Sent!</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Send Message <Send size={18} />
                </>
              )}
            </button>

            {/* Form Status Message */}
            {formStatus === 'success' && (
              <p className="text-center text-sm text-green-400 mt-2">
                Thank you! Your message has been sent.
              </p>
            )}
            {formStatus === 'error' && (
              <p className="text-center text-sm text-red-400 mt-2">
                Oops! Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
