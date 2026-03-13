import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const CandidateBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot) return;
    setConfirmed(true);
    toast.success('Créneau réservé avec succès.');
  };

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div>
      <div className="mb-10">
        <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">
          Fixer un call avec Logan
        </p>
        <div className="w-8 h-px bg-foreground" />
      </div>

      {confirmed ? (
        <div className="text-center py-16">
          <CheckCircle2 className="w-10 h-10 text-foreground mx-auto mb-4" />
          <p className="text-lg font-serif text-foreground mb-2">Créneau confirmé</p>
          <p className="text-sm font-serif text-muted-foreground">
            {formattedDate} à {selectedSlot}
          </p>
          <p className="text-xs text-muted-foreground mt-4 font-sans">
            Votre consultant Logan vous contactera à l'heure convenue.
          </p>
          <Button
            variant="outline"
            className="mt-8 text-xs font-sans"
            onClick={() => { setConfirmed(false); setSelectedDate(undefined); setSelectedSlot(null); }}
          >
            Modifier le créneau
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Calendar */}
          <div>
            <p className="text-[11px] font-sans font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              Choisir une date
            </p>
            <div className="rounded-lg border border-border p-4 inline-block" style={{ background: 'hsl(0 0% 96%)' }}>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => { setSelectedDate(date); setSelectedSlot(null); }}
                disabled={(date) => {
                  const day = date.getDay();
                  return day === 0 || day === 6 || date < new Date();
                }}
                className={cn("p-3 pointer-events-auto")}
              />
            </div>
          </div>

          {/* Time slots */}
          <div>
            <p className="text-[11px] font-sans font-medium text-muted-foreground mb-4 uppercase tracking-wide">
              {selectedDate ? `Créneaux disponibles — ${selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` : 'Sélectionnez une date'}
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
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border hover:bg-secondary text-foreground'
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
                    className="w-full mt-4 font-sans text-sm"
                  >
                    Confirmer — {selectedSlot}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-sm font-serif">
                <Phone className="w-5 h-5 mr-2 opacity-30" />
                Choisissez d'abord une date
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateBooking;
