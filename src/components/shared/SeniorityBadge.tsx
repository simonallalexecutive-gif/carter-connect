import type { SeniorityInfo } from '@/types';
import { cn } from '@/lib/utils';

interface SeniorityBadgeProps {
  info: SeniorityInfo | null;
  className?: string;
}

const SeniorityBadge = ({ info, className }: SeniorityBadgeProps) => {
  if (!info) return null;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold", info.colorClass, className)}>
      {info.label} · {info.years} ans PQE
    </span>
  );
};

export default SeniorityBadge;
