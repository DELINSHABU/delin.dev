import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick,
  ...props 
}) => {
  const { theme } = useTheme();
  
  return (
    <button 
      className={`button ${variant} ${theme}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
