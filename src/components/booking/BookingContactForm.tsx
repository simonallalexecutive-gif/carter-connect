import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, User, Building2, Briefcase, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CABINETS } from '@/lib/constants';

const STATUSES = ['Associé(e)', 'Managing Partner', 'RH'] as const;

interface BookingContactData {
  firstName: string;
  lastName: string;
  cabinet: string;
  status: string;
  phone: string;
  email: string;
}

interface BookingContactFormProps {
  onSubmit: (data: BookingContactData) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const BookingContactForm = ({ onSubmit }: BookingContactFormProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cabinet, setCabinet] = useState('');
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [cabinetSearch, setCabinetSearch] = useState('');

  const filteredCabinets = CABINETS.filter(c =>
    c.toLowerCase().includes(cabinetSearch.toLowerCase())
  );

  const isValid = firstName.trim() && lastName.trim() && cabinet.trim() && status && phone.trim().length === 10 && email.includes('@');

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto"
    >
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-8 space-y-5">
        <div className="flex items-center gap-2 mb-6">
          <User className="w-4 h-4 text-white/50" />
          <span className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40">Vos coordonnées</span>
        </div>

        {/* Prénom / Nom */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5 block">Prénom</label>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Jean"
              className="w-full bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 rounded-sm px-3 py-2.5 text-sm focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5 block">Nom</label>
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Dupont"
              className="w-full bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 rounded-sm px-3 py-2.5 text-sm focus:border-white/30 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Cabinet - autocomplete */}
        <div className="relative">
          <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> Cabinet
          </label>
          <input
            value={cabinetOpen ? cabinetSearch : cabinet}
            onChange={e => {
              setCabinetSearch(e.target.value);
              setCabinet('');
              if (!cabinetOpen) setCabinetOpen(true);
            }}
            onFocus={() => { setCabinetOpen(true); setCabinetSearch(cabinet); }}
            placeholder="Rechercher un cabinet…"
            className="w-full bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 rounded-sm px-3 py-2.5 text-sm focus:border-white/30 focus:outline-none transition-colors"
          />
          {cabinetOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#1C1C1C] border border-white/10 rounded-sm max-h-48 overflow-y-auto">
              {filteredCabinets.length > 0 ? filteredCabinets.map(c => (
                <button
                  key={c}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setCabinet(c); setCabinetSearch(c); setCabinetOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {c}
                </button>
              )) : (
                <p className="px-3 py-2 text-sm text-white/30">Aucun résultat</p>
              )}
            </div>
          )}
        </div>

        {/* Statut */}
        <div>
          <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/40 mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3 h-3" /> Statut
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  'py-2.5 rounded-sm text-sm font-sans font-medium transition-all border',
                  status === s
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Téléphone */}
        <div>
          <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3 h-3" /> Téléphone portable
          </label>
          <input
            value={phone}
            onChange={e => handlePhoneChange(e.target.value)}
            type="tel"
            placeholder="06 12 34 56 78"
            className="w-full bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 rounded-sm px-3 py-2.5 text-sm focus:border-white/30 focus:outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/40 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3 h-3" /> Email
          </label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="votre@email.com"
            className="w-full bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 rounded-sm px-3 py-2.5 text-sm focus:border-white/30 focus:outline-none transition-colors"
          />
        </div>

        <Button
          onClick={() => onSubmit({ firstName, lastName, cabinet, status, phone, email })}
          disabled={!isValid}
          className="w-full bg-white text-black hover:bg-white/90 font-sans text-sm font-bold rounded-sm py-5 mt-4 group"
        >
          Choisir un créneau
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );
};

export default BookingContactForm;
export type { BookingContactData };
