import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Clock, Code, Edit, Trash2, ChevronDown, ChevronUp, Github } from 'lucide-react';
import { Task } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { format } from 'date-fns';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdate: (id: string, task: Partial<Task>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onDelete, 
  onToggleComplete, 
  onUpdate 
}) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Determine if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  // Format dates
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '';
  const formattedCreatedDate = format(new Date(task.createdAt), 'MMM d, yyyy');
  
  // Get priority color for left border
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'border-error-500';
      case 'medium':
        return 'border-warning-500';
      case 'low':
        return 'border-success-500';
      default:
        return 'border-gray-300 dark:border-gray-700';
    }
  };
  
  const handleUpdate = (updatedTask: Partial<Task>) => {
    onUpdate(task.id, updatedTask);
    setEditing(false);
  };
  
  return (
    <AnimatePresence mode="wait">
      {editing ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <TaskForm 
            initialTask={task} 
            onSubmit={handleUpdate} 
            onCancel={() => setEditing(false)}
            isEditing
          />
        </motion.div>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 ${getPriorityColor()} overflow-hidden mb-4`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <button
                onClick={() => onToggleComplete(task.id)}
                className="mt-1 mr-3 flex-shrink-0 focus:outline-none transition-transform duration-300 hover:scale-110"
              >
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-success-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 hover:text-success-500" />
                )}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <motion.h3 
                    className={`text-lg font-medium ${
                      task.completed 
                        ? 'text-gray-400 dark:text-gray-500 line-through' 
                        : 'text-gray-800 dark:text-white'
                    }`}
                    animate={{ scale: task.completed ? 0.98 : 1 }}
                  >
                    {task.title}
                  </motion.h3>
                  
                  <div className="flex items-center space-x-2">
                    {task.dueDate && (
                      <div 
                        className={`flex items-center text-xs ${
                          isOverdue 
                            ? 'text-error-500' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <Clock size={14} className="mr-1" />
                        <span>{formattedDueDate}</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditing(true)}
                        icon={<Edit size={16} />}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDelete(task.id)}
                        icon={<Trash2 size={16} />}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setExpanded(!expanded)}
                        icon={expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge type="category" value={task.category} />
                  <Badge type="priority" value={task.priority} />
                  {task.tags.map((tag, index) => (
                    <Badge key={index} type="tag" value={tag} />
                  ))}
                </div>
                
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 space-y-3"
                    >
                      {task.description && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {task.description}
                          </p>
                        </div>
                      )}
                      
                      {task.codeSnippet && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                            <Code size={14} className="mr-1" />
                            Code Snippet
                          </h4>
                          <div className="rounded-md overflow-hidden text-sm">
                            <SyntaxHighlighter
                              language="javascript"
                              style={tomorrow}
                              customStyle={{ margin: 0, borderRadius: '0.375rem' }}
                            >
                              {task.codeSnippet}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      )}
                      
                      {task.githubLink && (task.githubLink.commitId || task.githubLink.prNumber) && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                            <Github size={14} className="mr-1" />
                            GitHub Link
                          </h4>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {task.githubLink.repoName && (
                              <span className="font-medium">{task.githubLink.repoName}: </span>
                            )}
                            {task.githubLink.commitId && (
                              <span>Commit {task.githubLink.commitId.substring(0, 7)}</span>
                            )}
                            {task.githubLink.prNumber && (
                              <span>PR #{task.githubLink.prNumber}</span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created on {formattedCreatedDate}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskItem;