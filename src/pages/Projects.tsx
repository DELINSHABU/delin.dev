import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/ProjectGrid.css';
import ProjectGrid from '../components/ProjectGrid';

const Projects: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`page ${theme}`}>
      <h1 className="section-title">Projects</h1>
      <ProjectGrid />
    </div>
  );
};

export default Projects;
