type Props = {
  year: number
  progressText: string
}

export default function YearHeader({ year, progressText }: Props) {
  return (
    <header className="flex w-full items-start justify-between gap-4 px-4">
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <div
          className="select-none text-left text-[clamp(56px,18vw,88px)] font-black leading-[0.85] tracking-[-0.04em] text-foreground sm:text-[clamp(72px,14vw,120px)] sm:tracking-[-0.048em] md:text-[160px]"
          style={{ fontVariantNumeric: "slashed-zero tabular-nums" }}
        >
          {year}
        </div>
        <div className="-mt-1 px-2 py-1 text-left text-[clamp(10px,2.6vw,14px)] font-extrabold tracking-[0.16em] text-muted-foreground">
          1 Year ≈ 53 Weeks
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-end">
        <span
          className="select-none text-right text-[clamp(56px,18vw,88px)] font-black leading-[0.85] tracking-[-0.04em] text-foreground sm:text-[clamp(72px,14vw,120px)] sm:tracking-[-0.048em] md:text-[160px]"
          style={{ fontVariantNumeric: "slashed-zero tabular-nums" }}
        >
          {progressText}
        </span>
        <div className="-mt-0.5 px-2 py-1 text-right text-[clamp(10px,2.6vw,14px)] font-extrabold tracking-[0.16em] text-muted-foreground">
          Year Progress
        </div>
      </div>
    </header>
  )
}
