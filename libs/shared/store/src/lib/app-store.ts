import { create } from 'zustand';

type AppStoreState = {
  user: {
    id: string;
    displayName: string;
  };
};

type AppStoreActions = {
  setUser: (user: { id: string; displayName: string }) => void;
};

const initialAppStoreState: AppStoreState = {
  user: { id: 'unknown', displayName: 'unknown' },
};

export const useAppStore = create<AppStoreState & AppStoreActions>(
  (set, get) => {
    return {
      ...initialAppStoreState,
      setUser: (user) => set({ user }),
    };
  }
);
