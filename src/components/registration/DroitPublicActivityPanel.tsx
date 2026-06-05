import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo } from 'react';
import { Check, Landmark, Gavel, FileCheck, Building2, Tag, BarChart3 } from 'lucide-react';
import { buildQuantizedChartData } from '@/lib/percentages';

const COL_CONTRATS = 'hsl(0, 0%, 8%)';
const COL_CONTENTIEUX = 'hsl(220, 45%, 18%)';
const COL_CONSEIL = 'hsl(155, 35%, 22%)';

const COL_CT_CMD = 'hsl(0, 0%, 8%)';
const COL_CT_CONC = 'hsl(220, 45%, 18%)';
const COL_CT_PPP = 'hsl(220, 30%, 45%)';

const COL_CTX_CONTRATS = 'hsl(350, 45%, 28%)';
const COL_CTX_RESP = 'hsl(350, 35%, 38%)';
const COL_CTX_REGL = 'hsl(350, 25%, 52%)';

const COL_CON_URB = 'hsl(155, 35%, 22%)';
const COL_CON_REG = 'hsl(155, 25%, 38%)';
const COL_CON_ECO = 'hsl(155, 22%, 48%)';

const MAIN_CATEGORIES = [
  { key: 'dpub_contrats', label: 'Droit public éco. / contrats publics', color: COL_CONTRATS },
  { key: 'dpub_contentieux', label: 'Contentieux administratif', color: COL_CONTENTIEUX },
  { key: 'dpub_conseil', label: 'Conseil / régulation', color: COL_CONSEIL },
];

const CONTRATS_SUBS = [
  { key: 'commande', label: 'Commande publique', color: COL_CT_CMD },
  { key: 'concessions', label: 'Concessions / DSP', color: COL_CT_CONC },
  { key: 'ppp', label: 'Partenariats public-privé', color: COL_CT_PPP },
];

const CTX_SUBS = [
  { key: 'contrats_pub', label: 'Contentieux des contrats publics', color: COL_CTX_CONTRATS },
  { key: 'responsabilite', label: 'Responsabilité administrative', color: COL_CTX_RESP },
  { key: 'reglementaire', label: 'Réglementaire / excès de pouvoir', color: COL_CTX_REGL },
];

const CONS_SUBS = [
  { key: 'urbanisme', label: 'Urbanisme / aménagement', color: COL_CON_URB },
  { key: 'regulation', label: 'Régulation sectorielle', color: COL_CON_REG },
  { key: 'eco', label: 'Droit public économique', color: COL_CON_ECO },
];

const CONTRATS_INTERVENTIONS = ['Passation des contrats', 'Exécution des contrats', 'Renégociation / restructuration'];
const CTX_INTERVENTIONS = ['Référés (suspension, liberté, précontractuel)', 'Recours au fond', 'Contentieux indemnitaire'];
const CONS_DOMAINES = ['Urbanisme opérationnel', 'Énergie', 'Infrastructures', 'Transport', 'Environnement', 'Télécoms / numérique'];
const CLIENTELE = ['État / administrations centrales', 'Collectivités territoriales', 'Établissements publics', 'Entreprises privées', 'Fonds d\'investissement (infrastructure, énergie)'];
const DIMENSION_PROJETS = ['Projets locaux', 'Projets nationaux', 'Grands projets / projets structurants'];
const SECTEURS = ['Énergie', 'Infrastructures', 'Transport', 'Immobilier public', 'Environnement', 'Numérique / télécoms'];

