import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import '../styles/ProjectDetails.css';

interface Technology {
  name: string;
  icon: string;
}

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  technologies: Technology[];
  liveLink?: string;
  githubLink?: string;
  features: string[];
  challenges: string[];
  screenshots: string[];
}

const projects: Record<string, ProjectDetail> = {
  'project-one': {
    id: 'project-one',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution',
    longDescription: `A comprehensive e-commerce platform built with React.js and Node.js. 
    This project showcases advanced features like real-time inventory management, 
    secure payment processing, and a responsive user interface.`,
    imageUrl: '/project1.jpg',
    technologies: [
      { name: 'React.js', icon: 'fab fa-react' },
      { name: 'Node.js', icon: 'fab fa-node-js' },
      { name: 'MongoDB', icon: 'fas fa-database' },
      { name: 'TypeScript', icon: 'fas fa-code' }
    ],
    liveLink: 'https://example.com/ecommerce',
    githubLink: 'https://github.com/example/ecommerce',
    features: [
      'User authentication and authorization',
      'Product catalog with search and filtering',
      'Shopping cart and checkout process',
      'Admin dashboard for inventory management'
    ],
    challenges: [
      'Implementing real-time inventory updates',
      'Optimizing database queries for performance',
      'Ensuring secure payment processing',
      'Building responsive UI for all devices'
    ],
    screenshots: ['/project1-screenshot1.jpg', '/project1-screenshot2.jpg', '/project1-screenshot3.jpg']
  },
  'project-two': {
    id: 'project-two',
    title: 'Task Management App',
    description: 'Real-time task management with full-stack capabilities',
    longDescription: `A collaborative task management application that allows teams to organize, 
    track, and manage their projects effectively. Features real-time updates and intuitive UI.`,
    imageUrl: '/project2.jpg',
    technologies: [
      { name: 'React.js', icon: 'fab fa-react' },
      { name: 'Firebase', icon: 'fas fa-fire' },
      { name: 'Redux', icon: 'fas fa-layer-group' },
      { name: 'SCSS', icon: 'fab fa-sass' }
    ],
    liveLink: 'https://example.com/taskapp',
    githubLink: 'https://github.com/example/taskapp',
    features: [
      'Real-time collaboration',
      'Task assignment and tracking',
      'Project timeline visualization',
      'File sharing and comments'
    ],
    challenges: [
      'Implementing real-time updates',
      'Managing complex state',
      'Optimizing performance',
      'Building intuitive UI'
    ],
    screenshots: ['/project2-screenshot1.jpg', '/project2-screenshot2.jpg', '/project2-screenshot3.jpg']
  },
  'project-three': {
    id: 'project-three',
    title: 'Portfolio Website',
    description: 'Modern UI/UX Design with React and TypeScript',
    longDescription: `A modern portfolio website built with React and TypeScript. 
    Features a clean, responsive design with smooth animations and interactive elements.`,
    imageUrl: '/project3.jpg',
    technologies: [
      { name: 'React', icon: 'fab fa-react' },
      { name: 'TypeScript', icon: 'fas fa-code' },
      { name: 'CSS Modules', icon: 'fab fa-css3' },
      { name: 'Framer Motion', icon: 'fas fa-film' }
    ],
    liveLink: 'https://example.com/portfolio',
    githubLink: 'https://github.com/example/portfolio',
    features: [
      'Responsive design',
      'Dark/Light theme',
      'Smooth animations',
      'Project showcase'
    ],
    challenges: [
      'Implementing smooth animations',
      'Optimizing performance',
      'Creating responsive layouts',
      'Managing theme system'
    ],
    screenshots: ['/project3-screenshot1.jpg', '/project3-screenshot2.jpg', '/project3-screenshot3.jpg']
  },
  'project-four': {
    id: 'project-four',
    title: 'Mobile Chat App',
    description: 'React Native application with Firebase backend',
    longDescription: `A cross-platform mobile chat application built with React Native and Firebase. 
    Features real-time messaging, file sharing, and user presence system.`,
    imageUrl: '/project4.jpg',
    technologies: [
      { name: 'React Native', icon: 'fab fa-react' },
      { name: 'Firebase', icon: 'fas fa-fire' },
      { name: 'TypeScript', icon: 'fas fa-code' },
      { name: 'Redux', icon: 'fas fa-layer-group' }
    ],
    liveLink: 'https://example.com/chatapp',
    githubLink: 'https://github.com/example/chatapp',
    features: [
      'Real-time messaging',
      'File sharing',
      'User presence system',
      'Push notifications'
    ],
    challenges: [
      'Managing real-time connections',
      'Implementing push notifications',
      'Optimizing app performance',
      'Cross-platform compatibility'
    ],
    screenshots: ['/project4-screenshot1.jpg', '/project4-screenshot2.jpg', '/project4-screenshot3.jpg']
  }
};

const ProjectDetails: React.FC = () => {
  const { theme } = useTheme();
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? projects[projectId] : null;

  if (!project) {
    return (
      <div className={`page ${theme}`}>
        <Header />
        <div className="project-not-found">
          <h2>Project not found</h2>
          <Link to="/projects" className="back-button">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`page ${theme}`}>
      <Header />
      <main className="project-details">
        <div className="project-details-container">
          <Link to="/projects" className="back-button">
            <i className="fas fa-arrow-left"></i> Back to Projects
          </Link>
          
          <section className="project-hero">
            <img src={project.imageUrl} alt={project.title} className="project-hero-image" />
            <div className="project-hero-content">
              <h1>{project.title}</h1>
              <p className="project-description">{project.longDescription}</p>
              <div className="project-links">
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link">
                    <i className="fas fa-external-link-alt"></i> Live Demo
                  </a>
                )}
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link">
                    <i className="fab fa-github"></i> View Code
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="project-technologies">
            <h2>Technologies Used</h2>
            <div className="technologies-grid">
              {project.technologies.map((tech, index) => (
                <div key={index} className="technology-item">
                  <i className={tech.icon}></i>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="project-details-grid">
            <section className="project-features">
              <h2>Key Features</h2>
              <ul>
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </section>

            <section className="project-challenges">
              <h2>Challenges & Solutions</h2>
              <ul>
                {project.challenges.map((challenge, index) => (
                  <li key={index}>{challenge}</li>
                ))}
              </ul>
            </section>
          </div>

          <section className="project-screenshots">
            <h2>Screenshots</h2>
            <div className="screenshots-grid">
              {project.screenshots.map((screenshot, index) => (
                <img key={index} src={screenshot} alt={`${project.title} screenshot ${index + 1}`} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
