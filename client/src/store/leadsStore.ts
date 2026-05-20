import { create } from 'zustand';
import { LeadFilters } from '../types';

interface LeadsState {
  filters: LeadFilters;
  setFilter: (key: keyof LeadFilters, value: string | number) => void;
  resetFilters: () => void;
}

const defaultFilters: LeadFilters = {
  status: 'all',
  source: 'all',
  search: '',
  sort: 'latest',
  page: 1,
};

export const useLeadsStore = create<LeadsState>((set) => ({
  filters: defaultFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
        ...(key !== 'page' ? { page: 1 } : {}),
      },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
}));