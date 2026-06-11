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
import '../styles/About.css';

const SKILLS = [
  {
    category: 'frontend',
    items: ['React', 'TypeScript', 'Next.js', 'HTML5/CSS3', 'Modern UI/UX'],
  },
  {
    category: 'backend',
    items: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Python'],
  },
  {
    category: 'ai-tools',
    items: [
      'Prompt Engineering',
      'AI Integration',
      'Git & Version Control',
      'VS Code',
      'Docker',
      'Automation Tools',
    ],
  },
  {
    category: 'languages',
    items: [
      'JavaScript/TypeScript',
      'Python',
      'C++',
      'Java',
      'Lua',
      'Brainfuck (for the culture)',
    ],
  },
  {
    category: 'soft-skills',
    items: [
      'Problem Solving',
      'Team Collaboration',
      'Communication',
      'Adaptability',
      'AI Whispering',
    ],
  },
];

const JOURNEY = [
  {
    year: '2023 — present',
    title: 'Freelance Developer',
    body: 'Working on various projects for clients worldwide, specializing in web applications and e-commerce solutions. Currently building the foundation for my AI-powered SaaS empire.',
  },
  {
    year: '2024 — 2025',
    title: 'Associate at Sutherland',
    body: 'Mastered the art of international voice processes while secretly coding at night. Learned that talking to humans is harder than talking to computers.',
  },
  {
    year: '2023',
    title: 'Intern at Brototype',
    body: 'Started my professional journey, working on full-stack applications and learning from experienced developers. Discovered that CSS is indeed a programming language (fight me).',
  },
  {
    year: '2020 — 2021',
    title: 'Self-Learning Era',
    body: 'Dedicated time to learning modern web technologies and building personal projects. The era of "Hello World" in 47 different programming languages.',
  },
];

const STATS = [
  { value: 2, suffix: '+', label: 'years experience' },
  { value: 15, suffix: '+', label: 'projects completed' },
  { value: 10, suffix: '+', label: 'happy clients' },
];

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

const About: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 85%', 'end 55%'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

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
              <p className="about-description">
                I'm a full-stack developer with a passion for creating elegant
                solutions to complex problems. My journey in tech started with
                curiosity about how things work, and that curiosity continues
                to drive me today.
              </p>
              <p className="about-description">
                Currently riding the AI wave (fashionably late, as always) to
                build the next generation of SaaS solutions. I believe AI isn't
                here to replace us—it's here to make us ridiculously efficient.
                Why hire 50 people when you can hire 5 smart ones with the
                right AI tools?
              </p>
              <p className="about-description">
                When I'm not busy convincing computers to do my bidding, you'll
                find me exploring new technologies, writing code in languages
                most people can't pronounce (yes, Brainfuck is a real
                language), or planning my next SaaS venture that'll hopefully
                require fewer humans than a space mission.
              </p>
            </div>
          </motion.div>

          <div className="stats">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
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
                <ul className="terminal-window__body skill-list">
                  {skillSet.items.map((skill) => (
                    <li key={skill}>
                      <span className="pane-bullet">▸</span> {skill}
                    </li>
                  ))}
                </ul>
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
