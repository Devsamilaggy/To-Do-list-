import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Link2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Task } from '../../types';

interface GitHubIntegrationProps {
  tasks: Task[];
  onUpdateTask: (id: string, task: Partial<Task>) => void;
}

const GitHubIntegration: React.FC<GitHubIntegrationProps> = ({ tasks, onUpdateTask }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [commitId, setCommitId] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const nonCompletedTasks = tasks.filter(task => !task.completed);
  
  const handleLinkTask = () => {
    if (!selectedTaskId) return;
    
    // Extract repo name from URL
    const repoNameMatch = repoUrl.match(/github\.com\/([^/]+\/[^/]+)/);
    const repoName = repoNameMatch ? repoNameMatch[1] : repoUrl;
    
    onUpdateTask(selectedTaskId, {
      githubLink: {
        repoName,
        commitId: commitId || undefined,
        prNumber: prNumber || undefined,
      }
    });
    
    // Reset form
    setRepoUrl('');
    setCommitId('');
    setPrNumber('');
    setSelectedTaskId(null);
  };
  
  const tasksWithGitHubLinks = tasks.filter(task => task.githubLink && (task.githubLink.commitId || task.githubLink.prNumber));
  
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0">
      <div className="flex items-center mb-6">
        <Github size={24} className="text-gray-800 dark:text-white mr-2" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">GitHub Integration</h2>
      </div>
      
      <Card className="mb-6 p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Link a Task to GitHub</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="taskSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Select Task
            </label>
            <select
              id="taskSelect"
              value={selectedTaskId || ''}
              onChange={(e) => setSelectedTaskId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="">Select a task...</option>
              {nonCompletedTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GitHub Repository URL
            </label>
            <input
              id="repoUrl"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="commitId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Commit ID (optional)
              </label>
              <input
                id="commitId"
                type="text"
                value={commitId}
                onChange={(e) => setCommitId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="e.g., a1b2c3d4"
              />
            </div>
            
            <div>
              <label htmlFor="prNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pull Request # (optional)
              </label>
              <input
                id="prNumber"
                type="text"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="e.g., 42"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={handleLinkTask}
              disabled={!selectedTaskId || !repoUrl}
              icon={<Link2 size={16} />}
            >
              Link Task
            </Button>
          </div>
        </div>
      </Card>
      
      <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
        Linked Tasks
      </h3>
      
      {tasksWithGitHubLinks.length > 0 ? (
        <div className="space-y-4">
          {tasksWithGitHubLinks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-primary-500"
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {task.title}
                  </h4>
                  
                  <div className="mt-2 space-y-2 text-sm">
                    {task.githubLink?.repoName && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Github size={14} className="mr-2" />
                        <span>{task.githubLink.repoName}</span>
                      </div>
                    )}
                    
                    {task.githubLink?.commitId && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="w-5 mr-2 text-xs">Commit:</span>
                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded font-mono">
                          {task.githubLink.commitId.substring(0, 7)}
                        </code>
                      </div>
                    )}
                    
                    {task.githubLink?.prNumber && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <span className="w-5 mr-2 text-xs">PR:</span>
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded">
                          #{task.githubLink.prNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Link2 size={14} />}
                    onClick={() => {
                      if (task.githubLink?.repoName) {
                        const url = `https://github.com/${task.githubLink.repoName}`;
                        window.open(url, '_blank');
                      }
                    }}
                    disabled={!task.githubLink?.repoName}
                  >
                    Open
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No tasks linked to GitHub yet.</p>
        </Card>
      )}
    </div>
  );
};

export default GitHubIntegration;