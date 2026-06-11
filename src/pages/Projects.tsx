import React from 'react';
import SectionHeading from '../components/SectionHeading';
import ProjectGrid from '../components/ProjectGrid';

const Projects: React.FC = () => (
  <div className="projects-page">
    <SectionHeading index="03" label="projects" />
    <ProjectGrid />
  </div>
);

export default Projects;
