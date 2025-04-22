import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, isSameMonth } from 'date-fns';
import { Task } from '../../types';
import Button from '../ui/Button';

interface CalendarViewProps {
  tasks: Task[];
  onDayClick: (date: Date, tasks: Task[]) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onDayClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Fill the beginning of the calendar to start with Sunday
  const startDay = monthStart.getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysToAdd = startDay === 0 ? 0 : startDay;
  const daysBefore = Array(daysToAdd).fill(null);
  
  // Fill the end of the calendar to end with Saturday
  const endDay = monthEnd.getDay();
  const daysAfter = Array(endDay === 6 ? 0 : 6 - endDay).fill(null);
  
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return isSameDay(dueDate, day);
    });
  };
  
  const getDayClass = (day: Date, dayTasks: Task[]) => {
    const isCurrentDay = isToday(day);
    const hasTasks = dayTasks.length > 0;
    const hasCompletedTasks = dayTasks.some(task => task.completed);
    const hasHighPriorityTasks = dayTasks.some(task => task.priority === 'high' && !task.completed);
    
    let bgColor = 'bg-white dark:bg-gray-800';
    let textColor = 'text-gray-700 dark:text-gray-300';
    let borderColor = 'border-gray-200 dark:border-gray-700';
    
    if (isCurrentDay) {
      bgColor = 'bg-primary-50 dark:bg-primary-900/30';
      textColor = 'text-primary-700 dark:text-primary-400';
      borderColor = 'border-primary-300 dark:border-primary-700';
    }
    
    if (hasTasks) {
      if (hasHighPriorityTasks) {
        bgColor = 'bg-error-50 dark:bg-error-900/20';
        borderColor = 'border-error-200 dark:border-error-800';
      } else if (hasCompletedTasks) {
        bgColor = 'bg-success-50 dark:bg-success-900/20';
        borderColor = 'border-success-200 dark:border-success-800';
      } else {
        bgColor = 'bg-warning-50 dark:bg-warning-900/20';
        borderColor = 'border-warning-200 dark:border-warning-800';
      }
    }
    
    return `${bgColor} ${textColor} ${borderColor}`;
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Calendar</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMonth}
            icon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            icon={<ChevronRight size={16} />}
          >
            Next
          </Button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div 
              key={day} 
              className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {daysBefore.map((_, index) => (
            <div
              key={`empty-before-${index}`}
              className="h-24 border-b border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
            />
          ))}
          
          {monthDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const dayClass = getDayClass(day, dayTasks);
            
            return (
              <motion.div
                key={day.toISOString()}
                className={`h-24 p-1 border-b border-r ${dayClass} hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer overflow-hidden`}
                onClick={() => onDayClick(day, dayTasks)}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm font-medium ${isToday(day) ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                
                <div className="mt-1 space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div 
                      key={task.id}
                      className={`text-xs truncate px-1.5 py-0.5 rounded
                        ${task.completed 
                          ? 'line-through text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800/50' 
                          : task.priority === 'high'
                            ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400'
                            : task.priority === 'medium'
                              ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                              : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                        }`}
                    >
                      {task.title}
                    </div>
                  ))}
                  
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          
          {daysAfter.map((_, index) => (
            <div
              key={`empty-after-${index}`}
              className="h-24 border-b border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;