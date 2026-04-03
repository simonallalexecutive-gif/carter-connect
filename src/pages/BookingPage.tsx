import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, Video, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import BookingContactForm, { type BookingContactData } from '@/components/booking/BookingContactForm';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const BookingPage = () => {
  const [step, setStep] = useState<'form' | 'calendar'>('form');
  const [contactData, setContactData] = useState<BookingContactData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [format_, setFormat_] = useState<'visio' | 'physique'>('visio');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = (data: BookingContactData) => {
    setContactData(data);
    setStep('calendar');
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !contactData) return;
    setSubmitting(true);
    try {
      const bookingDate = format(selectedDate, 'yyyy-MM-dd');
      const { error } = await supabase.from('logan_bookings').insert({
        candidate_name: `${contactData.firstName} ${contactData.lastName}`,
        candidate_email: contactData.email,
        booking_date: bookingDate,
        booking_time: selectedTime,
        candidate_cabinet: contactData.cabinet,
        candidate_department: contactData.status,
        candidate_seniority: '',
        status: 'confirmed',
        notes: [
          format_ === 'physique' ? 'RDV en physique dans les locaux du cabinet' : 'Visioconférence',
          `Tél: ${contactData.phone}`,
          `Statut: ${contactData.status}`,
        ].join(' | '),
      });
      if (error) throw error;
      setConfirmed(true);
      toast.success('Rendez-vous confirmé !');
    } catch {
      toast.error('Erreur lors de la confirmation. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isWeekend(date);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">Rendez-vous confirmé</h1>
          <p className="text-white/50 font-sans text-sm leading-relaxed mb-2">
            {format(selectedDate!, 'EEEE d MMMM yyyy', { locale: fr })} à {selectedTime}
          </p>
          <p className="text-white/40 font-sans text-xs leading-relaxed mb-2">
            {format_ === 'physique' ? 'En physique dans les locaux du cabinet' : 'En visioconférence'}
          </p>
          <p className="text-white/40 font-sans text-xs leading-relaxed mb-10">
            Un membre de l'équipe Logan vous contactera par email pour confirmer les détails.
          </p>
          <Link to="/">
            <Button variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/10 rounded-sm px-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour à l'accueil
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20 relative z-10">
        <Link to="/" className="font-serif text-[31px] tracking-[0.04em] text-white">Logan</Link>
        {step === 'calendar' ? (
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/5 text-sm rounded-sm"
            onClick={() => setStep('form')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        ) : (
          <Link to="/">
            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 text-sm rounded-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour
            </Button>
          </Link>
        )}
      </header>

      <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-4xl">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Intro */}
            <motion.div variants={fadeUp} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-3 py-1.5 mb-8">
                <span className="font-serif text-xs font-bold text-white/80 tracking-[0.1em]">LOGAN</span>
                <span className="w-px h-3 bg-white/20" />
                <span className="text-[9px] text-white/40 tracking-[0.12em] uppercase">Rendez-vous</span>
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-normal text-white mb-5 tracking-[-0.02em]">
                Échangeons ensemble
              </h1>
              <p className="text-base text-white/60 font-sans font-light max-w-xl mx-auto leading-relaxed mb-3">
                Nos équipes sont à votre disposition pour vous présenter Logan, répondre à vos questions et envisager avec vous la formule la plus adaptée à vos besoins.
              </p>
              {step === 'form' && (
                <p className="text-sm text-white/40 font-sans font-light max-w-md mx-auto leading-relaxed">
                  Renseignez vos coordonnées pour accéder à l'agenda et réserver un créneau.
                </p>
              )}
              {step === 'calendar' && (
                <p className="text-sm text-white/40 font-sans font-light max-w-md mx-auto leading-relaxed">
                  Choisissez un créneau qui vous convient — l'échange dure environ 20 minutes, en visioconférence ou en physique dans les locaux du cabinet, selon votre préférence.
                </p>
              )}
            </motion.div>

            {/* Step 1: Contact form */}
            {step === 'form' && (
              <BookingContactForm onSubmit={handleContactSubmit} />
            )}

            {/* Step 2: Calendar + time */}
            {step === 'calendar' && (
              <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left: Calendar */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <CalendarDays className="w-4 h-4 text-white/50" />
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40">Choisir une date</span>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                    disabled={disabledDays}
                    locale={fr}
                    className="p-3 pointer-events-auto [&_.rdp-day]:text-white [&_.rdp-day_button]:text-white [&_.rdp-head_cell]:text-white/40 [&_.rdp-caption_label]:text-white [&_.rdp-nav_button]:text-white/60 [&_.rdp-nav_button:hover]:text-white [&_.rdp-day_selected]:bg-white [&_.rdp-day_selected]:text-black [&_.rdp-day_today]:border-white/30 [&_.rdp-day_disabled]:text-white/15 [&_button]:text-white [&_button:hover]:bg-white/10 [&_.text-muted-foreground]:text-white/40"
                  />
                </div>

                {/* Right: Time slots */}
                <div className="space-y-6">
                  {selectedDate ? (
                    <>
                      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <Clock className="w-4 h-4 text-white/50" />
                          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40">
                            Créneaux — {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                'py-2.5 rounded-sm text-sm font-sans font-medium transition-all border',
                                selectedTime === time
                                  ? 'bg-white text-black border-white'
                                  : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                              )}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedTime && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-6"
                        >
                          <div className="flex items-center gap-2 mb-5">
                            <Video className="w-4 h-4 text-white/50" />
                            <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40">Format du rendez-vous</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <button
                              onClick={() => setFormat_('visio')}
                              className={cn(
                                'py-2.5 rounded-sm text-sm font-sans font-medium transition-all border flex items-center justify-center gap-2',
                                format_ === 'visio'
                                  ? 'bg-white text-black border-white'
                                  : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                              )}
                            >
                              <Video className="w-3.5 h-3.5" /> Visio
                            </button>
                            <button
                              onClick={() => setFormat_('physique')}
                              className={cn(
                                'py-2.5 rounded-sm text-sm font-sans font-medium transition-all border flex items-center justify-center gap-2',
                                format_ === 'physique'
                                  ? 'bg-white text-black border-white'
                                  : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                              )}
                            >
                              <MapPin className="w-3.5 h-3.5" /> En physique
                            </button>
                          </div>

                          <Button
                            onClick={handleConfirm}
                            disabled={submitting}
                            className="w-full bg-white text-black hover:bg-white/90 font-sans text-sm font-bold rounded-sm py-5 group"
                          >
                            {submitting ? 'Confirmation...' : 'Confirmer le rendez-vous'}
                            {!submitting && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
                          </Button>
                          <p className="text-[10px] text-white/30 mt-4 text-center leading-relaxed">
                            Appel de 20 min · Visio ou en physique · Sans engagement
                          </p>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-10 text-center">
                      <CalendarDays className="w-8 h-8 text-white/20 mx-auto mb-4" />
                      <p className="text-sm text-white/40 font-sans font-light">
                        Sélectionnez une date dans le calendrier pour voir les créneaux disponibles.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
