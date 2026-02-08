import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="mb-6 md:mb-12">
      <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 text-white">
        {title}
      </h1>
      <p className="text-zinc-400 text-sm md:text-lg max-w-2xl">
        {description}
      </p>
      {children}
    </div>
  );
};

export default PageHeader;
