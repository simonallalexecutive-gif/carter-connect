import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CheckCircle2, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CABINETS } from '@/lib/constants';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

const STATUSES = ['Associé(e)', 'Managing Partner', 'RH'] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const PRACTICES = [
  'M&A',
  'Private Equity',
  'Financement',
  'Droit social',
  'Droit immobilier',
  'Fiscalité',
  'Restructuring',
];

const PROFILE_ITEMS = [
  { label: 'Séniorité', desc: 'Années d\'expérience et niveau de qualification post-qualification.' },
  { label: 'Expertise', desc: 'Pratique principale et éventuelles spécialités secondaires.' },
  { label: 'Cabinet d\'origine', desc: 'Nationalité et présence aux classements Legal 500 & Chambers.' },
  { label: 'Projet du candidat', desc: 'Ce qu\'il rechercherait s\'il devait quitter son cabinet actuel.' },
  { label: 'Statut d\'écoute', desc: 'Actif — en recherche ouverte — ou Opportuniste — à l\'écoute d\'opportunités ciblées.' },
];

const FirmBooking = () => {
  const [step, setStep] = useState<'contact' | 'slot' | 'done'>('contact');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cabinet, setCabinet] = useState('');
  const [cabinetSearch, setCabinetSearch] = useState('');
  const [cabinetOpen, setCabinetOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredCabinets = CABINETS.filter(c =>
    c.toLowerCase().includes(cabinetSearch.toLowerCase())
  );

  const isContactValid =
    firstName.trim() && lastName.trim() && cabinet.trim() &&
    status && phone.trim().length >= 10 && email.includes('@');

  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('logan_bookings').insert({
        candidate_name: `${firstName} ${lastName}`.trim(),
        candidate_email: email,
        candidate_cabinet: cabinet,
        candidate_department: status,
        candidate_seniority: '',
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedSlot,
        user_id: null,
        status: 'confirmed',
        notes: `RDV cabinet depuis /acces-cabinet — tel ${phone}`,
      } as any);
      if (error) throw error;
      supabase.functions.invoke('notify-booking', {
        body: {
          name: `${firstName} ${lastName}`.trim(),
          email,
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

  const inputCls = 'w-full bg-white/5 border border-white/15 text-white placeholder:text-white/25 rounded-sm px-3 py-2.5 text-sm focus:border-white/40 focus:outline-none transition-colors';
  const labelCls = 'text-[9px] font-sans font-semibold tracking-[0.16em] uppercase text-white/35 mb-1.5 block';

  return (
    <AnimatePresence mode="wait">
      {step === 'contact' && (
        <motion.div key="contact" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="space-y-4">
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
              placeholder="Rechercher un cabinet…"
              className={inputCls}
            />
            {cabinetOpen && filteredCabinets.length > 0 && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[#111] border border-white/15 rounded-sm max-h-44 overflow-y-auto">
                {filteredCabinets.map(c => (
                  <button key={c} onMouseDown={e => e.preventDefault()} onClick={() => { setCabinet(c); setCabinetSearch(c); setCabinetOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/8 hover:text-white transition-colors">
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Statut */}
          <div>
            <label className={labelCls}>Statut</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={cn('py-2 rounded-sm text-[12px] font-sans transition-all border',
                    status === s ? 'bg-white text-black border-white' : 'bg-transparent text-white/50 border-white/15 hover:border-white/35 hover:text-white/80')}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Téléphone</label>
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} type="tel" placeholder="06 12 34 56 78" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="votre@cabinet.com" className={inputCls} />
            </div>
          </div>

          <Button onClick={() => setStep('slot')} disabled={!isContactValid}
            className="w-full bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal rounded-sm py-5 mt-2 tracking-wide disabled:opacity-30">
            Choisir un créneau →
          </Button>
        </motion.div>
      )}

      {step === 'slot' && (
        <motion.div key="slot" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <button onClick={() => setStep('contact')} className="text-[11px] text-white/35 hover:text-white/70 mb-5 font-sans transition-colors">
            ← Modifier mes coordonnées
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className={labelCls}>Choisir une date</p>
              <div className="border border-white/12 rounded-sm p-2 inline-block bg-white/3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => { setSelectedDate(date); setSelectedSlot(null); }}
                  disabled={(date) => date.getDay() === 0 || date.getDay() === 6 || date < new Date()}
                  className={cn('p-2 pointer-events-auto [&_*]:text-white [&_.rdp-day_button:hover]:bg-white/10 [&_.rdp-day_button.rdp-day_selected]:bg-white [&_.rdp-day_button.rdp-day_selected]:text-black')}
                />
              </div>
            </div>
            <div>
              <p className={labelCls}>{selectedDate ? `Créneaux — ${selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` : 'Sélectionnez une date'}</p>
              {selectedDate ? (
                <div className="space-y-1.5">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      className={cn('w-full text-left px-3.5 py-2.5 rounded-sm border text-[13px] font-sans transition-all duration-150 flex items-center gap-2',
                        selectedSlot === slot ? 'bg-white text-black border-white' : 'border-white/15 text-white/60 hover:border-white/35 hover:text-white/90')}>
                      <Phone className="w-3 h-3" /> {slot}
                    </button>
                  ))}
                  {selectedSlot && (
                    <Button onClick={handleConfirm} disabled={submitting}
                      className="w-full mt-3 bg-white text-black hover:bg-white/90 font-sans text-[12.3px] tracking-wide rounded-sm py-5">
                      {submitting ? 'Confirmation…' : `Confirmer — ${selectedSlot}`}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center h-24 text-white/25 text-sm font-sans gap-2">
                  <Phone className="w-4 h-4" /> Choisissez d'abord une date
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {step === 'done' && (
        <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center py-10">
          <CheckCircle2 className="w-8 h-8 text-white/60 mx-auto mb-4" />
          <p className="font-serif text-xl text-white mb-2">Créneau confirmé</p>
          <p className="text-white/45 font-sans text-sm">
            {selectedDate?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedSlot}
          </p>
          <p className="text-white/30 font-sans text-xs mt-3">Votre consultant Logan vous contactera à l'heure convenue.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FirmAccessPage = () => (
  <div className="min-h-screen bg-black">
    <Header />

    {/* Hero */}
    <section className="min-h-[72svh] flex flex-col justify-center relative px-6 sm:px-10 lg:px-16 pt-32 pb-20">
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse 55% 45% at 50% 35%, rgba(255,255,255,0.045) 0%, transparent 70%)',
            'radial-gradient(ellipse 65% 55% at 48% 42%, rgba(255,255,255,0.06) 0%, transparent 70%)',
            'radial-gradient(ellipse 55% 45% at 52% 38%, rgba(255,255,255,0.045) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <motion.div variants={stagger} initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6"
          >
            Pour les cabinets
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-serif font-[300] text-[2.2rem] sm:text-[3.2rem] md:text-[4.1rem] text-white leading-[1.06] tracking-normal mb-8"
          >
            Accédez aux profils les plus<br />
            <em className="italic">qualifiés du marché.</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-white/60 font-sans font-light text-[1rem] sm:text-[1.08rem] leading-[1.75] max-w-2xl mb-10"
          >
            Logan est un réseau confidentiel d'avocats d'affaires, constitué et enrichi chaque jour
            par des consultants spécialisés qui chassent, rencontrent et qualifient les meilleurs candidats
            du marché. Chaque cabinet partenaire accède au réseau sur une base absolument confidentielle,
            structurée et sécurisée.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <Link to="/demander-acces">
              <Button className="bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal px-6 py-2.5 rounded-sm tracking-wide">
                Rejoindre Logan
              </Button>
            </Link>
            <a href="#booking" className="text-white/50 hover:text-white font-sans text-[12.3px] tracking-wide transition-colors duration-200 border-b border-white/20 hover:border-white/50 pb-px">
              Fixer un échange →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Séparateur */}
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
      <div className="h-px bg-white/10" />
    </div>

    {/* Pratiques couvertes */}
    <section className="py-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">
            Pratiques couvertes
          </p>
          <div className="flex flex-wrap gap-2.5">
            {PRACTICES.map((p) => (
              <span
                key={p}
                className="px-4 py-1.5 border border-white/20 rounded-sm text-[12.5px] font-sans font-normal tracking-wide text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    {/* Séparateur */}
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
      <div className="h-px bg-white/10" />
    </div>

    {/* Deux modes d'accès */}
    <section className="py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-4">
            Comment ça fonctionne
          </p>
          <h2 className="font-serif font-[300] text-[1.8rem] sm:text-[2.5rem] text-white leading-[1.1]">
            Deux façons de travailler<br />avec Logan.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-white/10">
          {/* Mode 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-black p-10 md:p-12"
          >
            <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/30 mb-5">
              Mode I
            </p>
            <h3 className="font-serif font-[300] text-[1.45rem] text-white mb-5 leading-snug">
              Explorer le marché<br />en toute autonomie.
            </h3>
            <p className="text-white/60 font-sans font-light text-[0.93rem] leading-[1.8] mb-7">
              Accédez librement à la base Logan quand bon vous semble.
            </p>
            <div className="space-y-3 mb-7">
              {[
                'Parcourez les profils disponibles.',
                'Filtrez par pratique, séniorité ou statut d\'écoute.',
                'Identifiez les candidats qui correspondent à vos besoins du moment.',
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <span className="mt-[0.4rem] w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />
                  <p className="text-white/50 font-sans font-light text-[0.9rem] leading-[1.75]">{line}</p>
                </div>
              ))}
            </div>
            <p className="text-white/35 font-sans font-light text-[0.85rem] leading-[1.8] border-t border-white/10 pt-6">
              Aucun engagement, aucune contrainte — Logan vous donne une visibilité continue sur le marché
              pour vous permettre d'être opportuniste sur le bon profil, au bon moment.
            </p>
          </motion.div>

          {/* Mode 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.22 }}
            className="bg-black p-10 md:p-12"
          >
            <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/30 mb-5">
              Mode II
            </p>
            <h3 className="font-serif font-[300] text-[1.45rem] text-white mb-5 leading-snug">
              Piloter un recrutement<br />avec un consultant dédié.
            </h3>
            <p className="text-white/55 font-sans font-light text-[0.93rem] leading-[1.8]">
              Confiez votre recherche à un consultant Logan spécialisé sur le marché des avocats
              qui vous accompagne de A à Z tout au long du processus. Logan est à la disposition
              de chacun de vos départements et coordonne, avec justesse et efficacité, les échanges
              dans le respect le plus strict de la confidentialité des parties.
            </p>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-8 text-white/30 font-sans font-light text-[0.85rem] leading-relaxed text-center"
        >
          Quel que soit le mode retenu, Logan enrichit sa base de candidats au day to day — en chassant,
          rencontrant et qualifiant les meilleurs profils du marché.
        </motion.p>
      </div>
    </section>

    {/* Séparateur */}
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
      <div className="h-px bg-white/10" />
    </div>

    {/* Honoraires + Booking */}
    <section id="booking" className="py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">
          {/* Texte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-4">
              Conditions d'intervention
            </p>
            <h2 className="font-serif font-[300] text-[1.8rem] sm:text-[2.4rem] text-white leading-[1.1] mb-7">
              Logan réinvente les conditions<br /><em className="italic">d'intervention.</em>
            </h2>
            <p className="text-white/55 font-sans font-light text-[0.93rem] leading-[1.85] mb-10">
              Logan innove également sur les conditions d'intervention traditionnellement pratiquées sur le marché.
            </p>
            {/* Quatre piliers */}
            <div className="grid grid-cols-2 gap-px bg-white/8">
              {[
                { label: 'Plus rapide', desc: 'Un réseau constitué en amont, prêt à activer.' },
                { label: 'Plus confidentiel', desc: 'Aucune mise en relation hors intermédiation.' },
                { label: 'Plus transparent', desc: 'Un honoraire de résultat, clair et réduit.' },
                { label: 'Plus premium', desc: 'Des profils qualifiés, rencontrés, validés.' },
              ].map((p) => (
                <div key={p.label} className="bg-black p-5">
                  <p className="text-white font-sans text-[0.82rem] font-medium tracking-wide mb-1.5">{p.label}</p>
                  <p className="text-white/35 font-sans font-light text-[0.78rem] leading-[1.6]">{p.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking inline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">
              Fixer un échange
            </p>
            <FirmBooking />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Séparateur */}
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
      <div className="h-px bg-white/10" />
    </div>

    {/* Confidentialité */}
    <section className="py-24 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2"
        >
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">
            Confidentialité absolue
          </p>
          <h2 className="font-serif font-[300] text-[1.8rem] sm:text-[2.4rem] text-white leading-[1.1] mb-7">
            Logan protège chaque partie,<br />à chaque étape.
          </h2>
          <p className="text-white/55 font-sans font-light text-[0.93rem] leading-[1.85]">
            Logan est très attaché à ce que candidats et cabinets bénéficient d'une confidentialité
            absolue tout au long du processus. Aucune mise en relation ne peut avoir lieu en dehors
            de notre intermédiation. L'identité du candidat, celle du cabinet et les termes des
            échanges restent strictement confidentiels jusqu'à ce que les deux parties aient
            explicitement consenti à progresser ensemble.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="md:w-1/2 flex flex-col gap-1"
        >
          <p className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">
            Ce que vous visualisez
          </p>
          {PROFILE_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              className="flex gap-5 py-5 border-b border-white/10 last:border-0"
            >
              <span className="text-white/20 font-serif text-sm mt-0.5 flex-shrink-0 w-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-white font-sans text-[0.88rem] font-medium tracking-wide mb-1">
                  {item.label}
                </p>
                <p className="text-white/45 font-sans font-light text-[0.84rem] leading-[1.7]">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Séparateur */}
    <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
      <div className="h-px bg-white/10" />
    </div>

    {/* CTA */}
    <section className="py-32 px-6 sm:px-10 lg:px-16">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif italic text-[1.7rem] sm:text-[2.4rem] text-white tracking-[0.03em] mb-5"
        >
          Si un profil vous intéresse,<br />manifestez votre intérêt — Logan s'occupe du reste.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-14 h-px bg-white/25 mb-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-white/45 font-sans font-light text-[0.9rem] leading-relaxed mb-10 max-w-sm"
        >
          Rejoignez le réseau Logan et accédez aux profils les plus qualifiés du marché,
          en toute confidentialité.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/demander-acces">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 font-sans text-sm font-normal px-10 py-5 rounded-sm tracking-wide"
            >
              Rejoindre Logan
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default FirmAccessPage;
