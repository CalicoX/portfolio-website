import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <div className="mb-12">
      <h1
        className="pixel-font text-4xl md:text-5xl font-bold mb-4 text-white"
        style={{ textShadow: '2px 2px 0px #22c55e' }}
      >
        {title}
      </h1>
      <p className="text-zinc-400 text-lg max-w-2xl">
        {description}
      </p>
      {children}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');
        .pixel-font { font-family: 'Silkscreen', monospace; }
      `}</style>
    </div>
  );
};

export default PageHeader;
