import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import ProjectGrid from '../components/ProjectGrid';
import { useParallax } from '../hooks/useParallax';

const Projects: React.FC = () => {
  const headingParallax = useParallax(0.06);

  return (
    <div className="projects-page">
      <motion.div
        ref={headingParallax.ref}
        style={{ y: headingParallax.y }}
      >
        <SectionHeading index="03" label="projects" />
      </motion.div>
      <ProjectGrid />
    </div>
  );
};

export default Projects;
