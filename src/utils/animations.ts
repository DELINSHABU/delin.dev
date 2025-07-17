// Animation variants and utilities for Framer Motion

export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 60 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      type: "tween" as const
    }
  }
};

export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      type: "tween" as const
    }
  }
};

export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 60 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      type: "tween" as const
    }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const scaleIn = {
  hidden: { 
    scale: 0.8, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "tween" as const
    }
  }
};

export const slideInFromBottom = {
  hidden: { 
    y: 100, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.8,
      type: "tween" as const
    }
  }
};

// Hover animations
export const hoverLift = {
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      duration: 0.3,
      type: "tween" as const
    }
  }
};

export const hoverScale = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      type: "tween" as const
    }
  }
};

// Parallax utility
export const parallaxVariants = (offset: number = 50) => ({
  hidden: { y: offset },
  visible: { y: -offset }
});

// Advanced animations
export const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      type: "tween" as const
    }
  }
};

export const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      type: "tween" as const
    }
  }
};

export const rotateAnimation = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      type: "tween" as const
    }
  }
};

// Text animations
export const typewriterAnimation = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 2,
      type: "tween" as const
    }
  }
};

// Loading animations
export const loadingDots = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1,
      repeat: Infinity,
      type: "tween" as const
    }
  }
};

// Page transition animations
export const pageSlideIn = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 }
};

export const pageFadeIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 }
};