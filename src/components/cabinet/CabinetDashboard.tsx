import { useState, useMemo, useCallback, useEffect } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { PROFILES, DEPT_KEY_MAP, FIRMS_DB, CABINET_EXPERTISE_DETAIL, type CabinetProfile } from '@/lib/cabinetConstants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CHAMBERS_DEPARTMENTS, getChambersRanking, formatChambersBand } from '@/lib/chambersRankings';
import { NAT_FLAGS, NAT_LABELS } from '@/lib/legal500Rankings';
import { cn } from '@/lib/utils';
import { X, Search, Eye, Plus, FileText, Users, User, Sparkles, Award, BookMarked, Star, CircleDot } from 'lucide-react';
import ActivityPieChart from '@/components/shared/ActivityPieChart';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { buildQuantizedChartData } from '@/lib/percentages';
import CabinetActivityPieSummary from '@/components/cabinet/CabinetActivityPieSummary';
import CabinetRestructuringSynthesis from '@/components/cabinet/CabinetRestructuringSynthesis';
import CabinetStep3Search from './CabinetStep3Search';
import { supabase } from '@/integrations/supabase/client';

const PALIER_MAP: Record<string, string> = {
  starter: 'Starter · 1.500€/mois',
  business: 'Business · 3.000€/mois',
  enterprise: 'Enterprise · Sur devis',
};

// Aligned with CHAMBERS_DEPARTMENTS (now includes Tax)
const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'ma', label: 'Corporate/M&A' },
  { key: 'pe', label: 'Private Equity' },
  { key: 'banque', label: 'Banking & Finance' },
  { key: 'restructuring', label: 'Restructuring/Insolvency' },
  { key: 'social', label: 'Employment' },
  { key: 'immo', label: 'Real Estate' },
  { key: 'projets', label: 'Projects & Energy' },
  { key: 'tax', label: 'Tax' },
  { key: 'new', label: 'New', icon: Star },
];

// Map of dept key → official practice label (mirrors FILTERS, used inside cards)
const PRACTICE_LABEL_BY_KEY: Record<string, string> = FILTERS.reduce((acc, f) => {
  if (f.key !== 'all' && f.key !== 'new') acc[f.key] = f.label;
  return acc;
}, {} as Record<string, string>);

// Pie chart palette: bleu nuit, bleu pétrole, gris clair, gris foncé, noir
const EXPLORE_PIE_PALETTE = [
  'hsl(220, 40%, 18%)',   // bleu nuit
  'hsl(195, 45%, 28%)',   // bleu pétrole
  'hsl(210, 15%, 55%)',   // gris clair
  'hsl(210, 10%, 35%)',   // gris foncé
  'hsl(0, 0%, 10%)',      // noir
  'hsl(200, 30%, 40%)',   // bleu pétrole clair
  'hsl(215, 20%, 45%)',   // bleu gris
  'hsl(0, 0%, 65%)',      // gris moyen
];

