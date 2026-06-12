import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Eye, Star, Loader2 } from 'lucide-react';
import { DEPT_KEY_MAP, FIRMS_DB, type CabinetProfile } from '@/lib/cabinetConstants';
import AdminCandidateProfileDialog from '@/components/admin/AdminCandidateProfileDialog';
import { Sparkles } from 'lucide-react';

// ── Helpers (miroir de CabinetDashboard) ──────────────────────────────────────

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

const ACTIVITY_KEY_LABELS: Record<string, string> = {
  'ma_pe': 'Private Equity', 'ma_ma': 'M&A', 'ma_vc': 'Venture Capital',
  'fin_obligataire': 'Financement obligataire', 'fin_acq': "Financement d'acquisition",
  'fin_lbo': 'Financement LBO', 'fin_immo': 'Financement immobilier',
  'fin_actifs': "Financement d'actifs", 'fin_titrisation': 'Titrisation',
  'restr_restructuring': 'Restructuring', 'restr_distressed': 'Distressed M&A',
  'restr_contentieux_affaires': 'Contentieux',
  'soc_conseil': 'Conseil', 'soc_contentieux': 'Contentieux',
  'conc_concentrations': 'Contrôle des concentrations',
  'conc_contentieux': 'Contentieux / enquêtes', 'conc_conseil': 'Conseil / compliance',
  'fisc_transac': 'Fiscalité transactionnelle', 'fisc_contentieux': 'Fiscalité contentieuse',
  'fisc_conseil': 'Fiscalité conseil',
  're_conseil': 'Conseil transactionnel', 're_contentieux': 'Contentieux',
  'arb_commercial': 'Arbitrage commercial', 'arb_invest': "Arbitrage d'investissement",
  'proj_infra': 'Infrastructures', 'proj_enr': 'Énergie renouvelable',
};

function registrationToProfile(row: any): CabinetProfile {
  const d = row.submission_data || {};
  const pqeYears = (() => {
    if (!d.sermentMois || !d.sermentAnnee) return 0;
    const now = new Date();
    return now.getFullYear() - d.sermentAnnee + (now.getMonth() + 1 < d.sermentMois ? -1 : 0);
  })();
  const pqeLabel = pqeYears <= 2 ? 'Junior' : pqeYears <= 5 ? 'Mid Level' : pqeYears <= 8 ? 'Senior' : d.statutAssoc === 'associe' ? 'Associé' : d.statutAssoc === 'counsel' ? 'Counsel' : 'Senior';
  const deptKey = DEPT_KEY_MAP[d.departement] || 'ma';
  const firmData = FIRMS_DB[d.cabinet];
  const nat = firmData?.nat || d.cabNat || 'FR';
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
  return {
    id: row.id,
    dept: deptKey,
    deptLabel: d.departement || '—',
    title: `${pqeLabel} — ${d.departement || ''}`,
    pqe: `${pqeYears} ans`,
    nat,
    natFlag: nat,
    origin: d.cabinet || '—',
    originTier: d.cabTier || FIRMS_DB[d.cabinet]?.p?.[deptKey] || '—',
    english: '—',
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
    motivation: d.notaBene || '—',
    match: 90,
    realPositioning: undefined,
    realClientele: d.typesClients?.join(', '),
    statutEcoute: d.statutEcoute,
  };
}

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

function isLegal500Ranked(p: CabinetProfile): boolean {
  return !!(p.originTier && p.originTier.startsWith('Tier'));
}

// ── Component ─────────────────────────────────────────────────────────────────

