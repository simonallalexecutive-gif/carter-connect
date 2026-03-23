import { useState, useMemo } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { SENIORITY_MAP, CABINET_EXPERTISE_DETAIL, NAT_LABELS } from '@/lib/cabinetConstants';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PREVIEW_PALETTE = [
  'hsl(210, 60%, 22%)',   // navy
  'hsl(210, 50%, 35%)',   // medium navy
  'hsl(0, 0%, 72%)',      // light grey
  'hsl(155, 35%, 28%)',   // dark green
  'hsl(210, 40%, 48%)',   // steel blue
  'hsl(0, 0%, 82%)',      // lighter grey
  'hsl(155, 25%, 40%)',   // muted green
  'hsl(210, 30%, 55%)',   // soft blue
];

const CabinetStep5Validation = () => {
  const s = useCabinetStore();
  const [checks, setChecks] = useState([false, false, false]);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const allChecked = checks.every(Boolean);
  const profileTypes = (s as any).profileTypes as string[] || [];
  const profileLabel = profileTypes.includes('associe') ? 'Associé' : profileTypes.includes('counsel') ? 'Counsel' : 'Collaborateur';
  const senStr = s.seniorities.length ? s.seniorities.map((k) => SENIORITY_MAP[k] || k).join(', ') : '';
  const retroStr = s.retroMin && s.retroMax ? `${s.retroMin}€ — ${s.retroMax}€` : s.retroMin ? `À partir de ${s.retroMin}€` : s.retroMax ? `Jusqu'à ${s.retroMax}€` : '';

  const activeActivities = Object.entries(s.cabinetActivites)
    .filter(([, v]) => v)
    .map(([k]) => {
      for (const exp of s.expertise) {
        const detail = CABINET_EXPERTISE_DETAIL[exp];
        if (detail) {
          for (const sec of detail.sections) {
            const item = sec.items.find((it) => it.key === k);
            if (item) return item.label;
          }
        }
      }
      return k;
    });

  const chartData = useMemo(() => {
    return Object.entries(s.activitySplit)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [s.activitySplit]);

  // Build title
  const titleExpertise = s.expertise.length ? s.expertise.join(' / ') : '';
  const titleSeniority = senStr ? `Profil ${senStr}` : '';
  const searchTitle = `${profileLabel}${titleExpertise ? ` ${titleExpertise}` : ''}${titleSeniority ? ` — ${titleSeniority}` : ''}`;

  // Rankings display
  const rankings = s.detectedRankings && s.detectedRankings.length > 0
    ? s.detectedRankings.map(r => `${r.label} : Tier ${r.tier}`).join(' · ')
    : '';

  const natLabel = s.detectedNat ? (NAT_LABELS[s.detectedNat] || s.detectedNat) : '';

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 4 / 4
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Validation & aperçu</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 max-w-xl">
        Voici comment votre recherche apparaîtra aux candidats. Vérifiez puis confirmez.
      </p>

      {/* ── APERÇU COMPACT (white bg, 50% reduced) ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
          <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground">Aperçu — visible par les candidats</span>
        </div>

        <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm" style={{ fontSize: '0.85em' }}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-border">
            <div className="text-[8px] tracking-[0.16em] uppercase text-muted-foreground/60 mb-1.5">Recherche en cours</div>
            <h3 className="font-sans text-base font-bold text-foreground leading-snug">{searchTitle}</h3>
            {(natLabel || rankings) && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {natLabel && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">{natLabel}</span>
                )}
                {rankings && (
                  <span className="text-[10px] text-muted-foreground">{rankings}</span>
                )}
              </div>
            )}
          </div>

          {/* Activity split + side info */}
          {(chartData.length > 0 || s.english || activeActivities.length > 0) && (
            <div className="px-5 py-4 border-b border-border">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground/50 mb-3">Répartition de l'activité</div>
              <div className="flex items-start gap-5">
                {/* Pie chart */}
                {chartData.length > 0 && (
                  <div className="flex flex-col items-center flex-shrink-0">
                    <ResponsiveContainer width={100} height={100}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={24}
                          outerRadius={45}
                          dataKey="value"
                          stroke="white"
                          strokeWidth={2}
                        >
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={PREVIEW_PALETTE[i % PREVIEW_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          contentStyle={{ fontSize: '10px', borderRadius: '4px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 justify-center max-w-[140px]">
                      {chartData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: PREVIEW_PALETTE[i % PREVIEW_PALETTE.length] }} />
                          <span className="text-[9px] text-muted-foreground">{item.name} ({item.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Side details */}
                <div className="flex-1 space-y-2.5 min-w-0">
                  {activeActivities.length > 0 && (
                    <div>
                      <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50 mb-1.5">Positionnement</div>
                      <div className="flex flex-wrap gap-1">
                        {activeActivities.map((a) => (
                          <span key={a} className="text-[9px] bg-muted border border-border rounded px-2 py-0.5 text-muted-foreground">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {s.english && (
                    <div>
                      <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50 mb-1">Anglais</div>
                      <span className="text-[10px] font-medium text-foreground">{s.english}</span>
                    </div>
                  )}
                  {s.contexte && (
                    <div>
                      <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50 mb-1">Contexte</div>
                      <span className="text-[10px] text-foreground">{s.contexte}</span>
                    </div>
                  )}
                  {(s.eqAssocies || s.eqCounsels || s.eqCollab) && (
                    <div>
                      <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50 mb-1">Équipe</div>
                      <div className="flex gap-3">
                        {s.eqAssocies && <span className="text-[10px] text-foreground">{s.eqAssocies} associé(s)</span>}
                        {s.eqCounsels && <span className="text-[10px] text-foreground">{s.eqCounsels} counsel(s)</span>}
                        {s.eqCollab && <span className="text-[10px] text-foreground">{s.eqCollab} collab(s)</span>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Rémunération compact */}
          <div className="px-5 py-3 flex items-center gap-6 text-[10px]">
            <div>
              <span className="text-muted-foreground/50 uppercase tracking-wider text-[8px]">Rétrocession</span>
              <div className="font-semibold text-foreground mt-0.5">{retroStr || 'Confidentiel'}</div>
            </div>
            {s.heures && (
              <div>
                <span className="text-muted-foreground/50 uppercase tracking-wider text-[8px]">Heures / an</span>
                <div className="font-semibold text-foreground mt-0.5">{s.heures}h</div>
              </div>
            )}
            {s.tt && (
              <div>
                <span className="text-muted-foreground/50 uppercase tracking-wider text-[8px]">Télétravail</span>
                <div className="font-semibold text-foreground mt-0.5">{s.tt}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Approval banner ── */}
      <div className="bg-foreground rounded-md p-6 mt-5">
        <div className="font-sans text-base font-semibold text-white mb-3.5">Confirmez votre demande d'accès</div>
        <div className="flex flex-col gap-2.5">
          {[
            "Je confirme les informations renseignées sur mon cabinet et mes besoins de recrutement.",
            "Je comprends que les profils sont strictement anonymisés et que toute levée de confidentialité est conditionnée à l'accord du candidat, orchestrée par LOGAN.",
            "J'accepte les conditions générales d'utilisation de la plateforme LOGAN et la politique de confidentialité.",
          ].map((text, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className={cn(
                'flex items-start gap-3 p-3 rounded border text-left transition-all',
                checks[i] ? 'bg-white/[0.07] border-white/[0.18]' : 'bg-white/[0.03] border-white/[0.08]'
              )}
            >
              <div className={cn(
                'w-[18px] h-[18px] rounded-sm border-[1.5px] flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                checks[i] ? 'bg-white border-white' : 'border-white/25'
              )}>
                {checks[i] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-white/65 leading-relaxed">{text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setStep(4)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button onClick={() => s.setStep(6)} disabled={!allChecked} className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8">
          Soumettre ma demande →
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep5Validation;
