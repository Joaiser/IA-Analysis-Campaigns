import { create } from 'zustand'

interface FilterState {
    isOpen: boolean
    objective: string | null
    dateRange: { from: string, to: string } | null
    platforms: string[]
    setFilters: (filters: Partial<Omit<FilterState, 'isOpen'>>) => void
    toggleSidebar: () => void
    closeSidebar: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
    isOpen: false,
    objective: null,
    dateRange: null,
    platforms: [],
    setFilters: (filters) => set((state) => ({ ...state, ...filters })),
    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    closeSidebar: () => set({ isOpen: false }),
}))