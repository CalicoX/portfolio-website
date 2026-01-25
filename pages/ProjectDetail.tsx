import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building, Wrench, Tag } from 'lucide-react';
import type { ProjectDetail } from '../types';
import { getProjectById } from '../lib/contentful';
import { DetailPageSkeleton } from '../components/Skeleton';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id || '');
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        // Fallback to mock data if Contentful is not configured
        const mockProject: ProjectDetail = {
          id: id || '1',
          title: 'Finance Dashboard',
          category: 'Web App',
          description: 'A comprehensive financial management platform designed for modern businesses.',
          content: `This project involved creating a complete financial dashboard that helps businesses track their revenue, expenses, and financial health in real-time.

The challenge was to present complex financial data in an intuitive and accessible way. We worked closely with financial experts to understand the key metrics that matter most to business owners.

Key features include:
- Real-time data visualization
- Customizable dashboard widgets
- Multi-currency support
- Exportable reports
- Secure data encryption

The design emphasizes clarity and trust, using a clean layout with strategic use of color to highlight important information.`,
          tags: ['Dashboard', 'Fintech', 'Web App', 'Data Visualization'],
          year: '2024',
          client: 'FinTech Co.',
          tools: ['Figma', 'React', 'TypeScript', 'D3.js'],
          imageUrl: `https://picsum.photos/800/600?random=${id}`,
          gallery: [
            `https://picsum.photos/1200/800?random=${id}1`,
            `https://picsum.photos/1200/800?random=${id}2`,
            `https://picsum.photos/1200/800?random=${id}3`,
          ],
        };
        setProject(mockProject);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return <DetailPageSkeleton />;
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-secondary">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate('/ui-design')}
        className="flex items-center gap-2 text-secondary hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        <span>Back to UI Design</span>
      </button>

      {/* Main Content - 768px max width */}
      <div className="max-w-[768px] mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{project.category}</span>
            {project.year && (
              <span className="flex items-center gap-1 text-sm text-secondary">
                <Calendar size={14} />
                {project.year}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold">{project.title}</h1>
          {project.description && (
            <p className="text-xl text-secondary">{project.description}</p>
          )}
        </div>

        {/* Cover Image */}
        <div className="rounded-2xl overflow-hidden border border-white/5">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-auto"
          />
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y border-white/10">
          {project.client && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-secondary text-sm">
                <Building size={16} />
                <span>Client</span>
              </div>
              <p className="font-medium">{project.client}</p>
            </div>
          )}
          {project.tools && project.tools.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-secondary text-sm">
                <Wrench size={16} />
                <span>Tools</span>
              </div>
              <p className="font-medium">{project.tools.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Content */}
        {project.content && (
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-secondary leading-relaxed">
              {project.content}
            </div>
          </div>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 rounded-lg text-sm text-secondary"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-1 gap-4">
              {project.gallery.map((image, index) => (
                <div key={index} className="rounded-xl overflow-hidden border border-white/5">
                  <img
                    src={image}
                    alt={`${project.title} ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
