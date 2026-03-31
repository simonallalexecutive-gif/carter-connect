import { cn } from '@/lib/utils';
import { useRef, useCallback } from 'react';

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
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = x / rect.width;
      const raw = min + ratio * (max - min);
      const snapped = Math.round(raw / step) * step;
      onChange(Math.max(min, Math.min(max, snapped)));
    },
    [min, max, step, onChange],
  );

  return (
    <div className="space-y-1.5">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-sans text-foreground/70">{label}</span>}
          {showValue && <span className="text-xs font-sans font-bold text-foreground tabular-nums">{value}%</span>}
        </div>
      )}
      <div
        ref={trackRef}
        onClick={handleClick}
        className="relative h-2 rounded-full cursor-pointer bg-secondary"
      >
        {/* Filled track */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${activeColor}, ${activeColor}dd)`,
          }}
        />
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background shadow-md transition-all duration-200"
          style={{
            left: `calc(${pct}% - 8px)`,
            backgroundColor: activeColor,
          }}
        />
      </div>
    </div>
  );
};

export default SegmentedBar;