const CabinetDashboard = () => {
  const s = useCabinetStore();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [drawerProfile, setDrawerProfile] = useState<CabinetProfile | null>(null);

  // New search: skip dept selection, go directly to search form
  if (s.dashboardView === 'newSearch') {
    if (s.currentSearchStep === 0 || s.currentSearchStep === 1) {
      return <SearchFormWrapper />;
    }
    if (s.currentSearchStep === 2) {
      return <SearchValidation />;
    }
  }

  // Mes recherches actives
  if (s.dashboardView === 'activeSearches') {
    return (
      <div>
        <h2 className="font-serif text-2xl text-foreground mb-6">Mes recherches actives</h2>
        {s.searches.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground font-sans">Aucune recherche active pour le moment.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 font-sans text-xs"
              onClick={() => { s.resetSearch(); s.setField('dashboardView', 'newSearch'); }}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Nouvelle recherche
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {s.searches.map((search) => (
              <div key={search.id} className="rounded-lg border border-border p-5 bg-background">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-sans text-sm font-bold text-foreground">{search.deptLabel || search.deptKey}</h3>
                  <span className="text-[10px] font-sans text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                    {search.seniorities?.join(', ') || 'Non spécifié'}
                  </span>
                </div>
                {search.expertise.length > 0 && (
                  <p className="text-xs text-muted-foreground font-sans">{search.expertise.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Explorer le marché
  if (s.dashboardView === 'explore') {
    return (
      <ExploreView
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
        drawerProfile={drawerProfile}
        setDrawerProfile={setDrawerProfile}
      />
    );
  }

  // Dashboard home
  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Tableau de bord</p>
        <div className="w-8 h-px bg-foreground" />
      </div>

      {s.searches.length > 0 && (
        <div className="mb-7">
          <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Recherches actives</div>
          <div className="grid gap-3">
            {s.searches.map((search) => (
              <div key={search.id} className="border border-border rounded-md p-4 bg-background flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">{search.deptLabel}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {search.seniorities.join(', ')} · {search.expertise.join(', ')}
                  </div>
                </div>
                <span className="text-[9px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm bg-foreground text-background">
                  {search.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two main CTAs */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => s.setField('dashboardView', 'explore')}
          className="group relative text-left rounded-lg border-2 border-border p-6 transition-all hover:border-foreground hover:shadow-lg bg-background flex flex-col"
        >
          <Eye className="w-5 h-5 text-foreground mb-3" />
          <div className="font-sans text-[11px] font-bold text-foreground tracking-wide mb-1">Explorer le marché des candidats</div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 flex-1">
            Parcourez librement tous les profils à l'écoute du marché, toutes matières confondues.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground mt-auto">
            <Users className="w-3.5 h-3.5" />
            {PROFILES.length} profils disponibles
          </div>
        </button>

        <button
          onClick={() => {
            s.resetSearch();
            s.setField('dashboardView', 'newSearch');
          }}
          className="group relative text-left rounded-lg border-2 border-border p-6 transition-all hover:border-foreground hover:shadow-lg bg-background flex flex-col"
        >
          <FileText className="w-5 h-5 text-foreground mb-3" />
          <div className="font-sans text-[11px] font-bold text-foreground tracking-wide mb-1">Publier une nouvelle recherche</div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-4 flex-1">
            Déposez un mandat confidentiel. LOGAN identifie et approche les meilleurs profils.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground mt-auto">
            <Plus className="w-3.5 h-3.5" />
            Créer une recherche
          </div>
        </button>
      </div>
    </div>
  );
};

// ── SEARCH FORM WRAPPER ──
const SearchFormWrapper = () => {
  const s = useCabinetStore();
  return (
    <div>
      <div className="max-w-[780px] mx-auto mb-4">
        <button
          onClick={() => s.setField('dashboardView', 'home')}
          className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1"
        >
          ← Retour au tableau de bord
        </button>
      </div>
      <CabinetStep3Search
        isEmbedded
        onBack={() => s.setField('dashboardView', 'home')}
        onNext={() => s.setField('currentSearchStep', 2)}
      />
    </div>
  );
};

// ── SEARCH VALIDATION ──
const SENIORITY_YEARS_MAP: Record<string, string> = {
  junior: '0/3 ans',
  mid: '3/6 ans',
  senior: '+6 ans',
};

const VALIDATION_PIE_PALETTE = [
  'hsl(220, 40%, 18%)',   // bleu nuit
  'hsl(185, 40%, 25%)',   // vert pétrole
  'hsl(210, 15%, 65%)',   // gris clair
  'hsl(200, 35%, 30%)',   // bleu pétrole foncé
  'hsl(155, 30%, 22%)',   // vert foncé
  'hsl(215, 25%, 40%)',   // bleu gris
  'hsl(0, 0%, 50%)',      // gris moyen
  'hsl(220, 30%, 28%)',   // bleu nuit clair
];

const SearchValidation = () => {
  const s = useCabinetStore();
  const [checks, setChecks] = useState([false, false]);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const allChecked = checks.every(Boolean);

  const profileTypes = s.profileTypes || [];
  const profileLabel = profileTypes.includes('associe') ? 'Associé' : profileTypes.includes('counsel') ? 'Counsel' : 'Collaborateur';
  const senYears = s.seniorities.length ? s.seniorities.map((k) => SENIORITY_YEARS_MAP[k] || '').filter(Boolean).join(', ') : '';
  const natLabel = s.detectedNat ? (NAT_LABELS[s.detectedNat] || s.detectedNat) : '';
  const hasChambersRanking = s.detectedRankings && s.detectedRankings.length > 0;

  // Get selected scope items
  const activeActivities = useMemo(() => {
    return Object.entries(s.cabinetActivites)
      .filter(([, v]) => v)
      .map(([k]) => {
        for (const exp of s.expertise) {
          const detail = CABINET_EXPERTISE_DETAIL[exp];
          if (detail) {
            for (const sec of detail.sections) {
              const item = sec.items.find((it) => it.key === k);
              if (item) return { key: k, label: item.label, section: sec.title };
            }
          }
        }
        return { key: k, label: k, section: 'Autre' };
      });
  }, [s.cabinetActivites, s.expertise]);

  // Build quantized chart data per expertise (same as Step3Search)
  const scopeChartDataByExpertise = useMemo(() => {
    const result: Record<string, ReturnType<typeof buildQuantizedChartData>> = {};
    s.expertise.filter(exp => exp !== 'Restructuring').forEach((exp) => {
      const detail = CABINET_EXPERTISE_DETAIL[exp];
      if (!detail) return;
      const selectedItems = detail.sections.flatMap(sec =>
        sec.items.filter(item => s.cabinetActivites[item.key])
      );
      if (selectedItems.length === 0) return;
      result[exp] = buildQuantizedChartData(
        selectedItems.map((item, index) => ({
          key: item.key,
          name: item.label,
          raw: s.scopePercentages[item.key] || 10,
          color: VALIDATION_PIE_PALETTE[index % VALIDATION_PIE_PALETTE.length],
        })),
      );
    });
    return result;
  }, [s.expertise, s.cabinetActivites, s.scopePercentages]);

  const retroStr = s.retroMin && s.retroMax ? `${s.retroMin}€ — ${s.retroMax}€` : s.retroMin ? `À partir de ${s.retroMin}€` : s.retroMax ? `Jusqu'à ${s.retroMax}€` : '';

  return (
    <div className="max-w-[780px] mx-auto">
      <button
        onClick={() => s.setField('currentSearchStep', 1)}
        className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
      >
        ← Modifier ma recherche
      </button>

      <h2 className="font-sans text-3xl font-normal text-foreground leading-tight mb-2.5">Validation de la recherche</h2>
      <p className="text-[11px] text-muted-foreground font-light leading-relaxed mb-3 max-w-xl">
        Voici l'aperçu de votre recherche telle qu'elle apparaîtra aux yeux des candidats.
      </p>

      {/* Preview card — dark premium style */}
      <div className="mb-6">
        <div className="bg-[hsl(0,0%,7%)] rounded-lg overflow-hidden shadow-[0_25px_60px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm">

          {/* ─── 1. EN-TÊTE : Statut | Département | Années ─── */}
          <div className="p-6 md:p-8 border-b border-white/[0.08]">
            <div className="text-[8px] tracking-[0.16em] uppercase text-white/35 font-sans mb-3">Opportunité · Présentée par LOGAN</div>
            <div className="flex items-center gap-2 flex-wrap text-[15px] font-semibold text-white font-sans">
              <span>{profileLabel}</span>
              <span className="text-white/25">|</span>
              <span>{s.currentSearchDeptLabel || s.expertise.join(' / ') || 'Département'}</span>
              {senYears && (
                <>
                  <span className="text-white/25">|</span>
                  <span>{senYears}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-white/40 font-sans">
              {natLabel && <span>{natLabel}</span>}
              {natLabel && <span className="text-white/15">·</span>}
              <span>Pratique reconnue Chambers : {hasChambersRanking ? 'Oui' : 'Non'}</span>
            </div>
            <div className="text-[10px] text-white/25 mt-2 font-sans">Identité protégée · Mise en relation via LOGAN uniquement</div>
          </div>

          {/* ─── 2. EXPERTISE RECHERCHÉE ─── */}
          {s.expertise.length > 0 && (
            <div className="p-6 md:p-8 border-b border-white/[0.08]">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 font-sans mb-4">Expertise recherchée</div>
              
              {/* Expertise chips */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {s.expertise.map((exp) => (
                  <span key={exp} className="text-[11px] bg-secondary border border-border rounded px-3 py-1.5 text-foreground/80 font-sans font-medium">{exp}</span>
                ))}
              </div>

              {Object.entries(scopeChartDataByExpertise).map(([exp, chartData]) => (
                chartData.length > 0 && (
                  <div key={exp} className="mt-5 pt-4 border-t border-white/[0.06]">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-3">{exp} — scope d'intervention</p>
                    <CabinetActivityPieSummary
                      chartData={chartData}
                      theme="dark"
                      className="text-white"
                    />
                  </div>
                )
              ))}

              {/* Activity split pie chart when multiple expertises */}
              {s.expertise.length >= 2 && Object.keys(s.activitySplit).length > 0 && (
                <div className="mt-5 pt-4 border-t border-white/[0.06]">
                  <p className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-3">Répartition de l'activité</p>
                  <div className="flex items-start gap-5">
                    <ResponsiveContainer width={100} height={100}>
                      <PieChart>
                        <Pie
                          data={s.expertise.map((k) => ({ name: k, value: s.activitySplit[k] || 0 })).filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={24}
                          outerRadius={44}
                          dataKey="value"
                          stroke="hsl(0, 0%, 10%)"
                          strokeWidth={2}
                        >
                          {s.expertise.map((_, i) => (
                            <Cell key={i} fill={VALIDATION_PIE_PALETTE[i % VALIDATION_PIE_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          contentStyle={{ fontSize: '10px', borderRadius: '4px', background: 'hsl(0,0%,15%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1.5">
                      {s.expertise.map((k, i) => {
                        const pct = s.activitySplit[k] || 0;
                        if (pct === 0) return null;
                        return (
                          <div key={k} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: VALIDATION_PIE_PALETTE[i % VALIDATION_PIE_PALETTE.length] }} />
                            <span className="text-[10px] text-white/60 font-sans">{k} — {pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {s.expertise.includes('Restructuring') && Object.keys(s.pourcentages).length > 0 && (() => {
                const distressedVal = s.pourcentages['restr_distressed'] ?? 10;
                const contentieuxVal = s.pourcentages['restr_contentieux_affaires'] ?? 10;
                const restructuringMainPct = Math.max(0, 100 - distressedVal - contentieuxVal);
                const amiableVal = s.sousActivites['restr_restructuring']?.amiable ?? 50;
                const amiableRatio = amiableVal / 100;
                const totalAmiablePct = Math.round(restructuringMainPct * amiableRatio);
                const judiciairePct = restructuringMainPct - totalAmiablePct;
                const financierPct = Math.round(totalAmiablePct * ((s.restrFinancier ?? 0) / 100));
                const amiableHorsFinancierPct = totalAmiablePct - financierPct;

                const chartData = [
                  amiableHorsFinancierPct > 0 ? { name: 'Amiable (hors financier)', value: amiableHorsFinancierPct, color: 'hsl(215, 50%, 35%)' } : null,
                  financierPct > 0 ? { name: 'Restructuring financier', value: financierPct, color: 'hsl(210, 25%, 50%)' } : null,
                  judiciairePct > 0 ? { name: 'Judiciaire', value: judiciairePct, color: 'hsl(215, 55%, 22%)' } : null,
                  distressedVal > 0 ? { name: 'Distressed M&A', value: distressedVal, color: 'hsl(200, 12%, 45%)' } : null,
                  contentieuxVal > 0 ? { name: 'Contentieux', value: contentieuxVal, color: 'hsl(220, 15%, 62%)' } : null,
                ].filter(Boolean) as Array<{ name: string; value: number; color: string }>;

                const posColors = ['hsl(215, 50%, 35%)', 'hsl(200, 15%, 50%)', 'hsl(220, 20%, 30%)'];
                const cliColors = ['hsl(215, 55%, 22%)', 'hsl(210, 20%, 42%)', 'hsl(200, 12%, 55%)', 'hsl(220, 15%, 35%)', 'hsl(215, 50%, 35%)', 'hsl(210, 10%, 62%)'];

                const posChartData = s.positionnementRestr.length === 0
                  ? []
                  : buildQuantizedChartData(
                      s.positionnementRestr.map((opt, i) => ({
                        key: opt,
                        name: opt,
                        raw: s.positionnementRestrPct[opt] || 10,
                        color: posColors[i % posColors.length],
                      }))
                    );

                const cliChartData = s.clienteleRestr.length === 0
                  ? []
                  : buildQuantizedChartData(
                      s.clienteleRestr.map((opt, i) => ({
                        key: opt,
                        name: opt,
                        raw: s.clienteleRestrPct[opt] || 10,
                        color: cliColors[i % cliColors.length],
                      }))
                    );

                return (
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <p className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-3">Synthèse Restructuring</p>
                    <CabinetRestructuringSynthesis
                      chartData={chartData}
                      posChartData={posChartData}
                      cliChartData={cliChartData}
                      theme="dark"
                    />
                  </div>
                );
              })()}
            </div>
          )}

          {/* ─── 3. CONTEXTE & ÉQUIPE ─── */}
          {(s.contexte || s.eqAssocies || s.eqCounsels || s.eqCollab) && (
            <div className="p-6 md:p-8 border-b border-white/[0.08]">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 font-sans mb-4">Contexte & équipe</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {s.contexte && (
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1">Contexte</div>
                    <div className="text-[13px] font-semibold text-white font-sans">{s.contexte}</div>
                  </div>
                )}
                {(s.eqAssocies || s.eqCounsels || s.eqCollab) && (
                  <div>
                    <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1">Composition actuelle</div>
                    <div className="text-[13px] font-semibold text-white font-sans">
                      {[s.eqAssocies ? `${s.eqAssocies} associé(s)` : '', s.eqCounsels ? `${s.eqCounsels} counsel(s)` : '', s.eqCollab ? `${s.eqCollab} collaborateur(s)` : ''].filter(Boolean).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── 4. RÉTROCESSION & CONDITIONS ─── */}
          <div className="p-6 md:p-8 border-b border-white/[0.08]">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-white/35 font-sans mb-4">Rétrocession & conditions</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/[0.05] rounded-lg p-3">
                <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Rétrocession</div>
                <div className="font-sans text-[13px] font-bold text-white">{retroStr || 'Confidentiel'}</div>
              </div>
              {s.hasHeures && s.heures && (
                <div className="bg-white/[0.05] rounded-lg p-3">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Objectif heures</div>
                  <div className="font-sans text-[13px] font-bold text-white">{s.heures}h/an</div>
                </div>
              )}
              {s.bonusEnabled && s.bonusTypes.length > 0 && (
                <div className="bg-white/[0.05] rounded-lg p-3">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Bonus</div>
                  <div className="font-sans text-[13px] font-bold text-white">
                    {s.bonusTypes.join(', ')}
                    {s.bonusDesc && ` (${s.bonusDesc}€)`}
                  </div>
                </div>
              )}
              {s.tt && (
                <div className="bg-white/[0.05] rounded-lg p-3">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Télétravail</div>
                  <div className="font-sans text-[13px] font-bold text-white">{s.tt}</div>
                </div>
              )}
              {s.english && (
                <div className="bg-white/[0.05] rounded-lg p-3">
                  <div className="text-[8px] uppercase tracking-[0.1em] text-white/35 font-sans mb-1.5">Anglais</div>
                  <div className="font-sans text-[13px] font-bold text-white">{s.english}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8 text-center bg-[hsl(0,0%,7%)]">
            <p className="text-[10px] text-white/30 font-sans mb-3 leading-relaxed">
              LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation.
            </p>
            <button className="w-full py-3 bg-white/[0.12] border border-white/[0.15] text-white font-bold text-[13px] rounded cursor-default font-sans">
              Je suis intéressé(e) par cette opportunité →
            </button>
            <div className="mt-2 text-[10px] text-white/25 font-sans">Un consultant Logan vous contactera sous 48h pour échanger plus en détails sur cette opportunité</div>
          </div>
        </div>
      </div>

      {/* Approval */}
      <div className="bg-[hsl(0,0%,7%)] rounded-md p-5 mb-6">
        <div className="font-sans text-[13px] font-semibold text-white mb-3">Confirmez votre recherche</div>
        <div className="flex flex-col gap-2">
          {[
            "Je confirme les critères de ma recherche.",
            "Je comprends que la mise en relation est confidentielle et orchestrée par LOGAN.",
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
                'w-[18px] h-[18px] rounded-sm border-[1.5px] flex-shrink-0 mt-0.5 flex items-center justify-center',
                checks[i] ? 'bg-white border-white' : 'border-white/25'
              )}>
                {checks[i] && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
              </div>
              <span className="text-[11px] text-white/65 leading-relaxed font-sans">{text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setField('currentSearchStep', 1)} className="font-sans text-[11px] rounded-sm">← Modifier</Button>
        <Button
          onClick={async () => {
            s.saveCurrentSearch();
            // Persist updated searches array to DB
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                const latest = useCabinetStore.getState().searches;
                await supabase
                  .from('cabinet_accounts')
                  .update({ searches: latest as any })
                  .eq('user_id', user.id);
              }
            } catch (e) {
              console.error('Failed to persist search:', e);
            }
            toast.success('Recherche publiée avec succès !');
          }}
          disabled={!allChecked}
          className="bg-foreground text-background hover:bg-foreground/90 font-sans text-[11px] font-bold rounded-sm px-8"
        >
          Publier ma recherche →
        </Button>
      </div>
    </div>
  );
};

// ── Helper: derive status label from profile ──
function getStatusLabel(p: CabinetProfile): string {
  if (p.seniority === 'Associé') return 'Associé';
  if (p.seniority === 'Counsel') return 'Counsel';
  return 'Collaborateur';
}

/**
 * Returns standardized seniority label among:
 * Junior / Mid Level / Senior / Counsel / Associé
 */
function getSeniorityLabel(p: CabinetProfile): string {
  const sen = p.seniority || '';
  if (sen.includes('Associé')) return 'Associé';
  if (sen.includes('Counsel')) return 'Counsel';
  if (sen.includes('Senior') || sen.includes('Sénior')) return 'Senior';
  if (sen.includes('Mid')) return 'Mid Level';
  if (sen.includes('Junior')) return 'Junior';
  return sen || 'Collaborateur';
}

function getNatLabel(nat: string): string {
  const map: Record<string, string> = { FR: 'Français', US: 'Américain', UK: 'Anglais' };
  return map[nat] || nat;
}

function isChambersRanked(p: CabinetProfile): boolean {
  // Chambers reconnaît les pratiques top-tier (Tier 1 ou Tier 2)
  return p.originTier === 'Tier 1' || p.originTier === 'Tier 2';
}

function isLegal500Ranked(p: CabinetProfile): boolean {
  // Legal 500 couvre une plage plus large (Tier 1 à Tier 5)
  return !!(p.originTier && p.originTier.startsWith('Tier'));
}

/** Renvoie un libellé compact ex: "Chambers", "Legal 500", "Chambers · Legal 500", ou "—" */
function getRankingsLabel(p: CabinetProfile): string {
  const parts: string[] = [];
  if (isChambersRanked(p)) parts.push('Chambers');
  if (isLegal500Ranked(p)) parts.push('Legal 500');
  return parts.join(' · ');
}

/** Rétrocession suggérée par LOGAN, calée sur la séniorité standardisée. */
function getSuggestedRetro(p: CabinetProfile): string {
  const sen = getSeniorityLabel(p);
  switch (sen) {
    case 'Junior': return '120 K€';
    case 'Mid Level': return '145 K€';
    case 'Senior': return '165 K€';
    case 'Counsel': return '200 K€';
    case 'Associé': return 'Sur devis (package associé)';
    default: return '145 K€';
  }
}

/**
 * Renvoie une répartition d'activité cohérente avec la pratique du candidat,
 * incluant positionnement et clientèle métier (overrides l'aléatoire d'origine).
 */
function getCoherentActivity(p: CabinetProfile): {
  split: Record<string, number>;
  positioning: string;
  clientele: string;
} {
  // If the profile has real data (from registrationToProfile), use it directly
  const hasSplit = p.split && Object.keys(p.split).length > 0;
  return {
    split: hasSplit ? p.split : (() => {
      switch (p.dept) {
        case 'banque': return { 'Financement LBO': 80, 'Financement immobilier': 20 };
        case 'ma': return { 'M&A industriel': 80, 'LBO': 20 };
        case 'restructuring': return { 'Restructuring opérationnel': 70, 'Restructuring financier': 30 };
        case 'public': return { 'Droit public des affaires': 70, 'Contentieux administratif': 30 };
        case 'arbitrage': return { 'Arbitrage commercial international': 70, "Arbitrage d'investissement": 30 };
        case 'social': return { 'Conseil RH stratégique': 65, 'Contentieux social': 35 };
        case 'concurrence': return { 'Contrôle des concentrations': 60, 'Pratiques anticoncurrentielles': 40 };
        case 'immo': return { 'Transactions immobilières': 70, 'Baux commerciaux': 30 };
        case 'projets': return { 'Énergies renouvelables': 70, 'Infrastructures': 30 };
        case 'fiscal': return { 'Fiscalité des transactions': 70, 'Prix de transfert': 30 };
        default: return p.split || {};
      }
    })(),
    positioning: p.realPositioning || (() => {
      switch (p.dept) {
        case 'banque': return 'Côté emprunteur';
        case 'ma': return 'Côté acquéreur';
        case 'restructuring': return 'Côté débiteur';
        case 'public': return 'Côté opérateurs privés';
        case 'arbitrage': return 'Côté demandeur';
        case 'social': return 'Côté employeur';
        case 'concurrence': return 'Côté notifiant';
        case 'immo': return 'Côté investisseur';
        case 'projets': return 'Côté sponsor';
        case 'fiscal': return 'Côté contribuable';
        default: return '';
      }
    })(),
    clientele: p.realClientele || (() => {
      switch (p.dept) {
        case 'banque': return "Fonds d'investissement";
        case 'ma': return 'Corporates & ETI';
        case 'restructuring': return 'Corporates en retournement';
        case 'public': return 'Concessionnaires & ETI';
        case 'arbitrage': return 'Groupes industriels';
        case 'social': return 'Grands groupes & ETI';
        case 'concurrence': return 'Multinationales';
        case 'immo': return 'Foncières & SCPI';
        case 'projets': return 'Producteurs indépendants';
        case 'fiscal': return 'Groupes internationaux';
        default: return '';
      }
    })(),
  };
}

// ── EXPLORE VIEW ──
// Key → display label for activity keys from registration store
const ACTIVITY_KEY_LABELS: Record<string, string> = {
  // M&A / PE / VC
  'ma_pe': 'Private Equity', 'ma_ma': 'M&A', 'ma_vc': 'Venture Capital',
  // Finance
  'fin_obligataire': 'Financement obligataire', 'fin_acq': "Financement d'acquisition",
  'fin_lbo': 'Financement LBO', 'fin_immo': 'Financement immobilier',
  'fin_actifs': "Financement d'actifs", 'fin_titrisation': 'Titrisation',
  // Restructuring
  'restr_restructuring': 'Restructuring', 'restr_distressed': 'Distressed M&A',
  'restr_contentieux_affaires': 'Contentieux',
  // Social
  'soc_conseil': 'Conseil', 'soc_contentieux': 'Contentieux',
  // Concurrence
  'conc_concentrations': 'Contrôle des concentrations',
  'conc_contentieux': 'Contentieux / enquêtes', 'conc_conseil': 'Conseil / compliance',
  // Fiscal / Tax
  'fisc_transac': 'Fiscalité transactionnelle', 'fisc_contentieux': 'Fiscalité contentieuse',
  'fisc_conseil': 'Fiscalité conseil',
  // Real Estate
  're_conseil': 'Conseil transactionnel', 're_contentieux': 'Contentieux',
  // Arbitrage
  'arb_commercial': 'Arbitrage commercial', 'arb_invest': "Arbitrage d'investissement",
  // Projets
  'proj_infra': 'Infrastructures', 'proj_enr': 'Énergie renouvelable',
};

// Converts a candidate_registrations row to CabinetProfile
function registrationToProfile(row: any): CabinetProfile {
  const d = row.submission_data || {};
  const pqeYears = (() => {
    if (!d.sermentMois || !d.sermentAnnee) return 0;
    const now = new Date();
    return now.getFullYear() - d.sermentAnnee + (now.getMonth() + 1 < d.sermentMois ? -1 : 0);
  })();
  const pqeLabel = pqeYears <= 2 ? 'Junior' : pqeYears <= 5 ? 'Mid Level' : pqeYears <= 8 ? 'Senior' : d.statutAssoc === 'associe' ? 'Associé' : d.statutAssoc === 'counsel' ? 'Counsel' : 'Senior';
  const deptKey = DEPT_KEY_MAP[d.departement] || 'ma';

  // Nat from FIRMS_DB
  const firmData = FIRMS_DB[d.cabinet];
  const nat = firmData?.nat || d.cabNat || 'FR';

  // English level from anglais percentage
  const anglaisPct = parseInt(d.anglais || '0', 10);
  const english = anglaisPct >= 80 ? 'Bilingue' : anglaisPct >= 40 ? 'Courant' : anglaisPct > 0 ? 'Notions' : '—';

  // Build split with display labels from activites + pourcentages
  const activites: Record<string, boolean> = d.activites || {};
  const pourcentages: Record<string, number> = d.pourcentages || {};
  const activeKeys = Object.keys(activites).filter(k => activites[k]);
  let split: Record<string, number> = {};
  if (activeKeys.length > 0) {
    const total = activeKeys.reduce((s, k) => s + (pourcentages[k] || 10), 0);
    activeKeys.forEach(k => {
      const label = ACTIVITY_KEY_LABELS[k] || k;
      split[label] = total > 0 ? Math.round(((pourcentages[k] || 10) / total) * 100) : 0;
    });
  }

  // Positioning from real data
  const realPositioning = (() => {
    if (d.maSanteVendeur !== undefined) return `Côté vendeur ${d.maSanteVendeur}% · Acquéreur ${100 - d.maSanteVendeur}%`;
    if (d.positionnementPreteur !== undefined) return `Côté prêteur ${d.positionnementPreteur}% · Sponsor ${100 - d.positionnementPreteur}%`;
    if (d.maPeFonds !== undefined) return `Côté fonds ${d.maPeFonds}% · Management ${100 - d.maPeFonds}%`;
    return undefined;
  })();

  // Clientele from real data
  const realClientele = (() => {
    if (d.typesClients?.length > 0) return d.typesClients.join(', ');
    if (d.maClientele?.length > 0) return d.maClientele.join(', ');
    if (d.socialClientele?.length > 0) return d.socialClientele.join(', ');
    return undefined;
  })();

  return {
    id: row.id,
    dept: deptKey,
    deptLabel: d.departement || '—',
    title: `${pqeLabel} — ${d.departement || ''} · ${pqeYears} ans PQE`,
    pqe: `${pqeYears} ans`,
    nat,
    natFlag: nat,
    origin: d.cabinet || '—',
    originTier: d.cabTier || '—',
    english,
    seniority: pqeLabel,
    isNew: (() => { const c = new Date(row.created_at); const now = new Date(); return (now.getTime() - c.getTime()) < 7 * 24 * 3600 * 1000; })(),
    expertise: activeKeys.slice(0, 4),
    split,
    formation: d.formation || '—',
    droit_etranger: '—',
    langue2: '—',
    retro_actuel: d.retrocession ? `${d.retrocession} €` : '—',
    disponibilite: d.disponibilite || '—',
    mobilite: d.mobilite || 'Paris',
    motivation: d.assocExpertiseSummary || d.notaBene || '—',
    match: Math.floor(70 + Math.random() * 25),
    realPositioning,
    realClientele,
    statutEcoute: d.statutEcoute,
  };
}

const ExploreView = ({
  filter, setFilter, sort, setSort, drawerProfile, setDrawerProfile
}: {
  filter: string;
  setFilter: (f: string) => void;
  sort: string;
  setSort: (s: string) => void;
  drawerProfile: CabinetProfile | null;
  setDrawerProfile: (p: CabinetProfile | null) => void;
}) => {
  const s = useCabinetStore();
  const [chambersOnly, setChambersOnly] = useState(false);
  const [legal500Only, setLegal500Only] = useState(false);
  const [seniorityFilter, setSeniorityFilter] = useState<string>('all');
  const [realProfiles, setRealProfiles] = useState<CabinetProfile[]>([]);

  const [profilesLoaded, setProfilesLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from('candidate_registrations')
      .select('id, created_at, submission_data')
      .eq('status', 'approved')
      .then(({ data, error }) => {
        if (error) console.error('CabinetDashboard fetch error:', error);
        console.log('CabinetDashboard fetched candidates:', data);
        setRealProfiles((data || []).map(registrationToProfile));
        setProfilesLoaded(true);
      });
  }, []);

  const SENIORITY_FILTERS = [
    { key: 'all', label: 'Toutes' },
    { key: 'Junior', label: 'Junior' },
    { key: 'Mid Level', label: 'Mid Level' },
    { key: 'Senior', label: 'Senior' },
    { key: 'Counsel', label: 'Counsel' },
    { key: 'Associé', label: 'Associé' },
  ];

  const filtered = useMemo(() => {
    const allProfiles = profilesLoaded ? realProfiles : [...PROFILES];
    let profiles = [...allProfiles];
    if (filter === 'new') profiles = profiles.filter((p) => p.isNew);
    else if (filter !== 'all') profiles = profiles.filter((p) => p.dept === filter);
    if (chambersOnly) profiles = profiles.filter((p) => isChambersRanked(p));
    if (legal500Only) profiles = profiles.filter((p) => isLegal500Ranked(p));
    if (seniorityFilter !== 'all') profiles = profiles.filter((p) => getSeniorityLabel(p) === seniorityFilter);
    if (sort === 'pqe') profiles.sort((a, b) => parseInt(b.pqe) - parseInt(a.pqe));
    else if (sort === 'match') profiles.sort((a, b) => b.match - a.match);
    return profiles;
  }, [filter, sort, chambersOnly, legal500Only, seniorityFilter, realProfiles]);

  return (
    <div>
      <button
        onClick={() => s.setField('dashboardView', 'home')}
        className="text-xs text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1"
      >
        ← Retour au tableau de bord
      </button>

      <h2 className="font-sans text-2xl font-normal text-foreground leading-tight mb-1">Explorer le marché</h2>
      <p className="text-xs text-muted-foreground mb-6">
        Parcourez tous les profils enregistrés. Cliquez sur un profil pour consulter le détail anonymisé.
      </p>

      {/* Filters — Pratique */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-[11px] font-semibold text-foreground mr-1">Pratique :</span>
        {FILTERS.map((f) => {
          const Icon = (f as any).icon as typeof Sparkles | undefined;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'inline-flex items-center gap-1.5 text-[10px] font-medium px-3 py-1.5 border rounded-full transition-all',
                filter === f.key
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:border-foreground'
              )}
            >
              {Icon && <Icon className="w-3 h-3" strokeWidth={1.75} />}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Filters — Classements + Séniorité + Tri */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-[11px] font-semibold text-foreground mr-1">Classements :</span>
        <button
          onClick={() => setChambersOnly(v => !v)}
          className={cn(
            'text-[10px] font-medium px-3 py-1.5 border rounded-full transition-all',
            chambersOnly
              ? 'bg-foreground text-background border-foreground'
              : 'bg-background text-muted-foreground border-border hover:border-foreground'
          )}
        >
          Chambers
        </button>
        <button
          onClick={() => setLegal500Only(v => !v)}
          className={cn(
            'text-[10px] font-medium px-3 py-1.5 border rounded-full transition-all',
            legal500Only
              ? 'bg-foreground text-background border-foreground'
              : 'bg-background text-muted-foreground border-border hover:border-foreground'
          )}
        >
          Legal 500
        </button>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-[11px] font-semibold text-foreground">Séniorité :</span>
          <select
            value={seniorityFilter}
            onChange={(e) => setSeniorityFilter(e.target.value)}
            className="text-[11px] border border-border rounded px-2 py-1 bg-background text-foreground cursor-pointer"
          >
            {SENIORITY_FILTERS.map((sf) => (
              <option key={sf.key} value={sf.key}>{sf.label}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-[11px] border border-border rounded px-2 py-1 bg-background text-foreground cursor-pointer"
          >
            <option value="date">Plus récents</option>
            <option value="pqe">Expérience</option>
            <option value="match">Matching</option>
          </select>
        </div>
      </div>

      {/* Grid — light cards matching CandidateOffers preview style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => {
          const seniorityLabel = getSeniorityLabel(p);
          const practiceLabel = p.deptLabel || PRACTICE_LABEL_BY_KEY[p.dept] || p.dept;
          const chambers = isChambersRanked(p);
          const legal500 = isLegal500Ranked(p);
          const isActive = p.statutEcoute === 'actif' || p.disponibilite === 'Immédiate';
          const natLabel = p.nat ? `Cabinet ${getNatLabel(p.nat)}` : '';

          return (
            <div
              key={p.id}
              onClick={() => setDrawerProfile(p)}
              className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-border bg-card cursor-pointer flex flex-col"
            >
              {/* Top strip: ID + status */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
                <span className="text-[9px] tracking-[0.18em] uppercase text-muted-foreground/70 font-sans">{p.id}</span>
                {isActive ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-800 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-800" />
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-700">Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                    <span className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">À l'écoute</span>
                  </span>
                )}
              </div>

              {/* Main */}
              <div className="px-5 py-5 flex-1 flex flex-col">
                {p.isNew && (
                  <span className="inline-flex items-center text-[8px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
                    <Star className="w-2.5 h-2.5 mr-1 fill-foreground/70" strokeWidth={0} />
                    new
                  </span>
                )}

                {/* Title */}
                <div className="mb-1">
                  <div className="text-[15px] font-sans font-semibold text-foreground leading-tight">{seniorityLabel}</div>
                  <div className="text-[12px] font-sans text-muted-foreground mt-0.5">{practiceLabel}{p.pqe ? ` · ${p.pqe}` : ''}</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {natLabel && (
                    <span className="text-[10px] font-sans text-foreground/75 leading-none border border-border rounded px-2 py-1">{natLabel}</span>
                  )}
                  <span className="text-[10px] font-sans text-foreground/75 leading-none border border-border rounded px-2 py-1">Chambers&nbsp;: {chambers ? 'Oui' : 'Non'}</span>
                  {legal500 && (
                    <span className="text-[10px] font-sans text-foreground/75 leading-none border border-border rounded px-2 py-1">Legal 500</span>
                  )}
                </div>
              </div>

              {/* Footer affordance */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border/60 bg-secondary/30">
                <span className="text-[10px] font-sans font-medium tracking-[0.08em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">Voir le profil</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-background border border-border">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      {drawerProfile && (
        <ProfileDrawer profile={drawerProfile} onClose={() => setDrawerProfile(null)} />
      )}
    </div>
  );
};

// ── PROFILE DRAWER ──
// Mirrors the structure of Step6Review (cabinet preview mode) so that the recap
// view and the cabinet-side drawer share the exact same section layout & ordering.
const DrawerDataRow = ({ label, value }: { label: string; value?: string | null }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-sans font-semibold mb-1">{label}</p>
      <p className="text-[13px] font-sans text-foreground leading-snug">{value}</p>
    </div>
  );
};

const DrawerSection = ({ title, children, first }: { title: string; children: React.ReactNode; first?: boolean }) => (
  <section className={cn('py-5', !first && 'border-t border-border')}>
    <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-sans font-semibold mb-4">{title}</p>
    {children}
  </section>
);

const ProfileDrawer = ({ profile: p, onClose }: { profile: CabinetProfile; onClose: () => void }) => {
  const status = getStatusLabel(p);
  const seniorityLabel = getSeniorityLabel(p);
  const senDetail = status === 'Collaborateur' ? seniorityLabel : null;
  const natLabel = getNatLabel(p.nat);
  const chambers = isChambersRanked(p);
  const legal500 = isLegal500Ranked(p);
  const isActive = p.statutEcoute === 'actif' || p.disponibilite === 'Immédiate';

  // Coherent activity & retro overrides
  const coherent = getCoherentActivity(p);
  const splitData = coherent.split;
  const positioningLabel = coherent.positioning;
  const clienteleLabel = coherent.clientele;
  const suggestedRetro = getSuggestedRetro(p);

  // Mock priorities (mirrors Projet → Priorités in Step6Review)
  const mockPriorities = p.motivation?.includes('autonomie')
    ? ['Responsabilité et autonomie', 'Qualité du management', 'Pratique et dossiers']
    : p.motivation?.includes('rémunération') || p.motivation?.includes('Rémunération')
    ? ['Rémunération', 'Perspectives', 'Équilibre pro/perso']
    : ['Rémunération', 'Responsabilité et autonomie', 'Flexibilité et organisation'];

  // Chambers band display (mirrors Step6Review grouping logic)
  const chambersDisplay = chambers
    ? `${p.originTier === 'Tier 1' ? 'Band 1/Band 2' : p.originTier === 'Tier 2' ? 'Band 2/Band 3' : 'Band 3/Band 4'} — ${p.deptLabel}`
    : legal500 ? 'Classé (hors pratique)' : 'Non classé';

  return (
    <>
      <div className="fixed inset-0 bg-foreground/30 z-[399]" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[500px] bg-background shadow-2xl z-[400] overflow-y-auto border-l border-border">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <span className="text-[12px] font-bold tracking-[0.06em] uppercase text-foreground font-sans">
            Profil anonyme
          </span>
          <button onClick={onClose} className="bg-secondary rounded-full w-7 h-7 flex items-center justify-center hover:bg-border">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6">
          {/* 1. Profil anonymisé */}
          <DrawerSection title="Profil anonymisé" first>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-foreground/15 to-foreground/[0.04] border border-border flex items-center justify-center">
                <User className="w-7 h-7 text-foreground/40" />
              </div>
              <div>
                <p className="font-serif text-lg text-foreground">Profil anonyme</p>
                <p className="text-[11px] text-muted-foreground font-sans mt-0.5">{p.id} · {status}{senDetail ? ` — ${senDetail}` : ''} · {p.pqe}</p>
                {(chambers || legal500) && (
                  <div className="flex items-center gap-3 mt-1.5">
                    {chambers && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground">
                        <Award className="w-3 h-3" strokeWidth={1.6} /> Chambers
                      </span>
                    )}
                    {legal500 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-foreground">
                        <BookMarked className="w-3 h-3" strokeWidth={1.6} /> Legal 500
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <DrawerDataRow label="Pratique" value={p.deptLabel} />
              <DrawerDataRow label="Cabinet d'origine" value={`Cabinet ${natLabel.toLowerCase()}`} />
              <div className="col-span-2">
                <DrawerDataRow label="Chambers" value={chambersDisplay} />
              </div>
            </div>
          </DrawerSection>

          {/* 2. Rémunération */}
          <DrawerSection title="Rémunération">
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <DrawerDataRow label="Rétrocession actuelle" value={p.retro_actuel} />
              <DrawerDataRow label="Rétrocession suggérée Logan" value={suggestedRetro} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 font-sans font-light">
              Recommandation alignée sur la séniorité et le marché.
            </p>
          </DrawerSection>

          {/* 3. Activité */}
          {Object.keys(splitData).length > 0 && (
            <DrawerSection title="Activité">
              <div className="flex items-start gap-5 mb-4">
                <div className="flex-shrink-0">
                  <ActivityPieChart
                    data={splitData}
                    size={130}
                    innerRadius={30}
                    outerRadius={56}
                    showLegend={false}
                    customColors={EXPLORE_PIE_PALETTE}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  {Object.entries(splitData).map(([name, value], i) => (
                    <div key={name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: EXPLORE_PIE_PALETTE[i % EXPLORE_PIE_PALETTE.length] }} />
                      <span className="text-[11px] font-sans text-foreground flex-1">{name}</span>
                      <span className="text-[11px] font-sans font-bold text-foreground">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 pt-3 border-t border-border">
                <DrawerDataRow label="Positionnement" value={positioningLabel} />
                <DrawerDataRow label="Clientèle" value={clienteleLabel} />
                <DrawerDataRow label="Anglais" value={p.english} />
                {p.langue2 && p.langue2 !== '—' && <DrawerDataRow label="Autre langue" value={p.langue2} />}
              </div>
            </DrawerSection>
          )}

          {/* 4. Projet */}
          <DrawerSection title="Projet">
            <div className="space-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-sans font-semibold mb-2">Priorités</p>
                <div className="flex flex-wrap gap-1.5">
                  {mockPriorities.map((priority) => (
                    <span key={priority} className="text-[10px] font-sans font-semibold px-3 py-1 rounded-full bg-foreground text-background tracking-wide">
                      {priority}
                    </span>
                  ))}
                </div>
              </div>
              {p.motivation && (
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground font-sans font-semibold mb-1.5">Motivation</p>
                  <p className="text-[12.5px] font-sans font-light text-foreground leading-relaxed">{p.motivation}</p>
                </div>
              )}
            </div>
          </DrawerSection>

          {/* 5. Statut */}
          <DrawerSection title="Statut">
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-sans font-semibold mb-1">Écoute</p>
                <p className={cn(
                  'text-[13px] font-sans inline-flex items-center gap-2',
                  isActive ? 'text-emerald-600 font-semibold' : 'text-foreground'
                )}>
                  {isActive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  )}
                  {isActive ? 'En recherche active' : "À l'écoute"}
                </p>
              </div>
              <DrawerDataRow label="Disponibilité" value={p.disponibilite} />
              
            </div>
          </DrawerSection>

          {/* Footer note */}
          <div className="pt-2 pb-4">
            <p className="text-[10px] font-sans font-light text-muted-foreground">
              Non visible : nom, prénom, email, téléphone, nom du cabinet actuel.
            </p>
          </div>

          {/* CTA */}
          <div className="bg-foreground rounded-md p-5 text-center mb-6">
            <div className="text-sm font-bold text-background mb-1.5">Ce candidat vous intéresse ?</div>
            <p className="text-[11px] text-background/55 mb-4 leading-relaxed">
              Manifestez votre intérêt pour ce candidat, LOGAN se charge du reste pour vous.
            </p>
            <button
              onClick={() => {
                onClose();
                toast.success(`Intérêt transmis à LOGAN pour le profil ${p.id}`);
              }}
              className="w-full py-2.5 bg-background text-foreground font-bold text-xs rounded hover:bg-background/90 transition-colors"
            >
              Ce candidat m'intéresse →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CabinetDashboard;
