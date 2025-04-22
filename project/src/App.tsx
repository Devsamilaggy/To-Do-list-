import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from './types';
import { useTaskStore } from './store/taskStore';
import { useThemeStore } from './store/themeStore';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

// Task Components
import TaskList from './components/tasks/TaskList';

// Calendar Components
import CalendarView from './components/calendar/CalendarView';
import DayView from './components/calendar/DayView';

// GitHub Integration
import GitHubIntegration from './components/github/GitHubIntegration';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Achievements
import AchievementsView from './components/achievements/AchievementsView';

function App() {
  const {
    tasks,
    user,
    filteredCategory,
    filteredPriority,
    searchQuery,
    addTask,
    deleteTask,
    toggleCompleted,
    updateTask,
    setSearchQuery,
  } = useTaskStore();
  
  const { darkMode, setDarkMode } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
  
  // Filter tasks based on category, priority, and search query
  const filteredTasks = tasks.filter((task) => {
    const matchesCategory = !filteredCategory || task.category === filteredCategory;
    const matchesPriority = !filteredPriority || task.priority === filteredPriority;
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesPriority && matchesSearch;
  });
  
  // Set dark mode class on document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  
  // Handle day click in calendar
  const handleDayClick = (date: Date, tasks: Task[]) => {
    setSelectedDate(date);
    setSelectedDateTasks(tasks);
  };
  
  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard
            tasks={tasks}
            user={user}
            onToggleComplete={toggleCompleted}
          />
        );
      case 'tasks':
        return (
          <TaskList
            tasks={filteredTasks}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
            onToggleComplete={toggleCompleted}
            onUpdateTask={updateTask}
          />
        );
      case 'calendar':
        if (selectedDate) {
          return (
            <DayView
              date={selectedDate}
              tasks={selectedDateTasks}
              onBack={() => setSelectedDate(null)}
              onToggleComplete={toggleCompleted}
            />
          );
        }
        return (
          <CalendarView
            tasks={tasks}
            onDayClick={handleDayClick}
          />
        );
      case 'github':
        return (
          <GitHubIntegration
            tasks={tasks}
            onUpdateTask={updateTask}
          />
        );
      case 'stats':
        return (
          <AchievementsView user={user} />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <motion.main 
          className="flex-1 pt-24 pb-12 ml-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (selectedDate ? selectedDate.toISOString() : '')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
}

export default App;