const AdminApprovedCandidates = () => {
  const [profiles, setProfiles] = useState<CabinetProfile[]>([]);
  const [submissionDataMap, setSubmissionDataMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [legal500Only, setLegal500Only] = useState(false);
  const [seniorityFilter, setSeniorityFilter] = useState('all');
  const [candidateViewData, setCandidateViewData] = useState<{ submissionData: any; id: string; user_id: string; status: string; auth_email: string | null; full_name: string | null } | null>(null);

  useEffect(() => {
    supabase
      .from('candidate_registrations')
      .select('id, user_id, created_at, submission_data')
      .eq('status', 'approved')
      .then(({ data }) => {
        setProfiles((data || []).map(registrationToProfile));
        const map: Record<string, any> = {};
        (data || []).forEach(row => { map[row.id] = { submissionData: row.submission_data, user_id: row.user_id }; });
        setSubmissionDataMap(map);
        setLoading(false);
      });
  }, []);

  const SENIORITY_OPTIONS = ['all', 'Junior', 'Mid Level', 'Senior', 'Counsel', 'Associé'];

  const filtered = useMemo(() => {
    let list = [...profiles];
    if (filter === 'new') list = list.filter(p => p.isNew);
    else if (filter !== 'all') list = list.filter(p => p.dept === filter);
    if (legal500Only) list = list.filter(isLegal500Ranked);
    if (seniorityFilter !== 'all') list = list.filter(p => getSeniorityLabel(p) === seniorityFilter);
    if (sort === 'pqe') list.sort((a, b) => parseInt(b.pqe) - parseInt(a.pqe));
    return list;
  }, [profiles, filter, sort, legal500Only, seniorityFilter]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-normal text-foreground mb-1">Candidats approuvés</h1>
        <p className="text-xs text-muted-foreground">
          {loading ? 'Chargement…' : `${profiles.length} profil${profiles.length > 1 ? 's' : ''} validé${profiles.length > 1 ? 's' : ''}`}
        </p>
      </div>

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
        <button onClick={() => setLegal500Only(v => !v)}
          className={cn('text-[10px] font-medium px-3 py-1.5 border rounded-full transition-all',
            legal500Only ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground'
          )}
        >Legal 500</button>
        <span className="text-[11px] font-semibold text-foreground ml-3 mr-1">Séniorité :</span>
        <select
          value={seniorityFilter}
          onChange={e => setSeniorityFilter(e.target.value)}
          className="text-[11px] border border-border rounded px-2 py-1 bg-background text-foreground cursor-pointer"
        >
          {SENIORITY_OPTIONS.map(o => <option key={o} value={o}>{o === 'all' ? 'Toutes' : o}</option>)}
        </select>
        <div className="ml-auto">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-[11px] border border-border rounded px-2 py-1 bg-background text-foreground cursor-pointer"
          >
            <option value="date">Plus récents</option>
            <option value="pqe">Expérience</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-sm text-muted-foreground">Aucun profil correspondant.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const seniorityLabel = getSeniorityLabel(p);
            const practiceLabel = p.deptLabel || p.dept;
            const legal500 = isLegal500Ranked(p);
            const isActive = p.statutEcoute === 'actif';
            const natLabel = p.nat ? `Cabinet ${getNatLabel(p.nat)}` : '';
            const entry = submissionDataMap[p.id];
            const sd = entry?.submissionData || {};
            const fullName = `${sd.prenom || ''} ${sd.nom || ''}`.trim();

            return (
              <div
                key={p.id}
                onClick={() => {
                  const entry = submissionDataMap[p.id];
                  if (entry) {
                    const sd = entry.submissionData || {};
                    setCandidateViewData({
                      submissionData: sd,
                      id: p.id,
                      user_id: entry.user_id,
                      status: 'approved',
                      auth_email: sd.email || null,
                      full_name: `${sd.prenom || ''} ${sd.nom || ''}`.trim() || null,
                    });
                  }
                }}
                className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-border cursor-pointer flex flex-col"
              >
                {/* Top strip */}
                <div className="flex items-center justify-between px-4 py-3 bg-[hsl(0,0%,9%)]">
                  <span className="text-[9px] tracking-[0.16em] uppercase text-white font-sans font-bold">Statut</span>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-400" />
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-400">Recherche active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/20" />
                      <span className="text-[9px] uppercase tracking-[0.16em] text-white font-bold">À l'écoute</span>
                    </span>
                  )}
                </div>

                {/* Corps */}
                <div className="px-5 py-5 flex-1 flex flex-col bg-card gap-4">
                  <div>
                    {p.isNew && (
                      <span className="inline-flex items-center text-[8px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-1.5">
                        <Star className="w-2.5 h-2.5 mr-1 fill-foreground/70" strokeWidth={0} />
                        new
                      </span>
                    )}
                    {fullName && (
                      <div className="text-[17px] font-sans font-medium text-foreground leading-tight mb-0.5">{fullName}</div>
                    )}
                    <div className="text-[12px] font-sans font-normal text-muted-foreground leading-tight">{seniorityLabel}</div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-sans font-medium text-foreground leading-none border border-foreground/20 rounded-full px-2.5 py-1">{practiceLabel}</span>
                    {natLabel && <span className="text-[10px] font-sans font-medium text-foreground/70 leading-none border border-border rounded-full px-2.5 py-1">{natLabel}</span>}
                    {legal500 && <span className="text-[10px] font-sans font-medium text-foreground/70 leading-none border border-border rounded-full px-2.5 py-1">Legal 500</span>}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 bg-[hsl(0,0%,9%)]">
                  <span className="text-[10px] font-sans font-bold tracking-[0.12em] uppercase text-white group-hover:text-white/80 transition-colors">Voir le profil</span>
                  <Eye className="w-3.5 h-3.5 text-white group-hover:text-white/70 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminCandidateProfileDialog
        open={!!candidateViewData}
        onOpenChange={(o) => { if (!o) setCandidateViewData(null); }}
        candidate={candidateViewData ? {
          id: candidateViewData.id,
          user_id: candidateViewData.user_id,
          status: candidateViewData.status,
          submission_data: candidateViewData.submissionData,
          auth_email: candidateViewData.auth_email,
          full_name: candidateViewData.full_name,
        } : null}
      />
    </div>
  );
};

export default AdminApprovedCandidates;
