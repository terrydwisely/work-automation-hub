import { create } from 'zustand';
import tasksData from './data/tasks.json';

const useStore = create((set, get) => ({
  tasks: tasksData.tasks,
  categories: tasksData.categories,
  meta: tasksData.meta,
  selectedTask: null,
  expandedTasks: {},
  groupDrag: true,
  sidebarOpen: true,
  sidebarTab: 'tasks', // 'tasks' | 'categories'

  selectTask: (taskId) => set({ selectedTask: taskId }),

  toggleExpand: (taskId) => set((state) => ({
    expandedTasks: {
      ...state.expandedTasks,
      [taskId]: !state.expandedTasks[taskId]
    }
  })),

  toggleGroupDrag: () => set((state) => ({ groupDrag: !state.groupDrag })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  getCategory: (categoryId) => {
    return get().categories.find(c => c.id === categoryId);
  },

  getTasksByCategory: (categoryId) => {
    return get().tasks.filter(t => t.category === categoryId);
  },

  getStepStats: (taskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return { total: 0, automated: 0, manual: 0, pending: 0 };
    return {
      total: task.steps.length,
      automated: task.steps.filter(s => s.automation_level === 'full').length,
      manual: task.steps.filter(s => s.automation_level === 'manual').length,
      pending: task.steps.filter(s => s.needs_detail).length,
    };
  }
}));

export default useStore;
