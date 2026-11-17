type Props = {
  step: number;
  total: number;
};

export default function ProgressBar({
  step,
  total,
}: Props) {
  const progress =
    (step / total) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between text-xs font-semibold text-[#D8DFD1]">
        <span>
          ETAPA {step} DE {total}
        </span>

        <span>
          {Math.round(progress)}% concluído
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-[#31402D]">
        <div
          className="h-full rounded-full bg-[#506A48] transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
