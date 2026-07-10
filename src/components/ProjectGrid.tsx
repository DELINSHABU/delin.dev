import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects, Project } from '../data/projects';
import { revealBlur, staggerContainer } from '../utils/animations';
import '../styles/ProjectGrid.css';
import WindowBar from './WindowBar';

const ProjectCard = React.memo<{ project: Project }>(({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    card.style.setProperty('--tx', `${((x / rect.width) - 0.5) * 2}`);
    card.style.setProperty('--ty', `${((y / rect.height) - 0.5) * 2}`);
  };

  const handlePointerLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--tx', '0');
    card.style.setProperty('--ty', '0');
  };

  return (
    <motion.div variants={revealBlur}>
      <Link
        to={`/project/${project.slug}`}
        className="project-card-link"
        data-cursor="hover"
      >
        <div
          ref={cardRef}
          className="terminal-window project-card"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="project-card__glow" aria-hidden="true" />
          <WindowBar title={<>~/projects/{project.slug}</>} />
          {project.screenshot && (
            <div className="project-card__preview" aria-hidden="true">
              <img src={project.screenshot} alt="" loading="lazy" />
            </div>
          )}
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
});

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
