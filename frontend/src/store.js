import { create } from 'zustand';
import tasksData from './data/tasks.json';

const useStore = create((set, get) => ({
  tasks: tasksData.tasks,
  categories: tasksData.categories,
  meta: tasksData.meta,
  selectedTask: null,
  expandedTasks: {},

  selectTask: (taskId) => set({ selectedTask: taskId }),

  toggleExpand: (taskId) => set((state) => ({
    expandedTasks: {
      ...state.expandedTasks,
      [taskId]: !state.expandedTasks[taskId]
    }
  })),

  getCategory: (categoryId) => {
    return get().categories.find(c => c.id === categoryId);
  }
}));

export default useStore;
