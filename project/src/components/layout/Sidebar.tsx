import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Github, 
  Home, 
  LayoutGrid, 
  ListTodo, 
  Settings, 
  Trophy 
} from 'lucide-react';
import { TaskCategory, TaskPriority } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import Badge from '../ui/Badge';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { 
    filteredCategory, 
    filteredPriority, 
    setFilteredCategory, 
    setFilteredPriority, 
    clearFilters,
    user
  } = useTaskStore();
  
  const tabs = [
    { id: 'home', icon: <Home size={18} />, label: 'Dashboard' },
    { id: 'tasks', icon: <ListTodo size={18} />, label: 'Tasks' },
    { id: 'calendar', icon: <Calendar size={18} />, label: 'Calendar' },
    { id: 'github', icon: <Github size={18} />, label: 'GitHub' },
    { id: 'stats', icon: <Trophy size={18} />, label: 'Achievements' },
  ];
  
  const categories = Object.values(TaskCategory);
  const priorities = Object.values(TaskPriority);
  
  return (
    <motion.div 
      className="w-64 bg-white dark:bg-gray-900 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-gray-800 pt-16 flex flex-col"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Main Menu</h3>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm ${
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</h3>
            {filteredCategory && (
              <button 
                onClick={() => setFilteredCategory(null)}
                className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                type="category"
                value={category}
                onClick={() => setFilteredCategory(filteredCategory === category ? null : category)}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</h3>
            {filteredPriority && (
              <button 
                onClick={() => setFilteredPriority(null)}
                className="text-xs text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {priorities.map((priority) => (
              <Badge
                key={priority}
                type="priority"
                value={priority}
                onClick={() => setFilteredPriority(filteredPriority === priority ? null : priority)}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-auto border-t border-gray-200 dark:border-gray-800 pt-4">
          <div className="flex items-center mb-2">
            <Trophy size={14} className="text-yellow-500 mr-2" />
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Level {user.level}
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${(user.xp % 100) / 100 * 100}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {user.xp} XP (next level at {Math.ceil(user.xp / 100) * 100} XP)
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;