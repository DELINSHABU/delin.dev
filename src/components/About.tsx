import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, scaleIn } from '../utils/animations';
import '../styles/About.css';

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description }) => {
  return (
    <motion.div 
      className="timeline-item"
      variants={fadeInLeft}
      whileHover={{ scale: 1.02, x: 10 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div className="timeline-year" variants={scaleIn}>{year}</motion.div>
      <motion.div className="timeline-content" variants={fadeInRight}>
        <h3>{title}</h3>
        <p>{description}</p>
      </motion.div>
    </motion.div>
  );
};

const AboutComponent: React.FC = () => {
  const { ref: bioRef, isInView: bioInView } = useScrollAnimation();
  const { ref: skillsRef, isInView: skillsInView } = useScrollAnimation();
  const { ref: timelineRef, isInView: timelineInView } = useScrollAnimation();

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

  const skillItems = ["React.js", "TypeScript", "Node.js", "MongoDB", "CSS/SCSS", "Git"];

  return (
    <section className="about-section" id="about">
      <div className="about-content">
        <motion.div 
          className="bio-section"
          ref={bioRef}
          initial="hidden"
          animate={bioInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp}>About Me</motion.h2>
          <motion.p variants={fadeInUp}>
            I'm a passionate developer who loves creating beautiful and functional web applications.
            My journey in web development started with a curiosity about how things work on the internet,
            and that curiosity has grown into a full-fledged passion for creating digital experiences.
          </motion.p>
        </motion.div>

        <motion.div 
          className="skills-section"
          ref={skillsRef}
          initial="hidden"
          animate={skillsInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp}>Skills</motion.h2>
          <motion.div className="skills-grid" variants={staggerContainer}>
            {skillItems.map((skill, index) => (
              <motion.div 
                key={skill}
                className="skill-item"
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: '#007bff',
                  color: '#fff',
                  boxShadow: '0 5px 15px rgba(0,123,255,0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="timeline-section"
          ref={timelineRef}
          initial="hidden"
          animate={timelineInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp}>Journey</motion.h2>
          <motion.div className="timeline" variants={staggerContainer}>
            {timelineItems.map((item, index) => (
              <TimelineItem key={index} {...item} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutComponent;
