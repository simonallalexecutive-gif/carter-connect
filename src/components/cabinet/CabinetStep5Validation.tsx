import { useState } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, CalendarDays, Check, Clock } from 'lucide-react';
import { format, addDays, isBefore, startOfDay, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

const CabinetStep5Validation = () => {
  const s = useCabinetStore();
  const [checks, setChecks] = useState([false, false, false]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const allChecked = checks.every(Boolean);
  const hasBooking = !!selectedDate && !!selectedTime;

  const disabledDays = (date: Date) => {
    return isBefore(date, startOfDay(new Date())) || isWeekend(date);
  };

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 3 / 3
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Validation</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 max-w-xl">
        Confirmez votre demande d'accès et planifiez un appel avec l'équipe Logan.
      </p>

      {/* ── Planifier un appel ── */}
      <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
            <Phone className="w-4 h-4 text-background" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Planifier un appel avec Logan</div>
            <div className="text-[11px] text-muted-foreground">Sélectionnez une date et un créneau horaire pour votre appel d'onboarding.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date picker */}
          <div>
            <label className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal h-11',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarDays className="w-4 h-4 mr-2 flex-shrink-0" />
                  {selectedDate ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }) : 'Choisir une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={disabledDays}
                  fromDate={new Date()}
                  toDate={addDays(new Date(), 60)}
                  locale={fr}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time slots */}
          <div>
            <label className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-2 block">Créneau horaire</label>
            <div className="grid grid-cols-4 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    'py-2 px-1 rounded text-xs font-medium border transition-all',
                    selectedTime === time
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-background border-border text-foreground hover:border-foreground/40'
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confirmation du créneau */}
        {hasBooking && (
          <div className="flex items-center gap-2 mt-4 text-[11px] text-foreground bg-background border border-border rounded px-4 py-3">
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>
              Appel prévu le <strong>{format(selectedDate!, 'EEEE d MMMM', { locale: fr })}</strong> à <strong>{selectedTime}</strong>
            </span>
          </div>
        )}

        {!hasBooking && (
          <div className="flex items-center gap-2 mt-4 text-[11px] text-muted-foreground bg-background border border-border rounded px-4 py-3">
            <Clock className="w-4 h-4 text-foreground/40 flex-shrink-0" />
            <span>Veuillez sélectionner une date et un créneau pour continuer.</span>
          </div>
        )}
      </div>

      {/* ── Approval banner ── */}
      <div className="bg-foreground rounded-md p-6">
        <div className="font-sans text-base font-semibold text-white mb-3.5">Confirmez votre demande d'accès</div>
        <div className="flex flex-col gap-2.5">
          {[
            "Je confirme l'exactitude des informations renseignées sur mon cabinet.",
            "Je comprends que les profils sont strictement anonymisés et que toute levée de confidentialité est conditionnée à l'accord du candidat, orchestrée par LOGAN.",
            "J'accepte les conditions générales d'utilisation de la plateforme LOGAN et la politique de confidentialité.",
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
                'w-[18px] h-[18px] rounded-sm border-[1.5px] flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                checks[i] ? 'bg-white border-white' : 'border-white/25'
              )}>
                {checks[i] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-white/65 leading-relaxed">{text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setStep(3)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button onClick={() => s.setStep(6)} disabled={!allChecked || !hasBooking} className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8">
          Soumettre ma demande →
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep5Validation;