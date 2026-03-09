import { useMemo } from 'react';
import type { SeniorityInfo } from '@/types';

export function usePQE(mois: number | null, annee: number | null): SeniorityInfo | null {
  return useMemo(() => {
    if (!mois || !annee) return null;
    const now = new Date();
    const years = ((now.getFullYear() - annee) * 12 + (now.getMonth() - (mois - 1))) / 12;
    const rounded = Math.round(years * 10) / 10;
    if (years < 3) return { label: 'Junior', years: rounded, colorClass: 'bg-accent/15 text-accent border border-accent/20' };
    if (years < 6) return { label: 'Mid Level', years: rounded, colorClass: 'bg-accent/15 text-accent border border-accent/20' };
    if (years < 10) return { label: 'Senior', years: rounded, colorClass: 'bg-foreground/10 text-foreground border border-foreground/20' };
    if (years < 15) return { label: 'Counsel', years: rounded, colorClass: 'bg-foreground/10 text-foreground border border-foreground/20' };
    return { label: 'Associé', years: rounded, colorClass: 'bg-foreground text-background' };
  }, [mois, annee]);
}
