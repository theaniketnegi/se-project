import { AdminType } from '@/types';
import { create } from 'zustand';

interface AdminState {
    admin: AdminType | null;
    setAdmin: (payload: AdminType) => void;
    signout: () => void;
}

export const useAdminStore = create<AdminState>()((set) => ({
    admin: null,
    setAdmin: (payload: AdminType) => set({ admin: payload }),
    signout: () => {
        localStorage.removeItem('adminPayload');
        set({ admin: null });
    },
}));
