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
