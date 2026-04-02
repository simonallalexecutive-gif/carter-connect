import { motion } from 'motion/react';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { usePQE } from '@/hooks/usePQE';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT, CABINET_META } from '@/lib/constants';
import { CHAMBERS_DB, CHAMBERS_DEPARTMENTS } from '@/lib/chambersRankings';
import { Eye, ArrowLeft, Check, User } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { buildQuantizedChartData } from '@/lib/percentages';

const CHART_COLORS = [
  'hsl(215, 60%, 30%)',
  'hsl(215, 50%, 42%)',
  'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)',
  'hsl(218, 40%, 36%)',
  'hsl(222, 50%, 28%)',
];

// ── Specialized department category definitions ──
const MA_CATEGORIES = [
  { key: 'ma_pe', label: 'Private Equity', color: 'hsl(215, 55%, 28%)' },
  { key: 'ma_ma', label: 'M&A', color: 'hsl(35, 35%, 48%)' },
  { key: 'ma_vc', label: 'Venture Capital', color: 'hsl(160, 35%, 38%)' },
  { key: 'ma_autres', label: 'Autres', color: 'hsl(200, 15%, 60%)' },
];

const CONC_CATEGORIES = [
  { key: 'conc_concentrations', label: 'Contrôle des concentrations', color: 'hsl(215, 55%, 28%)' },
  { key: 'conc_contentieux', label: 'Contentieux / enquêtes', color: 'hsl(35, 35%, 48%)' },
  { key: 'conc_conseil', label: 'Conseil / compliance', color: 'hsl(160, 35%, 38%)' },
];

const FISC_CATEGORIES = [
  { key: 'fisc_transac', label: 'Fiscalité transactionnelle', color: 'hsl(215, 55%, 28%)' },
  { key: 'fisc_contentieux', label: 'Fiscalité contentieuse', color: 'hsl(35, 35%, 48%)' },
  { key: 'fisc_conseil', label: 'Fiscalité conseil / structuration', color: 'hsl(160, 35%, 38%)' },
];

const DPUB_CATEGORIES = [
  { key: 'dpub_contrats', label: 'Droit public éco. / contrats publics', color: 'hsl(215, 55%, 28%)' },
  { key: 'dpub_contentieux', label: 'Contentieux administratif', color: 'hsl(35, 35%, 48%)' },
  { key: 'dpub_conseil', label: 'Conseil / régulation', color: 'hsl(160, 35%, 38%)' },
];

const ARB_TYPES = [
  { key: 'arb_commercial', label: 'Arbitrage commercial', color: 'hsl(215, 50%, 35%)' },
  { key: 'arb_invest', label: "Arbitrage d'investissement", color: 'hsl(200, 50%, 40%)' },
  { key: 'arb_construction', label: 'Arbitrage construction', color: 'hsl(210, 25%, 50%)' },
  { key: 'arb_sport', label: 'Arbitrage sportif', color: 'hsl(215, 55%, 22%)' },
];

const PROJ_TYPES = [
  { key: 'proj_infra', label: 'Infrastructures', color: 'hsl(215, 50%, 35%)' },
  { key: 'proj_enr', label: 'Énergie renouvelable', color: 'hsl(160, 40%, 38%)' },
  { key: 'proj_concession', label: 'Concessions / PPP', color: 'hsl(210, 25%, 50%)' },
  { key: 'proj_fin', label: 'Financement de projets', color: 'hsl(200, 12%, 45%)' },
  { key: 'proj_regl', label: 'Réglementaire / permitting', color: 'hsl(35, 35%, 48%)' },
];

const RESTRUCTURING_COLORS = {
  amiable: 'hsl(215, 50%, 35%)',
  financier: 'hsl(210, 25%, 50%)',
  judiciaire: 'hsl(215, 55%, 22%)',
  distressed: 'hsl(200, 12%, 45%)',
  contentieux: 'hsl(220, 15%, 62%)',
};

const RE_COLORS = {
  baux: 'hsl(215, 50%, 35%)',
  share: 'hsl(200, 50%, 40%)',
  asset: 'hsl(210, 25%, 50%)',
  construction: 'hsl(215, 55%, 22%)',
  financement: 'hsl(200, 12%, 45%)',
  contentieux: 'hsl(220, 15%, 62%)',
};

