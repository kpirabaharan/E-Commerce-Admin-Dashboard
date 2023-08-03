import { create } from 'zustand';

interface LoadingStore {
  isLoading: boolean;
  setStartLoading: () => void;
  setFinishLoading: () => void;
}

export const useLoading = create<LoadingStore>((set) => ({
  isLoading: false,
  setStartLoading: () => set({ isLoading: true }),
  setFinishLoading: () => set({ isLoading: false }),
}));
