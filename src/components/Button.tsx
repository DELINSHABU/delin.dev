import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import '../styles/Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick,
  className,
  disabled,
  type = 'button'
}) => {
  const { theme } = useTheme();
  
  return (
    <motion.button 
      className={`button ${variant} ${theme} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        y: -2
      }}
      whileTap={{ 
        scale: 0.95,
        y: 0
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        type: "tween" as const
      }}
    >
      {children}
    </motion.button>
  );
};
