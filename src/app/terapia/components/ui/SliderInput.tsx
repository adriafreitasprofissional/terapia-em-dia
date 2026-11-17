type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  leftLabel?: string;
  rightLabel?: string;
};

export default function SliderInput({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  leftLabel = "Baixo",
  rightLabel = "Alto",
}: Props) {
  return (
    <div className="space-y-3 rounded-2xl border border-[#D7C18C]/40 bg-[#263825] p-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(
            Number(
              event.target.value
            )
          )
        }
        className="w-full accent-[#8AA27A]"
      />

      <div className="flex items-center justify-between gap-3 text-xs text-[#D8DFD1]">
        <span>{leftLabel}</span>

        <span className="rounded-full bg-[#31402D] px-3 py-1 text-sm font-black text-[#F5F0E6]">
          {value}
        </span>

        <span className="text-right">
          {rightLabel}
        </span>
      </div>
    </div>
  );
}
