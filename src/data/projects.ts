export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  features: string[];
  challenges: string[];
  liveLink?: string;
  githubLink?: string;
}

export const projects: Project[] = [
  {
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    tagline: 'Full-stack store with real-time inventory',
    description:
      "A full-stack e-commerce solution with React.js and MongoDB. Features include real-time inventory management, secure payment processing, and an admin dashboard that doesn't make you want to throw your laptop out the window.",
    stack: ['react', 'node', 'mongodb', 'typescript'],
    features: [
      'User authentication and authorization',
      'Product catalog with search and filtering',
      'Shopping cart and checkout process',
      'Admin dashboard for inventory management',
    ],
    challenges: [
      'Implementing real-time inventory updates',
      'Optimizing database queries for performance',
      'Ensuring secure payment processing',
      'Building responsive UI for all devices',
    ],
    liveLink: 'https://example.com/ecommerce',
    githubLink: 'https://github.com/example/ecommerce',
  },
  {
    slug: 'task-management-app',
    title: 'Task Management App',
    tagline: 'Real-time collaboration for teams',
    description:
      'A collaborative task management application that allows teams to organize, track, and manage their projects effectively. Features real-time updates and intuitive UI.',
    stack: ['react', 'firebase', 'redux', 'scss'],
    features: [
      'Real-time collaboration',
      'Task assignment and tracking',
      'Project timeline visualization',
      'File sharing and comments',
    ],
    challenges: [
      'Implementing real-time updates',
      'Managing complex state',
      'Optimizing performance',
      'Building intuitive UI',
    ],
    liveLink: 'https://example.com/taskapp',
    githubLink: 'https://github.com/example/taskapp',
  },
  {
    slug: 'portfolio-website',
    title: 'Portfolio Website',
    tagline: 'Terminal-themed portfolio with WebGL',
    description:
      'A modern portfolio website built with React and TypeScript. Features a terminal-inspired design with shader-driven backgrounds, smooth scrolling, and interactive WebGL elements.',
    stack: ['react', 'typescript', 'three.js', 'framer-motion'],
    features: [
      'Shader-based layered background',
      'WebGL hero text distortion',
      'Lenis smooth scrolling',
      'Scroll-driven reveal animations',
    ],
    challenges: [
      'Implementing smooth animations',
      'Optimizing WebGL performance',
      'Creating responsive layouts',
      'Balancing aesthetics and accessibility',
    ],
    liveLink: 'https://example.com/portfolio',
    githubLink: 'https://github.com/example/portfolio',
  },
  {
    slug: 'mobile-chat-app',
    title: 'Mobile Chat App',
    tagline: 'Cross-platform messaging with Firebase',
    description:
      'A cross-platform mobile chat application built with React Native and Firebase. Features real-time messaging, file sharing, and user presence system.',
    stack: ['react-native', 'firebase', 'typescript', 'redux'],
    features: [
      'Real-time messaging',
      'File sharing',
      'User presence system',
      'Push notifications',
    ],
    challenges: [
      'Managing real-time connections',
      'Implementing push notifications',
      'Optimizing app performance',
      'Cross-platform compatibility',
    ],
    liveLink: 'https://example.com/chatapp',
    githubLink: 'https://github.com/example/chatapp',
  },
];

export const getProject = (slug: string | undefined): Project | undefined =>
  projects.find((p) => p.slug === slug);
