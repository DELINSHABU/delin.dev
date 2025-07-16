import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/About.css';

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description }) => {
  return (
    <div className="timeline-item">
      <div className="timeline-year">{year}</div>
      <div className="timeline-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

const AboutComponent: React.FC = () => {
  const timelineItems = [
    {
      year: "2023",
      title: "Started Learning React",
      description: "Began my journey into web development with React and TypeScript."
    },
    {
      year: "2024",
      title: "First Projects",
      description: "Created several personal projects to strengthen my development skills."
    },
    {
      year: "2025",
      title: "Portfolio Development",
      description: "Building my personal portfolio website to showcase my work and skills."
    }
  ];

  return (
    <section className="about-section">
      <div className="about-content">
        <div className="bio-section">
          <h2>About Me</h2>
          <p>
            I'm a passionate developer who loves creating beautiful and functional web applications.
            My journey in web development started with a curiosity about how things work on the internet,
            and that curiosity has grown into a full-fledged passion for creating digital experiences.
          </p>
        </div>
        <div className="skills-section">
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skill-item">React.js</div>
            <div className="skill-item">TypeScript</div>
            <div className="skill-item">Node.js</div>
            <div className="skill-item">MongoDB</div>
            <div className="skill-item">CSS/SCSS</div>
            <div className="skill-item">Git</div>
          </div>
        </div>
        <div className="timeline-section">
          <h2>Journey</h2>
          <div className="timeline">
            {timelineItems.map((item, index) => (
              <TimelineItem key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutComponent;
