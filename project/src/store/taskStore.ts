import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskCategory, TaskPriority, User } from '../types';

interface TaskState {
  tasks: Task[];
  user: User;
  filteredCategory: TaskCategory | null;
  filteredPriority: TaskPriority | null;
  searchQuery: string;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  deleteTask: (id: string) => void;
  toggleCompleted: (id: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  setFilteredCategory: (category: TaskCategory | null) => void;
  setFilteredPriority: (priority: TaskPriority | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  addXp: (amount: number) => void;
  addAchievement: (achievement: Omit<Achievement, 'id' | 'unlockedAt'>) => void;
}

const defaultUser: User = {
  id: uuidv4(),
  name: 'Sami Dev',
  xp: 0,
  completedTasks: 0,
  streakDays: 0,
  achievements: [],
  level: 1,
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      user: defaultUser,
      filteredCategory: null,
      filteredPriority: null,
      searchQuery: '',

      addTask: (task) => 
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              completed: false,
            },
          ],
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      toggleCompleted: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const wasCompleted = task.completed;
          
          // Update user stats if task is being completed
          const userUpdates = !wasCompleted 
            ? { 
                completedTasks: state.user.completedTasks + 1,
                xp: state.user.xp + (task.priority === TaskPriority.HIGH ? 30 : 
                                    task.priority === TaskPriority.MEDIUM ? 20 : 10),
                streakDays: state.user.streakDays + 1
              }
            : state.user;
          
          return {
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, completed: !task.completed } : task
            ),
            user: userUpdates,
          };
        }),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),

      setFilteredCategory: (category) =>
        set(() => ({
          filteredCategory: category,
        })),

      setFilteredPriority: (priority) =>
        set(() => ({
          filteredPriority: priority,
        })),

      setSearchQuery: (query) =>
        set(() => ({
          searchQuery: query,
        })),

      clearFilters: () =>
        set(() => ({
          filteredCategory: null,
          filteredPriority: null,
          searchQuery: '',
        })),

      addXp: (amount) =>
        set((state) => {
          const newXp = state.user.xp + amount;
          const newLevel = Math.floor(Math.sqrt(newXp) / 10) + 1;
          
          return {
            user: {
              ...state.user,
              xp: newXp,
              level: newLevel > state.user.level ? newLevel : state.user.level
            }
          };
        }),

      addAchievement: (achievement) =>
        set((state) => ({
          user: {
            ...state.user,
            achievements: [
              ...state.user.achievements,
              {
                ...achievement,
                id: uuidv4(),
                unlockedAt: new Date().toISOString(),
              },
            ],
          },
        })),
    }),
    {
      name: 'sami-dev-todo-storage',
    }
  )
);