import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'candidat' | 'cabinet';

interface FAQItem {
  question: string;
  answer: string;
}

const candidatFAQ: FAQItem[] = [
  {
    question: 'Mon profil est-il strictement protégé ?',
    answer:
      'Oui. Votre identité — nom, prénom et cabinet d\'origine — n\'est jamais accessible aux cabinets recruteurs. Seul Logan peut, avec votre accord exprès, organiser un rapprochement. Les informations visibles sont volontairement généralisées.',
  },
  {
    question: 'Mon cabinet actuel peut-il avoir connaissance de ma présence sur Logan ?',
    answer:
      'Non, les membres d\'un même cabinet ne peuvent jamais apparaître sur leurs espaces respectifs. De manière générale, aucun élément ne permet à un cabinet de reconnaître votre identité ni celle de votre cabinet actuel.',
  },
  {
    question: 'Mon CV peut-il être partagé sans mon accord ?',
    answer:
      'Jamais. Votre CV n\'est transmis à un cabinet qu\'après votre autorisation exprès, dans le cadre d\'une mise en relation validée par Logan. De même, les cabinets ne peuvent jamais vous contacter directement — Logan est l\'unique intermédiaire à chaque étape.',
  },
  {
    question: 'Quel est l\'intérêt de rejoindre Logan ?',
    answer:
      'Logan vous permet de rester visible et attractif - sans effort et sans exposition de votre identité - aux yeux du marché. Vous êtes alerté lorsqu\'un cabinet s\'intéresse à votre profil ou qu\'une nouvelle opportunité correspond à votre projet, sans avoir à multiplier les démarches : tout est désormais centralisé, accessible et encadré dans la plus grande confidentialité.',
  },
  {
    question: 'Intégrer Logan, c\'est envoyer un signal au marché que je suis en recherche active ?',
    answer:
      'Absolument pas. Logan est là pour renforcer votre attractivité tout en vous conférant la discrétion la plus totale. Ainsi, vous restez connecté à votre marché et maître de décider quand l\'activer, tout en bénéficiant, en temps utiles, d\'un accompagnement sur-mesure et d\'une visibilité inégalée.',
  },
  {
    question: 'Comment suis-je informé des opportunités ?',
    answer:
      'Depuis votre espace personnel, vous recevez des notifications dès qu\'un cabinet manifeste un intérêt pour votre profil ou qu\'une opportunité correspond à vos critères. Vous pouvez également consulter la dynamique de votre marché : mouvements, tendances, et nouveaux besoins identifiés par Logan. Tout est centralisé dans un tableau de bord clair et confidentiel.',
  },
  {
    question: 'L\'inscription est-elle gratuite et combien de temps prend-elle ?',
    answer:
      'Oui, l\'inscription est entièrement gratuite et sans engagement pour les candidats. Le parcours d\'inscription prend moins de 5 minutes : vous renseignez votre séniorité, votre expertise, et les grandes lignes de votre projet. Votre profil est ensuite validé manuellement par l\'équipe Logan sous 48 heures.',
  },
  {
    question: 'Puis-je me désinscrire à tout moment ?',
    answer:
      'Oui. Vous pouvez supprimer votre compte et l\'ensemble de vos données à tout moment depuis votre espace personnel. La suppression est définitive et immédiate : votre profil est retiré du réseau et aucune information n\'est conservée.',
  },
];

