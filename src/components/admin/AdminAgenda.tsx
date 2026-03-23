import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Clock, User, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_cabinet: string;
  candidate_seniority: string;
  candidate_department: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-primary text-primary-foreground',
  cancelled: 'bg-muted text-muted-foreground',
  completed: 'bg-primary/70 text-primary-foreground',
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  completed: 'Terminé',
};

const AdminAgenda = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    const fetchBookings = async () => {
      const { data } = await supabase
        .from('logan_bookings')
        .select('*')
        .order('booking_date', { ascending: true })
        .order('booking_time', { ascending: true }) as { data: Booking[] | null };
      if (data) setBookings(data);
    };
    fetchBookings();

    const channel = supabase
      .channel('admin_agenda_bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'logan_bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filtered = bookings.filter(b => {
    if (filter === 'upcoming') return b.booking_date >= today;
    if (filter === 'past') return b.booking_date < today;
    return true;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, Booking[]>>((acc, b) => {
    if (!acc[b.booking_date]) acc[b.booking_date] = [];
    acc[b.booking_date].push(b);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) =>
    filter === 'past' ? b.localeCompare(a) : a.localeCompare(b)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Agenda</h1>
        <p className="text-sm text-muted-foreground mt-1">Tous les rendez-vous pris sur Logan par les candidats et cabinets.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['upcoming', 'past', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'text-[10px] font-semibold px-3 py-1.5 border rounded-full transition-all',
              filter === f
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground'
            )}
          >
            {f === 'upcoming' ? 'À venir' : f === 'past' ? 'Passés' : 'Tous'}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} rendez-vous</span>
      </div>

      {/* Timeline */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Aucun rendez-vous {filter === 'upcoming' ? 'à venir' : filter === 'past' ? 'passé' : ''}.</div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold tracking-[0.08em] uppercase text-muted-foreground">
                  {new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="text-[10px] text-muted-foreground">({grouped[date].length})</span>
              </div>
              <div className="space-y-2 ml-7">
                {grouped[date].map(b => (
                  <div key={b.id} className="border border-border rounded-lg p-4 bg-background hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{b.candidate_name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {b.candidate_cabinet && `${b.candidate_cabinet} · `}{b.candidate_department}
                            {b.candidate_seniority && ` · ${b.candidate_seniority}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                            <Clock className="w-3 h-3" />
                            {b.booking_time}
                          </div>
                        </div>
                        <span className={cn(
                          'text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm',
                          STATUS_COLORS[b.status] || 'bg-secondary text-foreground'
                        )}>
                          {STATUS_LABELS[b.status] || b.status}
                        </span>
                      </div>
                    </div>
                    {b.candidate_email && (
                      <div className="mt-2 ml-[52px] flex items-center gap-3 text-[11px] text-muted-foreground">
                        <Mail className="w-3 h-3" /> {b.candidate_email}
                      </div>
                    )}
                    {b.notes && (
                      <div className="mt-2 ml-[52px] text-[11px] text-muted-foreground italic">
                        {b.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAgenda;
