export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TaskCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  STUDY = 'study',
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DESIGN = 'design',
  MEETING = 'meeting',
  OTHER = 'other',
}

export interface GitHubLink {
  commitId?: string;
  prNumber?: string;
  repoName?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  codeSnippet?: string;
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  tags: string[];
  githubLink?: GitHubLink;
  streak?: number;
}

export interface User {
  id: string;
  name: string;
  xp: number;
  completedTasks: number;
  streakDays: number;
  achievements: Achievement[];
  level: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export interface ThemeConfig {
  darkMode: boolean;
}