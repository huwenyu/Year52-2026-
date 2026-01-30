import { describe, expect, it } from "vitest"
import { getWeekProgress, getYearWeeksJan1 } from "@/utils/weeks"

describe("weeks", () => {
  it("generates 52 weeks from Jan 1", () => {
    const weeks = getYearWeeksJan1(2026)
    expect(weeks).toHaveLength(52)
    expect(weeks[0]?.label).toBe("01/01 - 01/07")
    expect(weeks[1]?.label).toBe("01/08 - 01/14")
    expect(weeks[51]?.label).toBe("12/24 - 12/30")
  })

  it("computes past/current/future and clamps progress", () => {
    const weekStart = new Date(2026, 0, 1, 0, 0, 0)

    const future = getWeekProgress(new Date(2025, 11, 31, 23, 0, 0), weekStart)
    expect(future.state).toBe("future")
    expect(future.progress).toBe(0)

    const current = getWeekProgress(new Date(2026, 0, 4, 12, 0, 0), weekStart)
    expect(current.state).toBe("current")
    expect(current.progress).toBeGreaterThan(0)
    expect(current.progress).toBeLessThan(1)

    const past = getWeekProgress(new Date(2026, 0, 8, 0, 0, 0), weekStart)
    expect(past.state).toBe("past")
    expect(past.progress).toBe(1)
  })
})
