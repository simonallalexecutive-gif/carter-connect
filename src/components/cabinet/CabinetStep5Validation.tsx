import { useState, useMemo } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { SENIORITY_MAP, CABINET_EXPERTISE_DETAIL, NAT_LABELS } from '@/lib/cabinetConstants';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PREVIEW_PALETTE = [
  'hsl(210, 60%, 22%)',
  'hsl(210, 50%, 35%)',
  'hsl(0, 0%, 72%)',
  'hsl(155, 35%, 28%)',
  'hsl(210, 40%, 48%)',
  'hsl(0, 0%, 82%)',
  'hsl(155, 25%, 40%)',
  'hsl(210, 30%, 55%)',
];

const SENIORITY_YEARS: Record<string, string> = {
  junior: '0/3 ans',
  mid: '3/6 ans',
  senior: '+6 ans',
};

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
  const senYears = s.seniorities.length ? s.seniorities.map((k) => SENIORITY_YEARS[k] || '').filter(Boolean).join(', ') : '';
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

  const natLabel = s.detectedNat ? (NAT_LABELS[s.detectedNat] || s.detectedNat) : '';

  // Check if any expertise has a Chambers ranking
  const hasChambersRanking = s.detectedRankings && s.detectedRankings.length > 0;

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 3 / 3
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Validation & aperçu</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 max-w-xl">
        Voici comment votre recherche apparaîtra aux candidats. Vérifiez puis confirmez.
      </p>

      {/* ── APERÇU ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
          <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground">Aperçu — visible par les candidats</span>
        </div>

        <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">

          {/* ─── 1. EN-TÊTE ─── */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2 flex-wrap text-[13px] font-semibold text-foreground">
              <span>{profileLabel}</span>
              <span className="text-muted-foreground/40">|</span>
              <span>{s.currentSearchDeptLabel || s.expertise.join(' / ')}</span>
              {senYears && (
                <>
                  <span className="text-muted-foreground/40">|</span>
                  <span>{senYears}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
              {natLabel && <span>{natLabel}</span>}
              {natLabel && <span>·</span>}
              <span>Pratique reconnue Chambers : {hasChambersRanking ? 'Oui' : 'Non'}</span>
            </div>
          </div>

          {/* ─── 2. SCOPE D'INTERVENTION (chips + pie chart) ─── */}
          {(activeActivities.length > 0 || chartData.length > 0) && (
            <div className="px-5 py-4 border-b border-border">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground/50 mb-3">Scope d'intervention</div>
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

                {/* Expertise chips */}
                {activeActivities.length > 0 && (
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-1.5">
                      {activeActivities.map((a) => (
                        <span key={a} className="text-[10px] bg-muted border border-border rounded px-2.5 py-1 text-foreground/80 font-medium">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── 3. CONTEXTE & ÉQUIPE ─── */}
          {(s.contexte || s.eqAssocies || s.eqCounsels || s.eqCollab) && (
            <div className="px-5 py-4 border-b border-border">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground/50 mb-3">Contexte & équipe</div>
              <div className="space-y-2.5">
                {s.contexte && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Contexte :</span>
                    <span className="text-[11px] font-medium text-foreground">{s.contexte}</span>
                  </div>
                )}
                {(s.eqAssocies || s.eqCounsels || s.eqCollab) && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Équipe actuelle :</span>
                    <div className="flex gap-3">
                      {s.eqAssocies && <span className="text-[11px] text-foreground">{s.eqAssocies} associé(s)</span>}
                      {s.eqCounsels && <span className="text-[11px] text-foreground">{s.eqCounsels} counsel(s)</span>}
                      {s.eqCollab && <span className="text-[11px] text-foreground">{s.eqCollab} collab(s)</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── 4. RÉTROCESSION & CONDITIONS ─── */}
          <div className="px-5 py-4">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground/50 mb-3">Rétrocession & conditions</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-[9px] text-muted-foreground mb-0.5">Rétrocession</div>
                <div className="text-[11px] font-semibold text-foreground">{retroStr || 'Confidentiel'}</div>
              </div>
              {s.hasHeures && s.heures && (
                <div>
                  <div className="text-[9px] text-muted-foreground mb-0.5">Objectif heures</div>
                  <div className="text-[11px] font-semibold text-foreground">{s.heures}h/an</div>
                </div>
              )}
              {s.bonusEnabled && s.bonusTypes.length > 0 && (
                <div>
                  <div className="text-[9px] text-muted-foreground mb-0.5">Bonus</div>
                  <div className="text-[11px] font-semibold text-foreground">
                    {s.bonusTypes.join(', ')}
                    {s.bonusDesc && ` (${s.bonusDesc}€)`}
                  </div>
                </div>
              )}
              {s.tt && (
                <div>
                  <div className="text-[9px] text-muted-foreground mb-0.5">Télétravail</div>
                  <div className="text-[11px] font-semibold text-foreground">{s.tt}</div>
                </div>
              )}
              {s.english && (
                <div>
                  <div className="text-[9px] text-muted-foreground mb-0.5">Anglais</div>
                  <div className="text-[11px] font-semibold text-foreground">{s.english}</div>
                </div>
              )}
            </div>
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
        <Button variant="outline" onClick={() => s.setStep(3)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button onClick={() => s.setStep(6)} disabled={!allChecked} className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8">
          Soumettre ma demande →
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep5Validation;
