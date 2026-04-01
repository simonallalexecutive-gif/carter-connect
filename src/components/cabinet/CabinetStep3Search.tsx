import { useState, useMemo, useCallback, useEffect } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EXPERTISES, SENIORITY_OPTIONS, CONF_OPTIONS, SPLIT_COLORS, CABINET_EXPERTISE_DETAIL } from '@/lib/cabinetConstants';
import { cn } from '@/lib/utils';
import { formatNumberWithDots } from '@/lib/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import SegmentedBar from '@/components/shared/SegmentedBar';

const TABS = ['Profil recherché', 'Contexte & équipe', 'Rémunération & conditions', 'Confidentialité'];

const PIE_COLORS = [
  'hsl(220, 40%, 18%)',   // bleu nuit
  'hsl(185, 40%, 25%)',   // vert pétrole
  'hsl(210, 15%, 65%)',   // gris clair
  'hsl(200, 35%, 30%)',   // bleu pétrole foncé
  'hsl(155, 30%, 22%)',   // vert foncé
  'hsl(215, 25%, 40%)',   // bleu gris
  'hsl(0, 0%, 50%)',      // gris moyen
  'hsl(220, 30%, 28%)',   // bleu nuit clair
];

interface CabinetStep3SearchProps {
  isEmbedded?: boolean;
  onBack?: () => void;
  onNext?: () => void;
}

