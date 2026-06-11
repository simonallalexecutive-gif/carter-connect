import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CheckCircle2, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CABINETS } from '@/lib/constants';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const FirmBookingPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'contact' | 'slot' | 'done'>('contact');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cabinet, setCabinet] = useState('');
  const [cabinetSearch, setCabinetSearch] = useState('');
  const [cabinetOpen, setCabinetOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredCabinets = CABINETS.filter(c =>
    c.toLowerCase().includes(cabinetSearch.toLowerCase())
  );

  const isContactValid = firstName.trim() && lastName.trim() && cabinet.trim();

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('logan_bookings').insert({
        candidate_name: `${firstName} ${lastName}`.trim(),
        candidate_email: '',
        candidate_cabinet: cabinet,
        candidate_department: '',
        candidate_seniority: '',
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedSlot,
        user_id: null,
        status: 'confirmed',
        notes: `RDV cabinet depuis /acces-cabinet`,
      } as any);
      if (error) throw error;
      supabase.functions.invoke('notify-booking', {
        body: {
          name: `${firstName} ${lastName}`.trim(),
          email: '',
          cabinet,
          date: format(selectedDate, 'dd/MM/yyyy'),
          time: selectedSlot,
          source: 'acces-cabinet',
        },
      }).catch(() => {});
      setStep('done');
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-black/[0.04] border border-black/15 text-black placeholder:text-black/30 rounded-sm px-3.5 py-3 text-sm focus:border-black/50 focus:outline-none transition-colors';
  const labelCls = 'text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-black/50 mb-1.5 block';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header minimal */}
      <header className="px-8 h-16 flex items-center justify-between">
        <button onClick={() => navigate('/acces-cabinet')} className="font-serif text-[28px] tracking-[0.04em] text-black hover:opacity-60 transition-opacity">
          Logan
        </button>
        <button onClick={() => navigate('/acces-cabinet')} className="text-black/40 hover:text-black font-sans text-[12px] tracking-wide transition-colors">
          ← Retour
        </button>
      </header>

      <main className="flex-1 flex items-start justify-center px-6 py-16">
        <div className="w-full max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-black/40 mb-5">Fixer un échange</p>
            <h1 className="font-serif font-[300] text-[2rem] sm:text-[2.6rem] text-black leading-[1.1] mb-2">
              Prendre rendez-vous.
            </h1>
            <p className="text-black/50 font-sans font-light text-[0.88rem] leading-relaxed mb-12">
              Un échange de 30 minutes avec votre consultant Logan.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">

            {/* Étape 1 — Coordonnées */}
            {step === 'contact' && (
              <motion.div key="contact" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Prénom</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jean" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Nom</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dupont" className={inputCls} />
                  </div>
                </div>

                {/* Cabinet autocomplete */}
                <div className="relative">
                  <label className={labelCls}>Cabinet</label>
                  <input
                    value={cabinetOpen ? cabinetSearch : cabinet}
                    onChange={e => { setCabinetSearch(e.target.value); setCabinet(''); if (!cabinetOpen) setCabinetOpen(true); }}
                    onFocus={() => { setCabinetOpen(true); setCabinetSearch(cabinet); }}
                    onBlur={() => setTimeout(() => setCabinetOpen(false), 150)}
                    placeholder="Rechercher votre cabinet…"
                    className={inputCls}
                  />
                  {cabinetOpen && filteredCabinets.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-black/12 rounded-sm max-h-44 overflow-y-auto shadow-lg">
                      {filteredCabinets.map(c => (
                        <button key={c} onMouseDown={e => e.preventDefault()}
                          onClick={() => { setCabinet(c); setCabinetSearch(c); setCabinetOpen(false); }}
                          className="w-full text-left px-3.5 py-2.5 text-[13px] text-black/60 hover:bg-black/5 hover:text-black transition-colors">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <Button onClick={() => setStep('slot')} disabled={!isContactValid}
                  className="w-full bg-black text-white hover:bg-black/85 font-sans text-[12.3px] font-normal rounded-sm py-5 mt-2 tracking-wide disabled:opacity-25">
                  Choisir un créneau →
                </Button>
              </motion.div>
            )}

            {/* Étape 2 — Créneau */}
            {step === 'slot' && (
              <motion.div key="slot" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <button onClick={() => setStep('contact')} className="text-[11px] text-black/40 hover:text-black mb-8 font-sans transition-colors">
                  ← Modifier mes informations
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Calendrier */}
                  <div>
                    <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-black/40 mb-4">Choisir une date</p>
                    <div className="border border-black/12 rounded-sm p-3 inline-block">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => { setSelectedDate(date); setSelectedSlot(null); }}
                        disabled={(date) => date.getDay() === 0 || date.getDay() === 6 || date < new Date()}
                        className={cn('p-2 pointer-events-auto [&_*]:text-black [&_.rdp-day_button:hover]:bg-black/8')}
                      />
                    </div>
                  </div>

                  {/* Créneaux */}
                  <div>
                    <p className="text-[9px] font-sans font-semibold tracking-[0.18em] uppercase text-black/40 mb-4">
                      {selectedDate
                        ? `Créneaux — ${selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                        : 'Sélectionnez une date'}
                    </p>
                    {selectedDate ? (
                      <div className="space-y-1.5">
                        {TIME_SLOTS.map(slot => (
                          <button key={slot} onClick={() => setSelectedSlot(slot)}
                            className={cn('w-full text-left px-4 py-2.5 rounded-sm border text-[13px] font-sans transition-all flex items-center gap-2',
                              selectedSlot === slot
                                ? 'bg-black text-white border-black'
                                : 'border-black/15 text-black/60 hover:border-black/40 hover:text-black')}>
                            <Phone className="w-3 h-3 flex-shrink-0" /> {slot}
                          </button>
                        ))}
                        {selectedSlot && (
                          <Button onClick={handleConfirm} disabled={submitting}
                            className="w-full mt-3 bg-black text-white hover:bg-black/85 font-sans text-[12.3px] tracking-wide rounded-sm py-5">
                            {submitting ? 'Confirmation…' : `Confirmer — ${selectedSlot}`}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center h-24 text-black/30 text-sm font-sans gap-2">
                        <Phone className="w-4 h-4" /> Choisissez d'abord une date
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étape 3 — Confirmation */}
            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center py-12">
                <CheckCircle2 className="w-9 h-9 text-black/30 mx-auto mb-6" />
                <p className="font-serif font-[300] text-[1.8rem] text-black mb-3">Créneau confirmé.</p>
                <p className="text-black/55 font-sans text-sm mb-2">
                  {selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedSlot}
                </p>
                <p className="text-black/35 font-sans text-xs mt-3">Votre consultant Logan vous contactera à l'heure convenue.</p>
                <button onClick={() => navigate('/acces-cabinet')} className="mt-8 text-black/40 hover:text-black font-sans text-[12px] tracking-wide transition-colors border-b border-black/20 pb-px">
                  ← Retour
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default FirmBookingPage;
