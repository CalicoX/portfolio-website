import React from 'react';

// Pixel-style skeleton card
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white/[0.02] border border-white/5 ${className}`}>
    <div className="animate-pulse">
      <div className="h-40 bg-zinc-800/50"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-zinc-800/50 w-3/4"></div>
        <div className="h-3 bg-zinc-800/50 w-1/2"></div>
      </div>
    </div>
  </div>
);

// Pixel-style skeleton text
export const SkeletonText: React.FC<{ width?: string; lines?: number; className?: string }> = ({
  width = 'w-full',
  lines = 1,
  className = ''
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-zinc-800/50 animate-pulse ${i === lines - 1 ? 'w-3/4' : width}`}
      ></div>
    ))}
  </div>
);

// Pixel-style skeleton avatar
export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };
  return (
    <div className={`${sizeMap[size]} bg-zinc-800/50 animate-pulse`}></div>
  );
};

// Grid skeleton for projects
export const ProjectGridSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

// Page skeleton with title and content
export const PageSkeleton: React.FC<{ title?: string }> = ({ title = '' }) => (
  <div className="space-y-8">
    <div className="space-y-2">
      {title && <div className="h-8 bg-zinc-800/50 w-48 animate-pulse"></div>}
      <SkeletonText className="max-w-2xl" lines={2} />
    </div>
    <ProjectGridSkeleton />
  </div>
);

// Detail page skeleton
export const DetailPageSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Back button */}
    <div className="h-6 bg-zinc-800/50 w-32 animate-pulse"></div>

    {/* Header */}
    <div className="space-y-4">
      <div className="h-4 bg-zinc-800/50 w-24 animate-pulse"></div>
      <div className="h-10 bg-zinc-800/50 w-3/4 animate-pulse"></div>
      <div className="h-5 bg-zinc-800/50 w-1/2 animate-pulse"></div>
    </div>

    {/* Image */}
    <div className="h-80 bg-zinc-800/50 animate-pulse"></div>

    {/* Info */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-white/10">
      <div className="h-16 bg-zinc-800/50 animate-pulse"></div>
      <div className="h-16 bg-zinc-800/50 animate-pulse"></div>
    </div>

    {/* Content */}
    <div className="space-y-3">
      <SkeletonText lines={8} />
    </div>

    {/* Gallery */}
    <div className="space-y-4">
      <div className="h-6 bg-zinc-800/50 w-24 animate-pulse"></div>
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 bg-zinc-800/50 animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

// Photo grid skeleton (masonry style for Graphic Design)
export const PhotoGridSkeleton: React.FC = () => (
  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="break-inside-avoid mb-6">
        <div className="h-64 bg-zinc-800/30 animate-pulse"></div>
      </div>
    ))}
  </div>
);

// Photos page skeleton (Coverflow style)
export const PhotosPageSkeleton: React.FC = () => (
  <div className="h-[calc(100vh-96px)] md:h-[calc(100vh-48px)] flex flex-col overflow-hidden -mb-24 md:-mb-12 relative">
    {/* Header */}
    <div className="space-y-1 flex-shrink-0">
      <div className="h-7 bg-zinc-800/30 w-28 animate-pulse rounded"></div>
      <div className="h-4 bg-zinc-800/30 w-48 animate-pulse rounded"></div>
    </div>

    {/* CoverFlow Container */}
    <div className="relative flex-1 flex items-center justify-center overflow-hidden">
      {/* Navigation Buttons */}
      <div className="absolute left-4 w-12 h-12 bg-zinc-800/50 rounded-full animate-pulse"></div>
      <div className="absolute right-4 w-12 h-12 bg-zinc-800/50 rounded-full animate-pulse"></div>

      {/* Position Indicator */}
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-zinc-800/50 rounded-full w-16 h-8 animate-pulse"></div>

      {/* Center Card with Reflection */}
      <div className="relative">
        <div className="w-[200px] h-[280px] bg-zinc-800/30 rounded-lg animate-pulse"></div>
        <div className="mt-1 w-[200px] h-[60px] bg-zinc-800/20 rounded-lg animate-pulse opacity-40"></div>
      </div>

      {/* Side Cards */}
      <div className="absolute left-16 opacity-40">
        <div className="w-[140px] h-[200px] bg-zinc-800/30 rounded-lg animate-pulse"></div>
        <div className="mt-1 w-[140px] h-[40px] bg-zinc-800/20 rounded-lg animate-pulse opacity-40"></div>
      </div>
      <div className="absolute right-16 opacity-40">
        <div className="w-[140px] h-[200px] bg-zinc-800/30 rounded-lg animate-pulse"></div>
        <div className="mt-1 w-[140px] h-[40px] bg-zinc-800/20 rounded-lg animate-pulse opacity-40"></div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <div className="h-5 bg-zinc-800/30 w-32 mx-auto mb-2 animate-pulse rounded"></div>
        <div className="h-4 bg-zinc-800/30 w-24 mx-auto animate-pulse rounded"></div>
      </div>
    </div>

    {/* Thumbnail Dock */}
    <div className="flex-shrink-0 mt-auto mb-4 flex justify-center">
      <div className="bg-zinc-800/40 rounded-2xl px-3 py-2">
        <div className="flex items-end gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`bg-zinc-700/50 rounded-lg animate-pulse ${
                i === 2 ? 'w-11 h-11 ring-2 ring-zinc-600/50' : 'w-10 h-10'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
