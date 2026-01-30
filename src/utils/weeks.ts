export type WeekRange = {
  index: number
  start: Date
  end: Date
  label: string
}

const DAY_MS = 24 * 60 * 60 * 1000

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function startOfDayLocal(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * DAY_MS)
}

export function formatMonthDay(d: Date) {
  const mm = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  return `${mm}/${dd}`
}

export function getYearWeeksJan1(year: number) {
  const start = new Date(year, 0, 1)
  const weeks: WeekRange[] = []
  for (let i = 1; i <= 52; i += 1) {
    const weekStart = addDays(start, (i - 1) * 7)
    const weekEnd = addDays(weekStart, 6)
    const label = `${formatMonthDay(weekStart)} - ${formatMonthDay(weekEnd)}`
    weeks.push({ index: i, start: weekStart, end: weekEnd, label })
  }
  return weeks
}

export type WeekProgress = {
  state: "past" | "current" | "future"
  progress: number
  daysElapsed: number
  daysRemaining: number
}

export function getWeekProgress(now: Date, weekStart: Date) {
  const start = weekStart
  const nextStart = addDays(start, 7)

  const raw = (now.getTime() - start.getTime()) / (7 * DAY_MS)
  const progress = Math.max(0, Math.min(1, raw))

  const state: WeekProgress["state"] =
    now.getTime() < start.getTime() ? "future" : now.getTime() >= nextStart.getTime() ? "past" : "current"

  const sodNow = startOfDayLocal(now).getTime()
  const sodStart = startOfDayLocal(start).getTime()
  const dayIndex = Math.max(0, Math.min(6, Math.floor((sodNow - sodStart) / DAY_MS)))

  if (state === "future") return { state, progress: 0, daysElapsed: 0, daysRemaining: 7 }
  if (state === "past") return { state, progress: 1, daysElapsed: 7, daysRemaining: 0 }

  return {
    state,
    progress,
    daysElapsed: dayIndex,
    daysRemaining: 7 - dayIndex,
  }
}

export function formatWeekIndex(i: number) {
  return pad2(i)
}