const SOCIAL_COLORS = {
  conseilIndiv: 'hsl(215, 55%, 28%)',
  conseilColl: 'hsl(215, 40%, 42%)',
  contentieuxIndiv: 'hsl(35, 30%, 50%)',
  contentieuxColl: 'hsl(40, 25%, 60%)',
};

const RESTRUCTURING_POSITIONING_COLORS = ['hsl(215, 50%, 35%)', 'hsl(200, 15%, 50%)', 'hsl(220, 20%, 30%)'];
const RESTRUCTURING_CLIENTELE_COLORS = ['hsl(215, 55%, 22%)', 'hsl(210, 20%, 42%)', 'hsl(200, 12%, 55%)', 'hsl(220, 15%, 35%)', 'hsl(215, 50%, 35%)', 'hsl(210, 10%, 62%)'];

type PreviewMode = 'recap' | 'cabinet';

// Map departement labels → chambers keys
const DEPT_TO_CHAMBERS: Record<string, string> = {
  'Corporate': 'ma',
  'M&A (dominante)': 'ma',
  'Private Equity (dominante)': 'pe',
  'Venture Capital': 'pe',
  'Financement LBO': 'banque',
  'Financement de projets': 'projets',
  'Restructuring': 'restructuring',
  'Droit Social': 'social',
  'Immobilier': 'immo',
};

const getNatLabel = (nat: string) => {
  const map: Record<string, string> = { FR: 'français', US: 'américain', UK: 'anglais' };
  return map[nat] || nat;
};

// Helper: build normalized chart from activites+pourcentages with category defs
const buildCategoryChart = (
  categories: { key: string; label: string; color: string }[],
  activites: Record<string, boolean>,
  pourcentages: Record<string, number>,
) => {
  const selected = categories.filter(c => activites[c.key]);
  if (selected.length === 0) return [];
  const items = selected.map(c => ({ name: c.label, raw: pourcentages[c.key] || 10, color: c.color }));
  const total = items.reduce((s, i) => s + i.raw, 0);
  return items.map(i => ({ name: i.name, value: total > 0 ? Math.round((i.raw / total) * 100) : 0, color: i.color }));
};

