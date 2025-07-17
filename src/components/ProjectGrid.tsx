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
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, imageUrl }) => {
  return (
    <motion.div 
      className="project-card"
      variants={fadeInUp}
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
      id: "project-one",
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React.js and Node.js",
      imageUrl: "/project1.jpg"
    },
    {
      id: "project-two",
      title: "Task Management App",
      description: "Real-time task management with full-stack capabilities",
      imageUrl: "/project2.jpg"
    },
    {
      id: "project-three",
      title: "Portfolio Website",
      description: "Modern UI/UX Design with React and TypeScript",
      imageUrl: "/project3.jpg"
    },
    {
      id: "project-four",
      title: "Mobile Chat App",
      description: "React Native application with Firebase backend",
      imageUrl: "/project4.jpg"
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
