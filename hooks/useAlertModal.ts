import { create } from 'zustand';

interface AlertModalStoreProps {
  deleteUrl: string;
  deleteType: 'store' | 'billboard';
}

interface AlertModalStore {
  deleteUrl: string | undefined;
  deleteType: 'store' | 'billboard' | undefined;
  isOpen: boolean;
  onOpen: ({ deleteUrl, deleteType }: AlertModalStoreProps) => void;
  onClose: () => void;
}

export const useAlertModal = create<AlertModalStore>((set) => ({
  deleteUrl: undefined,
  deleteType: undefined,
  isOpen: false,
  onOpen: ({ deleteUrl, deleteType }: AlertModalStoreProps) =>
    set({ isOpen: true, deleteUrl, deleteType }),
  onClose: () =>
    set({ isOpen: false, deleteUrl: undefined, deleteType: undefined }),
}));
