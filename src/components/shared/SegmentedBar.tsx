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
  for (let i = min; i <= max; i += step) {
    segments.push(i);
  }

  const filledCount = segments.filter(s => s <= value).length;
  const totalSegments = segments.length;
  const ratio = totalSegments > 0 ? filledCount / totalSegments : 0;

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-sans text-foreground/70">{label}</span>}
          {showValue && <span className="text-xs font-sans font-bold text-foreground tabular-nums">{value}%</span>}
        </div>
      )}
      <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
        {/* Filled track */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${ratio * 100}%`,
            background: `linear-gradient(90deg, ${activeColor}, ${activeColor}dd)`,
          }}
        />
        {/* Clickable segments overlay */}
        <div className="absolute inset-0 flex">
          {segments.map((segVal, i) => (
            <button
              key={segVal}
              type="button"
              onClick={() => onChange(segVal === value && segVal > min ? segVal - step : segVal)}
              className="flex-1 h-full cursor-pointer hover:bg-foreground/5 transition-colors"
              title={`${segVal}%`}
            />
          ))}
        </div>
        {/* Tick marks */}
        <div className="absolute inset-0 flex pointer-events-none">
          {segments.map((segVal, i) => (
            i > 0 && i < totalSegments ? (
              <div key={segVal} className="flex-1 border-l border-background/30 h-full" />
            ) : <div key={segVal} className="flex-1" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SegmentedBar;
