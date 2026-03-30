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
  const segments = [];
  for (let i = min; i <= max; i += step) {
    segments.push(i);
  }
  const totalSegments = segments.length;

  return (
    <div className="space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-sans text-foreground">{label}</span>}
          {showValue && <span className="text-xs font-sans font-bold text-foreground tabular-nums">{value}%</span>}
        </div>
      )}
      <div className="flex gap-[2px] h-7">
        {segments.map((segVal, i) => {
          const isActive = segVal <= value;
          return (
            <button
              key={segVal}
              type="button"
              onClick={() => onChange(segVal === value && segVal > min ? segVal - step : segVal)}
              className={cn(
                "flex-1 transition-all duration-150 hover:opacity-80",
                i === 0 && "rounded-l-sm",
                i === totalSegments - 1 && "rounded-r-sm",
              )}
              style={{
                backgroundColor: isActive ? activeColor : 'hsl(var(--secondary))',
                opacity: isActive ? 1 - (value - segVal) / (max * 2.5) : undefined,
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
