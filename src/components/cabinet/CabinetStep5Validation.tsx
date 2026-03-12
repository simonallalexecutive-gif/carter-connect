import { useState } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { SENIORITY_MAP, CABINET_EXPERTISE_DETAIL } from '@/lib/cabinetConstants';
import { cn } from '@/lib/utils';
import ActivityPieChart from '@/components/shared/ActivityPieChart';

const CONF_MAP: Record<string, string> = {
  confidentielle: 'Confidentielle (LOGAN proactif)',
  semi: 'Semi-confidentielle',
  ouverte: 'Ouverte',
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
  const senStr = s.seniorities.length ? s.seniorities.map((k) => SENIORITY_MAP[k] || k).join(', ') : '';
  const eqStr = [
    s.eqAssocies ? s.eqAssocies + ' associé(s)' : '',
    s.eqCounsels ? s.eqCounsels + ' counsel(s)' : '',
    s.eqCollab ? s.eqCollab + ' collaborateur(s)' : '',
  ].filter(Boolean).join(', ');
  const retroStr = s.retroMin && s.retroMax ? `${s.retroMin}€ — ${s.retroMax}€` : s.retroMin ? `À partir de ${s.retroMin}€` : s.retroMax ? `Jusqu'à ${s.retroMax}€` : '';

  // Active sub-activities
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

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 4 / 4
      </div>
      <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Validation & aperçu</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
        Visualisez comment votre recherche apparaîtra aux candidats sur la plateforme LOGAN, puis confirmez votre demande.
      </p>

      {/* ── Candidate preview ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
          <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground">Aperçu — votre recherche telle que vue par les candidats</span>
        </div>

        <div className="bg-foreground rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="text-[8px] tracking-[0.16em] uppercase text-white/30 mb-2">Opportunité · Présentée par LOGAN</div>
            <div className="font-serif text-xl font-bold text-white mb-1.5">
              {profileLabel}{senStr ? ` · ${senStr}` : ''}{s.expertise.length ? ` — ${s.expertise.join(', ')}` : ''}
            </div>
            <div className="text-[11px] text-white/45">
              {s.confNiveau === 'ouverte' ? s.cabinetName || 'Cabinet' : 'Cabinet anonyme · Identité protégée'}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/[0.08]">
              <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/15 text-white/60">{profileLabel}</span>
              {s.seniorities.map((se) => (
                <span key={se} className="text-[10px] px-2.5 py-1 rounded-full border border-white/15 text-white/60">{SENIORITY_MAP[se] || se}</span>
              ))}
              {s.expertise.map((e) => (
                <span key={e} className="text-[10px] px-2.5 py-1 rounded-full border border-white/15 text-white/60">{e}</span>
              ))}
              {s.english && <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/15 text-white/60">Anglais : {s.english}</span>}
            </div>
          </div>

          {/* Activity breakdown with pie chart */}
          {s.expertise.length > 0 && (
            <div className="p-6 border-b border-white/[0.06]">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/30 mb-4">Répartition de l'activité</div>
              {s.expertise.length >= 2 && Object.keys(s.activitySplit).length > 0 ? (
                <div className="flex items-start gap-6">
                  <ActivityPieChart data={s.activitySplit} size={130} innerRadius={32} outerRadius={58} showLegend={false} darkMode />
                  <div className="flex-1 space-y-2">
                    {s.expertise.map((exp) => (
                      <div key={exp}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-medium text-white">{exp}</span>
                          <span className="text-xs font-bold text-white">{s.activitySplit[exp] || 0}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white/40 rounded-full" style={{ width: `${s.activitySplit[exp] || 0}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {s.expertise.map((e) => (
                    <span key={e} className="text-[10px] bg-white/[0.07] border border-white/[0.12] rounded px-2.5 py-1 text-white/60">{e}</span>
                  ))}
                </div>
              )}

              {/* Sub-activities */}
              {activeActivities.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/30 mb-2">Scope d'intervention</div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeActivities.map((a) => (
                      <span key={a} className="text-[10px] bg-white/[0.05] border border-white/[0.10] rounded px-2.5 py-1 text-white/50">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Context & team */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/30 mb-3">Contexte & équipe</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {s.contexte && (
                <div>
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/30 mb-1">Contexte</div>
                  <div className="text-xs font-semibold text-white">{s.contexte}</div>
                </div>
              )}
              {eqStr && (
                <div>
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/30 mb-1">Composition de l'équipe</div>
                  <div className="text-xs font-semibold text-white">{eqStr}</div>
                </div>
              )}
            </div>
            {s.equipeDesc && (
              <div className="mb-3">
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/30 mb-1">Présentation de l'équipe</div>
                <p className="text-[11px] text-white/60 leading-relaxed">{s.equipeDesc}</p>
              </div>
            )}
            {s.profilLibre && (
              <div>
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/30 mb-1">Profil idéal</div>
                <p className="text-[11px] text-white/60 leading-relaxed italic">« {s.profilLibre} »</p>
              </div>
            )}
          </div>

          {/* Rémunération & conditions */}
          <div className="p-6 border-b border-white/[0.06]">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/30 mb-3">Rémunération & conditions</div>
            <div className="grid grid-cols-3 gap-5">
              <div>
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/30 mb-1.5">Rétrocession</div>
                <div className="font-serif text-base font-bold text-white">{retroStr || 'Confidentiel'}</div>
                {!retroStr && <div className="text-[10px] text-white/25 mt-0.5">Transmis si intérêt confirmé</div>}
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/30 mb-1.5">Objectif heures / an</div>
                <div className="font-serif text-base font-bold text-white">{s.heures ? `${s.heures}h` : 'Non communiqué'}</div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/30 mb-1.5">Télétravail</div>
                <div className="text-xs font-semibold text-white">{s.tt || '—'}</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="p-6 text-center">
            <p className="text-[11px] text-white/30 mb-3.5 leading-relaxed">
              LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation.<br />
              Votre identité reste confidentielle jusqu'à accord mutuel.
            </p>
            <button className="w-full py-3 bg-white text-foreground font-bold text-sm rounded cursor-default">
              Je suis intéressé(e) par cette opportunité →
            </button>
            <div className="mt-3 text-[10px] text-white/20">0% commission · Levée de rideau conditionnée à votre accord</div>
          </div>
        </div>
      </div>

      {/* Approval banner */}
      <div className="bg-foreground rounded-md p-6 mt-5">
        <div className="font-serif text-base font-semibold text-white mb-3.5">Confirmez votre demande d'accès</div>
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
