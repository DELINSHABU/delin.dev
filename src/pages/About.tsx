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
    { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Angular", "Vue.js"] },
    { category: "Backend", items: ["Node.js", "Express", "MongoDB", "Firebase"] },
    { category: "AI & Tools", items: ["Gemini", "Claude", "Midjourney", "Fooocus"] },
    { category: "IT & DevOps", items: ["Linux", "SSH", "Vercel", "Git"] }
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
              A versatile IT professional and Linux power user who architects end-to-end solutions 
              by leveraging cutting-edge AI technologies. From supporting global clients at Sutherland 
              to crafting MERN stack applications — I turn caffeine into code and bugs into features.
            </p>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">3+</span>
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
                <h3>AUG 2024 - OCT 2025</h3>
                <h4>IT Associate | Sutherland, Ernakulam</h4>
                <p>Provided comprehensive IT support for international clients in a global MNC environment, specializing in technical troubleshooting, cross-cultural communication, and process efficiency.</p>
              </div>
            </motion.div>
            <motion.div className="timeline-item" variants={itemVariants}>
              <div className="timeline-content">
                <h3>OCT 2023 - Present</h3>
                <h4>Freelancer | Trivandrum & Kollam</h4>
                <p>AI-enhanced development using Gemini and Claude Code, Linux & network administration, generative media production with Midjourney/Fooocus, and end-to-end IT infrastructure support.</p>
              </div>
            </motion.div>
            <motion.div className="timeline-item" variants={itemVariants}>
              <div className="timeline-content">
                <h3>JUL 2019 - JAN 2022</h3>
                <h4>Creative Person | Corindians, Kollam</h4>
                <p>Multimedia production using After Effects, Premiere Pro, and DaVinci Resolve. Executed digital marketing campaigns with Google Ads and Facebook Ads while managing Linux workstations.</p>
              </div>
            </motion.div>
            <motion.div className="timeline-item" variants={itemVariants}>
              <div className="timeline-content">
                <h3>Education</h3>
                <h4>BSc. Computer Science | Canchipur, Manipur</h4>
                <p>MERN Stack Developer certification from Brototype, Trivandrum.</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
