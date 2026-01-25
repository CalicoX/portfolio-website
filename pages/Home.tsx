import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AvailableBadge from '../components/AvailableBadge';
import { ArrowRight, Download, ExternalLink } from 'lucide-react';
import { EXPERIENCES, UI_PROJECTS, GRAPHIC_PROJECTS } from '../constants';
import { getSiteProfile } from '../lib/contentful';
import type { SiteProfile } from '../types';

// Get base URL for assets
const BASE_URL = import.meta.env.BASE_URL || '/';

// Skills data with white icons
const SKILLS = [
  { id: '1', name: 'Figma', icon: `${BASE_URL}icons/figma.svg`, color: 'from-pink-500 to-purple-500', initialColor: '#fafafa', hoverColor: '#ffffff' },
  { id: '2', name: 'Adobe', icon: `${BASE_URL}icons/adobe.svg`, color: 'from-red-500 to-orange-500', initialColor: '#fafafa', hoverColor: '#ffffff' },
  { id: '3', name: 'Video Editing', icon: `${BASE_URL}icons/video.svg`, color: 'from-blue-500 to-cyan-500', initialColor: '#fafafa', hoverColor: '#ffffff' },
  { id: '4', name: 'Vibecoding', icon: `${BASE_URL}icons/vibecoding.svg`, color: 'from-green-500 to-emerald-500', initialColor: '#fafafa', hoverColor: '#ffffff' },
];

// Spotlight Card Component with mouse tracking
const SpotlightCard: React.FC<{
  skill: typeof SKILLS[number];
  children: React.ReactNode;
}> = ({ skill, children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className="skill-card group relative overflow-hidden rounded-lg bg-zinc-900/30"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--hover-color': skill.hoverColor } as React.CSSProperties}
    >
      {/* Main Spotlight Effect - Large and bright */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: isHovered
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.4), transparent 50%)`
            : 'none',
        }}
      />
      {/* Secondary brighter spotlight center */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{
          background: isHovered
            ? `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.25), transparent 60%)`
            : 'none',
        }}
      />
      {/* Border spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.6), transparent 70%)`
            : 'none',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '2px',
        }}
      />
      {children}
    </div>
  );
};

const DEFAULT_PROFILE: SiteProfile = {
  id: 'default',
  heroTitle: 'Designing digital',
  heroSubtitle: 'experiences that matter.',
  name: "I'm Alex, a multidisciplinary designer focused on creating accessible, human-centered products. I bridge the gap between design and engineering.",
  description: '',
  profileImageUrl: 'https://picsum.photos/600/600?random=100',
  cvLink: '',
};

// 8BIT colors for terminal
const EIGHT_BIT_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#A8E6CF',
  '#FFB6B9',
  '#95E1D3',
  '#DDA0DD',
  '#87CEEB',
];

// Single-time typewriter effect for name
const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      let currentIndex = 0;
      const typeTimer = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeTimer);
          setTimeout(() => setShowCursor(false), 500);
        }
      }, 30);
      return () => clearInterval(typeTimer);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, delay]);

  return (
    <span className="relative inline-block">
      {/* Hidden full text to reserve height */}
      <span className="invisible">{text}</span>
      {/* Visible typing text */}
      <span className="absolute left-0 top-0">
        {displayText.slice(0, -1)}
        {displayText.length > 0 && (
          <span
            className="animate-shake-glow text-accent font-bold inline-block relative"
            style={{
              textShadow: '0 0 10px #22c55e, 0 0 20px #22c55e, 0 0 30px #22c55e, 0 0 40px rgba(34,197,94,0.8), 0 0 80px rgba(34,197,94,0.6)',
              filter: 'brightness(1.3)',
            }}
          >
            {displayText.slice(-1)}
          </span>
        )}
        {showCursor && (
          <span
            className="animate-pulse text-accent inline-block ml-0.5"
            style={{
              textShadow: '0 0 8px #22c55e, 0 0 16px #22c55e',
            }}
          >
            █
          </span>
        )}
      </span>
    </span>
  );
};

// Bento grid items for featured work
const BENTO_ITEMS = [
  {
    id: '1',
    title: 'UI Design',
    description: 'Web & Mobile interfaces',
    link: '/ui-design',
    image: 'https://via.placeholder.com/1200x400/18181b/22c55e?text=UI+Design', // 替换成你的图片URL
    size: 'col-span-3 row-span-1',
  },
  {
    id: '2',
    title: 'Photography',
    description: 'Visual storytelling',
    link: '/photos',
    image: '/images/photography.png', // 你的图片
    size: 'col-span-1 row-span-1',
  },
  {
    id: '3',
    title: 'Graphic Design',
    description: 'Branding & Illustration',
    link: '/graphic-design',
    image: 'https://via.placeholder.com/800x400/18181b/22c55e?text=Graphic+Design', // 替换成你的图片URL
    size: 'col-span-2 row-span-1',
  },
];

