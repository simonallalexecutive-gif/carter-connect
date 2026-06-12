import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

type Stats = {
  candidatesApproved: number;
  candidatesPending: number;
  cabinetsTotal: number;
  interestsTotal: number;
};

type RecentCandidate = {
  id: string;
  full_name: string;
  dept: string;
  cabinet: string;
  approved_at: string;
};

type RecentSearch = {
  id: string;
  cabinet_name: string;
  dept: string;
  created_at: string;
};

type RecentInterest = {
  id: string;
  cabinet_name: string;
  candidate_name: string;
  created_at: string;
  logan_validated: boolean;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

const AdminKPIs = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentCandidates, setRecentCandidates] = useState<RecentCandidate[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [recentInterests, setRecentInterests] = useState<RecentInterest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [
        { count: approved },
        { count: pending },
        { count: cabinets },
        { count: interests },
        { data: lastCandidates },
        { data: lastSearches },
        { data: lastInterests },
      ] = await Promise.all([
        supabase.from('candidate_registrations').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('candidate_registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending_admin_approval'),
        supabase.from('cabinet_accounts').select('*', { count: 'exact', head: true }),
        supabase.from('cabinet_candidate_interests').select('*', { count: 'exact', head: true }),
        supabase.from('candidate_registrations')
          .select('id, submission_data, updated_at')
          .eq('status', 'approved')
          .order('updated_at', { ascending: false })
          .limit(5),
        supabase.from('cabinet_accounts')
          .select('id, cabinet_name, submission_data, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('cabinet_candidate_interests')
          .select(`id, created_at, logan_validated, cabinet_accounts!cabinet_account_id(cabinet_name), candidate_registrations!candidate_user_id(submission_data)`)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setStats({
        candidatesApproved: approved || 0,
        candidatesPending: pending || 0,
        cabinetsTotal: cabinets || 0,
        interestsTotal: interests || 0,
      });

      setRecentCandidates(
        (lastCandidates || []).map((r: any) => ({
          id: r.id,
          full_name: `${r.submission_data?.prenom || ''} ${r.submission_data?.nom || ''}`.trim() || '—',
          dept: r.submission_data?.departement || '—',
          cabinet: r.submission_data?.cabinet || '—',
          approved_at: r.updated_at,
        }))
      );

      setRecentSearches(
        (lastSearches || []).map((r: any) => {
          const searches = Array.isArray(r.submission_data?.searches) ? r.submission_data.searches : [];
          const lastSearch = searches[searches.length - 1];
          return {
            id: r.id,
            cabinet_name: r.cabinet_name || '—',
            dept: lastSearch?.departement || lastSearch?.dept || '—',
            created_at: r.created_at,
          };
        }).filter((r: any) => r.dept !== '—')
      );

      setRecentInterests(
        (lastInterests || []).map((r: any) => {
          const cab = r.cabinet_accounts || {};
          const cand = r.candidate_registrations || {};
          const sd = cand.submission_data || {};
          return {
            id: r.id,
            cabinet_name: cab.cabinet_name || '—',
            candidate_name: `${sd.prenom || ''} ${sd.nom || ''}`.trim() || 'Profil anonyme',
            created_at: r.created_at,
            logan_validated: r.logan_validated,
          };
        })
      );

      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement…
      </div>
    );
  }

  const kpis = [
    { label: 'Candidats validés', value: stats?.candidatesApproved ?? 0 },
    { label: 'En attente de validation', value: stats?.candidatesPending ?? 0 },
    { label: 'Cabinets inscrits', value: stats?.cabinetsTotal ?? 0 },
    { label: 'Intérêts manifestés', value: stats?.interestsTotal ?? 0 },
  ];

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-2xl font-normal text-foreground mb-1">Tableau de bord</h1>
        <p className="text-xs text-muted-foreground">Activité Logan en temps réel</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-10">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-background px-6 py-5">
            <div className="font-serif text-3xl font-normal text-foreground mb-2">{kpi.value}</div>
            <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground leading-tight">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Derniers candidats validés */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">Derniers candidats validés</p>
          </div>
          {recentCandidates.length === 0 ? (
            <p className="px-5 py-6 text-xs text-muted-foreground">Aucun candidat validé.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentCandidates.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">{c.full_name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{c.dept} · {c.cabinet}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-4">{formatDate(c.approved_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Derniers intérêts cabinets */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">Derniers intérêts cabinets</p>
          </div>
          {recentInterests.length === 0 ? (
            <p className="px-5 py-6 text-xs text-muted-foreground">Aucun intérêt enregistré.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentInterests.map((r) => (
                <li key={r.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">{r.cabinet_name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">→ {r.candidate_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-4 flex-shrink-0">
                    <span className="text-[10px] text-muted-foreground">{formatDate(r.created_at)}</span>
                    {r.logan_validated ? (
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-green-600">Traité</span>
                    ) : (
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-orange-500">À traiter</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Derniers cabinets inscrits */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">Derniers cabinets inscrits</p>
        </div>
        {recentSearches.length === 0 ? (
          <p className="px-5 py-6 text-xs text-muted-foreground">Aucun cabinet récent.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recentSearches.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <p className="text-[12px] font-semibold text-foreground">{s.cabinet_name}</p>
                <span className="text-[10px] text-muted-foreground">{formatDate(s.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminKPIs;
