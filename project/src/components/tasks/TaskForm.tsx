import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TaskCategory, TaskPriority, Task } from '../../types';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Calendar, ChevronDown, Plus, X } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => void;
  onCancel?: () => void;
  initialTask?: Task;
  isEditing?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialTask, 
  isEditing = false 
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || TaskCategory.WORK);
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || TaskPriority.MEDIUM);
  const [codeSnippet, setCodeSnippet] = useState(initialTask?.codeSnippet || '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [tags, setTags] = useState<string[]>(initialTask?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [githubRepo, setGithubRepo] = useState(initialTask?.githubLink?.repoName || '');
  const [githubCommit, setGithubCommit] = useState(initialTask?.githubLink?.commitId || '');
  const [githubPR, setGithubPR] = useState(initialTask?.githubLink?.prNumber || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Partial<Task> = {
      title,
      description,
      category,
      priority,
      tags,
      ...(codeSnippet ? { codeSnippet } : {}),
      ...(dueDate ? { dueDate } : {}),
    };
    
    // Add GitHub link if any field is filled
    if (githubRepo || githubCommit || githubPR) {
      taskData.githubLink = {
        ...(githubRepo ? { repoName: githubRepo } : {}),
        ...(githubCommit ? { commitId: githubCommit } : {}),
        ...(githubPR ? { prNumber: githubPR } : {})
      };
    }
    
    onSubmit(taskData);
    
    // Clear form if not editing
    if (!isEditing) {
      setTitle('');
      setDescription('');
      setCategory(TaskCategory.WORK);
      setPriority(TaskPriority.MEDIUM);
      setCodeSnippet('');
      setDueDate('');
      setTags([]);
      setTagInput('');
      setGithubRepo('');
      setGithubCommit('');
      setGithubPR('');
      setShowAdvanced(false);
    }
  };
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Task Title*
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Enter task title"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            placeholder="Describe your task..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              {Object.values(TaskCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              {Object.values(TaskPriority).map((pri) => (
                <option key={pri} value={pri}>
                  {pri.charAt(0).toUpperCase() + pri.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <div className="relative">
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white pr-10"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          <div className="flex">
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder="Add a tag..."
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-primary-500 text-white rounded-r-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Plus size={18} />
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  type="tag" 
                  value={tag}
                  removable
                  onRemove={() => removeTag(tag)}
                />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none"
          >
            {showAdvanced ? (
              <ChevronDown size={16} className="mr-1" />
            ) : (
              <ChevronDown size={16} className="mr-1" />
            )}
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>
        
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-2"
          >
            <div>
              <label htmlFor="codeSnippet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code Snippet
              </label>
              <textarea
                id="codeSnippet"
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="// Add your code here..."
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub Integration
              </h3>
              
              <div>
                <label htmlFor="githubRepo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Repository Name
                </label>
                <input
                  id="githubRepo"
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  placeholder="username/repo"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="githubCommit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Commit ID
                  </label>
                  <input
                    id="githubCommit"
                    type="text"
                    value={githubCommit}
                    onChange={(e) => setGithubCommit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Commit hash"
                  />
                </div>
                
                <div>
                  <label htmlFor="githubPR" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pull Request #
                  </label>
                  <input
                    id="githubPR"
                    type="text"
                    value={githubPR}
                    onChange={(e) => setGithubPR(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="PR number"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
          >
            {isEditing ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default TaskForm;