const renderLabel = ({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = ir + (or - ir) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (value < 8) return null;
  return (<text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fontFamily="Inter, sans-serif">{Math.round(value)}%</text>);
};

const tooltipStyle = { fontSize: '11px', fontFamily: 'Inter', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' };

const Chip = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-light transition-all duration-200 border", active ? "bg-foreground text-background border-foreground" : "bg-transparent text-foreground border-border hover:border-foreground/40")}>
    {active && <Check className="w-3 h-3" />}{label}
  </button>
);

const MiniPie = ({ data, size = 160 }: { data: { name: string; value: number; color: string }[]; size?: number }) => (
  <div className="mx-auto" style={{ width: size }}>
    <ResponsiveContainer width={size} height={size}>
      <PieChart><Pie data={data} cx="50%" cy="50%" innerRadius={size * 0.2} outerRadius={size * 0.42} dataKey="value" paddingAngle={1.5} stroke="hsl(var(--background))" strokeWidth={2} label={renderLabel} labelLine={false}>{data.map((seg, i) => <Cell key={i} fill={seg.color} />)}</Pie><Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={tooltipStyle} /></PieChart>
    </ResponsiveContainer>
  </div>
);

const MiniLegend = ({ data }: { data: { name: string; value: number; color: string }[] }) => (
  <div className="space-y-1 px-2">
    {data.map(seg => (
      <div key={seg.name} className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: seg.color }} />
        <span className="text-[11px] font-sans text-foreground/80 truncate">{seg.name}</span>
        <span className="text-[11px] font-sans font-semibold text-foreground ml-auto">{seg.value}%</span>
      </div>
    ))}
  </div>
);

