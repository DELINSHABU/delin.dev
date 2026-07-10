import React from 'react';
import { motion } from 'framer-motion';
import { clipReveal } from '../utils/animations';
import '../styles/SectionHeading.css';

interface SectionHeadingProps {
  index: string;
  label: string;
}

/** `// 01. about_me` styled section heading with a clip reveal. */
const SectionHeading = React.memo<SectionHeadingProps>(({ index, label }) => (
  <motion.h2
    className="section-heading"
    variants={clipReveal}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.6 }}
  >
    <span className="section-heading__comment">{'//'}</span>
    <span className="section-heading__index">{index}.</span>
    <span className="section-heading__label">{label}</span>
  </motion.h2>
));

export default SectionHeading;
