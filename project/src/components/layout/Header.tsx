import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Moon, Search, Sun, X } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';
import Button from '../ui/Button';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery }) => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  
  return (
    <motion.header 
      className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Code2 size={28} className="text-primary-500" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Sami Dev To-Do Manager
          </h1>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all w-full md:w-48 lg:w-64"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            icon={darkMode ? <Sun size={18} /> : <Moon size={18} />}
          >
            {darkMode ? 'Light' : 'Dark'}
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;