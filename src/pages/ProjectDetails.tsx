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
  'bloom-cafe-pos': {
    id: 'bloom-cafe-pos',
    title: 'Bloom Cafe POS',
    description: 'Full-stack Point of Sale application for cafe management',
    longDescription: `A comprehensive Point of Sale system designed for cafe operations. 
    Built with the MERN stack, featuring order management, inventory tracking, 
    and sales analytics — because even coffee shops deserve clean code.`,
    imageUrl: '/project1.jpg',
    technologies: [
      { name: 'React.js', icon: 'fab fa-react' },
      { name: 'Node.js', icon: 'fab fa-node-js' },
      { name: 'MongoDB', icon: 'fas fa-database' },
      { name: 'Express', icon: 'fas fa-server' }
    ],
    githubLink: 'https://github.com/DELINSHABU/BloomCafePOS',
    features: [
      'Order management system',
      'Real-time inventory tracking',
      'Sales analytics dashboard',
      'Multi-user support with roles'
    ],
    challenges: [
      'Building real-time order updates',
      'Implementing secure payment flow',
      'Optimizing for high-traffic usage',
      'Creating intuitive cashier interface'
    ],
    screenshots: ['/project1-screenshot1.jpg', '/project1-screenshot2.jpg', '/project1-screenshot3.jpg']
  },
  'stylewav-ecommerce': {
    id: 'stylewav-ecommerce',
    title: 'StyleWav E-Commerce',
    description: 'Modern e-commerce platform built with MERN stack',
    longDescription: `A full-featured e-commerce platform for fashion and lifestyle products. 
    Features product catalog, shopping cart, secure checkout, and admin dashboard — 
    shipping style, one commit at a time.`,
    imageUrl: '/project2.jpg',
    technologies: [
      { name: 'React.js', icon: 'fab fa-react' },
      { name: 'Node.js', icon: 'fab fa-node-js' },
      { name: 'MongoDB', icon: 'fas fa-database' },
      { name: 'Express', icon: 'fas fa-server' }
    ],
    githubLink: 'https://github.com/DELINSHABU/StyleWav',
    features: [
      'Product catalog with filtering',
      'Shopping cart and wishlist',
      'Secure checkout process',
      'Admin dashboard for management'
    ],
    challenges: [
      'Implementing secure payments',
      'Building responsive product galleries',
      'Optimizing search and filtering',
      'Managing complex cart state'
    ],
    screenshots: ['/project2-screenshot1.jpg', '/project2-screenshot2.jpg', '/project2-screenshot3.jpg']
  },
  'job-tracker': {
    id: 'job-tracker',
    title: 'Job Applying Tracker',
    description: 'Track and manage job applications efficiently',
    longDescription: `A productivity tool to track job applications, interview stages, and follow-ups. 
    Built to stay organized during the job hunt — because spreadsheets are so 2010.`,
    imageUrl: '/project3.jpg',
    technologies: [
      { name: 'React.js', icon: 'fab fa-react' },
      { name: 'TypeScript', icon: 'fas fa-code' },
      { name: 'Firebase', icon: 'fas fa-fire' },
      { name: 'CSS', icon: 'fab fa-css3' }
    ],
    githubLink: 'https://github.com/DELINSHABU/Job-Applying-Tracker',
    features: [
      'Application status tracking',
      'Interview stage management',
      'Follow-up reminders',
      'Analytics and insights'
    ],
    challenges: [
      'Designing intuitive workflow',
      'Implementing data persistence',
      'Building responsive dashboard',
      'Creating useful analytics'
    ],
    screenshots: ['/project3-screenshot1.jpg', '/project3-screenshot2.jpg', '/project3-screenshot3.jpg']
  },
  'anomaly-design-studio': {
    id: 'anomaly-design-studio',
    title: 'Anomaly Design Studio',
    description: 'Portfolio website for an architecture and interior design studio',
    longDescription: `A sleek portfolio website for Anomaly Design Studio, showcasing architecture 
    and interior design projects. Built with modern web technologies to highlight creative work — 
    where code meets concrete.`,
    imageUrl: '/project4.jpg',
    technologies: [
      { name: 'React.js', icon: 'fab fa-react' },
      { name: 'TypeScript', icon: 'fas fa-code' },
      { name: 'CSS', icon: 'fab fa-css3' },
      { name: 'Framer Motion', icon: 'fas fa-film' }
    ],
    liveLink: 'https://anomalydesignstudio.com/',
    features: [
      'Project portfolio showcase',
      'Responsive gallery design',
      'Smooth animations',
      'Contact integration'
    ],
    challenges: [
      'Creating visual-first design',
      'Optimizing image loading',
      'Building responsive layouts',
      'Balancing aesthetics with performance'
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
