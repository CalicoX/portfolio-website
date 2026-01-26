import React, { useEffect, useState, useRef } from 'react';
import { MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PhotosPageSkeleton } from '../components/Skeleton';
import MatrixBackground from '../components/MatrixBackground';
import PageHeader from '../components/PageHeader';
import { getPhotos } from '../lib/contentful';
import type { Photo } from '../types';

const Photos: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardSize, setCardSize] = useState({ width: 280, height: 360 });
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mobileFullscreen, setMobileFullscreen] = useState<Photo | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch photos from Contentful
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPhotos();
        setPhotos(data);
      } catch (error) {
        console.error('Failed to fetch photos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  // Calculate card size based on viewport
  useEffect(() => {
    const calculateSize = () => {
      const vh = window.innerHeight;
      // header(50px) + thumbnail(70px) + info(60px) + reflection(~28%) + paddings
      const availableHeight = vh - 230;
      const cardHeight = Math.min(Math.max(availableHeight * 0.68, 180), 420);
      const cardWidth = cardHeight * 0.72;
      setCardSize({ width: cardWidth, height: cardHeight });
    };
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);


  // Keyboard navigation with loop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto) {
        if (e.key === 'Escape') {
          closeModal();
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      } else if (e.key === 'Enter') {
        handlePhotoClick(photos[currentIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos, selectedPhoto]);

  // Mouse wheel navigation with throttle
  useEffect(() => {
    let lastTime = 0;
    const throttleDelay = 300; // ms between switches

    const handleWheel = (e: WheelEvent) => {
      if (selectedPhoto) return;
      e.preventDefault();

      const now = Date.now();
      if (now - lastTime < throttleDelay) return;
      lastTime = now;

      if (e.deltaY > 0 || e.deltaX > 0) {
        // Loop to first when at end
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      } else if (e.deltaY < 0 || e.deltaX < 0) {
        // Loop to last when at beginning
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [photos.length, selectedPhoto]);

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsFlipped(false);
    // Trigger flip animation after a short delay
    setTimeout(() => setIsFlipped(true), 50);
  };

  const closeModal = () => {
    setIsFlipped(false);
    setTimeout(() => setSelectedPhoto(null), 300);
  };

  const getCardStyle = (index: number) => {
    const diff = index - currentIndex;
    const absDiff = Math.abs(diff);

    // Tighter spacing for more compact coverflow
    const spacing = cardSize.width * 0.55;
    const translateX = diff * spacing;
    const translateZ = -absDiff * 100;
    const rotateY = diff * -50;
    const scale = absDiff === 0 ? 1 : 0.7 - absDiff * 0.05;
    const opacity = absDiff > 4 ? 0 : 1 - absDiff * 0.15;
    const zIndex = 100 - absDiff;

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  return (
    <div className="h-[calc(100vh-96px)] md:h-[calc(100vh-48px)] flex flex-col overflow-hidden -mb-24 md:-mb-12 relative">
      {/* Matrix Background */}
      <MatrixBackground opacity={0.12} />
      {/* Header */}
      <div className="flex-shrink-0 mb-2 md:mb-4">
        <PageHeader
          title="Photography"
          description={isMobile ? "Swipe to explore." : "Capturing moments from around the world. ← → or scroll to navigate."}
        />
      </div>

      {/* Cover Flow Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');
        .coverflow-container {
          perspective: 1000px;
          perspective-origin: 50% 50%;
          background: radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 50%);
        }
        .coverflow-item {
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .coverflow-item:hover {
          filter: brightness(1.1);
        }
        .modal-card {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .modal-card.flipped {
          transform: rotateY(360deg) scale(1);
        }
        .modal-card:not(.flipped) {
          transform: rotateY(0deg) scale(0.5);
        }
        .reflection {
          transform: scaleY(-1);
          mask-image: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%);
          -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 70%);
        }
        .pixel-font { font-family: 'Silkscreen', monospace; }
        .content-blur {
          filter: blur(10px) brightness(0.5);
          transition: filter 0.3s ease;
        }
      `}</style>

      {loading ? (
        <PhotosPageSkeleton />
      ) : isMobile ? (
        <>
          {/* Mobile Layout - Horizontal scrolling cards */}
          <div
            className="flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-6 px-6 flex items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: '80px' }}
          >
            <div className="flex gap-4 items-center" style={{ height: 'calc(100% - 16px)' }}>
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="snap-center flex-shrink-0 relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer active:scale-95 transition-transform"
                  style={{ height: '100%', aspectRatio: '3/4' }}
                  onClick={() => setMobileFullscreen(photo)}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {/* Info overlay with glassmorphism */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/40 backdrop-blur-md">
                    <h3 className="pixel-font text-sm text-white mb-0.5">{photo.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                      <MapPin size={10} />
                      <span>{photo.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Fullscreen Modal */}
          {mobileFullscreen && (
            <div
              className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
              onClick={() => setMobileFullscreen(null)}
            >
              <img
                src={mobileFullscreen.imageUrl}
                alt={mobileFullscreen.title}
                className="w-full h-full object-contain"
              />
              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="pixel-font text-xl text-white mb-1">{mobileFullscreen.title}</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <MapPin size={14} />
                  <span>{mobileFullscreen.location}</span>
                </div>
              </div>
              {/* Tap hint */}
              <div className="absolute top-6 right-6 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full">
                <span className="text-xs text-white/70">Tap to close</span>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Desktop Layout - Cover Flow */
        <>
          {/* Cover Flow */}
          <div className={`relative flex-1 flex items-center justify-center overflow-hidden transition-all duration-300 ${selectedPhoto ? 'content-blur' : ''}`}>
            {/* Navigation Buttons */}
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
              className="absolute left-4 z-50 p-3 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-full hover:bg-zinc-700 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
              className="absolute right-4 z-50 p-3 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-full hover:bg-zinc-700 transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            {/* Position Indicator */}
            <div className="absolute top-4 right-4 z-50 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-full">
              <span className="pixel-font text-xs text-accent">{currentIndex + 1}</span>
              <span className="text-zinc-500 text-xs mx-1">/</span>
              <span className="pixel-font text-xs text-zinc-400">{photos.length}</span>
            </div>

            {/* Cover Flow Container */}
            <div
              ref={containerRef}
              className="coverflow-container relative w-full h-full flex items-center justify-center"
            >
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="coverflow-item absolute cursor-pointer"
                  style={getCardStyle(index)}
                  onClick={() => {
                    if (index === currentIndex) {
                      handlePhotoClick(photo);
                    } else {
                      setCurrentIndex(index);
                    }
                  }}
                >
                  {/* Main Image */}
                  <div className="relative">
                    <div
                      className="rounded-lg overflow-hidden bg-zinc-900"
                      style={{
                        width: cardSize.width,
                        height: cardSize.height,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      {/* Gloss effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/10 pointer-events-none" />
                    </div>

                    {/* Reflection */}
                    <div
                      className="mt-1 overflow-hidden relative"
                      style={{ width: cardSize.width, height: cardSize.height * 0.3 }}
                    >
                      <img
                        src={photo.imageUrl}
                        alt=""
                        className="reflection absolute bottom-0 w-full object-cover object-top opacity-40 blur-[0.5px]"
                        style={{ height: cardSize.height }}
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Current Photo Info */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-50">
              <h3 className="pixel-font text-lg text-white mb-1">{photos[currentIndex]?.title}</h3>
              <div className="flex items-center justify-center gap-3 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{photos[currentIndex]?.location}</span>
                </div>
                {photos[currentIndex]?.date && (
                  <span className="text-zinc-500">{photos[currentIndex]?.date}</span>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnail Preview - Dock Style (Desktop only) */}
          <div className={`flex-shrink-0 mt-auto mb-4 flex justify-center transition-all duration-300 ${selectedPhoto ? 'content-blur' : ''}`}>
            <div className="bg-zinc-800/60 backdrop-blur-xl border border-zinc-600/50 rounded-2xl px-3 py-2 shadow-lg">
              <div className="flex items-end gap-1.5">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative rounded-lg overflow-hidden transition-all duration-200 ease-out hover:scale-125 hover:-translate-y-2 ${
                      index === currentIndex
                        ? 'w-11 h-11 ring-2 ring-accent/80 scale-110 -translate-y-1'
                        : 'w-10 h-10 opacity-70 hover:opacity-100 grayscale hover:grayscale-0'
                    }`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 3D Flip Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 p-2 bg-zinc-800/80 border border-zinc-700 rounded-full hover:bg-zinc-700 transition-colors z-50"
          >
            <X size={24} />
          </button>

          <div
            className={`modal-card ${isFlipped ? 'flipped' : ''}`}
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: '1500px' }}
          >
            <div className="relative">
              {/* Large Image */}
              <div className="max-w-[80vw] max-h-[80vh] rounded-xl overflow-hidden border-4 border-zinc-700 shadow-2xl">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[70vh] object-contain bg-zinc-900"
                />
              </div>

              {/* Photo Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="pixel-font text-2xl text-white mb-2">{selectedPhoto.title}</h3>
                <div className="flex items-center gap-2 text-zinc-300">
                  <MapPin size={16} />
                  <span>{selectedPhoto.location}</span>
                </div>
              </div>

              {/* Corner decorations - pixel style */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-accent" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-accent" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-accent" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-accent" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