// Terminal-style typing experience component with loop
const TerminalExperience: React.FC<{ experience: typeof EXPERIENCES[number]; index: number }> = ({ experience, index }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const showCursor = true;
  const color = EIGHT_BIT_COLORS[index % EIGHT_BIT_COLORS.length];

  useEffect(() => {
    const fullText = `${experience.period} // ${experience.role} @ ${experience.company}`;
    let currentIndex = 0;
    let deleteTimer: NodeJS.Timeout | null = null;

    const typeText = () => {
      setIsDeleting(false);
      setDisplayText('');
      currentIndex = 0;

      const typeTimer = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeTimer);
          deleteTimer = setTimeout(() => {
            deleteText();
          }, 3000);
        }
      }, 30);

      return () => clearInterval(typeTimer);
    };

    const deleteText = () => {
      setIsDeleting(true);

      const deleteTimer = setInterval(() => {
        if (currentIndex > 0) {
          setDisplayText(fullText.slice(0, currentIndex - 1));
          currentIndex--;
        } else {
          clearInterval(deleteTimer);
          setDisplayText('');
          setTimeout(() => {
            typeText();
          }, 1000);
        }
      }, 20);

      return () => clearInterval(deleteTimer);
    };

    const startTimer = setTimeout(() => {
      typeText();
    }, index * 400);

    return () => {
      clearTimeout(startTimer);
      if (deleteTimer) clearTimeout(deleteTimer);
    };
  }, [experience, index]);

  return (
    <div className="font-mono mb-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded backdrop-blur-md">
      <div className="flex gap-2 items-center min-h-[28px]">
        <span className="text-accent text-base">$</span>
        <span className="pixel-font text-base" style={{ color }}>{displayText}</span>
        {showCursor && !isDeleting && <span className="animate-pulse text-base" style={{ color }}>_</span>}
      </div>
      <div className="text-zinc-500 text-xs mt-3 pl-4">{experience.description}</div>
    </div>
  );
};

