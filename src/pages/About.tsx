import React, { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';
import SectionHeading from '../components/SectionHeading';
import { revealBlur, fadeInLeft, fadeInRight, staggerContainer } from '../utils/animations';
import {
  about as ABOUT_PARAGRAPHS,
  skills as SKILLS,
  journey as JOURNEY,
  stats as STATS,
  type SkillItem,
} from '../data/profile';
import { useParallax } from '../hooks/useParallax';
import '../styles/About.css';

const StatCard: React.FC<{ value: number; suffix: string; label: string }> = ({
  value,
  suffix,
  label,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 1.4, ease: 'easeOut' });
      return controls.stop;
    }
  }, [inView, count, value]);

  return (
    <motion.div ref={ref} className="stat-item" variants={revealBlur}>
      <span className="stat-number">
        <motion.span>{rounded}</motion.span>
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
};

const SkillBar: React.FC<SkillItem> = ({ name, level }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <div ref={ref} className="skill-bar-row">
      <div className="skill-bar-label">
        <span className="pane-bullet">▸</span>
        <span>{name}</span>
        <span className="skill-bar-pct">{level}%</span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className="skill-bar-fill"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: level / 100 } : { scaleX: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </div>
  );
};

const About: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 85%', 'end 55%'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  const statsParallax = useParallax(0.08);

  return (
    <div className="about-page">
      <div className="about-container">
        <SectionHeading index="02" label="about_me" />

        <motion.div
          className="about-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div className="terminal-window about-window" variants={revealBlur}>
            <div className="terminal-window__bar">
              <span className="dot dot--red" />
              <span className="dot dot--yellow" />
              <span className="dot dot--green" />
              <span className="terminal-window__title">~/about.md</span>
            </div>
            <div className="terminal-window__body">
              <p className="prompt-line">
                <span className="prompt-symbol">$</span> cat about.md
              </p>
              {ABOUT_PARAGRAPHS.map((paragraph, index) => (
                <p key={index} className="about-description">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            ref={statsParallax.ref}
            style={{ y: statsParallax.y }}
            className="stats"
            variants={staggerContainer}
          >
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="skills-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.h3 className="subsection-title" variants={revealBlur}>
            <span className="prompt-symbol">$</span> ls ~/skills
          </motion.h3>
          <div className="skills-grid">
            {SKILLS.map((skillSet) => (
              <motion.div
                key={skillSet.category}
                className="terminal-window skill-pane"
                variants={revealBlur}
              >
                <div className="terminal-window__bar">
                  <span className="dot dot--red" />
                  <span className="dot dot--yellow" />
                  <span className="dot dot--green" />
                  <span className="terminal-window__title">
                    ~/skills/{skillSet.category}
                  </span>
                </div>
                <div className="terminal-window__body skill-bar-list">
                  {skillSet.items.map((skill) => (
                    <SkillBar key={skill.name} {...skill} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="journey-section">
          <motion.h3
            className="subsection-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={revealBlur}
          >
            <span className="prompt-symbol">$</span> git log --reverse
          </motion.h3>
          <div className="timeline" ref={timelineRef}>
            <div className="timeline-track">
              <motion.div
                className="timeline-line"
                style={{ scaleY: lineScale }}
              />
            </div>
            {JOURNEY.map((entry, index) => (
              <motion.div
                key={entry.title}
                className={`timeline-item ${index % 2 === 0 ? 'timeline-item--left' : 'timeline-item--right'}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={index % 2 === 0 ? fadeInLeft : fadeInRight}
              >
                <span className="timeline-node" aria-hidden="true" />
                <div className="timeline-content">
                  <span className="timeline-year">* {entry.year}</span>
                  <h4>{entry.title}</h4>
                  <p>{entry.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
