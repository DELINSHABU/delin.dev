// Single source of truth for portfolio content shared between the page
// sections and the interactive terminal. Edit here and both stay in sync.

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillGroup {
  category: string;
  items: SkillItem[];
}

export interface JourneyEntry {
  year: string;
  title: string;
  body: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface ContactMethod {
  icon: string;
  label: string;
  value: string;
}

export interface SocialLink {
  href: string;
  icon: string;
  label: string;
}

export const identity = {
  name: 'DELIN SHABU',
  handle: 'delin',
  host: 'dev',
  role: 'Front-end developer building fast, expressive interfaces with React, TypeScript and a sprinkle of AI magic.',
  location: 'Trivandrum, India',
};

export const email = 'delinshabu.b@gmail.com';
export const phone = '+91 96337 66791';

// Resume lives in public/ so it is served at the site root.
export const resumeUrl = '/delin-shabu-cv.pdf';

export const about: string[] = [
  "I'm a full-stack developer with a passion for creating elegant solutions to complex problems. My journey in tech started with curiosity about how things work, and that curiosity continues to drive me today.",
  "Currently riding the AI wave (fashionably late, as always) to build the next generation of SaaS solutions. I believe AI isn't here to replace us—it's here to make us ridiculously efficient. Why hire 50 people when you can hire 5 smart ones with the right AI tools?",
  "When I'm not busy convincing computers to do my bidding, you'll find me exploring new technologies, writing code in languages most people can't pronounce (yes, Brainfuck is a real language), or planning my next SaaS venture that'll hopefully require fewer humans than a space mission.",
];

export const skills: SkillGroup[] = [
  {
    category: 'frontend',
    items: [
      { name: 'React', level: 92 },
      { name: 'TypeScript', level: 85 },
      { name: 'Next.js', level: 78 },
      { name: 'HTML5/CSS3', level: 90 },
      { name: 'Modern UI/UX', level: 80 },
    ],
  },
  {
    category: 'backend',
    items: [
      { name: 'Node.js', level: 75 },
      { name: 'Express', level: 72 },
      { name: 'MongoDB', level: 68 },
      { name: 'REST APIs', level: 82 },
      { name: 'Python', level: 65 },
    ],
  },
  {
    category: 'ai-tools',
    items: [
      { name: 'Prompt Engineering', level: 88 },
      { name: 'AI Integration', level: 80 },
      { name: 'Git & Version Control', level: 85 },
      { name: 'VS Code', level: 95 },
      { name: 'Docker', level: 60 },
      { name: 'Automation Tools', level: 70 },
    ],
  },
  {
    category: 'languages',
    items: [
      { name: 'JavaScript/TypeScript', level: 90 },
      { name: 'Python', level: 65 },
      { name: 'C++', level: 55 },
      { name: 'Java', level: 50 },
      { name: 'Lua', level: 45 },
      { name: 'Brainfuck (for the culture)', level: 30 },
    ],
  },
  {
    category: 'soft-skills',
    items: [
      { name: 'Problem Solving', level: 90 },
      { name: 'Team Collaboration', level: 85 },
      { name: 'Communication', level: 80 },
      { name: 'Adaptability', level: 88 },
      { name: 'AI Whispering', level: 95 },
    ],
  },
];

export const journey: JourneyEntry[] = [
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

export const stats: Stat[] = [
  { value: 2, suffix: '+', label: 'years experience' },
  { value: 15, suffix: '+', label: 'projects completed' },
  { value: 10, suffix: '+', label: 'happy clients' },
];

export const contactMethods: ContactMethod[] = [
  { icon: 'fas fa-envelope', label: 'email', value: email },
  { icon: 'fas fa-phone', label: 'phone', value: phone },
  { icon: 'fas fa-map-marker-alt', label: 'location', value: identity.location },
];

// NOTE: LinkedIn / Twitter point at placeholder roots — swap in real profile URLs.
export const socials: SocialLink[] = [
  { href: 'https://github.com/DELINSHABU', icon: 'fab fa-github', label: 'GitHub' },
  { href: 'https://linkedin.com', icon: 'fab fa-linkedin', label: 'LinkedIn' },
  { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
];