const Home: React.FC = () => {
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const profileData = await getSiteProfile();

        if (!mounted) return;

        if (profileData) {
          setProfile(profileData);
        } else {
          setProfile(DEFAULT_PROFILE);
        }

        setTimeout(() => {
          if (mounted) {
            setReady(true);
            sessionStorage.setItem('homeDataLoaded', 'true');
          }
        }, 100);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
        if (mounted) {
          setProfile(DEFAULT_PROFILE);
          setTimeout(() => {
            setReady(true);
            sessionStorage.setItem('homeDataLoaded', 'true');
          }, 100);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // Skeleton loading component
  if (!ready) {
    return (
      <div className="flex flex-col gap-16 md:gap-24 animate-pulse">
        {/* Hero Skeleton */}
        <section className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-6 w-full">
            <div className="h-6 w-32 bg-zinc-800 rounded mx-auto lg:mx-0" />
            <div className="space-y-3">
              <div className="h-12 md:h-16 bg-zinc-800 rounded w-3/4 mx-auto lg:mx-0" />
              <div className="h-12 md:h-16 bg-zinc-800 rounded w-1/2 mx-auto lg:mx-0" />
            </div>
            <div className="space-y-2 max-w-xl mx-auto lg:mx-0">
              <div className="h-4 bg-zinc-800 rounded w-full" />
              <div className="h-4 bg-zinc-800 rounded w-5/6" />
            </div>
            <div className="h-12 w-36 bg-zinc-800 rounded mx-auto lg:mx-0" />
          </div>
          <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-zinc-800 rounded-full flex-shrink-0" />
        </section>

        {/* Skills Skeleton */}
        <section>
          <div className="h-8 w-48 bg-zinc-800 rounded mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-6 flex flex-col items-center gap-5">
                <div className="w-7 h-7 bg-zinc-800 rounded" />
                <div className="h-4 w-20 bg-zinc-800 rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Experience Skeleton */}
        <section>
          <div className="h-8 w-72 bg-zinc-800 rounded mb-8" />
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-zinc-900/50 border border-zinc-800 rounded">
                <div className="h-5 w-3/4 bg-zinc-800 rounded mb-2" />
                <div className="h-3 w-1/2 bg-zinc-800 rounded ml-4" />
              </div>
            ))}
          </div>
        </section>

        {/* Featured Work Skeleton */}
        <section className="space-y-6">
          <div className="h-8 w-48 bg-zinc-800 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${i === 1 ? 'md:col-span-3' : i === 2 ? 'md:col-span-1' : 'md:col-span-2'} h-[300px] bg-zinc-800 rounded`} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  const displayProfile = profile!;

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <AvailableBadge />

          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-zinc-400">
              {displayProfile.heroTitle}
            </span>
            {' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-zinc-500">
              {displayProfile.heroSubtitle}
            </span>
          </h1>

          <p className="text-sm text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
            <TypewriterText text={displayProfile.name} delay={500} />
          </p>

          <div className="flex justify-center lg:justify-start pt-4">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-black font-semibold hover:bg-accent/90 transition-colors">
              Hire Me <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex-shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/20 to-purple-500/20 blur-3xl animate-pulse-slow"></div>
          <img
            src={displayProfile.profileImageUrl}
            alt="Portrait"
            className="relative w-full h-full object-cover rounded-full border-2 border-white/10 shadow-2xl z-10"
          />
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Skills & Tools</h2>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');
          .skill-card:hover .skill-icon { background-color: var(--hover-color) !important; }
          .pixel-font { font-family: 'Silkscreen', monospace; }
        `}</style>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SKILLS.map((skill) => (
            <SpotlightCard key={skill.id} skill={skill}>
              {/* Content */}
              <div className="relative h-full bg-zinc-900/50 p-6 flex flex-col items-center justify-center z-10 border border-zinc-800 rounded-lg">
                {/* Icon - 28x28 with color change on hover */}
                <div
                  className="skill-icon w-7 h-7 transition-all duration-300"
                  style={{
                    WebkitMaskImage: `url(${skill.icon})`,
                    maskImage: `url(${skill.icon})`,
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskPosition: 'center',
                    backgroundColor: skill.initialColor,
                    imageRendering: 'pixelated',
                  }}
                />

                {/* Name - pixel font with increased margin */}
                <h3 className="pixel-font text-sm text-white text-center mt-5">{skill.name}</h3>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* Experience Section - Terminal Style */}
      <section>
        <h2 className="text-xl md:text-3xl lg:text-4xl font-black mb-8 flex flex-wrap items-center gap-2 font-mono tracking-wider">
          <span className="text-accent">root@portfolio</span>
          <span className="text-zinc-600">:</span>
          <span className="text-zinc-600">~</span>
          <span className="text-white">cat experience.txt</span>
        </h2>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-lg backdrop-blur-md">
          {EXPERIENCES.map((exp, index) => (
            <TerminalExperience key={exp.id} experience={exp} index={index} />
          ))}
        </div>
      </section>

      {/* Featured Work - Retro Game Boy Style */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">Featured Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BENTO_ITEMS.map((item) => {
            const colSpan = item.size.includes('col-span-3') ? 'md:col-span-3' :
                           item.size.includes('col-span-2') ? 'md:col-span-2' : 'md:col-span-1';

            return (
              <Link
                key={item.id}
                to={item.link}
                className={`${colSpan} group block relative overflow-hidden transition-all duration-300 border border-zinc-700/50 hover:border-zinc-600/50 min-h-[320px]`}
                style={{
                  backgroundImage: item.image ? `url(${item.image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm group-hover:bg-zinc-900/40 transition-all" />

                {/* Window Title Bar */}
                <div className="relative z-10 flex items-center gap-2 px-3 py-2 border-b border-zinc-700/50 bg-zinc-800/50">
                  {/* Window controls - pixel circles */}
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-600" />
                    <div className="w-3 h-3 rounded-full bg-zinc-600" />
                    <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  </div>
                  {/* Title bar line */}
                  <div className="flex-1 h-3 mx-2" style={{
                    background: 'repeating-linear-gradient(90deg, #52525b 0px, #52525b 8px, transparent 8px, transparent 12px)',
                  }} />
                  {/* View button in title bar - no border */}
                  <span className="pixel-font text-xs text-zinc-500 group-hover:text-accent transition-colors">
                    VIEW
                  </span>
                </div>

                {/* Content Area */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-start pt-4">
                  {/* Title */}
                  <h3 className="pixel-font text-lg mb-2 text-white group-hover:text-accent transition-colors drop-shadow-lg">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-300 drop-shadow-md" style={{ fontFamily: 'monospace' }}>
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
