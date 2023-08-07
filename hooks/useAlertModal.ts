import { create } from 'zustand';

type DeleteType =
  | 'store'
  | 'billboard'
  | 'category'
  | 'size'
  | 'color'
  | 'product'
  | undefined;

interface AlertModalStoreProps {
  deleteUrl: string;
  deleteType: DeleteType;
}

interface AlertModalStore {
  deleteUrl: string | undefined;
  deleteType: DeleteType;
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
