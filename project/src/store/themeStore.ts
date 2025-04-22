import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      
      toggleDarkMode: () => 
        set((state) => {
          const newDarkMode = !state.darkMode;
          document.documentElement.classList.toggle('dark', newDarkMode);
          return { darkMode: newDarkMode };
        }),
        
      setDarkMode: (value) => 
        set(() => {
          document.documentElement.classList.toggle('dark', value);
          return { darkMode: value };
        }),
    }),
    {
      name: 'sami-dev-theme-storage',
    }
  )
);