import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar } from '@/components/ui/calendar';
import { Phone, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BookingContactForm, { type BookingContactData } from '@/components/booking/BookingContactForm';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const BookingPage = () => {
  const [step, setStep] = useState<'contact' | 'slot' | 'done'>('contact');
  const [contact, setContact] = useState<BookingContactData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot || !contact) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('logan_bookings').insert({
        candidate_name: `${contact.firstName} ${contact.lastName}`.trim(),
        candidate_email: contact.email,
        candidate_cabinet: contact.cabinet,
        candidate_department: contact.status,
        candidate_seniority: '',
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedSlot,
        user_id: null,
        status: 'confirmed',
        notes: `RDV depuis landing — tel ${contact.phone}`,
      } as any);
      if (error) throw error;
      setStep('done');
      toast.success('Créneau réservé avec succès.');
    } catch (e) {
      console.error(e);
      toast.error('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-1 pt-28 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl mx-auto"
        >
          <div className="text-center mb-10">
            <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-black/50 mb-3">
              Fixer un call avec Logan
            </p>
            <h1 className="font-serif text-2xl md:text-3xl text-black tracking-[-0.01em] mb-3">
              Prendre rendez-vous
            </h1>
            <p className="text-sm text-black/60 font-sans max-w-md mx-auto">
              Échange confidentiel de 30 minutes avec votre consultant Logan.
            </p>
          </div>

          {step === 'contact' && (
            <BookingContactForm
              onSubmit={(data) => { setContact(data); setStep('slot'); }}
            />
          )}

          {step === 'slot' && (
            <div>
              <button
                onClick={() => setStep('contact')}
                className="flex items-center gap-1.5 text-xs text-black/60 hover:text-black mb-6 font-sans"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Modifier mes coordonnées
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[11px] font-sans font-medium text-black/60 mb-4 uppercase tracking-wide">
                    Choisir une date
                  </p>
                  <div className="rounded-lg border border-black/10 p-4 inline-block bg-white">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => { setSelectedDate(date); setSelectedSlot(null); }}
                      disabled={(date) => {
                        const day = date.getDay();
                        return day === 0 || day === 6 || date < new Date();
                      }}
                      className={cn('p-3 pointer-events-auto')}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-sans font-medium text-black/60 mb-4 uppercase tracking-wide">
                    {selectedDate
                      ? `Créneaux disponibles — ${selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                      : 'Sélectionnez une date'}
                  </p>
                  {selectedDate ? (
                    <div className="space-y-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            'w-full text-left px-4 py-3 rounded-md border text-sm font-sans transition-all duration-200',
                            selectedSlot === slot
                              ? 'bg-black text-white border-black'
                              : 'border-black/10 hover:bg-black/5 text-black'
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5" />
                            {slot}
                          </span>
                        </button>
                      ))}
                      {selectedSlot && (
                        <Button
                          onClick={handleConfirm}
                          disabled={submitting}
                          className="w-full mt-4 font-sans text-sm bg-black text-white hover:bg-black/90"
                        >
                          {submitting ? 'Confirmation…' : `Confirmer — ${selectedSlot}`}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-black/40 text-sm font-sans">
                      <Phone className="w-5 h-5 mr-2 opacity-30" />
                      Choisissez d'abord une date
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-16">
              <CheckCircle2 className="w-10 h-10 text-black mx-auto mb-4" />
              <p className="text-lg font-sans text-black mb-2">Créneau confirmé</p>
              <p className="text-sm font-sans text-black/60">
                {formattedDate} à {selectedSlot}
              </p>
              <p className="text-xs text-black/50 mt-4 font-sans">
                Votre consultant Logan vous contactera à l'heure convenue.
              </p>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
