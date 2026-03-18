import { useEffect, useState } from 'react';
import { MOCK_PROFILES, MOCK_OFFERS, MOCK_PROCESSES } from '@/lib/adminMockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Clock, User } from 'lucide-react';

interface Booking {
  id: string;
  candidate_name: string;
  candidate_cabinet: string;
  candidate_seniority: string;
  candidate_department: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
}

const AdminKPIs = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('logan_bookings')
        .select('*')
        .order('booking_date', { ascending: true })
        .limit(20) as { data: Booking[] | null };
      if (data) setBookings(data);
    };
    fetchBookings();

    const channel = supabase
      .channel('logan_bookings_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logan_bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const newThisMonth = MOCK_PROFILES.filter((p) => p.createdAt >= '2026-03-01').length;
  const activeOffers = MOCK_OFFERS.filter((o) => o.status === 'active').length;
  const activeProcesses = MOCK_PROCESSES.filter((p) => p.stage !== 'placé' && p.stage !== 'abandonné').length;
  const placed = MOCK_PROCESSES.filter((p) => p.stage === 'placé').length;

  const deptData = ['M&A', 'Private Equity', 'Financement', 'Fiscal', 'Droit Social'].map((d) => ({
    dept: d,
    candidats: MOCK_PROFILES.filter((p) => p.dept === d).length,
    offres: MOCK_OFFERS.filter((o) => o.dept === d).length,
  }));

  const statusData = [
    { name: 'Nouveaux', value: MOCK_PROFILES.filter((p) => p.status === 'nouveau').length },
    { name: 'Qualifiés', value: MOCK_PROFILES.filter((p) => p.status === 'qualifié').length },
    { name: 'En process', value: MOCK_PROFILES.filter((p) => p.status === 'en_process').length },
    { name: 'Placés', value: MOCK_PROFILES.filter((p) => p.status === 'placé').length },
    { name: 'Inactifs', value: MOCK_PROFILES.filter((p) => p.status === 'inactif').length },
  ].filter((d) => d.value > 0);

  const PIE_COLORS = ['hsl(222,44%,11%)', 'hsl(222,35%,25%)', 'hsl(220,20%,40%)', 'hsl(220,15%,55%)', 'hsl(220,12%,70%)'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">Vue d'ensemble de l'activité Logan</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Profils inscrits', value: MOCK_PROFILES.length, sub: `+${newThisMonth} ce mois` },
          { label: 'Offres actives', value: activeOffers, sub: `${MOCK_OFFERS.length} total` },
          { label: 'Processus en cours', value: activeProcesses, sub: `${placed} placement(s)` },
          { label: 'Taux de conversion', value: `${Math.round((placed / Math.max(MOCK_PROCESSES.length, 1)) * 100)}%`, sub: 'placés / processus' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-background border border-border rounded-lg p-5">
            <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-2">{kpi.label}</div>
            <div className="font-serif text-3xl font-bold text-foreground">{kpi.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Agenda — RDV candidats */}
      <div className="bg-background border border-border rounded-lg p-5 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
          <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground">Agenda — Rendez-vous candidats</div>
        </div>
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground font-light py-6 text-center">Aucun rendez-vous programmé pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-4 rounded-md border border-border bg-card hover:shadow-sm transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{b.candidate_name}</p>
                  <p className="text-xs text-muted-foreground font-light">
                    {b.candidate_cabinet && `${b.candidate_cabinet} · `}{b.candidate_department}
                  </p>
                  {b.candidate_seniority && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">{b.candidate_seniority}</p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                    <CalendarIcon className="w-3 h-3" />
                    {new Date(b.booking_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                    <Clock className="w-3 h-3" />
                    {b.booking_time}
                  </div>
                </div>
                <span className="text-[9px] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm bg-primary text-primary-foreground">
                  {b.status === 'confirmed' ? 'Confirmé' : b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background border border-border rounded-lg p-5">
          <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-4">Répartition par département</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deptData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis dataKey="dept" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="candidats" fill="hsl(222,44%,11%)" radius={[3, 3, 0, 0]} name="Candidats" />
              <Bar dataKey="offres" fill="hsl(220,20%,40%)" radius={[3, 3, 0, 0]} name="Offres" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-background border border-border rounded-lg p-5">
          <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground mb-4">Statut des candidats</div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name">
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {statusData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-[10px] text-muted-foreground">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminKPIs;
