import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Phone, CheckCircle2, Clock, MessageSquare, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

interface CandidateBookingProps {
  userType?: 'candidat' | 'cabinet';
}

const CandidateBooking = ({ userType = 'candidat' }: CandidateBookingProps) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    try {
      const bookingDate = format(selectedDate, 'yyyy-MM-dd');

      let candidateName = user?.email || '';
      let candidateCabinet = '';
      let candidateDepartment = '';

      if (user) {
        if (userType === 'candidat') {
          const { data } = await supabase
            .from('candidate_registrations')
            .select('submission_data')
            .eq('user_id', user.id)
            .single();
          if (data?.submission_data) {
            const d = data.submission_data as any;
            candidateName = `${d.prenom || ''} ${d.nom || ''}`.trim() || candidateName;
            candidateCabinet = d.cabinet || '';
            candidateDepartment = d.departement || '';
          }
        } else {
          const { data } = await supabase
            .from('cabinet_accounts')
            .select('cabinet_name')
            .eq('user_id', user.id)
            .single();
          if (data) {
            candidateName = data.cabinet_name || candidateName;
            candidateCabinet = data.cabinet_name || '';
          }
        }
      }

      const { error } = await supabase.from('logan_bookings').insert({
        candidate_name: candidateName,
        candidate_email: user?.email || '',
        candidate_cabinet: candidateCabinet,
        candidate_department: candidateDepartment,
        candidate_seniority: '',
        booking_date: bookingDate,
        booking_time: selectedSlot,
        user_id: user?.id || null,
        status: 'confirmed',
        notes: userType === 'cabinet' ? 'RDV depuis espace cabinet' : 'RDV depuis espace candidat',
      } as any);

      if (error) throw error;

      supabase.functions.invoke('notify-booking', {
        body: {
          name: candidateName,
          email: user?.email || '',
          cabinet: candidateCabinet,
          date: format(selectedDate, 'dd/MM/yyyy'),
          time: selectedSlot,
          source: userType,
        },
      }).catch(() => {});

      setConfirmed(true);
      toast.success('Créneau réservé avec succès.');
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = selectedDate
    ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })
    : null;

  if (confirmed) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Fixer un call</p>
          <div className="w-8 h-px bg-foreground" />
        </div>
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="bg-[hsl(0,0%,10%)] px-8 py-10 text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-6 h-6 text-white/70" />
            </div>
            <p className="font-serif text-[22px] text-white font-light mb-2">Créneau confirmé</p>
            <p className="text-[13px] font-sans text-white/55">
              {formattedDate} à {selectedSlot}
            </p>
          </div>
          <div className="px-8 py-6 text-center">
            <p className="text-[12px] font-sans text-muted-foreground leading-relaxed mb-6">
              Votre consultant Logan vous contactera à l'heure convenue au numéro associé à votre compte.
            </p>
            <button
              onClick={() => { setConfirmed(false); setSelectedDate(undefined); setSelectedSlot(null); }}
              className="text-[11px] font-sans text-muted-foreground hover:text-foreground transition-colors border border-border rounded-sm px-4 py-2"
            >
              Modifier le créneau
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Fixer un call</p>
        <div className="w-8 h-px bg-foreground" />
      </div>

      {/* Intro card */}
      <div className="rounded-lg border border-border overflow-hidden mb-8">
        <div className="bg-[hsl(0,0%,10%)] px-7 py-6">
          <Phone className="w-5 h-5 text-white/40 mb-3" />
          <p className="font-serif text-[20px] text-white font-light leading-snug mb-1">
            Un échange avec votre consultant Logan
          </p>
          <p className="text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-white/35">
            30 minutes · Confidentiel
          </p>
        </div>
        <div className="bg-background px-7 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Clock, label: 'Stratégie de carrière', desc: 'Positionnement, timing, ambitions' },
              { icon: MessageSquare, label: 'Préparation entretiens', desc: 'Coaching, simulations, debriefs' },
              { icon: Phone, label: 'Analyse du marché', desc: 'Opportunités, cabinets, tendances' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-sm bg-foreground/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-foreground/50" />
                </div>
                <div>
                  <p className="text-[11px] font-sans font-medium text-foreground leading-tight">{label}</p>
                  <p className="text-[10px] font-sans text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Calendar */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <p className="text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-muted-foreground">
              Choisir une date
            </p>
          </div>
          <div className="p-4 flex justify-center bg-card">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => { setSelectedDate(date); setSelectedSlot(null); }}
              disabled={(date) => {
                const day = date.getDay();
                return day === 0 || day === 6 || date < new Date();
              }}
              className="pointer-events-auto"
            />
          </div>
        </div>

        {/* Slots */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <p className="text-[10px] font-sans font-semibold tracking-[0.16em] uppercase text-muted-foreground">
              {selectedDate
                ? format(selectedDate, 'd MMMM', { locale: fr })
                : 'Sélectionnez une date'}
            </p>
          </div>

          {selectedDate ? (
            <div className="p-4 bg-card space-y-1.5">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-2.5 rounded-sm border text-[12px] font-sans transition-all',
                    selectedSlot === slot
                      ? 'bg-foreground text-background border-foreground font-medium'
                      : 'border-border hover:border-foreground/30 hover:bg-foreground/[0.04] text-foreground'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-3 h-3 opacity-40" />
                    {slot}
                  </span>
                  {selectedSlot === slot && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center px-6 bg-card">
              <Phone className="w-6 h-6 text-muted-foreground/30 mb-3" />
              <p className="text-[12px] font-sans text-muted-foreground">
                Choisissez d'abord une date dans le calendrier
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation */}
      {selectedDate && selectedSlot && (
        <div className="mt-5 rounded-lg border border-border bg-[hsl(0,0%,10%)] px-6 py-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-sans text-white/50 mb-0.5">Créneau sélectionné</p>
            <p className="text-[14px] font-sans font-medium text-white">
              {formattedDate} · {selectedSlot}
            </p>
          </div>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-shrink-0 px-6 py-2.5 bg-white text-[hsl(0,0%,7%)] text-[11.5px] font-sans font-semibold tracking-[0.08em] uppercase rounded-sm hover:bg-white/90 transition-all disabled:opacity-50"
          >
            {submitting ? 'Confirmation…' : 'Confirmer →'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateBooking;
