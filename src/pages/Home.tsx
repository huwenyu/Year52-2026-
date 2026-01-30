import { useMemo } from "react"
import { toPng, toSvg } from "html-to-image"
import { Moon, Sun } from "lucide-react"
import YearHeader from "@/components/YearHeader"
import WeekCard from "@/components/WeekCard"
import { useNow } from "@/hooks/useNow"
import { useTheme } from "@/hooks/useTheme"
import { useWeekUiStore } from "@/stores/useWeekUiStore"
import { getWeekProgress, getYearWeeksJan1 } from "@/utils/weeks"

const YEAR = 2026

export default function Home() {
  const now = useNow(60_000)
  const weeks = useMemo(() => getYearWeeksJan1(YEAR), [])

  const selectedWeekIndex = useWeekUiStore((s) => s.selectedWeekIndex)
  const hoveredWeekIndex = useWeekUiStore((s) => s.hoveredWeekIndex)

  const activeWeekIndex = selectedWeekIndex ?? hoveredWeekIndex
  const activeWeek = activeWeekIndex ? weeks[activeWeekIndex - 1] : null
  const activeWeekProgress = activeWeek ? getWeekProgress(now, activeWeek.start) : null

  const currentWeekIndex = useMemo(() => {
    for (const w of weeks) {
      const p = getWeekProgress(now, w.start)
      if (p.state === "current") return w.index
    }
    return null
  }, [now, weeks])

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div id="capture-root" className="mx-auto w-full max-w-6xl px-6 py-10">
        <YearHeader year={YEAR} progressText="23%" />

        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(112px,1fr))] gap-3">
          {weeks.map((w) => {
            const p = getWeekProgress(now, w.start)
            const isCurrent = currentWeekIndex === w.index
            return <WeekCard key={w.index} week={w} progress={p} isCurrent={isCurrent} />
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5">
          <div className="flex items-center justify-between gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <ExportButtons year={YEAR} />
              <CopyLinkButton year={YEAR} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? <Moon size={14} /> : <Sun size={14} />}
    </button>
  )
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function toPngBlob(node: HTMLElement) {
  const dataUrl = await toPng(node, { backgroundColor: getBackgroundColor(), pixelRatio: 2 })
  const res = await fetch(dataUrl)
  return res.blob()
}

async function toSvgBlob(node: HTMLElement) {
  const dataUrl = await toSvg(node, { backgroundColor: getBackgroundColor() })
  const comma = dataUrl.indexOf(",")
  const encoded = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl
  const svgText = decodeURIComponent(encoded)
  return new Blob([svgText], { type: "image/svg+xml" })
}

function getBackgroundColor() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--background").trim()
  return raw ? `hsl(${raw})` : "#ffffff"
}

function ExportButtons({ year }: { year: number }) {
  return (
    <>
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-extrabold tracking-[0.12em] text-foreground transition-colors hover:bg-muted"
        onClick={async () => {
          const node = document.getElementById("capture-root")
          if (!node) return
          const blob = await toSvgBlob(node)
          downloadBlob(`year52-${year}.svg`, blob)
        }}
      >导出 SVG</button>
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-1.5 text-xs font-extrabold tracking-[0.12em] text-foreground transition-colors hover:bg-muted"
        onClick={async () => {
          const node = document.getElementById("capture-root")
          if (!node) return
          const blob = await toPngBlob(node)
          downloadBlob(`year52-${year}.png`, blob)
        }}
      >导出 PNG</button>
    </>
  )
}

function CopyLinkButton({ year }: { year: number }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-border px-3 py-1.5 text-xs font-extrabold tracking-[0.12em] text-foreground transition-colors hover:bg-muted"
      onClick={async () => {
        const url = new URL(window.location.href)
        url.searchParams.set("year", String(year))
        url.searchParams.set("rule", "jan1")
        window.history.replaceState(null, "", url.toString())
        await navigator.clipboard.writeText(url.toString())
      }}
    >复制链接</button>
  )
}