const DroitPublicActivityPanel = () => {
  const store = useRegistrationStore();

  const handleToggle = (key: string) => {
    const next = { ...store.activites, [key]: !store.activites[key] };
    store.setField('activites', next);
    if (!store.activites[key]) store.setField('pourcentages', { ...store.pourcentages, [key]: 10 });
  };
  const handlePct = (key: string, value: number) => store.setField('pourcentages', { ...store.pourcentages, [key]: value });
  const handleSub = (parent: string, child: string, value: number) => {
    const cur = store.sousActivites[parent] || {};
    store.setField('sousActivites', { ...store.sousActivites, [parent]: { ...cur, [child]: value } });
  };
  const toggleArr = (field: 'dpubContratsInterventions' | 'dpubCtxInterventions' | 'dpubConsDomaines' | 'dpubClientele' | 'dpubDimensionProjets' | 'dpubSecteurs', value: string) => {
    const cur = (store[field] as string[]) || [];
    store.setField(field, cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]);
  };

  const selected = MAIN_CATEGORIES.filter(c => store.activites[c.key]);
  const hasAny = selected.length > 0;
  const totalRaw = useMemo(() => selected.reduce((s, c) => s + (store.pourcentages[c.key] || 10), 0), [selected, store.pourcentages]);

  const hasContrats = store.activites['dpub_contrats'];
  const hasCtx = store.activites['dpub_contentieux'];
  const hasCons = store.activites['dpub_conseil'];

  const mainChartData = useMemo(() =>
    buildQuantizedChartData(
      selected.map(c => ({ key: c.key, name: c.label, raw: store.pourcentages[c.key] || 10, color: c.color })),
    ),
    [selected, store.pourcentages]
  );

  const buildSubChart = (parentKey: string, subs: { key: string; label: string; color: string }[]) => {
    const vals = store.sousActivites[parentKey] || {};
    return buildQuantizedChartData(
      subs.map(s => ({ key: s.key, name: s.label, raw: vals[s.key] ?? Math.round(100 / subs.length), color: s.color })),
    );
  };

  const contratsChart = useMemo(() => hasContrats ? buildSubChart('dpub_contrats', CONTRATS_SUBS) : [], [hasContrats, store.sousActivites]);
  const ctxChart = useMemo(() => hasCtx ? buildSubChart('dpub_contentieux', CTX_SUBS) : [], [hasCtx, store.sousActivites]);
  const consChart = useMemo(() => hasCons ? buildSubChart('dpub_conseil', CONS_SUBS) : [], [hasCons, store.sousActivites]);

  const dpubPublique = store.dpubPublique ?? 50;
  const dpubCtxDefense = store.dpubCtxDefense ?? 50;
  const dpubDomestique = store.dpubDomestique ?? 50;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {MAIN_CATEGORIES.map(c => (<Chip key={c.key} active={!!store.activites[c.key]} label={c.label} onClick={() => handleToggle(c.key)} />))}
      </div>

      {hasAny && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="carter-card p-6 space-y-6">
          <div className="flex gap-8 items-start flex-col lg:flex-row">

            {/* LEFT */}
            <div className="lg:w-[45%] space-y-5 bg-white border border-gray-200 rounded-sm p-5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Structure de l'activité droit public</p>
              <MiniPie data={mainChartData} size={240} />
              <MiniLegend data={mainChartData} />

              <div className="space-y-3 pt-3 border-t border-border">
                {selected.map(c => {
                  const raw = store.pourcentages[c.key] || 10;
                  const pct = totalRaw > 0 ? Math.round((raw / totalRaw) * 100) : 0;
                  return (
                    <div key={c.key} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans text-foreground">{c.label}</span>
                        <span className="text-xs font-sans font-bold text-foreground">{pct}%</span>
                      </div>
                      <Slider value={[raw]} onValueChange={([v]) => handlePct(c.key, v)} min={10} max={100} step={10} className="w-full" />
                    </div>
                  );
                })}
              </div>

              {/* Dimension internationale */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Dimension internationale</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-sans text-foreground">Dossiers domestiques</span>
                    <span className="text-xs font-sans font-bold text-foreground">{dpubDomestique}%</span>
                  </div>
                  <Slider value={[dpubDomestique]} onValueChange={([v]) => store.setField('dpubDomestique', v)} min={0} max={100} step={10} className="w-full" />
                  <div className="h-3 rounded-full overflow-hidden flex border border-border">
                    <div className="bg-foreground/70 h-full transition-all duration-300" style={{ width: `${dpubDomestique}%` }} />
                    <div className="bg-foreground/15 h-full transition-all duration-300" style={{ width: `${100 - dpubDomestique}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] font-sans text-muted-foreground">FR Domestique {dpubDomestique}%</span>
                    <span className="text-[10px] font-sans text-muted-foreground">International International {100 - dpubDomestique}%</span>
                  </div>
                </div>
              </div>

              {/* Clientèle */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Typologie de clientèle</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CLIENTELE.map(s => (<Chip key={s} active={(store.dpubClientele || []).includes(s)} label={s} onClick={() => toggleArr('dpubClientele', s)} />))}
                </div>
              </div>

              {/* Dimension des projets */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Dimension des projets</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DIMENSION_PROJETS.map(s => (<Chip key={s} active={(store.dpubDimensionProjets || []).includes(s)} label={s} onClick={() => toggleArr('dpubDimensionProjets', s)} />))}
                </div>
              </div>

              {/* Secteurs */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Secteurs dominants</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SECTEURS.map(s => (<Chip key={s} active={(store.dpubSecteurs || []).includes(s)} label={s} onClick={() => toggleArr('dpubSecteurs', s)} />))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:w-[55%] space-y-6">

              {/* CONTRATS PUBLICS */}
              {hasContrats && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Contrats publics</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={contratsChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1"><MiniLegend data={contratsChart} /></div>
                  </div>
                  <div className="space-y-2">
                    {CONTRATS_SUBS.map(sub => {
                      const vals = store.sousActivites['dpub_contrats'] || {};
                      const raw = vals[sub.key] ?? 33;
                      const total = CONTRATS_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 33), 0);
                      const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                      return (
                        <div key={sub.key} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                              <span className="text-[11px] font-sans text-foreground">{sub.label}</span>
                            </div>
                            <span className="text-[11px] font-sans font-bold text-foreground">{pct}%</span>
                          </div>
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('dpub_contrats', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Positionnement publique / privé */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Côté personne publique</span>
                      <span className="text-xs font-sans font-bold text-foreground">{dpubPublique}%</span>
                    </div>
                    <Slider value={[dpubPublique]} onValueChange={([v]) => store.setField('dpubPublique', v)} min={0} max={100} step={10} className="w-full" />
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${dpubPublique}%`, backgroundColor: COL_CONTRATS }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - dpubPublique}%`, backgroundColor: 'hsl(0, 0%, 72%)' }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-sans text-muted-foreground">Publique {dpubPublique}%</span>
                      <span className="text-[10px] font-sans text-muted-foreground">Privé {100 - dpubPublique}%</span>
                    </div>
                  </div>
                  {/* Types d'intervention */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Types d'intervention</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CONTRATS_INTERVENTIONS.map(s => (<Chip key={s} active={(store.dpubContratsInterventions || []).includes(s)} label={s} onClick={() => toggleArr('dpubContratsInterventions', s)} />))}
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENTIEUX ADMINISTRATIF */}
              {hasCtx && (
                <div className={cn("space-y-4", hasContrats && "pt-4 border-t border-border")}>
                  <div className="flex items-center gap-2">
                    <Gavel className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Contentieux administratif</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={ctxChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1"><MiniLegend data={ctxChart} /></div>
                  </div>
                  <div className="space-y-2">
                    {CTX_SUBS.map(sub => {
                      const vals = store.sousActivites['dpub_contentieux'] || {};
                      const raw = vals[sub.key] ?? 33;
                      const total = CTX_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 33), 0);
                      const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                      return (
                        <div key={sub.key} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                              <span className="text-[11px] font-sans text-foreground">{sub.label}</span>
                            </div>
                            <span className="text-[11px] font-sans font-bold text-foreground">{pct}%</span>
                          </div>
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('dpub_contentieux', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Types d'intervention */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Types d'intervention</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CTX_INTERVENTIONS.map(s => (<Chip key={s} active={(store.dpubCtxInterventions || []).includes(s)} label={s} onClick={() => toggleArr('dpubCtxInterventions', s)} />))}
                    </div>
                  </div>
                  {/* Positionnement défense / requérant */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Positionnement contentieux</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans text-foreground">Défense</span>
                      <span className="text-xs font-sans font-bold text-foreground">{dpubCtxDefense}%</span>
                    </div>
                    <Slider value={[dpubCtxDefense]} onValueChange={([v]) => store.setField('dpubCtxDefense', v)} min={0} max={100} step={10} className="w-full" />
                    <div className="h-2.5 rounded-full overflow-hidden flex border border-border">
                      <div className="h-full transition-all duration-300" style={{ width: `${dpubCtxDefense}%`, backgroundColor: COL_CONTENTIEUX }} />
                      <div className="h-full transition-all duration-300" style={{ width: `${100 - dpubCtxDefense}%`, backgroundColor: 'hsl(0, 0%, 72%)' }} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[10px] font-sans text-muted-foreground">Défense {dpubCtxDefense}%</span>
                      <span className="text-[10px] font-sans text-muted-foreground">Requérant {100 - dpubCtxDefense}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CONSEIL / RÉGULATION */}
              {hasCons && (
                <div className={cn("space-y-4", (hasContrats || hasCtx) && "pt-4 border-t border-border")}>
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-medium">Détail Conseil / régulation</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <MiniPie data={consChart} size={140} />
                    <div className="flex-1 space-y-2 pt-1"><MiniLegend data={consChart} /></div>
                  </div>
                  <div className="space-y-2">
                    {CONS_SUBS.map(sub => {
                      const vals = store.sousActivites['dpub_conseil'] || {};
                      const raw = vals[sub.key] ?? 33;
                      const total = CONS_SUBS.reduce((s, ss) => s + (vals[ss.key] ?? 33), 0);
                      const pct = total > 0 ? Math.round((raw / total) * 100) : 0;
                      return (
                        <div key={sub.key} className="space-y-0.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sub.color }} />
                              <span className="text-[11px] font-sans text-foreground">{sub.label}</span>
                            </div>
                            <span className="text-[11px] font-sans font-bold text-foreground">{pct}%</span>
                          </div>
                          <Slider value={[raw]} onValueChange={([v]) => handleSub('dpub_conseil', sub.key, v)} min={0} max={100} step={10} className="w-full" />
                        </div>
                      );
                    })}
                  </div>
                  {/* Domaines d'intervention */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground font-sans font-medium uppercase tracking-wider">Domaines d'intervention</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CONS_DOMAINES.map(s => (<Chip key={s} active={(store.dpubConsDomaines || []).includes(s)} label={s} onClick={() => toggleArr('dpubConsDomaines', s)} />))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DroitPublicActivityPanel;
