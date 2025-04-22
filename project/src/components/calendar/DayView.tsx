import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Task } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import Button from '../ui/Button';

interface DayViewProps {
  date: Date;
  tasks: Task[];
  onBack: () => void;
  onToggleComplete: (id: string) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, tasks, onBack, onToggleComplete }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-2xl mx-auto px-4 md:px-0"
    >
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          icon={<ArrowLeft size={16} />}
        >
          Back to Calendar
        </Button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white ml-4">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
      
      <div className="space-y-4">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className="mt-1 flex-shrink-0 focus:outline-none transition-transform duration-300 hover:scale-110"
                >
                  {task.completed ? (
                    <CheckCircle className="h-5 w-5 text-success-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 hover:text-success-500" />
                  )}
                </button>
                
                <div className="flex-1">
                  <h3 className={`text-lg font-medium ${
                    task.completed 
                      ? 'text-gray-400 dark:text-gray-500 line-through' 
                      : 'text-gray-800 dark:text-white'
                  }`}>
                    {task.title}
                  </h3>
                  
                  {task.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge type="category" value={task.category} />
                    <Badge type="priority" value={task.priority} />
                    {task.tags.map((tag, index) => (
                      <Badge key={index} type="tag" value={tag} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No tasks for this day.</p>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default DayView;