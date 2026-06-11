import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects, Project } from '../data/projects';
import { revealBlur, staggerContainer } from '../utils/animations';
import '../styles/ProjectGrid.css';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // pointer-tracked radial border glow via CSS vars
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <motion.div variants={revealBlur}>
      <Link to={`/project/${project.slug}`} className="project-card-link">
        <div
          ref={cardRef}
          className="terminal-window project-card"
          onPointerMove={handlePointerMove}
        >
          <div className="project-card__glow" aria-hidden="true" />
          <div className="terminal-window__bar">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
            <span className="terminal-window__title">
              ~/projects/{project.slug}
            </span>
          </div>
          <div className="terminal-window__body project-card__body">
            <h3 className="project-card__title">{project.title}</h3>
            <p className="project-card__tagline">{project.tagline}</p>
            <div className="project-card__stack">
              {project.stack.map((tech) => (
                <span key={tech} className="stack-chip">
                  [{tech}]
                </span>
              ))}
            </div>
            <span className="project-card__open">
              open <span className="link-arrow">→</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ProjectGrid: React.FC = () => (
  <motion.div
    className="projects-grid"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={staggerContainer}
  >
    {projects.map((project) => (
      <ProjectCard key={project.slug} project={project} />
    ))}
  </motion.div>
);

export default ProjectGrid;
