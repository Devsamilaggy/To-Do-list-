import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { Task, TaskPriority } from '../../types';
import Card from '../ui/Card';
import { format, isPast, differenceInDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

interface DashboardProps {
  tasks: Task[];
  user: {
    completedTasks: number;
    streakDays: number;
    level: number;
    xp: number;
  };
  onToggleComplete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, user, onToggleComplete }) => {
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(task => task.priority === TaskPriority.HIGH && !task.completed).length;
  
  // Get today's tasks
  const today = new Date();
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  });
  
  // Get overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return isPast(new Date(task.dueDate));
  });
  
  // Get upcoming tasks (next 7 days, excluding today and overdue)
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const diffDays = differenceInDays(dueDate, today);
    return diffDays > 0 && diffDays <= 7;
  });
  
  // Prepare data for charts
  const categoryData = Object.entries(
    tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));
  
  const completionData = Array(7)
    .fill(0)
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      const dateString = format(date, 'MMM d');
      
      const completed = tasks.filter(task => {
        if (!task.completed) return false;
        const completedDate = new Date(task.createdAt);
        return (
          completedDate.getDate() === date.getDate() &&
          completedDate.getMonth() === date.getMonth() &&
          completedDate.getFullYear() === date.getFullYear()
        );
      }).length;
      
      return {
        date: dateString,
        completed,
      };
    });
  
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-4 h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-4">
                <ListTodo size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{totalTasks}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {completedTasks} completed ({Math.round(completedTasks / (totalTasks || 1) * 100)}%)
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-4 h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 mr-4">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingTasks}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {highPriorityTasks} high priority tasks
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="p-4 h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400 mr-4">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Today</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{todayTasks.length}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {overdueTasks.length} overdue tasks
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-4 h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 mr-4">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{user.streakDays} days</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Level {user.level} ({user.xp} XP)
            </div>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="p-6 h-full">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Tasks by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={index} 
                        fill={[
                          '#3b82f6', // primary
                          '#14b8a6', // secondary
                          '#f97316', // accent
                          '#ef4444', // error
                          '#22c55e', // success
                          '#f59e0b', // warning
                          '#a855f7', // purple
                          '#ec4899', // pink
                        ][index % 8]} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Card className="p-6 h-full">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Tasks Completed Last 7 Days
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '0.5rem',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{
                      stroke: '#3b82f6',
                      strokeWidth: 2,
                      r: 4,
                      fill: 'white',
                    }}
                    activeDot={{
                      stroke: '#3b82f6',
                      strokeWidth: 2,
                      r: 6,
                      fill: '#3b82f6',
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card className="h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Today's Tasks</h3>
            </div>
            <div className="p-4">
              {todayTasks.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {todayTasks.map(task => (
                    <li key={task.id} className="py-3">
                      <div className="flex items-start">
                        <button
                          onClick={() => onToggleComplete(task.id)}
                          className="mt-1 mr-3 flex-shrink-0 focus:outline-none"
                        >
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-success-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 hover:text-success-500" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            task.completed 
                              ? 'text-gray-400 dark:text-gray-500 line-through' 
                              : 'text-gray-800 dark:text-white'
                          }`}>
                            {task.title}
                          </p>
                          <div className="mt-1 flex items-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === 'high'
                                ? 'bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400'
                                : task.priority === 'medium'
                                  ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                                  : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No tasks due today.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card className="h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Upcoming Tasks</h3>
            </div>
            <div className="p-4">
              {upcomingTasks.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {upcomingTasks.map(task => (
                    <li key={task.id} className="py-3">
                      <div className="flex items-start">
                        <button
                          onClick={() => onToggleComplete(task.id)}
                          className="mt-1 mr-3 flex-shrink-0 focus:outline-none"
                        >
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-success-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 hover:text-success-500" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {task.title}
                          </p>
                          <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Clock size={12} className="mr-1" />
                            <span>
                              {task.dueDate && format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No upcoming tasks.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;