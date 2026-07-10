import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProject } from '../data/projects';
import { clipReveal, revealBlur, staggerContainer } from '../utils/animations';
import '../styles/ProjectDetails.css';
import WindowBar from '../components/WindowBar';

const ProjectDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = getProject(slug);

  if (!project) {
    return (
      <div className="project-details-page">
        <div className="terminal-window project-404">
          <WindowBar title="~/projects" />
          <div className="terminal-window__body">
            <p className="prompt-line">
              <span className="prompt-symbol">$</span> open {slug}
            </p>
            <p className="error-line">
              bash: {slug}: No such file or directory
            </p>
            <Link to="/" className="terminal-link">
              <span className="prompt-symbol">$</span> cd ~ <span className="link-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      <motion.div
        className="project-details-container"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={revealBlur}>
          <Link to="/" state={{ fromProject: true }} className="terminal-link back-link">
            <span className="prompt-symbol">$</span> cd ..
          </Link>
        </motion.div>

        <motion.p className="project-path" variants={revealBlur}>
          <span className="prompt-symbol">$</span> cat ~/projects/{project.slug}.md
        </motion.p>

        <motion.h1 className="project-title" variants={clipReveal}>
          {project.title}
        </motion.h1>

        <motion.p className="project-tagline" variants={revealBlur}>
          {project.tagline}
        </motion.p>

        <motion.div className="project-stack" variants={revealBlur}>
          {project.stack.map((tech) => (
            <span key={tech} className="stack-chip">
              [{tech}]
            </span>
          ))}
        </motion.div>

        <motion.p className="project-description" variants={revealBlur}>
          {project.description}
        </motion.p>

        <motion.div className="project-links" variants={revealBlur}>
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-button terminal-button--primary"
            >
              [ ./live-demo ]
            </a>
          )}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-button"
            >
              [ ./source ]
            </a>
          )}
        </motion.div>

        <div className="project-panes">
          <motion.div className="terminal-window" variants={revealBlur}>
            <WindowBar title="features.log" />
            <ul className="terminal-window__body pane-list">
              {project.features.map((feature) => (
                <li key={feature}>
                  <span className="pane-bullet">▸</span> {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="terminal-window" variants={revealBlur}>
            <WindowBar title="challenges.log" />
            <ul className="terminal-window__body pane-list">
              {project.challenges.map((challenge) => (
                <li key={challenge}>
                  <span className="pane-bullet">▸</span> {challenge}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDetails;
