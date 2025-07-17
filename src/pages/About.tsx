import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import TypewriterText from '../components/TypewriterText';
import '../styles/About.css';

const About: React.FC = () => {
  const { theme } = useTheme();
  const [startTyping, setStartTyping] = useState(false);
  const [startSkillsTyping, setStartSkillsTyping] = useState(false);
  const [startJourneyTyping, setStartJourneyTyping] = useState(false);
  
  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "HTML5/CSS3"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB", "REST APIs"] },
    { category: "Tools", items: ["Git", "VS Code", "Docker", "Figma"] },
    { category: "Soft Skills", items: ["Problem Solving", "Team Collaboration", "Communication", "Adaptability"] }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const skillsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        onComplete: () => setStartSkillsTyping(true)
      }
    }
  };

  const journeyContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        onComplete: () => setStartJourneyTyping(true)
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <div className={`about-page ${theme}`}>
      <div className="about-container">
        <section className="about-hero">
          <div className="about-content">
            <motion.h1
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1, 
                  transition: { 
                    duration: 0.5,
                    onComplete: () => setStartTyping(true)
                  } 
                }
              }}
            >
              <TypewriterText 
                text="About Me" 
                speed={150}
                startDelay={300}
                cursorChar="_"
                showCursor={true}
                trigger={startTyping}
              />
            </motion.h1>
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

        <motion.section 
          className="skills-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={skillsContainerVariants}
        >
          <motion.h2 variants={itemVariants}>
            <TypewriterText 
              text="Skills & Expertise" 
              speed={150}
              startDelay={300}
              cursorChar="_"
              showCursor={true}
              trigger={startSkillsTyping}
            />
          </motion.h2>
          <motion.div className="skills-grid" variants={containerVariants}>
            {skills.map((skillSet, index) => (
              <motion.div key={index} className="skill-category" variants={itemVariants}>
                <h3>{skillSet.category}</h3>
                <ul>
                  {skillSet.items.map((skill, skillIndex) => (
                    <li key={skillIndex}>{skill}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section 
          className="journey-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={journeyContainerVariants}
        >
          <motion.h2 variants={itemVariants}>
            <TypewriterText 
              text="My Journey" 
              speed={150}
              startDelay={300}
              cursorChar="_"
              showCursor={true}
              trigger={startJourneyTyping}
            />
          </motion.h2>
          <motion.div className="timeline" variants={containerVariants}>
            <motion.div className="timeline-item" variants={itemVariants}>
              <div className="timeline-content">
                <h3>2023 - Present</h3>
                <h4>Freelance Developer</h4>
                <p>Working on various projects for clients worldwide, specializing in web applications and e-commerce solutions.</p>
              </div>
            </motion.div>
            <motion.div className="timeline-item" variants={itemVariants}>
              <div className="timeline-content">
                <h3>2021 - 2023</h3>
                <h4>Junior Developer</h4>
                <p>Started my professional journey, working on full-stack applications and learning from experienced developers.</p>
              </div>
            </motion.div>
            <motion.div className="timeline-item" variants={itemVariants}>
              <div className="timeline-content">
                <h3>2020 - 2021</h3>
                <h4>Self-Learning</h4>
                <p>Dedicated time to learning modern web technologies and building personal projects.</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
