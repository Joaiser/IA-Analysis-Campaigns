// store/useChartStore.ts
import { create } from 'zustand'

export type MetricCategory = "rendimiento" | "conversion" | "alcance"

type ChartStore = {
    selectedCategory: MetricCategory
    setSelectedCategory: (category: MetricCategory) => void
}

export const useChartStore = create<ChartStore>((set) => ({
    selectedCategory: "rendimiento",
    setSelectedCategory: (category) => set({ selectedCategory: category }),
}))
