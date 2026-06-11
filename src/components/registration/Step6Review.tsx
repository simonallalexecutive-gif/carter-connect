import { motion } from 'motion/react';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { usePQE } from '@/hooks/usePQE';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT, CABINET_META } from '@/lib/constants';
import { CHAMBERS_DB, CHAMBERS_DEPARTMENTS } from '@/lib/chambersRankings';
import { Eye, ArrowLeft, ArrowRight, Check, User, CalendarIcon, ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';


import { Calendar } from '@/components/ui/calendar';
import { format, parse, addDays, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';
import { buildQuantizedChartData } from '@/lib/percentages';
import { serializeRegistration } from '@/lib/registrationSerializer';

// Palette neutre, sobre et professionnelle — tons gris, ardoise et bleu nuit
// Conçue pour un rendu monochrome élégant sur fond noir mat
const CHART_COLORS = [
  'hsl(0, 0%, 92%)',       // Blanc cassé / perle
  'hsl(215, 14%, 62%)',    // Gris ardoise clair
  'hsl(220, 12%, 42%)',    // Anthracite bleuté
  'hsl(210, 18%, 78%)',    // Brume claire
  'hsl(218, 10%, 30%)',    // Graphite profond
  'hsl(212, 16%, 52%)',    // Bleu acier mat
];

// ── Specialized department category definitions (palette neutre sur fond sombre) ──
const PALETTE = {
  blue: 'hsl(0, 0%, 92%)',         // Perle
  emerald: 'hsl(215, 14%, 62%)',   // Gris ardoise
  gold: 'hsl(220, 12%, 42%)',      // Anthracite bleuté
  pearl: 'hsl(210, 18%, 78%)',     // Brume claire
  terra: 'hsl(218, 10%, 30%)',     // Graphite
  mauve: 'hsl(212, 16%, 52%)',     // Bleu acier
};

const MA_CATEGORIES = [
  { key: 'ma_pe', label: 'Private Equity', color: PALETTE.blue },
  { key: 'ma_ma', label: 'M&A', color: PALETTE.emerald },
  { key: 'ma_vc', label: 'Venture Capital', color: PALETTE.gold },
  { key: 'ma_autres', label: 'Autres', color: PALETTE.pearl },
];

const CONC_CATEGORIES = [
  { key: 'conc_concentrations', label: 'Contrôle des concentrations', color: PALETTE.blue },
  { key: 'conc_contentieux', label: 'Contentieux / enquêtes', color: PALETTE.emerald },
  { key: 'conc_conseil', label: 'Conseil / compliance', color: PALETTE.gold },
];

const FISC_CATEGORIES = [
  { key: 'fisc_transac', label: 'Fiscalité transactionnelle', color: PALETTE.blue },
  { key: 'fisc_contentieux', label: 'Fiscalité contentieuse', color: PALETTE.emerald },
  { key: 'fisc_conseil', label: 'Fiscalité conseil / structuration', color: PALETTE.gold },
];

const DPUB_CATEGORIES = [
  { key: 'dpub_contrats', label: 'Droit public éco. / contrats publics', color: PALETTE.blue },
  { key: 'dpub_contentieux', label: 'Contentieux administratif', color: PALETTE.emerald },
  { key: 'dpub_conseil', label: 'Conseil / régulation', color: PALETTE.gold },
];

const ARB_TYPES = [
  { key: 'arb_commercial', label: 'Arbitrage commercial', color: PALETTE.blue },
  { key: 'arb_invest', label: "Arbitrage d'investissement", color: PALETTE.emerald },
  { key: 'arb_construction', label: 'Arbitrage construction', color: PALETTE.gold },
  { key: 'arb_sport', label: 'Arbitrage sportif', color: PALETTE.pearl },
];

const PROJ_TYPES = [
  { key: 'proj_infra', label: 'Infrastructures', color: PALETTE.blue },
  { key: 'proj_enr', label: 'Énergie renouvelable', color: PALETTE.emerald },
  { key: 'proj_concession', label: 'Concessions / PPP', color: PALETTE.gold },
  { key: 'proj_fin', label: 'Financement de projets', color: PALETTE.terra },
  { key: 'proj_regl', label: 'Réglementaire / permitting', color: PALETTE.mauve },
];

const RESTRUCTURING_COLORS = {
  amiable: PALETTE.blue,
  financier: PALETTE.emerald,
  judiciaire: PALETTE.gold,
  distressed: PALETTE.terra,
  contentieux: PALETTE.pearl,
};

const RE_COLORS = {
  baux: PALETTE.blue,
  share: PALETTE.emerald,
  asset: PALETTE.gold,
  construction: PALETTE.pearl,
  financement: PALETTE.terra,
  contentieux: PALETTE.mauve,
};

const SOCIAL_COLORS = {
  conseilIndiv: PALETTE.blue,
  conseilColl: PALETTE.emerald,
  contentieuxIndiv: PALETTE.gold,
  contentieuxColl: PALETTE.terra,
};

const RESTRUCTURING_POSITIONING_COLORS = [PALETTE.blue, PALETTE.emerald, PALETTE.gold];
const RESTRUCTURING_CLIENTELE_COLORS = [PALETTE.blue, PALETTE.emerald, PALETTE.gold, PALETTE.pearl, PALETTE.terra, PALETTE.mauve];

type PreviewMode = 'recap' | 'cabinet';

// Map departement labels → chambers keys (couvre toutes les pratiques)
const DEPT_TO_CHAMBERS: Record<string, string> = {
  // Corporate / M&A / PE / VC
  'Corporate': 'ma',
  'Corporate/M&A': 'ma',
  'M&A (dominante)': 'ma',
  'Private Equity': 'pe',
  'Private Equity (dominante)': 'pe',
  'Venture Capital': 'pe',
  // Finance
  'Banking & Finance': 'banque',
  'Financement LBO': 'banque',
  'Financement de projets': 'projets',
  // Restructuring
  'Restructuring': 'restructuring',
  'Restructuring/Insolvency': 'restructuring',
  // Social
  'Droit Social': 'social',
  'Employment': 'social',
  // Concurrence
  'Competition/European Law': 'concurrence',
  // Fiscal
  'Tax': 'tax',
  // Public
  'Public Law': 'public',
  // Arbitration
  'International Arbitration': 'arbitrage',
  // Projets
  'Projects & Energy': 'projets',
  // Immobilier
  'Immobilier': 'immo',
  'Real Estate': 'immo',
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

interface Step6ReviewProps {
  readOnly?: boolean;
}

const Step6Review = ({ readOnly = false }: Step6ReviewProps = {}) => {
  const store = useRegistrationStore();
  const isAdmin = store.isAdminMode;
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('recap');
  const [submitting, setSubmitting] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const practiceActivities = store.departement
    ? (ACTIVITES_BY_PRACTICE[store.departement] || ACTIVITES_DEFAULT)
    : ACTIVITES_DEFAULT;
  const allActivites = practiceActivities.sections.flatMap(s => s.items);
  const activeActivites = allActivites.filter(a => store.activites[a.key]);

  // Global key → label resolver: agrège TOUTES les pratiques pour toujours afficher
  // un libellé complet (ex: "fin_acq" → "Financement d'acquisition") même quand
  // le département actuel ne contient pas cette clé.
  const GLOBAL_LABEL_MAP = useMemo(() => {
    const map: Record<string, string> = {};
    Object.values(ACTIVITES_BY_PRACTICE).forEach(p => {
      p.sections.forEach(s => s.items.forEach(it => { map[it.key] = it.label; }));
    });
    ACTIVITES_DEFAULT.sections.forEach(s => s.items.forEach(it => { map[it.key] = it.label; }));
    return map;
  }, []);
  const labelOf = (key: string) => GLOBAL_LABEL_MAP[key] || allActivites.find(a => a.key === key)?.label || key;

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
      const finKeys = Object.keys(store.activites).filter(k => (k.startsWith('fin_') || k.startsWith('finp_')) && store.activites[k]);
      if (finKeys.length > 0) {
        const items = finKeys.map((k, i) => ({
          name: labelOf(k),
          raw: store.pourcentages[k] || 10,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }));
        const total = items.reduce((s, i) => s + i.raw, 0);
        return { chartData: items.map(i => ({ name: i.name, value: total > 0 ? Math.round((i.raw / total) * 100) : 0, color: i.color })), positionnement: [], clientele: [] };
      }
      return { chartData: [], positionnement: [], clientele: [] };
    }

    // ── Concurrence ──
    if (dept === 'Competition/European Law') {
      return { chartData: buildCategoryChart(CONC_CATEGORIES, store.activites, store.pourcentages), positionnement: [], clientele: [] };
    }

    // ── Tax (new questionnaire) ──
    if (dept === 'Tax') {
      const segs: { name: string; value: number; color: string }[] = [];
      const corp = store.taxCorporatePct ?? 0;
      const tr = store.taxTransacPct ?? 0;
      const patri = store.taxHasPatrimonial === true ? (store.taxPatrimonialPct ?? 0) : 0;
      const pxt = store.taxHasPrixTransfert === true ? (store.taxPrixTransfertPct ?? 0) : 0;
      const tva = store.taxHasTva === true ? (store.taxTvaPct ?? 0) : 0;
      const intl = store.taxInternationalPct ?? 0;
      if (corp > 0) segs.push({ name: 'Corporate Tax', value: corp, color: PALETTE.blue });
      if (tr > 0) segs.push({ name: 'Transactionnel (M&A/PE/LBO)', value: tr, color: PALETTE.emerald });
      if (patri > 0) segs.push({ name: 'Patrimonial', value: patri, color: PALETTE.gold });
      if (pxt > 0) segs.push({ name: 'Prix de transfert', value: pxt, color: PALETTE.pearl });
      if (tva > 0) segs.push({ name: 'TVA / Fiscalité indirecte', value: tva, color: PALETTE.terra });
      if (intl > 0) segs.push({ name: 'Fiscalité internationale', value: intl, color: PALETTE.mauve });
      return { chartData: segs, positionnement: [], clientele: [] };
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
          name: labelOf(item.key),
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
    store.taxConseilPct, store.taxCorporatePct, store.taxTransacPct, store.taxHasPatrimonial,
    store.taxPatrimonialPct, store.taxHasPrixTransfert, store.taxPrixTransfertPct, store.taxHasTva,
    store.taxTvaPct, store.taxInternationalPct,
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

  // Section as a panel inside the dark monolithic block — no card framing, only a top divider + accent
  const SectionCard = ({ title, children, className: cls, first }: { title: string; children: React.ReactNode; className?: string; noBorder?: boolean; first?: boolean }) => (
    <section className={cn(
      "relative px-7 md:px-10 py-7",
      !first && "border-t border-white/10",
      cls,
    )}>
      <div className="flex items-center gap-3 mb-5">
        <span className="block w-6 h-px bg-white/40" />
        <p className="text-[10px] uppercase tracking-[0.28em] text-white/55 font-sans font-semibold">{title}</p>
      </div>
      <div className="text-white">{children}</div>
    </section>
  );

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <span className="text-[9px] uppercase tracking-[0.18em] text-white/45 font-sans font-medium">{label}</span>
      <p className="text-[13px] font-sans font-medium mt-1.5 text-white">{value || '—'}</p>
    </div>
  );

  const ActivitySummaryCard = () => {
    if (activitySummary.chartData.length === 0) return null;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,340px)_1fr] gap-8 items-start">
          {/* Donut — espace agrandi */}
          <div className="w-full aspect-square max-w-[340px] mx-auto lg:mx-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                  data={activitySummary.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="48%"
                  outerRadius="86%"
                  dataKey="value"
                  paddingAngle={activitySummary.chartData.length === 1 ? 0 : 1.5}
                  stroke="hsl(0, 0%, 7%)"
                  strokeWidth={activitySummary.chartData.length === 1 ? 0 : 2}
                  label={({ cx, cy, midAngle, innerRadius: ir, outerRadius: or, value, fill }) => {
                    const RADIAN = Math.PI / 180;
                    const isSmall = value < 8;
                    const r = ir + (or - ir) * 0.55;
                    const x = cx + r * Math.cos(-midAngle * RADIAN);
                    const y = cy + r * Math.sin(-midAngle * RADIAN);
                    // Adaptive contrast: parse HSL lightness so text stays readable on any slice
                    const m = typeof fill === 'string' ? fill.match(/hsl\(\s*\d+\s*,\s*\d+%\s*,\s*(\d+)%/i) : null;
                    const lightness = m ? parseInt(m[1], 10) : 50;
                    const sliceTextColor = lightness > 55 ? 'hsl(0, 0%, 7%)' : 'hsl(0, 0%, 100%)';
                    return (
                      <g>
                        {isSmall && (
                          <circle cx={x} cy={y} r={11} fill="hsl(0, 0%, 100%)" stroke="hsl(0, 0%, 7%)" strokeWidth={1.5} />
                        )}
                        <text
                          x={x}
                          y={y}
                          fill={isSmall ? 'hsl(0, 0%, 7%)' : sliceTextColor}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={isSmall ? 10 : 13}
                          fontWeight={700}
                          style={{ letterSpacing: '-0.02em' }}
                        >
                          {value}%
                        </text>
                      </g>
                    );
                  }}
                  labelLine={false}
                >
                  {activitySummary.chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, '']}
                  contentStyle={{
                    fontSize: '11px',
                    borderRadius: '4px',
                    background: 'hsl(0, 0%, 12%)',
                    border: '1px solid hsl(0, 0%, 22%)',
                    color: 'white',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Légende & métriques — texte clair sur fond sombre */}
          <div className="flex-1 space-y-5 w-full">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-3">Répartition d'activité</p>
              <div className="space-y-2">
                {activitySummary.chartData.map((item) => (
                  <div key={item.name} className="flex items-baseline gap-3 text-[12px] font-sans">
                    <span className="block w-2 h-2 rounded-full flex-shrink-0 translate-y-[2px]" style={{ backgroundColor: item.color }} />
                    <span className="text-white/90 flex-1 leading-snug">{item.name}</span>
                    <span className="text-white font-mono font-semibold tabular-nums">{totalPercent > 0 ? Math.round((item.value / totalPercent) * 100) : item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {activitySummary.positionnement.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Positionnement</p>
                {activitySummary.positionnement.map((item) => (
                  <div key={item.name} className="flex items-baseline gap-3 text-[12px] font-sans">
                    <span className="block w-2 h-2 rounded-full flex-shrink-0 translate-y-[2px]" style={{ backgroundColor: item.color }} />
                    <span className="text-white/90 flex-1">{item.name}</span>
                    <span className="text-white font-mono font-semibold tabular-nums">{item.value}%</span>
                  </div>
                ))}
              </div>
            )}

            {activitySummary.clientele.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Clientèle</p>
                {activitySummary.clientele.map((item) => (
                  <div key={item.name} className="flex items-baseline gap-3 text-[12px] font-sans">
                    <span className="block w-2 h-2 rounded-full flex-shrink-0 translate-y-[2px]" style={{ backgroundColor: item.color }} />
                    <span className="text-white/90 flex-1">{item.name}</span>
                    <span className="text-white font-mono font-semibold tabular-nums">{item.value}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Positionnement prêteur/sponsor (Finance) */}
            {(store.departement === 'Financement LBO' || store.departement === 'Financement de projets' || store.departement === 'Banking & Finance') && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Positionnement</p>
                <div className="flex items-baseline gap-3 text-[12px] font-sans">
                  <span className="text-white/90 flex-1">Prêteur</span>
                  <span className="text-white font-mono font-semibold tabular-nums">{store.positionnementPreteur}%</span>
                </div>
                <div className="flex items-baseline gap-3 text-[12px] font-sans">
                  <span className="text-white/90 flex-1">Sponsor</span>
                  <span className="text-white font-mono font-semibold tabular-nums">{100 - store.positionnementPreteur}%</span>
                </div>
              </div>
            )}

            {/* Employeur / Salarié (Social) */}
            {(store.departement === 'Droit Social' || store.departement === 'Employment') && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Positionnement</p>
                <div className="flex items-baseline gap-3 text-[12px] font-sans">
                  <span className="text-white/90 flex-1">Employeur</span>
                  <span className="text-white font-mono font-semibold tabular-nums">{store.socialEmployeur ?? 50}%</span>
                </div>
                <div className="flex items-baseline gap-3 text-[12px] font-sans">
                  <span className="text-white/90 flex-1">Salarié / dirigeant</span>
                  <span className="text-white font-mono font-semibold tabular-nums">{100 - (store.socialEmployeur ?? 50)}%</span>
                </div>
              </div>
            )}

            {/* Clientèle Française / Internationale */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Clientèle</p>
              <div className="flex items-baseline gap-3 text-[12px] font-sans">
                <span className="text-white/90 flex-1">Française</span>
                <span className="text-white font-mono font-semibold tabular-nums">{store.clienteleFrancaise}%</span>
              </div>
              <div className="flex items-baseline gap-3 text-[12px] font-sans">
                <span className="text-white/90 flex-1">Internationale</span>
                <span className="text-white font-mono font-semibold tabular-nums">{100 - store.clienteleFrancaise}%</span>
              </div>
            </div>

            {/* OPÉRATIONS */}
            {(store.tailleOperations || []).length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Opérations</p>
                <div className="flex flex-wrap gap-1.5">
                  {(store.tailleOperations || []).map(t => (
                    <span key={t} className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans bg-white text-[hsl(0,0%,7%)] font-semibold tracking-wide">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Social-specific tags */}
            {(store.departement === 'Droit Social' || store.departement === 'Employment') && (store.socialClientele || []).length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Clientèle cible</p>
                <div className="flex flex-wrap gap-1.5">
                  {(store.socialClientele || []).map(c => (
                    <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans bg-white/10 text-white border border-white/20">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Sous-détail M&A — Private M&A / Public M&A + clientèle */}
            {(store.departement === 'Corporate/M&A' || store.departement === 'M&A (dominante)') && store.activites['ma_ma'] && (() => {
              const subs = [
                { key: 'private', label: 'Private M&A' },
                { key: 'public', label: 'Public M&A' },
              ].filter(s => store.pourcentages[s.key] !== undefined);
              if (subs.length === 0) return null;
              const total = subs.reduce((s, i) => s + (store.pourcentages[i.key] ?? 0), 0);
              return (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Détail M&A</p>
                  {subs.map(s => (
                    <div key={s.key} className="flex items-baseline gap-3 text-[12px] font-sans">
                      <span className="text-white/90 flex-1">{s.label}</span>
                      <span className="text-white font-mono font-semibold tabular-nums">{total > 0 ? Math.round((store.pourcentages[s.key] ?? 0) / total * 100) : 0}%</span>
                    </div>
                  ))}
                  {(store.maClientele || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(store.maClientele || []).map(c => (
                        <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans bg-white/10 text-white border border-white/20">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Sous-détail Private Equity — LBO / MBO / PTP / PIPE + Fonds/Management */}
            {(store.departement === 'Corporate/M&A' || store.departement === 'Private Equity' || store.departement === 'Private Equity (dominante)') && store.activites['ma_pe'] && (() => {
              const subs = [
                { key: 'lbo', label: 'LBO' },
                { key: 'mbo', label: 'MBO / Management' },
                { key: 'ptp', label: 'Public-to-Private' },
                { key: 'pipe', label: 'PIPE' },
              ].filter(s => store.pourcentages[s.key] !== undefined);
              if (subs.length === 0) return null;
              const total = subs.reduce((s, i) => s + (store.pourcentages[i.key] ?? 0), 0);
              const peFonds = store.maPeFonds ?? 50;
              return (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Détail Private Equity</p>
                  {subs.map(s => (
                    <div key={s.key} className="flex items-baseline gap-3 text-[12px] font-sans">
                      <span className="text-white/90 flex-1">{s.label}</span>
                      <span className="text-white font-mono font-semibold tabular-nums">{total > 0 ? Math.round((store.pourcentages[s.key] ?? 0) / total * 100) : 0}%</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-sans text-white/45">
                    <span>Fonds {peFonds}%</span>
                    <span>·</span>
                    <span>Management {100 - peFonds}%</span>
                  </div>
                </div>
              );
            })()}

            {/* Sous-détail Venture Capital + secteurs */}
            {store.activites['ma_vc'] && (() => {
              const subs = [
                { key: 'levees', label: 'Levées de fonds' },
                { key: 'corporate', label: 'Corporate venture' },
                { key: 'secondary', label: 'Secondary / Cessions' },
              ].filter(s => store.pourcentages[s.key] !== undefined);
              if (subs.length === 0) return null;
              const total = subs.reduce((s, i) => s + (store.pourcentages[i.key] ?? 0), 0);
              const vcFonds = store.maVcFonds ?? 50;
              return (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Détail Venture Capital</p>
                  {subs.map(s => (
                    <div key={s.key} className="flex items-baseline gap-3 text-[12px] font-sans">
                      <span className="text-white/90 flex-1">{s.label}</span>
                      <span className="text-white font-mono font-semibold tabular-nums">{total > 0 ? Math.round((store.pourcentages[s.key] ?? 0) / total * 100) : 0}%</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-sans text-white/45">
                    <span>Fonds {vcFonds}%</span>
                    <span>·</span>
                    <span>Management {100 - vcFonds}%</span>
                  </div>
                  {(store.vcSecteurs || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(store.vcSecteurs || []).map(s => (
                        <span key={s} className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans bg-white/10 text-white border border-white/20">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Social expertises */}
            {(store.departement === 'Droit Social' || store.departement === 'Employment') && (store.socialExpertises || []).length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Expertises</p>
                <div className="flex flex-wrap gap-1.5">
                  {(store.socialExpertises || []).map(e => (
                    <span key={e} className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans bg-white/10 text-white border border-white/20">{e}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Social — Positionnement cabinet (standalone / corporate / restructuring) */}
            {(store.departement === 'Droit Social' || store.departement === 'Employment') && (() => {
              const posCabinet = store.socialPosCabinet || {};
              const entries = [
                { key: 'standalone', label: 'Stand alone' },
                { key: 'corporate', label: 'En support Corporate / M&A' },
                { key: 'restructuring', label: 'En support Restructuring' },
              ].filter(e => (posCabinet[e.key as keyof typeof posCabinet] ?? 0) > 0);
              if (entries.length === 0) return null;
              const total = entries.reduce((s, e) => s + (posCabinet[e.key as keyof typeof posCabinet] ?? 0), 0);
              return (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Positionnement cabinet</p>
                  {entries.map(e => (
                    <div key={e.key} className="flex items-baseline gap-3 text-[12px] font-sans">
                      <span className="text-white/90 flex-1">{e.label}</span>
                      <span className="text-white font-mono font-semibold tabular-nums">{total > 0 ? Math.round((posCabinet[e.key as keyof typeof posCabinet] ?? 0) / total * 100) : 0}%</span>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Tax — Conseil / Contentieux ratio */}
            {store.departement === 'Tax' && (() => {
              const conseilPct = store.taxConseilPct ?? 70;
              const contentieuxPct = 100 - conseilPct;
              return (
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Activité</p>
                  <div className="flex items-baseline gap-3 text-[12px] font-sans">
                    <span className="text-white/90 flex-1">Conseil</span>
                    <span className="text-white font-mono font-semibold tabular-nums">{conseilPct}%</span>
                  </div>
                  <div className="flex items-baseline gap-3 text-[12px] font-sans">
                    <span className="text-white/90 flex-1">Contentieux</span>
                    <span className="text-white font-mono font-semibold tabular-nums">{contentieuxPct}%</span>
                  </div>
                </div>
              );
            })()}

            {/* Tax — Clientèle */}
            {store.departement === 'Tax' && (store.taxClients || []).length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Clientèle</p>
                <div className="flex flex-wrap gap-1.5">
                  {(store.taxClients || []).map(c => (
                    <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans bg-white/10 text-white border border-white/20">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Real Estate — Types d'actifs */}
            {(store.departement === 'Immobilier' || store.departement === 'Real Estate') && (store.reAssetTypes || []).length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Actifs</p>
                <div className="flex flex-wrap gap-1.5">
                  {(store.reAssetTypes || []).map(a => (
                    <span key={a} className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans bg-white/10 text-white border border-white/20">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Real Estate — Domaines de contentieux */}
            {(store.departement === 'Immobilier' || store.departement === 'Real Estate') && (store.reContentieuxDomaines || []).length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Domaines de contentieux</p>
                <div className="flex flex-wrap gap-1.5">
                  {(store.reContentieuxDomaines || []).map(d => (
                    <span key={d} className="inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-sans bg-white/10 text-white border border-white/20">{d}</span>
                  ))}
                </div>
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
        {label && <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">{label}</p>}
        <div className="flex flex-wrap gap-1.5">
          {items.map(t => (
            <span key={t} className="text-[10px] px-2.5 py-1 rounded-sm bg-white/10 text-white border border-white/15 font-sans">{t}</span>
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
          emailRedirectTo: `${window.location.origin}/confirmation`,
          data: {
            full_name: `${store.prenom} ${store.nom}`.trim(),
            user_type: 'candidat',
          },
        },
      });

      if (error) throw error;

      const userId = signUpData?.user?.id;
      if (userId) {
        // Upload files to storage (best-effort)
        let photoStoragePath: string | undefined;
        let cvStoragePath: string | undefined;

        try {
          if (store.photo) {
            const ext = store.photo.name.split('.').pop() || 'jpg';
            const path = `${userId}/photo-${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage
              .from('candidate-files')
              .upload(path, store.photo, { upsert: true, contentType: store.photo.type });
            if (!upErr) photoStoragePath = path;
          }
        } catch (e) { console.warn('Photo upload failed', e); }

        try {
          if (store.cvFile) {
            const ext = store.cvFile.name.split('.').pop() || 'pdf';
            const path = `${userId}/cv-${Date.now()}.${ext}`;
            const { error: upErr } = await supabase.storage
              .from('candidate-files')
              .upload(path, store.cvFile, { upsert: true, contentType: store.cvFile.type });
            if (!upErr) cvStoragePath = path;
          }
        } catch (e) { console.warn('CV upload failed', e); }

        const submissionData = serializeRegistration(store, {
          photoStoragePath,
          cvStoragePath,
        });

        try {
          const { error: regError } = await supabase.functions.invoke('save-registration', {
            body: {
              userId,
              submissionData,
              visibility: store.visibilite || 'confidentiel',
              noGoCabinets: store.noGoCabinets || [],
            },
          });
          if (regError) console.error('Failed to save registration:', regError);
        } catch (regError) {
          console.error('Failed to save registration:', regError);
        }
      }

      if (store.souhaitePrendreRdv && store.creneauPrefere) {
        try {
          // creneauPrefere format: "lundi 9 juin 2025 à 14:00"
          const timeMatch = store.creneauPrefere.match(/à (\d{2}:\d{2})$/);
          const bookingTime = timeMatch?.[1] || '';
          // Parse the date from the French label using date-fns
          const dateStr = store.creneauPrefere.replace(/à \d{2}:\d{2}$/, '').trim();
          const parsed = parse(dateStr, 'EEEE d MMMM yyyy', new Date(), { locale: fr });
          const bookingDate = !isNaN(parsed.getTime())
            ? format(parsed, 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd');
          await supabase.from('logan_bookings').insert({
            candidate_name: `${store.prenom} ${store.nom}`.trim(),
            candidate_email: store.email,
            candidate_cabinet: store.cabinet || '',
            candidate_seniority: pqe ? `${pqe.label} · ${pqe.years} ans` : '',
            candidate_department: store.departement || '',
            booking_date: bookingDate,
            booking_time: bookingTime,
            user_id: signUpData?.user?.id || null,
            status: 'confirmed',
            notes: 'RDV depuis parcours inscription',
          } as any);
          // Notif admin
          supabase.functions.invoke('notify-booking', {
            body: {
              name: `${store.prenom} ${store.nom}`.trim(),
              email: store.email,
              cabinet: store.cabinet || '',
              date: bookingDate,
              time: bookingTime,
              source: 'inscription',
            },
          }).catch(() => {});
        } catch (bookingError) {
          console.error('Failed to save booking:', bookingError);
        }
      }

      // Appel Edge Function email admin
      try {
        await supabase.functions.invoke('notify-registration', {
          body: {
            candidateName: `${store.prenom} ${store.nom}`.trim(),
            candidateEmail: store.email,
            registrationId: signUpData?.user?.id || '',
            notaBene: store.notaBene || '',
            cabinet: store.cabinet || '',
            departement: store.departement || '',
          },
        });
      } catch (e) { console.warn('Email admin failed', e); }
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
      className="max-w-[780px] mx-auto px-4"
    >

      <div className="text-[9px] font-bold text-foreground/40 tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 5 / 5
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Récapitulatif</h2>
      <p className="text-foreground/50 font-sans text-xs font-light mb-8">Vérifiez vos informations avant de soumettre votre profil.</p>

      {/* Tabs — habillage sombre, élégant */}
      <div className="inline-flex gap-1 mb-6 p-1 bg-[hsl(0,0%,11%)] rounded-md">
        {[
          { key: 'recap' as const, label: 'Mon profil complet', icon: User },
          { key: 'cabinet' as const, label: 'Ce que voient les cabinets', icon: Eye },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setPreviewMode(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 font-sans text-[11px] tracking-[0.18em] uppercase transition-all duration-300 rounded-sm",
              previewMode === tab.key
                ? "bg-white text-[hsl(0,0%,7%)] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                : "text-white/55 hover:text-white/80"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ BLOC MONOLITHIQUE DARK MATTE ═══ */}
      <div className="relative bg-[hsl(0,0%,7%)] rounded-md overflow-hidden border border-white/[0.06] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.025] via-transparent to-transparent" />

        <div className="relative">
          {/* ═══ RECAP COMPLET ═══ */}
          {previewMode === 'recap' && (
            <>
              {/* Identity */}
              <SectionCard title="Identité" first>
                <div className="flex items-start gap-5 mb-6">
                  {store.photoPreviewUrl ? (
                    <img src={store.photoPreviewUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-white/15 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center font-serif text-xl text-white flex-shrink-0">
                      {store.prenom?.[0]}{store.nom?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-serif text-xl text-white tracking-tight">{store.prenom} {store.nom}</p>
                    <p className="text-sm font-sans font-light text-white/65 mt-0.5">{store.email}</p>
                    {store.telephone && <p className="text-xs font-sans font-light text-white/50 mt-0.5">{store.telephone}</p>}
                    {store.linkedinUrl && <p className="text-xs font-sans font-light text-white/45 mt-0.5 truncate max-w-xs">{store.linkedinUrl}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {pqe && (
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.18em] text-white/45 font-sans font-medium">Séniorité</span>
                      <div className="mt-1.5">
                        <span className="inline-flex items-center text-[13px] font-sans font-medium text-white">
                          {`${pqe.label} · ${pqe.years} ans`}
                        </span>
                      </div>
                    </div>
                  )}
                  <DataRow label="Pratique" value={store.departement} />
                  <DataRow label="Cabinet" value={store.cabinet} />
                  <DataRow label="Chambers" value={chambersInfo?.band ? `Band ${chambersInfo.band}` : chambersInfo?.isIntegrated ? 'Cabinet classé (hors pratique)' : 'Non classé'} />
                </div>
                {store.previousCabinets.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2.5">Cabinets précédents</p>
                    <div className="space-y-1.5">
                      {store.previousCabinets.map((pc, i) => (
                        <div key={i} className="text-xs font-sans text-white/85">
                          <span className="font-medium text-white">{pc.name}</span>
                          {pc.practices.length > 0 && (
                            <span className="text-white/55"> — {pc.practices.join(', ')}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>

              {/* Rémunération */}
              {(store.retrocession || store.bonus) && (
                <SectionCard title="Rémunération">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {store.retrocession && <DataRow label="Rétrocession" value={`${store.retrocession} €`} />}
                    {store.bonus && <DataRow label="Bonus" value={`${store.bonus} €`} />}
                    {store.hasObjectifFacturable && store.objectifFacturable && <DataRow label="Objectif heures" value={`${store.objectifFacturable}h`} />}
                    {store.hasObjectifFacturable && store.objectifFacturableReel && <DataRow label="Réalisé" value={`${store.objectifFacturableReel}h`} />}
                  </div>
                  {store.conserverRetrocession !== null && (
                    <p className="mt-4 pt-3 border-t border-white/10 text-xs font-sans text-white/60 font-light">
                      {store.conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
                      {!store.conserverRetrocession && store.raisonsBaisseRetro.length > 0 && ` — ${store.raisonsBaisseRetro.join(', ')}`}
                    </p>
                  )}
                </SectionCard>
              )}

              {/* Activité */}
              <SectionCard title="Activité">
                <ActivitySummaryCard />
                <div className="mt-5">
                  <TagList items={store.typesClients} label="Clientèle" />
                </div>
                {store.anglais && <p className="text-xs font-sans font-light mt-4 text-white/85"><span className="text-white/50">Anglais : </span>{store.anglais}{/^\d+$/.test(String(store.anglais).trim()) ? ' %' : ''}</p>}
              </SectionCard>

              {/* Associé / Counsel */}
              {store.isAssocieOrCounsel && (
                <SectionCard title={store.statutAssoc === 'associe' ? 'Associé' : 'Counsel'}>
                  <div className="grid grid-cols-2 gap-5">
                    {store.chiffreAffairesPortable && <DataRow label="CA portable" value={`${store.chiffreAffairesPortable} €`} />}
                    {store.assocExpertiseSummary && <DataRow label="Expertise" value={store.assocExpertiseSummary} />}
                  </div>
                  <div className="mt-4 space-y-4">
                    <TagList items={store.assocAttentes} label="Attentes" />
                    <TagList items={store.assocCabTypes} label="Types de cabinets visés" />
                  </div>
                </SectionCard>
              )}

              {/* Projet */}
              <SectionCard title="Projet">
                <div className="space-y-4">
                  {store.movePriorities.length > 0 && (
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Priorités</p>
                      <div className="flex flex-wrap gap-1.5">
                        {store.movePriorities.map(p => (
                          <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[hsl(0,0%,7%)] text-[10px] font-sans font-semibold tracking-wide">
                            <Check className="w-2.5 h-2.5" />{p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {store.motivation && <div><p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-1.5">Motivation</p><p className="text-sm font-sans font-light text-white/90 leading-relaxed">{store.motivation}</p></div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TagList items={store.cabinetsCibles} label="Cabinets cibles" />
                    <TagList items={store.noGoCabinets} label="Cabinets exclus" />
                  </div>
                  {store.processusCours && <DataRow label="Processus en cours" value={store.processusCours} />}
                  {store.souhaitePrendreRdv && store.creneauPrefere && <DataRow label="RDV souhaité" value={store.creneauPrefere} />}
                </div>
              </SectionCard>

              {/* Statut */}
              <SectionCard title="Statut">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <DataRow label="Écoute" value={store.statutEcoute === 'actif' ? 'En recherche active' : store.statutEcoute === 'passif' ? 'À l\'écoute' : '—'} />
                  <DataRow label="Visibilité" value={store.visibilite === 'confidentiel' ? 'Confidentiel – fermé' : store.visibilite === 'semi-confidentiel' ? 'Confidentiel – ouvert' : '—'} />
                  {store.disponibilite && <DataRow label="Disponibilité" value={store.disponibilite} />}
                </div>
              </SectionCard>
            </>
          )}

          {/* ═══ VUE CABINET (anonymisée) ═══ */}
          {previewMode === 'cabinet' && (
            <>
              {/* Anonymized header */}
              <SectionCard title="Profil anonymisé" first>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/15 to-white/[0.04] border border-white/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-white/40" />
                  </div>
                  <div>
                    <p className="font-serif text-xl text-white tracking-tight">Profil anonyme</p>
                    <div className="mt-1.5">{pqe && <SeniorityBadge info={pqe} hideExactPQE />}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <DataRow label="Pratique" value={store.departement} />
                  {chambersInfo && <DataRow label="Cabinet d'origine" value={chambersInfo.cabinetValue} />}
                  <DataRow label="Chambers" value={
                    chambersInfo?.band
                      ? (chambersInfo.band > 1
                          ? `Band ${chambersInfo.band - 1}/Band ${chambersInfo.band} — ${chambersInfo.deptLabel}`
                          : `Band ${chambersInfo.band} — ${chambersInfo.deptLabel}`)
                      : chambersInfo?.isIntegrated ? 'Classé (hors pratique)' : 'Non classé'
                  } />
                </div>
              </SectionCard>

              {/* Rémunération (anonymized) */}
              {(store.retrocession || store.bonus) && (
                <SectionCard title="Rémunération">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {store.retrocession && <DataRow label="Rétrocession" value={`${store.retrocession} €`} />}
                    {store.bonus && <DataRow label="Bonus" value={`${store.bonus} €`} />}
                    {store.hasObjectifFacturable && store.objectifFacturable && <DataRow label="Objectif heures" value={`${store.objectifFacturable}h`} />}
                  </div>
                  {store.conserverRetrocession !== null && (
                    <p className="mt-4 pt-3 border-t border-white/10 text-xs font-sans text-white/60 font-light">
                      {store.conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
                    </p>
                  )}
                </SectionCard>
              )}

              {/* Activité */}
              <SectionCard title="Activité">
                <ActivitySummaryCard />
                <div className="mt-5">
                  <TagList items={store.typesClients} label="Clientèle" />
                </div>
                {store.anglais && <p className="text-xs font-sans font-light mt-4 text-white/85"><span className="text-white/50">Anglais : </span>{store.anglais}{/^\d+$/.test(String(store.anglais).trim()) ? ' %' : ''}</p>}
              </SectionCard>

              {/* Associé / Counsel */}
              {store.isAssocieOrCounsel && (
                <SectionCard title={store.statutAssoc === 'associe' ? 'Associé' : 'Counsel'}>
                  <div className="grid grid-cols-2 gap-5">
                    {store.chiffreAffairesPortable && <DataRow label="CA portable" value={`${store.chiffreAffairesPortable} €`} />}
                  </div>
                  <div className="mt-4">
                    <TagList items={store.assocAttentes} label="Attentes" />
                  </div>
                </SectionCard>
              )}

              {/* Projet */}
              <SectionCard title="Projet">
                <div className="space-y-4">
                  {store.movePriorities.length > 0 && (
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-2">Priorités</p>
                      <div className="flex flex-wrap gap-1.5">
                        {store.movePriorities.map(p => (
                          <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[hsl(0,0%,7%)] text-[10px] font-sans font-semibold tracking-wide">
                            <Check className="w-2.5 h-2.5" />{p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {store.motivation && <div><p className="text-[9px] uppercase tracking-[0.22em] text-white/45 font-sans font-semibold mb-1.5">Motivation</p><p className="text-sm font-sans font-light text-white/90 leading-relaxed">{store.motivation}</p></div>}
                </div>
              </SectionCard>

              {/* Statut */}
              <SectionCard title="Statut">
                <div className="grid grid-cols-2 gap-5">
                  <DataRow label="Écoute" value={store.statutEcoute === 'actif' ? 'En recherche active' : store.statutEcoute === 'passif' ? 'À l\'écoute' : '—'} />
                  {store.disponibilite && <DataRow label="Disponibilité" value={store.disponibilite} />}
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>


      {!readOnly && (
        <>
          {/* Nota Bene */}
          <div className="rounded-sm border border-border bg-card px-5 py-4 mt-6">
            <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-sans font-light mb-3">Nota bene (facultatif)</p>
            <textarea
              value={store.notaBene || ''}
              onChange={e => store.setField('notaBene', e.target.value)}
              placeholder="Un mot à ajouter ? Une précision, un contexte particulier..."
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm font-sans ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          {/* RDV inline — collapsed by default */}
          <div className="rounded-sm border border-border bg-card mt-4 overflow-hidden">
            {/* Toggle header */}
            <button
              onClick={() => setShowBooking(v => !v)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-black/[0.02]"
            >
              <div>
                <p className="text-sm font-sans font-medium text-foreground">Souhaitez-vous échanger avec un consultant Logan ?</p>
                <p className="text-xs font-sans font-light text-muted-foreground mt-0.5">Sélectionnez directement un créneau ci-dessous.</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span className={cn(
                  "w-6 h-6 rounded-full border border-border flex items-center justify-center transition-all duration-300",
                  showBooking ? "bg-foreground border-foreground" : "bg-transparent"
                )}>
                  <ChevronDown className={cn(
                    "w-3 h-3 transition-all duration-300",
                    showBooking ? "rotate-180 text-background" : "text-muted-foreground"
                  )} />
                </span>
              </div>
            </button>

            {/* Calendrier — visible uniquement si ouvert */}
            <motion.div
              initial={false}
              animate={{ height: showBooking ? 'auto' : 0, opacity: showBooking ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5">
                <InlineBookingCalendar
                  onConfirm={(slot) => {
                    store.setField('souhaitePrendreRdv', true);
                    store.setField('creneauPrefere', slot);
                    toast.success(`Créneau enregistré : ${slot}`);
                  }}
                  selected={store.souhaitePrendreRdv ? store.creneauPrefere : ''}
                />
              </div>
            </motion.div>
          </div>

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
        </>
      )}
    </motion.div>
  );
};

const SLOTS = ['09:30', '10:30', '11:30', '14:00', '15:00', '16:00', '17:00'];

const InlineBookingCalendar = ({ onConfirm, selected }: { onConfirm: (slot: string) => void; selected: string }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slot, setSlot] = useState<string>('');

  const handleConfirm = () => {
    if (!date || !slot) return;
    const label = `${format(date, "EEEE d MMMM yyyy", { locale: fr })} à ${slot}`;
    onConfirm(label);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5">
      <div className="rounded-sm border border-border bg-background">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={fr}
          weekStartsOn={1}
          disabled={(d) => isBefore(d, startOfDay(new Date())) || d.getDay() === 0 || d.getDay() === 6}
          fromDate={new Date()}
          toDate={addDays(new Date(), 60)}
          className="pointer-events-auto p-2"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-sans mb-2.5">
          {date ? `Créneaux — ${format(date, 'EEEE d MMM', { locale: fr })}` : 'Sélectionnez une date'}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {SLOTS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={!date}
              onClick={() => setSlot(s)}
              className={cn(
                'px-2 py-2 rounded-sm border text-[12px] font-sans transition-all',
                !date && 'opacity-40 cursor-not-allowed',
                slot === s
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:border-foreground'
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={!date || !slot}
          size="sm"
          className="self-start font-sans text-xs font-medium rounded-sm"
        >
          Confirmer le créneau
        </Button>
        {selected && (
          <p className="mt-3 text-[11px] font-sans text-emerald-700">✓ {selected}</p>
        )}
      </div>
    </div>
  );
};

export default Step6Review;
