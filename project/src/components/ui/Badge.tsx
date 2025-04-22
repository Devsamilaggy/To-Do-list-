import React from 'react';
import { motion } from 'framer-motion';
import { TaskCategory, TaskPriority } from '../../types';

interface BadgeProps {
  type: 'category' | 'priority' | 'tag';
  value: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge: React.FC<BadgeProps> = ({ 
  type, 
  value, 
  onClick, 
  removable = false,
  onRemove
}) => {
  const getColorClasses = (): string => {
    if (type === 'priority') {
      switch (value) {
        case TaskPriority.HIGH:
          return 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400 border-error-200 dark:border-error-800';
        case TaskPriority.MEDIUM:
          return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400 border-warning-200 dark:border-warning-800';
        case TaskPriority.LOW:
          return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400 border-success-200 dark:border-success-800';
        default:
          return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      }
    } else if (type === 'category') {
      switch (value) {
        case TaskCategory.WORK:
          return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border-primary-200 dark:border-primary-800';
        case TaskCategory.PERSONAL:
          return 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400 border-accent-200 dark:border-accent-800';
        case TaskCategory.STUDY:
          return 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400 border-secondary-200 dark:border-secondary-800';
        case TaskCategory.FRONTEND:
          return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        case TaskCategory.BACKEND:
          return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
        case TaskCategory.DESIGN:
          return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800';
        case TaskCategory.MEETING:
          return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
        default:
          return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      }
    } else {
      // Tag type
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
  const cursorClass = onClick ? 'cursor-pointer' : '';
  const colorClasses = getColorClasses();
  
  const badgeClasses = `${baseClasses} ${colorClasses} ${cursorClass}`;

  return (
    <motion.span 
      className={badgeClasses}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      {value}
      {removable && (
        <button 
          className="ml-1.5 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.span>
  );
};

export default Badge;