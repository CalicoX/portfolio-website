import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UIDesign from './pages/UIDesign';
import ProjectDetailPage from './pages/ProjectDetail';
import GraphicDesign from './pages/GraphicDesign';
import Photos from './pages/Photos';
import Contact from './pages/Contact';
import { getNavigation } from './lib/contentful';
import { NavItem } from './types';

// Page component mapping
const PAGE_COMPONENTS: Record<string, React.ComponentType> = {
  '/ui-design': UIDesign,
  '/graphic-design': GraphicDesign,
  '/photos': Photos,
  '/contact': Contact,
};

function App() {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNav = async () => {
      const data = await getNavigation();
      setNavItems(data);
      setLoading(false);
    };
    fetchNav();
  }, []);

  if (loading) {
    return (
      <Router>
        <Layout />
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* UI Design routes */}
          <Route path="ui-design" element={<UIDesign />} />
          <Route path="ui-design/:id" element={<ProjectDetailPage />} />

          {/* Dynamic routes based on navigation */}
          {navItems.map((item) => {
            if (item.path === '/' || item.path === '/ui-design' || item.path.startsWith('/ui-design/')) {
              return null;
            }
            const Component = PAGE_COMPONENTS[item.path];
            if (Component) {
              return <Route key={item.id} path={item.path.slice(1)} element={<Component />} />;
            }
            return null;
          }).filter(Boolean)}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
