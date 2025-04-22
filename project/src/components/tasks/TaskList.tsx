import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { Task } from '../../types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import Button from '../ui/Button';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onDeleteTask,
  onToggleComplete,
  onUpdateTask,
}) => {
  const [showForm, setShowForm] = useState(false);
  
  const handleAddTask = (task: Partial<Task>) => {
    onAddTask(task);
    setShowForm(false);
  };
  
  const sortedTasks = [...tasks].sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tasks</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'ghost' : 'primary'}
          icon={<PlusCircle size={18} />}
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </Button>
      </div>
      
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-4">
        <AnimatePresence>
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
              onUpdate={onUpdateTask}
            />
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center"
          >
            <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add your first task!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskList;