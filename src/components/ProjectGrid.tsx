import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer } from '../utils/animations';
import '../styles/ProjectGrid.css';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imageUrl, link }) => {
  const handleClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div 
      className="project-card"
      variants={fadeInUp}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      whileHover={{
        y: -10,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div className="project-content">
        {imageUrl && (
          <motion.img 
            src={imageUrl} 
            alt={title} 
            className="project-image"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        )}
        <motion.div 
          className="project-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3>{title}</h3>
          <p>{description}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ProjectGrid: React.FC = () => {
  const { ref, isInView } = useScrollAnimation();

  const projects = [
    {
      id: "bloom-cafe-pos",
      title: "Bloom Cafe POS",
      description: "Full-stack Point of Sale application for cafe management",
      imageUrl: new URL('../Screenshots/BloomCafePOS.png', import.meta.url).href,
      link: "https://github.com/DELINSHABU/BloomCafePOS"
    },
    {
      id: "stylewav-ecommerce",
      title: "StyleWav E-Commerce",
      description: "Modern e-commerce platform built with MERN stack",
      imageUrl: new URL('../Screenshots/StyleWavE-Commerce.png', import.meta.url).href,
      link: "https://github.com/DELINSHABU/StyleWav"
    },
    {
      id: "job-tracker",
      title: "Job Applying Tracker",
      description: "Track and manage job applications efficiently",
      imageUrl: new URL('../Screenshots/JobApplyingTracker.png', import.meta.url).href,
      link: "https://github.com/DELINSHABU/Job-Applying-Tracker"
    },
    {
      id: "anomaly-design-studio",
      title: "Anomaly Design Studio",
      description: "Portfolio website for an architecture and interior design studio",
      imageUrl: new URL('../Screenshots/AnomalyDesignStudio.png', import.meta.url).href,
      link: "https://anomalydesignstudio.com/"
    }
  ];

  return (
    <section className="projects-section" id="projects">
      <motion.div 
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {/* <motion.h2 variants={fadeInUp}>My Projects</motion.h2> */}
        <motion.div className="projects-grid" variants={staggerContainer}>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProjectGrid;