const CabinetStep3Search = ({ isEmbedded, onBack, onNext }: CabinetStep3SearchProps = {}) => {
  const s = useCabinetStore();
  const [activeTab, setActiveTab] = useState(0);
  // Track percentage split per expertise's sections: { [expertise]: { [sectionTitle]: number } }
  const [scopeSplits, setScopeSplits] = useState<Record<string, Record<string, number>>>({});

  const splitTotal = s.expertise.reduce((sum, k) => sum + (s.activitySplit[k] || 0), 0);

  const isTab0Complete = useCallback(() => {
    const profileTypes = (s as any).profileTypes as string[] || [];
    const needsSeniority = profileTypes.length === 0 || profileTypes.includes('collaborateur');
    const seniorityOk = !needsSeniority || s.seniorities.length > 0;
    return profileTypes.length > 0 && seniorityOk && s.expertise.length > 0 && s.english !== '' &&
      (s.expertise.length < 2 || splitTotal === 100);
  }, [(s as any).profileTypes, s.seniorities, s.expertise, s.english, splitTotal]);

  const isTab1Complete = useCallback(() => {
    return s.contexte !== '' && s.eqAssocies !== '' && s.eqCollab !== '';
  }, [s.contexte, s.eqAssocies, s.eqCollab]);

  const isTab2Complete = useCallback(() => {
    return (s.retroMin !== '' || s.retroMax !== '') && s.tt !== '';
  }, [s.retroMin, s.retroMax, s.tt]);

  const isTab3Complete = useCallback(() => {
    return s.confNiveau !== '';
  }, [s.confNiveau]);

  const tabComplete = [isTab0Complete(), isTab1Complete(), isTab2Complete(), isTab3Complete()];
  const allComplete = tabComplete[0] && tabComplete[1] && tabComplete[2] && tabComplete[3];

  const toggleActivity = (key: string) => {
    s.setField('cabinetActivites', { ...s.cabinetActivites, [key]: !s.cabinetActivites[key] });
  };

  const chartData = useMemo(() => {
    return s.expertise.map((k) => ({
      name: k,
      value: s.activitySplit[k] || 0,
    }));
  }, [s.expertise, s.activitySplit]);

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 2 / 4
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Ma recherche</h2>
      <p className="text-[11px] text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
        Décrivez le profil que vous recherchez et le contexte de votre recrutement. Plus vous êtes précis, plus le matching LOGAN est efficace.
      </p>

      {/* Tabs */}
      <div className="flex gap-0 border-b-2 border-border mb-6 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              'px-5 py-2.5 text-[11px] font-medium whitespace-nowrap border-b-2 -mb-[2px] transition-all flex items-center gap-1.5',
              activeTab === i ? 'text-foreground border-foreground font-semibold' : 'text-muted-foreground border-transparent hover:text-foreground'
            )}
          >
            {i < 3 && tabComplete[i] && <Check className="w-3 h-3 text-green-600" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 0: Profil recherché */}
      {activeTab === 0 && (
        <div className="animate-fade-in">
          {/* Profile type */}
          <div className="mb-8">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-3 block">
              Type de profil recherché
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'collaborateur', label: 'Collaborateur' },
                { key: 'counsel', label: 'Counsel' },
                { key: 'associe', label: 'Associé' },
              ].map((pt) => {
                const profileTypes = (s as any).profileTypes as string[] || [];
                const isChecked = profileTypes.includes(pt.key);
                return (
                  <button
                    key={pt.key}
                    onClick={() => {
                      s.setField('profileTypes' as any, [pt.key]);
                      s.setField('searchAssocie', pt.key === 'counsel' || pt.key === 'associe');
                    }}
                    className={cn(
                      'p-4 rounded border text-center transition-all cursor-pointer',
                      isChecked
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background border-border hover:border-foreground'
                    )}
                  >
                    <div className="text-[11px] font-medium">{pt.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Associé/Counsel details */}
          {s.searchAssocie && (
            <div className="mb-8 p-5 rounded-md border border-border bg-secondary/20 animate-fade-in">
              <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-4">
                Détails Associé / Counsel
              </div>
              <div className="space-y-5">
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Chiffre d'affaires portable requis
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Input value={s.assocCAMin} onChange={(e) => s.setField('assocCAMin', formatNumberWithDots(e.target.value))} placeholder="Min — Ex : 500" className="bg-background pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">K€</span>
                    </div>
                    <div className="relative">
                      <Input value={s.assocCAMax} onChange={(e) => s.setField('assocCAMax', formatNumberWithDots(e.target.value))} placeholder="Max — Ex : 2.000" className="bg-background pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">K€</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Expertise & positionnement attendus
                  </label>
                  <Textarea value={s.assocExpertiseDesc} onChange={(e) => s.setField('assocExpertiseDesc', e.target.value)} rows={3} placeholder="Ex : Associé M&A mid-cap avec une clientèle PE établie…" className="bg-background text-[11px]" />
                </div>
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Type de clientèle attendue
                  </label>
                  <Textarea value={s.assocClienteleDesc} onChange={(e) => s.setField('assocClienteleDesc', e.target.value)} rows={2} placeholder="Ex : Fonds PE mid-cap, industriels du CAC 40…" className="bg-background text-[11px]" />
                </div>
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Projet d'intégration <span className="font-normal normal-case tracking-normal text-[10px] text-border">facultatif</span>
                  </label>
                  <Textarea value={s.assocProjetDesc} onChange={(e) => s.setField('assocProjetDesc', e.target.value)} rows={3} placeholder="Gouvernance, perspectives, intégration…" className="bg-background text-[11px]" />
                </div>
              </div>
            </div>
          )}

          {/* Seniority */}
          {(() => {
            const profileTypes = (s as any).profileTypes as string[] || [];
            const showSeniority = profileTypes.length === 0 || profileTypes.includes('collaborateur');
            return showSeniority ? (
              <div className="mb-6">
                <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                  Séniorité recherchée <span className="font-normal normal-case tracking-normal text-[10px] text-border">plusieurs choix possibles</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {SENIORITY_OPTIONS.map((sen) => (
                    <button
                      key={sen.key}
                      onClick={() => s.toggleSeniority(sen.key)}
                      className={cn(
                        'p-4 rounded border text-center transition-all cursor-pointer',
                        s.seniorities.includes(sen.key)
                          ? 'bg-foreground text-background border-foreground'
                          : 'bg-background border-border hover:border-foreground'
                      )}
                    >
                      <div className="font-sans text-[11px] font-bold mb-0.5">{sen.pqe}</div>
                      <div className="text-[10px] font-medium">{sen.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Department — using Chambers nomenclature */}
          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
              Département concerné par la recherche
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                { key: 'ma', label: 'Corporate/M&A/PE' },
                { key: 'banque', label: 'Banking & Finance' },
                { key: 'restructuring', label: 'Restructuring/Insolvency' },
                { key: 'public', label: 'Public Law' },
                { key: 'arbitrage', label: 'International Arbitration' },
                { key: 'social', label: 'Employment' },
                { key: 'concurrence', label: 'Competition/European Law' },
                { key: 'immo', label: 'Real Estate' },
                { key: 'projets', label: 'Projects & Energy' },
                { key: 'tax', label: 'Tax' },
              ].map((dept) => (
                <button
                  key={dept.key}
                  onClick={() => {
                    s.setField('currentSearchDeptLabel', dept.label);
                    s.setField('currentSearchDept', dept.key);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-[11px] transition-all',
                    s.currentSearchDeptLabel === dept.label ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                  )}
                >
                  {dept.label}
                </button>
              ))}
            </div>
          </div>

          {/* Expertise — using Chambers nomenclature */}
          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
              Expertise recherchée <span className="font-normal normal-case tracking-normal text-[10px] text-border">plusieurs choix possibles</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {EXPERTISES.map((exp) => (
                <button
                  key={exp}
                  onClick={() => s.toggleExpertise(exp)}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-[11px] transition-all',
                    s.expertise.includes(exp)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                  )}
                >
                  {exp}
                </button>
              ))}
            </div>

            {/* Sub-categories with pie chart */}
            {s.expertise.length > 0 && (
              <div className="mt-5 space-y-5">
                {s.expertise.map((exp) => {
                  const detail = CABINET_EXPERTISE_DETAIL[exp];
                  if (!detail) return null;
                  const selectedItems = detail.sections.flatMap(sec =>
                    sec.items.filter(item => s.cabinetActivites[item.key])
                  );
                  // Group selected items by section for the pie chart
                  const sectionCounts = detail.sections
                    .map(sec => ({
                      name: sec.title,
                      value: sec.items.filter(item => s.cabinetActivites[item.key]).length,
                    }))
                    .filter(d => d.value > 0);

                  return (
                    <div key={exp} className="p-4 rounded border border-border bg-secondary/30">
                      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3">{exp} — scope d'intervention</p>
                      {detail.sections.map((section) => (
                        <div key={section.title} className="mb-3 last:mb-0">
                          <p className="text-[10px] text-muted-foreground mb-2">{section.title}</p>
                          <div className="flex gap-1.5 flex-wrap">
                            {section.items.map((item) => (
                              <button
                                key={item.key}
                                onClick={() => toggleActivity(item.key)}
                                className={cn(
                                  'px-3 py-1.5 rounded-sm border text-[11px] transition-all',
                                  s.cabinetActivites[item.key]
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                                )}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Pie chart + selected chips when items are selected */}
                      {selectedItems.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-start gap-5">
                            {/* Mini pie chart by section type */}
                            {sectionCounts.length > 0 && (
                              <div className="flex flex-col items-center flex-shrink-0">
                                <ResponsiveContainer width={110} height={110}>
                                  <PieChart>
                                    <Pie
                                      data={sectionCounts}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={28}
                                      outerRadius={50}
                                      dataKey="value"
                                      stroke="hsl(var(--background))"
                                      strokeWidth={2}
                                    >
                                      {sectionCounts.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip
                                      formatter={(value: number, name: string) => [`${value} sélection(s)`, name]}
                                      contentStyle={{ fontSize: '10px', borderRadius: '4px' }}
                                    />
                                  </PieChart>
                                </ResponsiveContainer>
                                <div className="flex flex-col gap-1 mt-1.5">
                                  {sectionCounts.map((sc, i) => (
                                    <div key={sc.name} className="flex items-center gap-1.5">
                                      <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                      <span className="text-[9px] text-muted-foreground">{sc.name} ({sc.value})</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Selected chips */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground mb-2">Sélection</p>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedItems.map(item => (
                                  <span key={item.key} className="text-[10px] bg-foreground/5 border border-border rounded px-2 py-0.5 text-foreground/70">{item.label}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Activity split with pie chart — blue/grey palette */}
            {s.expertise.length >= 2 && (
              <div className="mt-5">
                <p className="text-[11px] text-muted-foreground mb-3">Quelle part représente chaque expertise dans l'activité globale du poste ?</p>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={65}
                          dataKey="value"
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        >
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          contentStyle={{ fontSize: '11px', borderRadius: '4px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1">
                    {s.expertise.map((k, i) => {
                      const pct = s.activitySplit[k] || 0;
                      return (
                        <div key={k} className="mb-3">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="text-[11px] font-medium text-foreground flex-1">{k}</span>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="10"
                                value={pct}
                                onChange={(e) => s.updateSplit(k, parseInt(e.target.value) || 0)}
                                className="w-16 text-right text-[11px] font-bold bg-secondary border border-border rounded px-2 py-1 text-foreground"
                              />
                              <span className="text-[11px] text-muted-foreground">%</span>
                            </div>
                          </div>
                          {/* Gauge bar */}
                          <div className="h-1.5 bg-secondary rounded-full overflow-hidden ml-5">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${pct}%`, background: PIE_COLORS[i % PIE_COLORS.length] }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between items-center p-3 bg-secondary rounded text-[11px] mt-2">
                      <span className="text-muted-foreground">Total</span>
                      <span className={cn('font-bold', splitTotal === 100 ? 'text-green-700' : 'text-orange-600')}>{splitTotal} %</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Pratique de l'anglais</label>
            <div className="flex gap-2 flex-wrap">
              {['Bilingue', 'Professionnel', 'Non requise'].map((e) => (
                <button
                  key={e}
                  onClick={() => s.setField('english', e)}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-[11px] transition-all',
                    s.english === e ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Contexte & équipe */}
      {activeTab === 1 && (
        <div className="animate-fade-in">
          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Contexte du recrutement</label>
            <div className="flex gap-2 flex-wrap">
              {['Départ à remplacer', "Renforcement d'équipe"].map((c) => (
                <button
                  key={c}
                  onClick={() => s.setField('contexte', c)}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-[11px] transition-all',
                    s.contexte === c ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Composition de l'équipe actuelle</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Associés</label>
                <Input value={s.eqAssocies} onChange={(e) => s.setField('eqAssocies', e.target.value)} type="number" min="0" placeholder="Ex : 2" className="bg-background" />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Counsels</label>
                <Input value={s.eqCounsels} onChange={(e) => s.setField('eqCounsels', e.target.value)} type="number" min="0" placeholder="Ex : 1" className="bg-background" />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Collaborateurs</label>
                <Input value={s.eqCollab} onChange={(e) => s.setField('eqCollab', e.target.value)} type="number" min="0" placeholder="Ex : 4" className="bg-background" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Rémunération & conditions */}
      {activeTab === 2 && (
        <div className="animate-fade-in">
          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
              Rétrocession proposée <span className="font-normal normal-case tracking-normal text-[10px] text-border">facultatif — confidentiel LOGAN</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Input value={s.retroMin} onChange={(e) => s.setField('retroMin', formatNumberWithDots(e.target.value))} placeholder="Min — Ex : 90.000" className="bg-background pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">€/an</span>
              </div>
              <div className="relative">
                <Input value={s.retroMax} onChange={(e) => s.setField('retroMax', formatNumberWithDots(e.target.value))} placeholder="Max — Ex : 130.000" className="bg-background pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">€/an</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Transmis par LOGAN uniquement si le candidat est en discussion avancée.</p>
          </div>

          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
              Objectif d'heures facturables / an
            </label>
            <div className="flex gap-2 mb-3">
              {['Oui', 'Non'].map((v) => (
                <button
                  key={v}
                  onClick={() => s.setField('hasHeures', v === 'Oui')}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-[11px] transition-all',
                    (v === 'Oui' && s.hasHeures) || (v === 'Non' && !s.hasHeures)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            {s.hasHeures && (
              <div className="animate-fade-in space-y-4 p-4 rounded border border-border bg-secondary/20">
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                    Objectif d'heures
                  </label>
                  <div className="relative max-w-[260px]">
                    <Input value={s.heures} onChange={(e) => s.setField('heures', formatNumberWithDots(e.target.value))} placeholder="Ex : 1.800" className="bg-background pr-12" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">h/an</span>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Système de bonus si objectif atteint
                  </label>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {['Bonus discrétionnaire', 'Bonus performance', 'Les deux'].map((bt) => (
                      <button
                        key={bt}
                        onClick={() => {
                          s.setField('bonusEnabled', true);
                          s.setField('bonusTypes', [bt]);
                        }}
                        className={cn(
                          'px-4 py-2 rounded-sm border text-[11px] transition-all',
                          s.bonusTypes.includes(bt)
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background text-muted-foreground border-border hover:border-foreground'
                        )}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>

                {s.bonusTypes.length > 0 && (
                  <div>
                    <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                      Fourchette du bonus si objectif atteint
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      <div className="relative">
                        <Input value={s.bonusDesc?.split('-')[0]?.trim() || ''} onChange={(e) => {
                          const max = s.bonusDesc?.split('-')[1]?.trim() || '';
                          s.setField('bonusDesc', `${formatNumberWithDots(e.target.value)}${max ? ` - ${max}` : ''}`);
                        }} placeholder="Min — Ex : 5.000" className="bg-background pr-8" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">€</span>
                      </div>
                      <div className="relative">
                        <Input value={s.bonusDesc?.split('-')[1]?.trim() || ''} onChange={(e) => {
                          const min = s.bonusDesc?.split('-')[0]?.trim() || '';
                          s.setField('bonusDesc', `${min} - ${formatNumberWithDots(e.target.value)}`);
                        }} placeholder="Max — Ex : 20.000" className="bg-background pr-8" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">€</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bonus section when NO billable hours */}
            {!s.hasHeures && (
              <div className="animate-fade-in space-y-4 p-4 rounded border border-border bg-secondary/20 mt-3">
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Système de bonus
                  </label>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {['Bonus discrétionnaire', 'Bonus performance', 'Les deux'].map((bt) => (
                      <button
                        key={bt}
                        onClick={() => {
                          s.setField('bonusEnabled', true);
                          s.setField('bonusTypes', [bt]);
                        }}
                        className={cn(
                          'px-4 py-2 rounded-sm border text-[11px] transition-all',
                          s.bonusTypes.includes(bt)
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background text-muted-foreground border-border hover:border-foreground'
                        )}
                      >
                        {bt}
                      </button>
                    ))}
                  </div>
                </div>

                {s.bonusTypes.length > 0 && (
                  <div>
                    <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                      Fourchette du bonus
                    </label>
                    <div className="grid grid-cols-2 gap-3 max-w-md">
                      <div className="relative">
                        <Input value={s.bonusDesc?.split('-')[0]?.trim() || ''} onChange={(e) => {
                          const max = s.bonusDesc?.split('-')[1]?.trim() || '';
                          s.setField('bonusDesc', `${formatNumberWithDots(e.target.value)}${max ? ` - ${max}` : ''}`);
                        }} placeholder="Min — Ex : 5.000" className="bg-background pr-8" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">€</span>
                      </div>
                      <div className="relative">
                        <Input value={s.bonusDesc?.split('-')[1]?.trim() || ''} onChange={(e) => {
                          const min = s.bonusDesc?.split('-')[0]?.trim() || '';
                          s.setField('bonusDesc', `${min} - ${formatNumberWithDots(e.target.value)}`);
                        }} placeholder="Max — Ex : 20.000" className="bg-background pr-8" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground">€</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Politique de télétravail</label>
            <div className="flex gap-2 flex-wrap">
              {['Aucun télétravail', '1 jour / semaine', '2 jours / semaine', 'Flexible'].map((t) => (
                <button
                  key={t}
                  onClick={() => s.setField('tt', t)}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-[11px] transition-all',
                    s.tt === t ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Confidentialité */}
      {activeTab === 3 && (
        <div className="animate-fade-in">
          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Niveau de confidentialité de votre recherche</label>
            <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
              Choisissez ce que les candidats voient de votre recherche. LOGAN reste en toute hypothèse le seul à connaître votre identité jusqu'à la levée de rideau.
            </p>
            <div className="flex flex-col gap-3">
              {CONF_OPTIONS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => s.setField('confNiveau', c.key)}
                  className={cn(
                    'flex items-start gap-4 p-5 rounded-md border text-left transition-all',
                    s.confNiveau === c.key ? 'border-foreground shadow-[inset_4px_0_0_hsl(var(--foreground))]' : 'border-border hover:border-foreground bg-background'
                  )}
                >
                  <div className={cn(
                    'w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center',
                    s.confNiveau === c.key ? 'bg-foreground border-foreground' : 'border-border'
                  )}>
                    {s.confNiveau === c.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-foreground mb-1 flex items-center gap-2">
                      {c.title}
                      {c.badge && (
                        <span className={cn(
                          'text-[8px] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-sm',
                          c.key === 'confidentielle' ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground border border-border'
                        )}>
                          {c.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => isEmbedded && onBack ? onBack() : s.setStep(2)} className="font-sans text-[11px] rounded-sm">← Retour</Button>
        <Button
          onClick={() => isEmbedded && onNext ? onNext() : s.setStep(4)}
          disabled={!allComplete}
          className="bg-foreground text-background hover:bg-foreground/90 font-sans text-[11px] font-bold rounded-sm px-8 disabled:opacity-40"
        >
          Continuer →
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep3Search;
