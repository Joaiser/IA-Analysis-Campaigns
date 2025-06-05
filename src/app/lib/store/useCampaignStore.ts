import { create } from 'zustand';

interface CampaignStore {
    isUpdating: boolean;
    updatedMsg: string | null;
    setIsUpdating: (state: boolean) => void;
    setUpdatedMsg: (msg: string | null) => void;
}

export const useCampaignStore = create<CampaignStore>((set) => ({
    isUpdating: false,
    updatedMsg: null,
    setIsUpdating: (state) => set({ isUpdating: state }),
    setUpdatedMsg: (msg) => set({ updatedMsg: msg }),
}));
