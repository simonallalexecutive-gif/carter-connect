import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CABINET_META } from '@/lib/constants';
import { X } from 'lucide-react';

interface AutocompleteInputProps {
  data: string[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  placeholder?: string;
  single?: boolean;
  showMeta?: boolean;
  className?: string;
}

const AutocompleteInput = ({
  data,
  value,
  onChange,
  placeholder = 'Rechercher...',
  single = true,
  showMeta = false,
  className,
}: AutocompleteInputProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = query.length >= 1
    ? data.filter(d => d.toLowerCase().includes(query.toLowerCase())).slice(0, 10)
    : [];

  const handleSelect = (item: string) => {
    if (single) {
      onChange(item);
      setQuery(item);
    } else {
      const arr = Array.isArray(value) ? value : [];
      if (!arr.includes(item)) {
        onChange([...arr, item]);
      }
      setQuery('');
    }
    setIsOpen(false);
  };

  const handleRemove = (item: string) => {
    if (!single && Array.isArray(value)) {
      onChange(value.filter(v => v !== item));
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Tags for multi-select */}
      {!single && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map(v => (
            <span
              key={v}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sans"
            >
              {v}
              <button onClick={() => handleRemove(v)} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={single ? (typeof value === 'string' ? (focused ? query : value || query) : query) : query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          if (single) onChange('');
        }}
        onFocus={() => {
          setFocused(true);
          if (single && typeof value === 'string') setQuery(value);
          if (query.length >= 1) setIsOpen(true);
        }}
        onBlur={() => {
          setFocused(false);
          setTimeout(() => setIsOpen(false), 200);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && filtered.length > 0) {
            e.preventDefault();
            handleSelect(filtered[0]);
          }
        }}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-input bg-popover text-foreground font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      />

      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filtered.map(item => {
            const meta = showMeta ? CABINET_META[item] : null;
            return (
              <button
                key={item}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
                className="w-full text-left px-4 py-3 hover:bg-muted transition-colors font-sans text-sm"
              >
                <span className="text-foreground">{item}</span>
                {meta && (
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    {meta.nat} · {meta.tier}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
