import { useState, useMemo } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { PROFILES, SPLIT_COLORS, DEPT_KEY_MAP, type CabinetProfile } from '@/lib/cabinetConstants';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const PALIER_MAP: Record<string, string> = {
  essentiel: 'Essentiel · 8 000€/an',
  standard: 'Standard · 15 000€/an',
  premium: 'Premium · 25 000€/an',
};

const FILTERS = [
  { key: 'all', label: 'Tous' },
  { key: 'ma', label: 'M&A' },
  { key: 'pe', label: 'Private Equity' },
  { key: 'banque', label: 'Banque & Finance' },
  { key: 'social', label: 'Droit Social' },
  { key: 'fiscal', label: 'Fiscal' },
  { key: 'new', label: '✦ New' },
];

const CabinetStep7Espace = () => {
  const s = useCabinetStore();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('date');
  const [drawerProfile, setDrawerProfile] = useState<CabinetProfile | null>(null);

  const getMatch = (p: CabinetProfile) => {
    let score = p.match;
    if (s.depts.length) {
      const keys = s.depts.map((d) => DEPT_KEY_MAP[d]).filter(Boolean);
      if (keys.includes(p.dept)) score = Math.min(99, score + 5);
    }
    return score;
  };

  const filtered = useMemo(() => {
    let profiles = [...PROFILES];
    if (filter === 'new') profiles = profiles.filter((p) => p.isNew);
    else if (filter !== 'all') profiles = profiles.filter((p) => p.dept === filter);
    if (sort === 'pqe') profiles.sort((a, b) => parseInt(b.pqe) - parseInt(a.pqe));
    else if (sort === 'match') profiles.sort((a, b) => getMatch(b) - getMatch(a));
    return profiles;
  }, [filter, sort, s.depts]);

  return (
    <div>
      {/* Dashboard header */}
      <div className="bg-foreground rounded-lg p-6 mb-7 flex items-center justify-between">
        <div>
          <div className="text-[9px] tracking-[0.18em] uppercase text-white/35 mb-1.5">Espace membre · Accès en cours de validation</div>
          <div className="font-sans text-xl font-bold text-white">{s.cabinetName || 'Mon cabinet'}</div>
          <div className="flex items-center gap-2.5 mt-1.5">
            <span className="text-[11px] text-white/45">{s.typeCab || '—'}</span>
            {s.ranking && (
              <span className="text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 bg-white text-foreground rounded-sm">{s.ranking}</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="bg-white/[0.07] border border-white/[0.1] rounded px-3.5 py-2 mb-1.5">
            <div className="text-[9px] text-white/35 tracking-[0.1em] uppercase mb-0.5">Abonnement</div>
            <div className="text-sm font-bold text-white">{PALIER_MAP[s.palier] || 'Standard'}</div>
          </div>
          <div className="text-[10px] text-white/25">0% commission · Profils anonymisés</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-7">
        {[
          { value: PROFILES.length, label: 'Profils disponibles' },
          { value: PROFILES.filter((p) => p.isNew).length, label: 'Nouveaux ce mois' },
          { value: 0, label: 'Mises en relation' },
          { value: '0%', label: 'Commission prélevée', highlight: true },
        ].map((stat) => (
          <div key={stat.label} className={cn('rounded-md p-4 border', stat.highlight ? 'bg-secondary border-border' : 'bg-background border-border')}>
            <div className="font-sans text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 tracking-[0.04em]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        <span className="text-[11px] font-semibold text-foreground mr-1">Filtrer :</span>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'text-[10px] font-semibold px-3 py-1.5 border rounded-full transition-all font-sans',
              filter === f.key
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
            )}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">Trier par :</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-[11px] border border-border rounded px-2 py-1 bg-background text-foreground font-sans cursor-pointer"
          >
            <option value="date">Plus récents</option>
            <option value="pqe">Expérience</option>
            <option value="match">Matching</option>
          </select>
        </div>
      </div>

      {/* Profiles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const match = getMatch(p);
          return (
            <div
              key={p.id}
              onClick={() => setDrawerProfile(p)}
              className="rounded-lg border border-white/[0.08] p-5 cursor-pointer transition-all hover:border-white/25 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden"
              style={{ background: '#111111' }}
            >
              {p.isNew && (
                <span className="absolute top-3 right-3 text-[7px] font-bold tracking-[0.12em] uppercase bg-white text-black px-2 py-0.5 rounded-sm">
                  NOUVEAU
                </span>
              )}
              <div className="text-[9px] text-white/40 tracking-[0.08em] mb-3 font-sans">ID LOGAN · {p.id}</div>
              <div className="font-sans text-base font-bold text-white mb-1.5 leading-tight">{p.title}</div>
              <div className="text-[11px] text-white/50 mb-3.5">{p.origin} · {p.natFlag} · Droit applicable : Paris</div>
              <div className="flex flex-wrap gap-1 mb-3.5">
                <span className="text-[9px] font-semibold tracking-[0.05em] uppercase px-2 py-0.5 rounded-sm bg-white text-black">{p.deptLabel}</span>
                <span className="text-[9px] font-semibold tracking-[0.05em] uppercase px-2 py-0.5 rounded-sm border border-white/20 text-white/80">{p.pqe} PQE</span>
                <span className="text-[9px] font-semibold tracking-[0.05em] uppercase px-2 py-0.5 rounded-sm border border-white/20 text-white/80">{p.natFlag} {p.nat}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-white/[0.1] pt-3 mt-0.5">
                <div><div className="text-[8px] text-white/35 uppercase tracking-[0.08em]">Anglais</div><div className="text-[11px] font-semibold text-white/90">{p.english}</div></div>
                <div><div className="text-[8px] text-white/35 uppercase tracking-[0.08em]">Disponibilité</div><div className="text-[11px] font-semibold text-white/90">{p.disponibilite}</div></div>
                <div><div className="text-[8px] text-white/35 uppercase tracking-[0.08em]">Mobilité</div><div className="text-[11px] font-semibold text-white/90">{p.mobilite}</div></div>
                <div><div className="text-[8px] text-white/35 uppercase tracking-[0.08em]">Matching</div><div className="text-[11px] font-semibold text-white/90">{match}%</div></div>
              </div>
              {/* Match bar */}
              <div className="h-[3px] bg-white/[0.1] mt-3.5 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${match}%` }} />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-sm">Aucun profil ne correspond à ce filtre pour le moment.</div>
        )}
      </div>

      {/* Profile drawer */}
      {drawerProfile && (
        <>
          <div className="fixed inset-0 bg-foreground/30 z-[399]" onClick={() => setDrawerProfile(null)} />
          <div className="fixed top-0 right-0 bottom-0 w-[480px] bg-background shadow-2xl z-[400] overflow-y-auto border-l border-border">
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
              <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-foreground">Fiche candidat anonymisée</span>
              <button onClick={() => setDrawerProfile(null)} className="bg-secondary rounded-full w-7 h-7 flex items-center justify-center text-foreground hover:bg-border">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              {/* Header card */}
              <div className="bg-foreground rounded-md p-4 mb-5">
                <div className="text-[9px] tracking-[0.12em] uppercase text-white/30 mb-1.5">{drawerProfile.id}</div>
                <div className="font-sans text-lg font-bold text-white mb-1">{drawerProfile.title}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-bold tracking-[0.06em] px-2 py-0.5 bg-white text-foreground rounded-sm">{drawerProfile.deptLabel}</span>
                  <span className="text-[11px] text-white/45">{drawerProfile.natFlag} {drawerProfile.origin}</span>
                </div>
                <div className="mt-2.5">
                  <div className="text-[9px] text-white/30 mb-1">Score de correspondance</div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${getMatch(drawerProfile)}%` }} />
                    </div>
                    <span className="text-sm font-bold text-white">{getMatch(drawerProfile)}%</span>
                  </div>
                </div>
              </div>

              {/* Sections */}
              <DrawerSection title="Parcours & formation">
                <KV k="Expérience" v={`${drawerProfile.pqe} PQE · ${drawerProfile.seniority}`} />
                <KV k="Formation" v={drawerProfile.formation} />
                <KV k="Droit étranger" v={drawerProfile.droit_etranger} />
                <KV k="Origine" v={`${drawerProfile.natFlag} ${drawerProfile.origin}`} />
              </DrawerSection>

              <DrawerSection title="Expertises & répartition">
                <div className="flex flex-wrap gap-1 mb-3">
                  {drawerProfile.expertise.map((e) => (
                    <span key={e} className="text-[9px] font-semibold tracking-[0.05em] px-2.5 py-1 rounded-sm bg-secondary text-foreground">{e}</span>
                  ))}
                </div>
                {drawerProfile.expertise.length > 1 && (
                  <div>
                    <div className="h-1.5 rounded overflow-hidden flex mb-3">
                      {Object.entries(drawerProfile.split).map(([, v], i) => (
                        <div key={i} style={{ width: `${v}%`, background: i % 2 === 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }} />
                      ))}
                    </div>
                    {Object.entries(drawerProfile.split).map(([k, v], i) => (
                      <div key={k} className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] text-muted-foreground border-l-[3px] pl-1.5" style={{ borderColor: i % 2 === 0 ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}>{k}</span>
                        <span className="text-xs font-bold text-foreground">{v}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </DrawerSection>

              <DrawerSection title="Langues & mobilité">
                <KV k="Anglais" v={drawerProfile.english} />
                {drawerProfile.langue2 && drawerProfile.langue2 !== '—' && <KV k="Autre langue" v={drawerProfile.langue2} />}
                <KV k="Mobilité" v={drawerProfile.mobilite} />
                <KV k="Disponibilité" v={drawerProfile.disponibilite} />
              </DrawerSection>

              <DrawerSection title="Rémunération actuelle (indicatif)">
                <KV k="Package actuel" v={drawerProfile.retro_actuel} />
                <p className="text-[10px] text-muted-foreground mt-1.5 italic">Les informations de rémunération sont fournies à titre indicatif.</p>
              </DrawerSection>

              <DrawerSection title="Motivation & projet">
                <div className="bg-secondary border-l-[3px] border-foreground p-3 rounded-r text-xs text-foreground leading-relaxed italic">
                  {drawerProfile.motivation}
                </div>
              </DrawerSection>

              {/* CTA */}
              <div className="bg-foreground rounded-md p-4 text-center mt-2">
                <div className="text-sm font-bold text-white mb-1.5">Ce profil vous intéresse ?</div>
                <p className="text-[11px] text-white/45 mb-3.5 leading-relaxed">LOGAN qualifie l'opportunité des deux côtés avant toute mise en relation.</p>
                <button
                  onClick={() => {
                    setDrawerProfile(null);
                    toast.success(`Intérêt transmis à LOGAN pour le profil ${drawerProfile.id}`);
                  }}
                  className="w-full py-2.5 bg-white text-foreground font-bold text-xs rounded tracking-[0.03em] hover:bg-white/90 transition-colors"
                >
                  Exprimer mon intérêt →
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const DrawerSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-5 pb-5 border-b border-secondary last:border-b-0">
    <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">{title}</div>
    {children}
  </div>
);

const KV = ({ k, v }: { k: string; v: string }) => (
  <div className="flex justify-between items-baseline mb-1.5">
    <span className="text-[11px] text-muted-foreground">{k}</span>
    <span className="text-xs font-semibold text-foreground text-right max-w-[60%]">{v}</span>
  </div>
);

export default CabinetStep7Espace;
