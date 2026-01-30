import { create } from "zustand"

type WeekUiState = {
  hoveredWeekIndex: number | null
  selectedWeekIndex: number | null
  setHoveredWeekIndex: (index: number | null) => void
  setSelectedWeekIndex: (index: number | null) => void
}

export const useWeekUiStore = create<WeekUiState>((set) => ({
  hoveredWeekIndex: null,
  selectedWeekIndex: null,
  setHoveredWeekIndex: (index) => set({ hoveredWeekIndex: index }),
  setSelectedWeekIndex: (index) => set({ selectedWeekIndex: index }),
}))