const cabinetFAQ: FAQItem[] = [
  {
    question: 'Comment fonctionne l\'accès aux profils candidats ?',
    answer:
      'Depuis votre espace cabinet, accédez en temps réel au marché des candidats et consultez les profils rigoureusement validés en amont et triés par expertise et séniorité. L\'identité et le cabinet d\'origine restent strictement confidentiels. Lorsqu\'un profil retient votre attention, manifestez votre intérêt auprès de Logan. Logan organise la mise en relation après avoir obtenu l\'accord explicite du candidat.',
  },
  {
    question: 'Comment Logan garantit-il la confidentialité de mes recherches ?',
    answer:
      'Le cloisonnement est au cœur de la plateforme. L\'identité de votre cabinet n\'est jamais visible par les candidats ni par les autres cabinets. Les candidats pourront prendre connaissance des grandes lignes de votre recherche (contexte, équipe, expertise et séniorité recherchées), jamais de votre identité qui est préservée en amont de toute volonté de rapprochement confirmé.',
  },
  {
    question: 'Puis-je publier une recherche ciblée sur la plateforme ?',
    answer:
      'Oui. Logan vous permet de diffuser vos recherches les plus confidentielles en préservant l\'identité de votre cabinet : si un candidat manifeste un intérêt pour votre recherche (contexte, équipe, expertise et séniorité recherchées) et que le profil vous paraît pertinent, Logan organise la mise en relation et vous accompagne tout au long du processus jusqu\'à son terme.',
  },
  {
    question: 'Quels types de profils sont disponibles ?',
    answer:
      'Logan réunit des avocats d\'affaires à tous les stades de leur carrière — collaborateurs juniors, mid-levels, seniors, counsels et associés — issus des cabinets les plus reconnus du marché (Chambers, Legal 500). Chaque profil est scrupuleusement analysé et validé par Logan.',
  },
  {
    question: 'Quel accompagnement Logan propose-t-il ?',
    answer:
      'Logan ne se limite pas à la mise en relation. Notre équipe vous accompagne de bout en bout : qualification du besoin, présélection des profils, coordination des entretiens, débriefings réguliers et suivi post-intégration. L\'objectif est de garantir non seulement la pertinence du matching, mais aussi la réussite durable de la collaboration.',
  },
  {
    question: 'Quel est le modèle tarifaire de Logan ?',
    answer:
      'Logan n\'exige ni abonnement ni acompte pour accéder à son réseau. Seul un honoraire de résultat est facturé au cabinet.',
  },
];

const FAQRow = ({
  item,
  index,
  open,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) => (
  <div className="border-b border-white/10 group">
    <button
      onClick={onToggle}
      className="w-full flex items-start gap-4 md:gap-5 py-6 md:py-7 text-left transition-colors"
    >
      <span className="font-serif text-[0.7rem] md:text-[0.72rem] text-white/40 tabular-nums tracking-[0.15em] pt-1.5 w-7 shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span
        className={cn(
          'flex-1 font-sans text-[0.88rem] md:text-[0.95rem] font-medium leading-snug tracking-[-0.005em] transition-colors',
          open ? 'text-white' : 'text-white/80 group-hover:text-white'
        )}
      >
        {item.question}
      </span>

      <span
        className={cn(
          'shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300',
          open ? 'bg-white border-white text-black' : 'border-white/25 text-white/65 group-hover:border-white/60 group-hover:text-white'
        )}
      >
        {open ? <Minus className="w-3 h-3" strokeWidth={1.8} /> : <Plus className="w-3 h-3" strokeWidth={1.8} />}
      </span>
    </button>
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="pl-0 md:pl-[2.75rem] pr-0 md:pr-6 pb-7">
            <p className="font-sans text-[0.85rem] md:text-[0.9rem] leading-[1.8] text-white/65 text-justify">
              {item.answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQSection = () => {
  const [tab, setTab] = useState<Tab>('candidat');
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const items = tab === 'candidat' ? candidatFAQ : cabinetFAQ;

  const handleTabChange = (t: Tab) => {
    setTab(t);
    setOpenIdx(0);
  };

  return (
    <section className="py-28 md:py-40 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
        {/* Header — left aligned editorial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/45 font-sans font-medium mb-5">
              Questions fréquentes
            </p>
            <h2 className="text-[2rem] sm:text-4xl md:text-[3rem] font-serif font-normal text-white tracking-[-0.02em] leading-[1.05]">
              Tout ce que vous<br />
              <span className="italic text-white/85">devez savoir.</span>
            </h2>
          </div>

          {/* Tabs as pill */}
          <div className="inline-flex p-1 rounded-full bg-white/[0.06] border border-white/[0.1] self-start md:self-auto">
            {(['candidat', 'cabinet'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={cn(
                  'relative px-5 py-2 text-[0.78rem] font-sans font-medium transition-colors rounded-full',
                  tab === t ? 'text-black' : 'text-white/55 hover:text-white/85'
                )}
              >
                {tab === t && (
                  <motion.span
                    layoutId="faq-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative z-10">{t === 'candidat' ? 'Candidats' : 'Firms'}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 grid grid-cols-1 md:grid-cols-2 md:gap-x-12 lg:gap-x-16"
          >
            {items.map((item, i) => (
              <FAQRow
                key={`${tab}-${i}`}
                item={item}
                index={i}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FAQSection;
