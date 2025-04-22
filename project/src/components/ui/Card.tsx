import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glassEffect?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glassEffect = false,
  hoverable = false,
  onClick,
}) => {
  const baseClasses = 'rounded-lg overflow-hidden';
  
  const glassClasses = glassEffect 
    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-800/30'
    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
  
  const hoverClasses = hoverable 
    ? 'transition-all duration-300 hover:shadow-xl cursor-pointer'
    : 'shadow-md';
  
  const cardClasses = `${baseClasses} ${glassClasses} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02, y: -5 } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;