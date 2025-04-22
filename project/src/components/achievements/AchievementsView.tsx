import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy } from 'lucide-react';
import Card from '../ui/Card';
import { User } from '../../types';

interface AchievementsViewProps {
  user: User;
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ user }) => {
  // Predefined achievements
  const allAchievements = [
    {
      id: 'first-task',
      name: 'First Step',
      description: 'Complete your first task',
      icon: <Award className="text-primary-500 h-6 w-6" />,
      condition: () => user.completedTasks >= 1,
    },
    {
      id: 'task-master',
      name: 'Task Master',
      description: 'Complete 10 tasks',
      icon: <Trophy className="text-yellow-500 h-6 w-6" />,
      condition: () => user.completedTasks >= 10,
    },
    {
      id: 'productivity-guru',
      name: 'Productivity Guru',
      description: 'Complete 50 tasks',
      icon: <Star className="text-accent-500 h-6 w-6" />,
      condition: () => user.completedTasks >= 50,
    },
    {
      id: 'streak-starter',
      name: 'Streak Starter',
      description: 'Maintain a 3-day streak',
      icon: <Award className="text-secondary-500 h-6 w-6" />,
      condition: () => user.streakDays >= 3,
    },
    {
      id: 'consistent-coder',
      name: 'Consistent Coder',
      description: 'Maintain a 7-day streak',
      icon: <Trophy className="text-yellow-500 h-6 w-6" />,
      condition: () => user.streakDays >= 7,
    },
    {
      id: 'dedication-master',
      name: 'Dedication Master',
      description: 'Maintain a 14-day streak',
      icon: <Star className="text-accent-500 h-6 w-6" />,
      condition: () => user.streakDays >= 14,
    },
    {
      id: 'level-up',
      name: 'Level Up',
      description: 'Reach level 5',
      icon: <Award className="text-primary-500 h-6 w-6" />,
      condition: () => user.level >= 5,
    },
    {
      id: 'expert-developer',
      name: 'Expert Developer',
      description: 'Reach level 10',
      icon: <Trophy className="text-yellow-500 h-6 w-6" />,
      condition: () => user.level >= 10,
    },
    {
      id: 'coding-legend',
      name: 'Coding Legend',
      description: 'Reach level 20',
      icon: <Star className="text-accent-500 h-6 w-6" />,
      condition: () => user.level >= 20,
    },
  ];
  
  // Filter achievements that have been unlocked or are close to being unlocked
  const unlockedAchievements = allAchievements.filter(achievement => achievement.condition());
  const lockedAchievements = allAchievements.filter(achievement => !achievement.condition());
  
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <div className="flex items-center mb-6">
        <Trophy size={24} className="text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Achievements</h2>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Your Progress</h3>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-primary-500 mb-2">{user.level}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Current Level</div>
              <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(user.xp % 100) / 100 * 100}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {user.xp} XP (next level at {Math.ceil(user.xp / 100) * 100} XP)
              </div>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-success-500 mb-2">{user.completedTasks}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tasks Completed</div>
            </div>
            
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-warning-500 mb-2">{user.streakDays}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Day Streak</div>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Unlocked Achievements ({unlockedAchievements.length}/{allAchievements.length})
        </h3>
        
        {unlockedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-full mr-4">
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {achievement.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't unlocked any achievements yet. Start completing tasks to earn them!
            </p>
          </Card>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          Locked Achievements
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 opacity-60 grayscale hover:opacity-80 hover:grayscale-0 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full mr-4">
                    {achievement.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsView;