import { cn } from '@/lib/utils';
import { ACTIVITES } from '@/lib/constants';
import { Slider } from '@/components/ui/slider';

interface TagCloudProps {
  activites: Record<string, boolean>;
  pourcentages: Record<string, number>;
  onToggle: (key: string) => void;
  onPercentChange: (key: string, value: number) => void;
}

const SECTIONS = [
  { title: 'Nature du travail', items: ACTIVITES.nature },
  { title: 'Positionnement', items: ACTIVITES.position },
  { title: 'Restructuration & opérations', items: ACTIVITES.restr },
];

const TagCloud = ({ activites, pourcentages, onToggle, onPercentChange }: TagCloudProps) => {
  return (
    <div className="space-y-6">
      {SECTIONS.map(section => (
        <div key={section.title}>
          <h4 className="text-sm font-sans font-semibold text-muted-foreground mb-3">{section.title}</h4>
          <div className="space-y-2">
            {section.items.map(item => {
              const isActive = activites[item.key];
              return (
                <div key={item.key} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => onToggle(item.key)}
                    className={cn(
                      "px-4 py-2.5 rounded-full text-sm font-sans transition-all duration-200 border",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-popover text-foreground border-border hover:border-primary/40"
                    )}
                  >
                    {item.label}
                    {isActive && pourcentages[item.key] ? ` — ${pourcentages[item.key]}%` : ''}
                  </button>
                  {isActive && (
                    <div className="flex items-center gap-3 pl-2 animate-fade-in">
                      <Slider
                        value={[pourcentages[item.key] || 10]}
                        onValueChange={([v]) => onPercentChange(item.key, v)}
                        min={10}
                        max={100}
                        step={10}
                        className="w-48"
                      />
                      <span className="text-xs font-sans text-muted-foreground w-10 text-right">
                        {pourcentages[item.key] || 10}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagCloud;
