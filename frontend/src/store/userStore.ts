import { UserType } from '@/types';
import { create } from 'zustand';

interface UserState {
    user: UserType | null;
    setUser: (payload: UserType) => void;
    signout: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
    user: null,
    setUser: (payload: UserType) => set({ user: payload }),
    signout: () => {
        localStorage.removeItem('userPayload');
        set({ user: null });
    },
}));
