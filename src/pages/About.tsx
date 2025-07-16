import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/About.css';

const About: React.FC = () => {
  const { theme } = useTheme();
  
  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "HTML5/CSS3"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB", "REST APIs"] },
    { category: "Tools", items: ["Git", "VS Code", "Docker", "Figma"] },
    { category: "Soft Skills", items: ["Problem Solving", "Team Collaboration", "Communication", "Adaptability"] }
  ];

  return (
    <div className={`about-page ${theme}`}>
      <div className="about-container">
        <section className="about-hero">
          <div className="about-content">
            <h1>About Me</h1>
            <p className="about-description">
              I'm a full-stack developer with a passion for creating elegant solutions 
              to complex problems. My journey in tech started with a curiosity about 
              how things work, and that curiosity continues to drive me today.
            </p>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">2+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15+</span>
                <span className="stat-label">Projects Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
            </div>
          </div>
        </section>

        <section className="skills-section">
          <h2>Skills & Expertise</h2>
          <div className="skills-grid">
            {skills.map((skillSet, index) => (
              <div key={index} className="skill-category">
                <h3>{skillSet.category}</h3>
                <ul>
                  {skillSet.items.map((skill, skillIndex) => (
                    <li key={skillIndex}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="journey-section">
          <h2>My Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>2023 - Present</h3>
                <h4>Freelance Developer</h4>
                <p>Working on various projects for clients worldwide, specializing in web applications and e-commerce solutions.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>2021 - 2023</h3>
                <h4>Junior Developer</h4>
                <p>Started my professional journey, working on full-stack applications and learning from experienced developers.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <h3>2020 - 2021</h3>
                <h4>Self-Learning</h4>
                <p>Dedicated time to learning modern web technologies and building personal projects.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
