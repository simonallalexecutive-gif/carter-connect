import { cn } from '@/lib/utils';

interface SegmentedBarProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  activeColor?: string;
  label?: string;
  showValue?: boolean;
}

const SegmentedBar = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 5,
  activeColor = 'hsl(215, 50%, 35%)',
  label,
  showValue = true,
}: SegmentedBarProps) => {
  const segments: number[] = [];
  for (let i = min + step; i <= max; i += step) {
    segments.push(i);
  }
  const totalSegments = segments.length;

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-sans text-foreground/70">{label}</span>}
          {showValue && <span className="text-xs font-sans font-bold text-foreground tabular-nums">{value}%</span>}
        </div>
      )}
      <div className="flex gap-[1.5px] h-[10px]">
        {segments.map((segVal, i) => {
          const isActive = segVal <= value;
          return (
            <button
              key={segVal}
              type="button"
              onClick={() => onChange(segVal === value && segVal > min + step ? segVal - step : segVal)}
              className={cn(
                "flex-1 transition-all duration-200 hover:opacity-80",
                i === 0 && "rounded-l-full",
                i === totalSegments - 1 && "rounded-r-full",
              )}
              style={{
                backgroundColor: isActive ? activeColor : 'hsl(var(--secondary))',
                opacity: isActive ? 0.55 + 0.45 * (segVal / max) : undefined,
              }}
              title={`${segVal}%`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedBar;
