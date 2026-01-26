import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UI_PROJECTS } from '../constants';
import { ArrowUpRight } from 'lucide-react';
import { getProjects } from '../lib/contentful';
import { ProjectGridSkeleton } from '../components/Skeleton';
import PageHeader from '../components/PageHeader';
import type { Project } from '../types';

const UIDesign: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        if (data.length > 0) {
          setProjects(data);
        } else {
          setProjects(UI_PROJECTS);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProjects(UI_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="UI Design"
        description="A collection of digital interfaces focusing on usability, accessibility, and visual aesthetics."
      />

      {loading ? (
        <ProjectGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/ui-design/${project.id}`}
              className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/5 hover:border-accent/30 transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-secondary mt-1">{project.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UIDesign;
