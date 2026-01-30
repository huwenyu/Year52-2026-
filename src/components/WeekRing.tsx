import { useId } from "react"

type Props = {
  weekIndexLabel: string
  progress: number
  isCurrent: boolean
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

export default function WeekRing({ weekIndexLabel, progress, isCurrent }: Props) {
  const id = useId()
  const cx = 50
  const cy = 50
  const segments = 8

  const w = 18
  const h = 7
  const r = 3.5
  const ringRadius = 30
  const baseX = cx - w / 2
  const baseY = cy - ringRadius - h / 2

  const segmentProgress = clamp01(progress) * segments

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-[92px] w-[92px]"
      aria-hidden="true"
      focusable={false}
    >
      <defs>
        {Array.from({ length: segments }).map((_, i) => {
          const f = clamp01(segmentProgress - i)
          const clipId = `${id}-clip-${i}`
          return (
            <clipPath id={clipId} key={clipId} clipPathUnits="userSpaceOnUse">
              <rect x={baseX} y={baseY} width={w * f} height={h} rx={r} ry={r} />
            </clipPath>
          )
        })}
      </defs>

      {Array.from({ length: segments }).map((_, i) => {
        const angle = -90 + i * (360 / segments)
        const f = clamp01(segmentProgress - i)
        const clipId = `${id}-clip-${i}`
        const strokeWidth = isCurrent ? 2.2 : 1.8

        return (
          <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
            <rect
              x={baseX}
              y={baseY}
              width={w}
              height={h}
              rx={r}
              ry={r}
              fill="hsl(var(--background))"
              stroke="hsl(var(--foreground))"
              strokeWidth={strokeWidth}
            />

            {f > 0 ? (
              <g clipPath={`url(#${clipId})`}>
                <rect x={baseX} y={baseY} width={w} height={h} rx={r} ry={r} fill="hsl(var(--foreground))" />
              </g>
            ) : null}

            <rect
              x={baseX}
              y={baseY}
              width={w}
              height={h}
              rx={r}
              ry={r}
              fill="transparent"
              stroke="hsl(var(--foreground))"
              strokeWidth={strokeWidth}
            />
          </g>
        )
      })}

      {isCurrent ? <circle cx={cx} cy={cy + 34} r={1.8} fill="hsl(var(--foreground))" /> : null}

      <text
        x={cx}
        y={cy + 7}
        textAnchor="middle"
        fontSize={24}
        fontWeight={800}
        fill="hsl(var(--foreground))"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {weekIndexLabel}
      </text>
    </svg>
  )
}
