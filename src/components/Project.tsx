import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProjectGrid.css';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, description, imageUrl }) => {
  return (
    <Link to={`/projects/${id}`} className="project-card">
      <div className="project-content">
        {imageUrl && <img src={imageUrl} alt={title} className="project-image" />}
        <div className="project-info">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  );
};

const ProjectComponent: React.FC = () => {
  const projects = [
    {
      id: 'project-one',
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with React.js and Node.js",
      link: "#",
      imageUrl: "/project1.jpg"
    },
    {
      id: 'project-two',
      title: "Task Management App",
      description: "Full Stack Development with real-time updates",
      link: "#",
      imageUrl: "/project2.jpg"
    },
    {
      id: 'project-three',
      title: "Portfolio Website",
      description: "Modern UI/UX Design with React and TypeScript",
      link: "#",
      imageUrl: "/project3.jpg"
    },
    {
      id: 'project-four',
      title: "Mobile Chat App",
      description: "React Native application with Firebase backend",
      link: "#",
      imageUrl: "/project4.jpg"
    }
  ];

  return (
    <section className="projects-section">
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
};

export default ProjectComponent;
