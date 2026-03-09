import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelect?: number;
  className?: string;
}

const ChipSelector = ({ options, selected, onChange, maxSelect, className }: ChipSelectorProps) => {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else if (!maxSelect || selected.length < maxSelect) {
      onChange([...selected, option]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map(option => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-sans transition-all duration-200 border",
              isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-popover text-foreground border-border hover:border-primary/40"
            )}
          >
            {option}
            {isSelected && <X className="w-3 h-3 ml-1.5 inline" />}
          </button>
        );
      })}
    </div>
  );
};

export default ChipSelector;
