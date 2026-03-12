import { useState, useMemo, useCallback } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EXPERTISES, SENIORITY_OPTIONS, CONF_OPTIONS, SPLIT_COLORS, CABINET_EXPERTISE_DETAIL } from '@/lib/cabinetConstants';
import { cn } from '@/lib/utils';
import { formatNumberWithDots } from '@/lib/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Check } from 'lucide-react';
import { FIRMS_DB } from '@/lib/cabinetConstants';
import AutocompleteInput from '@/components/shared/AutocompleteInput';

const TABS = ['Profil recherché', 'Contexte & équipe', 'Rémunération & conditions', 'Confidentialité'];

const CHART_COLORS = [
  'hsl(215, 60%, 30%)',
  'hsl(215, 50%, 42%)',
  'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)',
  'hsl(218, 40%, 36%)',
  'hsl(222, 50%, 28%)',
  'hsl(212, 35%, 46%)',
  'hsl(225, 45%, 18%)',
];

interface CabinetStep3SearchProps {
  isEmbedded?: boolean;
  onBack?: () => void;
  onNext?: () => void;
}

const CabinetStep3Search = ({ isEmbedded, onBack, onNext }: CabinetStep3SearchProps = {}) => {
  const s = useCabinetStore();
  const [activeTab, setActiveTab] = useState(0);

  const splitTotal = s.expertise.reduce((sum, k) => sum + (s.activitySplit[k] || 0), 0);

  const isTab0Complete = useCallback(() => {
    return s.seniorities.length > 0 && s.expertise.length > 0 && s.english !== '' &&
      (s.expertise.length < 2 || splitTotal === 100);
  }, [s.seniorities, s.expertise, s.english, splitTotal]);

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



  // Sub-category toggle
  const toggleActivity = (key: string) => {
    s.setField('cabinetActivites', { ...s.cabinetActivites, [key]: !s.cabinetActivites[key] });
  };

  // Pie chart data
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
      <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Ma recherche</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
        Décrivez le profil que vous recherchez et le contexte de votre recrutement. Plus vous êtes précis, plus le matching LOGAN est efficace.
      </p>

      {/* Tabs */}
      <div className="flex gap-0 border-b-2 border-border mb-6 overflow-x-auto">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              'px-5 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 -mb-[2px] transition-all flex items-center gap-1.5',
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
          {/* Associé search toggle */}
          <div className="mb-8 p-5 rounded-md border border-border bg-secondary/20">
            <button
              onClick={() => s.setField('searchAssocie', !s.searchAssocie)}
              className={cn(
                'w-full flex items-center justify-between transition-all'
              )}
            >
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">Cette recherche porte sur un Associé ou Counsel</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Activez cette option pour préciser le CA requis, l'expertise et le projet attendu</div>
              </div>
              <div className={cn('w-9 h-5 rounded-full relative transition-colors flex-shrink-0', s.searchAssocie ? 'bg-foreground' : 'bg-border')}>
                <div className={cn('absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] transition-transform shadow-sm', s.searchAssocie ? 'translate-x-4' : 'translate-x-[3px]')} />
              </div>
            </button>

            {s.searchAssocie && (
              <div className="mt-5 space-y-5 animate-fade-in border-t border-border pt-5">
                {/* CA requis */}
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Chiffre d'affaires portable requis
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Input value={s.assocCAMin} onChange={(e) => s.setField('assocCAMin', formatNumberWithDots(e.target.value))} placeholder="Min — Ex : 500" className="bg-background pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">K€</span>
                    </div>
                    <div className="relative">
                      <Input value={s.assocCAMax} onChange={(e) => s.setField('assocCAMax', formatNumberWithDots(e.target.value))} placeholder="Max — Ex : 2.000" className="bg-background pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">K€</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">Fourchette indicative du CA portable minimum attendu</p>
                </div>

                {/* Expertise requise */}
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Expertise & positionnement attendus
                  </label>
                  <Textarea value={s.assocExpertiseDesc} onChange={(e) => s.setField('assocExpertiseDesc', e.target.value)} rows={3} placeholder="Ex : Associé M&A mid-cap avec une clientèle PE établie, capable de co-gérer une équipe de 5 collaborateurs…" className="bg-background" />
                </div>

                {/* Clientèle */}
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Type de clientèle attendue
                  </label>
                  <Textarea value={s.assocClienteleDesc} onChange={(e) => s.setField('assocClienteleDesc', e.target.value)} rows={2} placeholder="Ex : Fonds PE mid-cap, industriels du CAC 40, family offices…" className="bg-background" />
                </div>

                {/* Projet d'intégration */}
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
                    Projet d'intégration <span className="font-normal normal-case tracking-normal text-[10px] text-border">facultatif</span>
                  </label>
                  <Textarea value={s.assocProjetDesc} onChange={(e) => s.setField('assocProjetDesc', e.target.value)} rows={3} placeholder="Décrivez le projet d'association : gouvernance, perspectives, intégration au sein de l'équipe existante…" className="bg-background" />
                  <p className="text-[11px] text-muted-foreground mt-1.5">Ces éléments seront présentés de manière anonyme au candidat par LOGAN.</p>
                </div>
              </div>
            )}
          </div>
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
                  <div className="font-serif text-sm font-bold mb-0.5">{sen.pqe}</div>
                  <div className="text-[10px] font-medium">{sen.label}</div>
                </button>
              ))}
            </div>
          </div>

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
                    'px-4 py-2 rounded-sm border text-xs transition-all',
                    s.expertise.includes(exp)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                  )}
                >
                  {exp}
                </button>
              ))}
            </div>

            {/* Sub-categories for selected expertises */}
            {s.expertise.length > 0 && (
              <div className="mt-5 space-y-5">
                {s.expertise.map((exp) => {
                  const detail = CABINET_EXPERTISE_DETAIL[exp];
                  if (!detail) return null;
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
                    </div>
                  );
                })}
              </div>
            )}

            {/* Activity split with pie chart */}
            {s.expertise.length >= 2 && (
              <div className="mt-5">
                <p className="text-[11px] text-muted-foreground mb-3">Quelle part représente chaque expertise dans l'activité globale du poste ?</p>

                <div className="flex gap-6 items-start">
                  {/* Pie chart */}
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
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          contentStyle={{ fontSize: '11px', borderRadius: '4px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Sliders */}
                  <div className="flex-1">
                    {s.expertise.map((k, i) => (
                      <div key={k} className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-medium text-foreground flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                            {k}
                          </span>
                          <span className="text-sm font-bold text-foreground">{s.activitySplit[k] || 0} %</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="10"
                          value={s.activitySplit[k] || 0}
                          onChange={(e) => s.updateSplit(k, parseInt(e.target.value))}
                          className="w-full accent-foreground"
                        />
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-secondary rounded text-sm">
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
              {['Courant / Bilingue', 'Professionnel', 'Non requis'].map((e) => (
                <button
                  key={e}
                  onClick={() => s.setField('english', e)}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-xs transition-all',
                    s.english === e ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border my-6" />

          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Cabinet d'origine du candidat</label>
            <button
              onClick={() => s.setField('l500cand', !s.l500cand)}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded border transition-all mb-3',
                s.l500cand ? 'border-foreground bg-secondary' : 'border-border bg-background'
              )}
            >
              <div className="text-left">
                <div className="text-sm text-foreground">Le candidat doit évoluer actuellement dans une équipe reconnue par le Legal 500</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Garantit un profil issu d'une structure de référence</div>
              </div>
              <div className={cn('w-9 h-5 rounded-full relative transition-colors flex-shrink-0', s.l500cand ? 'bg-foreground' : 'bg-border')}>
                <div className={cn('absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] transition-transform shadow-sm', s.l500cand ? 'translate-x-4' : 'translate-x-[3px]')} />
              </div>
            </button>

            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block mt-3">Préférence de nationalité du cabinet d'origine</label>
            <div className="flex gap-2 flex-wrap">
              {['Cabinet US', 'Cabinet UK', 'Cabinet français', 'Pas de préférence'].map((n) => (
                <button
                  key={n}
                  onClick={() => s.setField('natOrigin', n)}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-xs transition-all',
                    s.natOrigin === n ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block mt-5">
              Cabinets prioritaires <span className="font-normal normal-case tracking-normal text-[10px] text-border">facultatif — notifications ciblées</span>
            </label>
            <p className="text-[11px] text-muted-foreground mb-2.5 leading-relaxed">
              Souhaitez-vous être notifié en priorité pour des candidats issus de cabinets spécifiques ? Sélectionnez les structures qui vous intéressent.
            </p>
            <AutocompleteInput
              data={Object.keys(FIRMS_DB)}
              value={s.prefFirms}
              onChange={(val) => s.setField('prefFirms', val as string[])}
              placeholder="Ex : Sullivan & Cromwell, Skadden, White & Case…"
              single={false}
            />
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
                    'px-4 py-2 rounded-sm border text-xs transition-all',
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

          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
              Présentation de l'équipe <span className="font-normal normal-case tracking-normal text-[10px] text-border">facultatif</span>
            </label>
            <Textarea value={s.equipeDesc} onChange={(e) => s.setField('equipeDesc', e.target.value)} rows={3} placeholder="Ex : équipe de 7 avocats, pratique majoritairement LBO mid-cap…" className="bg-background" />
          </div>

          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
              Profil idéal — décrivez-le librement <span className="font-normal normal-case tracking-normal text-[10px] text-border">facultatif</span>
            </label>
            <Textarea value={s.profilLibre} onChange={(e) => s.setField('profilLibre', e.target.value)} rows={4} placeholder="Ex : Nous recherchons un collaborateur senior autonome…" className="bg-background" />
            <p className="text-[11px] text-muted-foreground mt-1.5">Ce texte sera visible par le candidat dans l'aperçu de votre recherche (sans révéler votre identité).</p>
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€/an</span>
              </div>
              <div className="relative">
                <Input value={s.retroMax} onChange={(e) => s.setField('retroMax', formatNumberWithDots(e.target.value))} placeholder="Max — Ex : 130.000" className="bg-background pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€/an</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Transmis par LOGAN uniquement si le candidat est en discussion avancée.</p>
          </div>

          {/* Objectif heures & bonus */}
          <div className="mb-6">
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
              Y a-t-il un objectif annuel d'heures facturables ?
            </label>
            <div className="flex gap-2 mb-3">
              {['Oui', 'Non'].map((v) => (
                <button
                  key={v}
                  onClick={() => s.setField('hasHeures', v === 'Oui')}
                  className={cn(
                    'px-4 py-2 rounded-sm border text-xs transition-all',
                    (v === 'Oui' && s.hasHeures) || (v === 'Non' && !s.hasHeures && s.heures === '' && s.bonusDesc === '' ? false : v === 'Non' && !s.hasHeures)
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background text-muted-foreground border-border hover:border-foreground'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>

            {s.hasHeures && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">
                    Objectif d'heures
                  </label>
                  <div className="relative max-w-[260px]">
                    <Input value={s.heures} onChange={(e) => s.setField('heures', formatNumberWithDots(e.target.value))} placeholder="Ex : 1.800" className="bg-background pr-12" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">h/an</span>
                  </div>
                </div>


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
                    'px-4 py-2 rounded-sm border text-xs transition-all',
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
                    <div className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
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
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => isEmbedded && onBack ? onBack() : s.setStep(2)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button
          onClick={() => isEmbedded && onNext ? onNext() : s.setStep(4)}
          disabled={!allComplete}
          className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8 disabled:opacity-40"
        >
          Continuer →
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep3Search;
