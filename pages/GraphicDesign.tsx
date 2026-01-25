import React, { useEffect, useState, useRef } from 'react';
import { GRAPHIC_PROJECTS } from '../constants';
import { getGraphicDesignProjects } from '../lib/contentful';
import { PhotoGridSkeleton } from '../components/Skeleton';
import type { Project } from '../types';

const GraphicDesign: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getGraphicDesignProjects();
        if (data.length > 0) {
          setProjects(data);
        } else {
          setProjects(GRAPHIC_PROJECTS);
        }
      } catch (error) {
        console.error('Failed to fetch graphic design projects:', error);
        setProjects(GRAPHIC_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgId = entry.target.getAttribute('data-img-id');
            if (imgId) {
              setVisibleImages(prev => new Set([...prev, imgId]));
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const images = document.querySelectorAll('[data-img-id]');
      images.forEach((img) => {
        observerRef.current?.observe(img);
      });
    }
  }, [loading, projects]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Graphic Design</h2>
        <p className="text-secondary max-w-2xl">
          Visual storytelling through branding, illustration, and print media.
        </p>
      </div>

      {loading ? (
        <PhotoGridSkeleton />
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {projects.map((project) => {
            const isVisible = visibleImages.has(project.id);
            return (
              <div
                key={project.id}
                className="group relative break-inside-avoid mb-6"
              >
                <div className="relative overflow-hidden bg-white/[0.03] border border-white/5">
                  {isVisible ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div
                      data-img-id={project.id}
                      className="w-full h-64 bg-zinc-800/30 animate-pulse"
                    ></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <h3 className="text-xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-zinc-300 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {project.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GraphicDesign;
