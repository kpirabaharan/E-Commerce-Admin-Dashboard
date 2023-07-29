import { create } from 'zustand';

interface AlertModalStore {
  storeId: string | undefined;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}

const useAlertModal = create<AlertModalStore>((set) => ({
  storeId: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, storeId: id }),
  onClose: () => set({ isOpen: false, storeId: undefined }),
}));

export default useAlertModal;