const Step6Review = () => {
  const store = useRegistrationStore();
  const isAdmin = store.isAdminMode;
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('recap');
  const [submitting, setSubmitting] = useState(false);

  const practiceActivities = store.departement
    ? (ACTIVITES_BY_PRACTICE[store.departement] || ACTIVITES_DEFAULT)
    : ACTIVITES_DEFAULT;
  const allActivites = practiceActivities.sections.flatMap(s => s.items);
  const activeActivites = allActivites.filter(a => store.activites[a.key]);

  const activitySummary = useMemo(() => {
    const dept = store.departement;

    // ── Restructuring ──
    if (dept === 'Restructuring' || dept === 'Restructuring/Insolvency') {
      const restrSubs = store.sousActivites['restr_restructuring'] || {};
      const amiableVal = restrSubs['amiable'] ?? 50;
      const distressedVal = store.pourcentages['restr_distressed'] ?? 10;
      const contentieuxVal = store.pourcentages['restr_contentieux_affaires'] ?? 10;
      const restructuringMainPct = Math.max(0, 100 - distressedVal - contentieuxVal);
      const totalAmiablePct = Math.round(restructuringMainPct * (amiableVal / 100));
      const judiciairePct = restructuringMainPct - totalAmiablePct;
      const financierPct = Math.round(totalAmiablePct * ((store.restrFinancier ?? 0) / 100));
      const amiableHorsFinancierPct = totalAmiablePct - financierPct;

      return {
        chartData: [
          amiableHorsFinancierPct > 0 ? { name: 'Amiable (hors financier)', value: amiableHorsFinancierPct, color: RESTRUCTURING_COLORS.amiable } : null,
          financierPct > 0 ? { name: 'Restructuring financier', value: financierPct, color: RESTRUCTURING_COLORS.financier } : null,
          judiciairePct > 0 ? { name: 'Judiciaire', value: judiciairePct, color: RESTRUCTURING_COLORS.judiciaire } : null,
          distressedVal > 0 ? { name: 'Distressed M&A', value: distressedVal, color: RESTRUCTURING_COLORS.distressed } : null,
          contentieuxVal > 0 ? { name: 'Contentieux', value: contentieuxVal, color: RESTRUCTURING_COLORS.contentieux } : null,
        ].filter(Boolean) as { name: string; value: number; color: string }[],
        positionnement: buildQuantizedChartData(
          store.positionnementRestr.map((opt, i) => ({
            key: opt, name: opt,
            raw: store.positionnementRestrPct[opt] || 10,
            color: RESTRUCTURING_POSITIONING_COLORS[i % RESTRUCTURING_POSITIONING_COLORS.length],
          })),
        ),
        clientele: buildQuantizedChartData(
          store.clienteleRestr.map((opt, i) => ({
            key: opt, name: opt,
            raw: store.clienteleRestrPct[opt] || 10,
            color: RESTRUCTURING_CLIENTELE_COLORS[i % RESTRUCTURING_CLIENTELE_COLORS.length],
          })),
        ),
      };
    }

    // ── Social ──
    if (dept === 'Droit Social' || dept === 'Employment') {
      const conseilPct = store.socialConseil ?? 50;
      const contentieuxPct = 100 - conseilPct;
      const relationType = store.socialRelationType ?? '';
      const indivPct = store.socialIndividuel ?? 50;
      const collPct = 100 - indivPct;
      let indivWeight = 0.5, collWeight = 0.5;
      if (relationType === 'individuelles') { indivWeight = 1; collWeight = 0; }
      else if (relationType === 'collectives') { indivWeight = 0; collWeight = 1; }
      else if (relationType === 'les_deux') { indivWeight = indivPct / 100; collWeight = collPct / 100; }

      const segments: { name: string; value: number; color: string }[] = [];
      if (conseilPct > 0) {
        const cIndiv = Math.round(conseilPct * indivWeight);
        const cColl = conseilPct - cIndiv;
        if (cIndiv > 0) segments.push({ name: 'Conseil – Individuel', value: cIndiv, color: SOCIAL_COLORS.conseilIndiv });
        if (cColl > 0) segments.push({ name: 'Conseil – Collectif', value: cColl, color: SOCIAL_COLORS.conseilColl });
      }
      if (contentieuxPct > 0) {
        const xIndiv = Math.round(contentieuxPct * indivWeight);
        const xColl = contentieuxPct - xIndiv;
        if (xIndiv > 0) segments.push({ name: 'Contentieux – Individuel', value: xIndiv, color: SOCIAL_COLORS.contentieuxIndiv });
        if (xColl > 0) segments.push({ name: 'Contentieux – Collectif', value: xColl, color: SOCIAL_COLORS.contentieuxColl });
      }
      return { chartData: segments, positionnement: [], clientele: [] };
    }

    // ── Real Estate ──
    if (dept === 'Immobilier' || dept === 'Real Estate') {
      const bauxVal = store.reBauxAM ?? 20;
      const shareVal = store.reShareDeal ?? 20;
      const assetVal = store.reAssetDealPct ?? 20;
      const hasFinancement = store.reHasFinancement === true;
      const financementPct = store.reFinancementPct ?? 20;
      const hasContentieux = store.reHasContentieux === true;
      const contentieuxPct = store.reContentieuxPct ?? 20;
      const advisoryPct = Math.max(0, 100 - (hasFinancement ? financementPct : 0) - (hasContentieux ? contentieuxPct : 0));
      const effBaux = Math.round(advisoryPct * bauxVal / 100);
      const effShare = Math.round(advisoryPct * shareVal / 100);
      const effAsset = Math.round(advisoryPct * assetVal / 100);
      const effConstruction = Math.max(0, advisoryPct - effBaux - effShare - effAsset);

      const segments: { name: string; value: number; color: string }[] = [];
      if (effBaux > 0) segments.push({ name: 'Baux commerciaux', value: effBaux, color: RE_COLORS.baux });
      if (effShare > 0) segments.push({ name: 'Share Deal', value: effShare, color: RE_COLORS.share });
      if (effAsset > 0) segments.push({ name: 'Asset Deal', value: effAsset, color: RE_COLORS.asset });
      if (effConstruction > 0) segments.push({ name: 'Construction', value: effConstruction, color: RE_COLORS.construction });
      if (hasFinancement && financementPct > 0) segments.push({ name: 'Financement', value: financementPct, color: RE_COLORS.financement });
      if (hasContentieux && contentieuxPct > 0) segments.push({ name: 'Contentieux', value: contentieuxPct, color: RE_COLORS.contentieux });
      return { chartData: segments, positionnement: [], clientele: [] };
    }

    // ── M&A / PE / Corporate ──
    if (dept === 'M&A (dominante)' || dept === 'Private Equity (dominante)' || dept === 'Corporate/M&A' || dept === 'Private Equity') {
      return { chartData: buildCategoryChart(MA_CATEGORIES, store.activites, store.pourcentages), positionnement: [], clientele: [] };
    }

    // ── Finance ──
    if (dept === 'Financement LBO' || dept === 'Financement de projets' || dept === 'Banking & Finance') {
      const finKeys = Object.keys(store.activites).filter(k => k.startsWith('fin_') && store.activites[k]);
      if (finKeys.length > 0) {
        const items = finKeys.map((k, i) => {
          const label = allActivites.find(a => a.key === k)?.label || k;
          return { name: label, raw: store.pourcentages[k] || 10, color: CHART_COLORS[i % CHART_COLORS.length] };
        });
        const total = items.reduce((s, i) => s + i.raw, 0);
        return { chartData: items.map(i => ({ name: i.name, value: total > 0 ? Math.round((i.raw / total) * 100) : 0, color: i.color })), positionnement: [], clientele: [] };
      }
      return { chartData: [], positionnement: [], clientele: [] };
    }

    // ── Concurrence ──
    if (dept === 'Competition/European Law') {
      return { chartData: buildCategoryChart(CONC_CATEGORIES, store.activites, store.pourcentages), positionnement: [], clientele: [] };
    }

    // ── Fiscal ──
    if (dept === 'Tax') {
      return { chartData: buildCategoryChart(FISC_CATEGORIES, store.activites, store.pourcentages), positionnement: [], clientele: [] };
    }

    // ── Droit Public ──
    if (dept === 'Public Law') {
      return { chartData: buildCategoryChart(DPUB_CATEGORIES, store.activites, store.pourcentages), positionnement: [], clientele: [] };
    }

    // ── Arbitration ──
    if (dept === 'International Arbitration') {
      return { chartData: buildCategoryChart(ARB_TYPES, store.activites, store.pourcentages), positionnement: [], clientele: [] };
    }

    // ── Projects & Energy ──
    if (dept === 'Projects & Energy') {
      return { chartData: buildCategoryChart(PROJ_TYPES, store.activites, store.pourcentages), positionnement: [], clientele: [] };
    }

    // ── Generic fallback ──
    return {
      chartData: buildQuantizedChartData(
        activeActivites.map((item, index) => ({
          key: item.key,
          name: item.label,
          raw: store.pourcentages[item.key] || 10,
          color: CHART_COLORS[index % CHART_COLORS.length],
        })),
      ),
      positionnement: [],
      clientele: [],
    };
  }, [
    store.departement, store.activites, store.pourcentages, store.sousActivites,
    store.positionnementRestr, store.positionnementRestrPct,
    store.clienteleRestr, store.clienteleRestrPct, store.restrFinancier,
    store.socialConseil, store.socialRelationType, store.socialIndividuel,
    store.reBauxAM, store.reShareDeal, store.reAssetDealPct, store.reConstructionPct,
    store.reHasFinancement, store.reFinancementPct, store.reHasContentieux, store.reContentieuxPct,
    activeActivites,
  ]);
  const totalPercent = activitySummary.chartData.reduce((sum, d) => sum + d.value, 0);

  const chambersInfo = useMemo(() => {
    if (!store.cabinet || !store.departement) return null;
    const firm = CHAMBERS_DB[store.cabinet];
    const chambersKey = DEPT_TO_CHAMBERS[store.departement];
    const deptLabel = chambersKey
      ? CHAMBERS_DEPARTMENTS.find(d => d.key === chambersKey)?.label || store.departement
      : store.departement;

    if (!firm) {
      const fallbackNat = CABINET_META[store.cabinet]?.nat;
      return {
        isIntegrated: false,
        nat: fallbackNat ? fallbackNat.toLowerCase() : null,
        band: null,
        deptLabel,
        cabinetValue: fallbackNat ? `Cabinet ${fallbackNat.toLowerCase()}` : 'Cabinet non renseigné',
        chambersValue: 'Cabinet non intégré au classement Chambers',
      };
    }

    const band = chambersKey ? firm.rankings[chambersKey] : undefined;
    return {
      isIntegrated: true,
      nat: getNatLabel(firm.nat),
      band: band ?? null,
      deptLabel,
      cabinetValue: `Cabinet ${getNatLabel(firm.nat)}`,
      chambersValue: band
        ? `Cabinet intégré au classement Chambers — Band ${band} en ${deptLabel}`
        : `Cabinet intégré au classement Chambers — non classé en ${deptLabel}`,
    };
  }, [store.cabinet, store.departement]);

  const SectionCard = ({ title, children, className: cls }: { title: string; children: React.ReactNode; className?: string; noBorder?: boolean }) => (
    <div className={cn("rounded-sm border border-border bg-card px-5 py-4 mb-4", cls)}>
      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-sans font-light mb-3">{title}</p>
      {children}
    </div>
  );

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <span className="text-[9px] text-muted-foreground font-sans font-light">{label}</span>
      <p className="text-[13px] font-sans font-normal mt-0.5 text-foreground">{value || '—'}</p>
    </div>
  );

  const ActivitySummaryCard = () => {
    if (activitySummary.chartData.length === 0) return null;

    return (
      <div className="space-y-5">
        <p className="text-sm font-sans font-medium text-foreground tracking-tight">Synthèse de votre activité</p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-44 h-44 flex-shrink-0 self-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activitySummary.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={72}
                  dataKey="value"
                  paddingAngle={2}
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                  label={({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = ir + (or - ir) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    if (value < 10) return null;
                    return (
                      <text x={x} y={y} fill="hsl(var(--background))" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
                        {value}%
                      </text>
                    );
                  }}
                  labelLine={false}
                >
                  {activitySummary.chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, '']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1.5">
              {activitySummary.chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs font-sans font-light">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-foreground">{item.name}</span>
                  <span className="text-muted-foreground ml-auto">{totalPercent > 0 ? Math.round((item.value / totalPercent) * 100) : item.value}%</span>
                </div>
              ))}
            </div>

            {activitySummary.positionnement.length > 0 && (
              <div className="border-t border-border pt-3 space-y-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Positionnement</p>
                {activitySummary.positionnement.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-sans font-light">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            )}

            {activitySummary.clientele.length > 0 && (
              <div className="border-t border-border pt-3 space-y-1.5">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Clientèle</p>
                {activitySummary.clientele.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-sans font-light">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TagList = ({ items, label }: { items: string[]; label?: string }) => {
    if (items.length === 0) return null;
    return (
      <div>
        {label && <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>}
        <div className="flex flex-wrap gap-1.5">
          {items.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{t}</span>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (isAdmin) {
      store.nextStep();
      return;
    }

    setSubmitting(true);
    try {
      const { data: signUpData, error } = await (supabase.auth as any).signUp({
        email: store.email,
        password: store.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            full_name: `${store.prenom} ${store.nom}`.trim(),
            user_type: 'candidat',
          },
        },
      });

      if (error) throw error;

      // Save registration data to database
      const userId = signUpData?.user?.id;
      if (userId) {
        const submissionData = {
          prenom: store.prenom, nom: store.nom, email: store.email, telephone: store.telephone,
          photoPreviewUrl: store.photoPreviewUrl, linkedinUrl: store.linkedinUrl,
          sermentMois: store.sermentMois, sermentAnnee: store.sermentAnnee,
          cabinet: store.cabinet, departement: store.departement,
          retrocession: store.retrocession, bonus: store.bonus,
          hasObjectifFacturable: store.hasObjectifFacturable,
          objectifFacturable: store.objectifFacturable, objectifFacturableReel: store.objectifFacturableReel,
          conserverRetrocession: store.conserverRetrocession, raisonsBaisseRetro: store.raisonsBaisseRetro,
          activites: store.activites, pourcentages: store.pourcentages, sousActivites: store.sousActivites,
          anglais: store.anglais, typesClients: store.typesClients, tailleOperations: store.tailleOperations,
          clienteleFrancaise: store.clienteleFrancaise,
          movePriorities: store.movePriorities, qualitesAppreciees: store.qualitesAppreciees,
          axesAmelioration: store.axesAmelioration, motivation: store.motivation,
          cabinetsCibles: store.cabinetsCibles, noGoCabinets: store.noGoCabinets,
          statutEcoute: store.statutEcoute, visibilite: store.visibilite, disponibilite: store.disponibilite,
          isAssocieOrCounsel: store.isAssocieOrCounsel, statutAssoc: store.statutAssoc,
          chiffreAffairesPortable: store.chiffreAffairesPortable, assocExpertiseSummary: store.assocExpertiseSummary,
          assocAttentes: store.assocAttentes, assocCabTypes: store.assocCabTypes,
          processusCours: store.processusCours,
          positionnementRestr: store.positionnementRestr, positionnementRestrPct: store.positionnementRestrPct,
          clienteleRestr: store.clienteleRestr, clienteleRestrPct: store.clienteleRestrPct,
          restrFinancier: store.restrFinancier,
          socialConseil: store.socialConseil, socialRelationType: store.socialRelationType,
          socialClientele: store.socialClientele, socialExpertises: store.socialExpertises,
          maPeFonds: store.maPeFonds, maIndusSecteurs: store.maIndusSecteurs,
        };
        try {
          await supabase.from('candidate_registrations').insert({
            user_id: userId,
            submission_data: submissionData as any,
            visibility: store.visibilite || 'confidentiel',
            no_go_cabinets: store.noGoCabinets || [],
          } as any);
        } catch (regError) {
          console.error('Failed to save registration:', regError);
        }
      }

      if (store.souhaitePrendreRdv && store.creneauPrefere) {
        try {
          const timeMatch = store.creneauPrefere.match(/à (\d{2}:\d{2})$/);
          const bookingTime = timeMatch?.[1] || '';
          const today = new Date();
          const bookingDate = today.toISOString().split('T')[0];
          await supabase.from('logan_bookings').insert({
            candidate_name: `${store.prenom} ${store.nom}`.trim(),
            candidate_email: store.email,
            candidate_cabinet: store.cabinet || '',
            candidate_seniority: pqe ? `${pqe.label} · ${pqe.years} ans` : '',
            candidate_department: store.departement || '',
            booking_date: bookingDate,
            booking_time: bookingTime,
            user_id: signUpData?.user?.id || null,
          } as any);
        } catch (bookingError) {
          console.error('Failed to save booking:', bookingError);
        }
      }

      toast.success('Inscription créée. Vérifiez votre email pour activer votre accès.');
      store.nextStep();
    } catch (error: any) {
      toast.error(error.message || 'Impossible de créer votre inscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-5xl mx-auto px-6 py-10"
    >
      
      <h2 className="text-2xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">Récapitulatif</h2>
      <p className="text-muted-foreground font-sans text-xs font-light mb-8">Vérifiez vos informations avant de soumettre votre profil.</p>

      {/* Tabs */}
      <div className="flex gap-px mb-10 bg-border rounded-sm overflow-hidden">
        {[
          { key: 'recap' as const, label: 'Mon profil complet', icon: User },
          { key: 'cabinet' as const, label: 'Ce que voient les cabinets', icon: Eye },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setPreviewMode(tab.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-3 font-sans text-xs tracking-wider uppercase transition-all duration-300",
              previewMode === tab.key ? "bg-card text-foreground font-medium" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ RECAP COMPLET ═══ */}
      {previewMode === 'recap' && (
        <div className="space-y-4">
          {/* Identity */}
          <SectionCard title="Identité">
            <div className="flex items-start gap-5 mb-5">
              {store.photoPreviewUrl ? (
                <img src={store.photoPreviewUrl} alt="" className="w-14 h-14 rounded-full object-cover border border-border flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center font-serif text-lg text-foreground flex-shrink-0">
                  {store.prenom?.[0]}{store.nom?.[0]}
                </div>
              )}
              <div>
                <p className="font-serif text-lg text-foreground">{store.prenom} {store.nom}</p>
                <p className="text-sm font-sans font-light text-muted-foreground">{store.email}</p>
                {store.telephone && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5">{store.telephone}</p>}
                {store.linkedinUrl && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5 truncate max-w-xs">{store.linkedinUrl}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pqe && <div><span className="text-[10px] text-muted-foreground font-sans font-light">Séniorité</span><div className="mt-1"><SeniorityBadge info={pqe} /></div></div>}
              <DataRow label="Cabinet" value={store.cabinet} />
      <DataRow label="Répertorié Chambers" value={chambersInfo?.isIntegrated ? 'Oui' : 'Non'} />
              <DataRow label="Pratique" value={store.departement} />
            </div>
          </SectionCard>

          {/* Rémunération */}
          {(store.retrocession || store.bonus) && (
            <SectionCard title="Rémunération">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {store.retrocession && <DataRow label="Rétrocession" value={`${store.retrocession} €`} />}
                {store.bonus && <DataRow label="Bonus" value={`${store.bonus} €`} />}
                {store.hasObjectifFacturable && store.objectifFacturable && <DataRow label="Objectif heures" value={`${store.objectifFacturable}h`} />}
                {store.hasObjectifFacturable && store.objectifFacturableReel && <DataRow label="Réalisé" value={`${store.objectifFacturableReel}h`} />}
              </div>
              {store.conserverRetrocession !== null && (
                <p className="mt-4 pt-3 border-t border-border text-xs font-sans text-muted-foreground font-light">
                  {store.conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
                  {!store.conserverRetrocession && store.raisonsBaisseRetro.length > 0 && ` — ${store.raisonsBaisseRetro.join(', ')}`}
                </p>
              )}
            </SectionCard>
          )}

          {/* Activité */}
          <SectionCard title="Activité">
            <ActivitySummaryCard />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <TagList items={store.tailleOperations} label="Taille opérations" />
              <TagList items={store.typesClients} label="Clientèle" />
            </div>
            {store.anglais && <p className="text-xs font-sans font-light mt-3"><span className="text-muted-foreground">Anglais : </span>{store.anglais}</p>}
          </SectionCard>

          {/* Associé / Counsel */}
          {store.isAssocieOrCounsel && (
            <SectionCard title={store.statutAssoc === 'associe' ? 'Associé' : 'Counsel'}>
              <div className="grid grid-cols-2 gap-4">
                {store.chiffreAffairesPortable && <DataRow label="CA portable" value={`${store.chiffreAffairesPortable} €`} />}
                {store.assocExpertiseSummary && <DataRow label="Expertise" value={store.assocExpertiseSummary} />}
              </div>
              <TagList items={store.assocAttentes} label="Attentes" />
              <TagList items={store.assocCabTypes} label="Types de cabinets visés" />
            </SectionCard>
          )}

          {/* Projet */}
          <SectionCard title="Projet">
            <div className="space-y-3">
              {store.movePriorities.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Priorités</p>
                  <div className="flex flex-wrap gap-1.5">
                    {store.movePriorities.map(p => (
                      <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-sans font-light">
                        <Check className="w-2.5 h-2.5" />{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {store.motivation && <div><p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Motivation</p><p className="text-sm font-sans font-light">{store.motivation}</p></div>}
              <div className="grid grid-cols-2 gap-3">
                <TagList items={store.cabinetsCibles} label="Cabinets cibles" />
                <TagList items={store.noGoCabinets} label="Cabinets exclus" />
              </div>
              {store.processusCours && <DataRow label="Processus en cours" value={store.processusCours} />}
              {store.souhaitePrendreRdv && store.creneauPrefere && <DataRow label="RDV souhaité" value={store.creneauPrefere} />}
            </div>
          </SectionCard>

          {/* Statut */}
          <SectionCard title="Statut">
            <div className="grid grid-cols-2 gap-4">
              <DataRow label="Écoute" value={store.statutEcoute === 'actif' ? 'En recherche active' : store.statutEcoute === 'passif' ? 'À l\'écoute' : '—'} />
              <DataRow label="Visibilité" value={store.visibilite === 'confidentiel' ? 'Confidentiel – fermé' : store.visibilite === 'semi-confidentiel' ? 'Confidentiel – ouvert' : '—'} />
              {store.disponibilite && <DataRow label="Disponibilité" value={store.disponibilite} />}
            </div>
          </SectionCard>
        </div>
      )}

      {/* ═══ VUE CABINET (anonymisée) ═══ */}
      {previewMode === 'cabinet' && (
        <div className="space-y-4">
          <div className="p-4 bg-secondary/50">
            <p className="text-xs font-sans font-light text-muted-foreground flex items-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              Voici ce que les cabinets partenaires verront. Votre identité est totalement protégée.
            </p>
          </div>

          {/* Anonymized header */}
          <SectionCard title="Profil anonymisé">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(215,20%,30%)] to-[hsl(215,15%,20%)] flex items-center justify-center shadow-inner">
                <User className="w-6 h-6 text-white/40" />
              </div>
              <div>
                <p className="font-serif text-lg text-foreground">Profil anonyme</p>
                <div className="mt-1">{pqe && <SeniorityBadge info={pqe} hideExactPQE />}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DataRow label="Pratique" value={store.departement} />
              {chambersInfo && <DataRow label="Cabinet d'origine" value={chambersInfo.cabinetValue} />}
              <DataRow label="Répertorié Chambers" value={chambersInfo?.isIntegrated ? 'Oui' : 'Non'} />
              {store.anglais && <DataRow label="Anglais" value={store.anglais} />}
            </div>
          </SectionCard>

          {/* Rémunération (anonymized — same data, no identity) */}
          {(store.retrocession || store.bonus) && (
            <SectionCard title="Rémunération">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {store.retrocession && <DataRow label="Rétrocession" value={`${store.retrocession} €`} />}
                {store.bonus && <DataRow label="Bonus" value={`${store.bonus} €`} />}
                {store.hasObjectifFacturable && store.objectifFacturable && <DataRow label="Objectif heures" value={`${store.objectifFacturable}h`} />}
              </div>
              {store.conserverRetrocession !== null && (
                <p className="mt-4 pt-3 border-t border-border text-xs font-sans text-muted-foreground font-light">
                  {store.conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
                </p>
              )}
            </SectionCard>
          )}

          {/* Activité */}
          <SectionCard title="Activité">
            <ActivitySummaryCard />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <TagList items={store.tailleOperations} label="Taille opérations" />
              <TagList items={store.typesClients} label="Clientèle" />
            </div>
            {store.anglais && <p className="text-xs font-sans font-light mt-3"><span className="text-muted-foreground">Anglais : </span>{store.anglais}</p>}
          </SectionCard>

          {/* Associé / Counsel */}
          {store.isAssocieOrCounsel && (
            <SectionCard title={store.statutAssoc === 'associe' ? 'Associé' : 'Counsel'}>
              <div className="grid grid-cols-2 gap-4">
                {store.chiffreAffairesPortable && <DataRow label="CA portable" value={`${store.chiffreAffairesPortable} €`} />}
              </div>
              <TagList items={store.assocAttentes} label="Attentes" />
            </SectionCard>
          )}

          {/* Projet (sans identité, sans cabinets exclus qui pourraient révéler l'identité) */}
          <SectionCard title="Projet">
            <div className="space-y-3">
              {store.movePriorities.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Priorités</p>
                  <div className="flex flex-wrap gap-1.5">
                    {store.movePriorities.map(p => (
                      <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-sans font-light">
                        <Check className="w-2.5 h-2.5" />{p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {store.motivation && <div><p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Motivation</p><p className="text-sm font-sans font-light">{store.motivation}</p></div>}
            </div>
          </SectionCard>

          {/* Statut */}
          <SectionCard title="Statut">
            <div className="grid grid-cols-2 gap-4">
              <DataRow label="Écoute" value={store.statutEcoute === 'actif' ? 'En recherche active' : store.statutEcoute === 'passif' ? 'À l\'écoute' : '—'} />
              {store.disponibilite && <DataRow label="Disponibilité" value={store.disponibilite} />}
            </div>
          </SectionCard>

          <div className="p-4">
            <p className="text-[10px] font-sans font-light text-muted-foreground">
              Non visible par les cabinets : nom, prénom, email, téléphone, nom du cabinet actuel, cabinets exclus.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-10">
        <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <Button onClick={handleSubmit} disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-medium px-8 rounded-sm">
          {submitting ? 'Envoi...' : isAdmin ? 'Générer le lien d\'invitation →' : 'Soumettre mon profil'}
        </Button>
      </div>
    </motion.div>
  );
};

export default Step6Review;
