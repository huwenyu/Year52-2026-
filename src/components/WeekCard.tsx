import { cn } from "@/lib/utils"
import { useWeekUiStore } from "@/stores/useWeekUiStore"
import type { WeekRange, WeekProgress } from "@/utils/weeks"
import { formatWeekIndex } from "@/utils/weeks"
import WeekRing from "@/components/WeekRing"

type Props = {
  week: WeekRange
  progress: WeekProgress
  isCurrent: boolean
}

export default function WeekCard({ week, progress, isCurrent }: Props) {
  const hoveredWeekIndex = useWeekUiStore((s) => s.hoveredWeekIndex)
  const selectedWeekIndex = useWeekUiStore((s) => s.selectedWeekIndex)
  const setHoveredWeekIndex = useWeekUiStore((s) => s.setHoveredWeekIndex)
  const setSelectedWeekIndex = useWeekUiStore((s) => s.setSelectedWeekIndex)

  const isHovered = hoveredWeekIndex === week.index
  const isSelected = selectedWeekIndex === week.index
  const isActive = isHovered || isSelected

  return (
    <button
      type="button"
      className={cn(
        "group relative flex w-full flex-col items-center justify-center gap-2 rounded-xl px-2 py-3",
        "transition-colors",
        isActive ? "bg-muted" : "bg-transparent hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
      aria-label={`第 ${formatWeekIndex(week.index)} 周 ${week.label}`}
      onMouseEnter={() => setHoveredWeekIndex(week.index)}
      onMouseLeave={() => setHoveredWeekIndex(null)}
      onFocus={() => setHoveredWeekIndex(week.index)}
      onBlur={() => setHoveredWeekIndex(null)}
      onClick={() => setSelectedWeekIndex(isSelected ? null : week.index)}
    >
      <div className={cn("text-[12px] font-semibold tracking-[0.08em]", isCurrent ? "text-foreground" : "text-muted-foreground")}>
        {week.label}
      </div>
      <WeekRing weekIndexLabel={formatWeekIndex(week.index)} progress={progress.progress} isCurrent={isCurrent} />
    </button>
  )
}
