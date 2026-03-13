import type { SeniorityInfo } from '@/types';
import { cn } from '@/lib/utils';

interface SeniorityBadgeProps {
  info: SeniorityInfo | null;
  className?: string;
  hideExactPQE?: boolean;
}

const SeniorityBadge = ({ info, className, hideExactPQE = false }: SeniorityBadgeProps) => {
  if (!info) return null;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-sans font-medium tracking-wide", info.colorClass, className)}>
      {hideExactPQE ? info.label : `${info.label} · ${info.years} ans PQE`}
    </span>
  );
};

export default SeniorityBadge;
