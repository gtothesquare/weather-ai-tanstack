interface Props {
  start: number;
  width: number;
}

export function TemperatureRangeBar({ start, width }: Props) {
  return (
    <div className="relative h-2 rounded-full bg-muted/42">
      <div
        className="absolute top-0 h-2 rounded-full bg-sky-300/70 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{
          left: `${start}%`,
          width: `${width}%`,
        }}
      />
    </div>
  );
}
