import { cn } from '@/lib/utils';

interface SquareGaugeProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  max?: number;
  activeColor?: string;
  label?: string;
}

const SquareGauge = ({
  value,
  onChange,
  step = 5,
  max = 100,
  activeColor = 'hsl(215, 50%, 35%)',
  label,
}: SquareGaugeProps) => {
  const totalSquares = max / step;
  const filledSquares = Math.round(value / step);

  const handleClick = (index: number) => {
    const newValue = (index + 1) * step;
    // If clicking the same square that's the current max filled, toggle it off
    onChange(newValue === value ? Math.max(0, newValue - step) : newValue);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-sans text-foreground/70">{label}</span>
          <span className="text-xs font-sans font-bold text-foreground tabular-nums">{value}%</span>
        </div>
      )}
      <div className="flex gap-[3px]">
        {Array.from({ length: totalSquares }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(i)}
            className={cn(
              "h-3 flex-1 rounded-[2px] transition-colors duration-150 cursor-pointer border",
              i < filledSquares
                ? "border-transparent"
                : "bg-secondary border-border/50 hover:border-foreground/20"
            )}
            style={i < filledSquares ? { backgroundColor: activeColor } : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default SquareGauge;
