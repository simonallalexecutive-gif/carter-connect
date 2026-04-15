import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type Tab = 'candidat' | 'cabinet';

interface FAQItem {
  question: string;
  answer: string;
}

const candidatFAQ: FAQItem[] = [
  {
    question: 'Mon profil est-il strictement protégé ?',
    answer:
      'Oui. Lors de votre inscription, vous choisissez votre statut de visibilité :\n\n• Confidentiel — Fermé : votre profil est enregistré mais non consultable par les cabinets. Logan vous contacte uniquement si une opportunité pertinente se présente.\n\n• Confidentiel — Ouvert : les cabinets peuvent consulter votre profil (séniorité, expertise, projet professionnel) sans jamais accéder à votre identité ni au nom de votre cabinet actuel.\n\nVotre identité — nom, prénom et cabinet d\'origine — n\'est jamais accessible aux cabinets recruteurs. Seul Logan peut, avec votre accord explicite, organiser un rapprochement. Les informations visibles sont volontairement généralisées et les membres d\'un même cabinet ne peuvent jamais apparaître sur leurs espaces respectifs.',
  },
  {
    question: 'Mon CV ou mes documents sont-ils partagés sans mon accord ?',
    answer:
      'Jamais. Votre CV n\'est transmis à un cabinet qu\'après votre autorisation explicite, dans le cadre d\'une mise en relation validée par Logan. Aucun document n\'est diffusé, partagé ou rendu accessible sans votre consentement préalable. De même, les cabinets ne peuvent jamais vous contacter directement — Logan est l\'unique intermédiaire à chaque étape.',
  },
  {
    question: 'En quoi Logan se distingue-t-il d\'un chasseur de têtes classique ?',
    answer:
      'Logan ne remplace pas la chasse de têtes traditionnelle : il la complète. Là où l\'approche classique repose sur des sollicitations ponctuelles, Logan vous offre un espace personnel dédié avec une visibilité continue sur votre marché, un matching intelligent alimenté par l\'IA et validé par l\'intervention humaine, et une transparence totale sur l\'avancement de chaque processus. Vous passez d\'une posture passive à une posture informée et maîtrisée.',
  },
  {
    question: 'Quel est l\'intérêt de rejoindre Logan ?',
    answer:
      'Logan vous permet de rester visible aux yeux du marché sans effort et sans risque. Vous êtes alerté lorsqu\'un cabinet s\'intéresse à votre profil, vous suivez en temps réel les dynamiques de votre segment d\'expertise, et vous pouvez saisir une opportunité au moment précis où elle correspond à vos aspirations — sans avoir à multiplier les démarches ni dépendre du calendrier d\'un chasseur de têtes.',
  },
  {
    question: 'Comment suis-je informé des opportunités ?',
    answer:
      'Depuis votre espace personnel, vous recevez des notifications dès qu\'un cabinet manifeste un intérêt pour votre profil ou qu\'une opportunité correspond à vos critères. Vous pouvez également consulter la dynamique de votre marché : mouvements, tendances, et nouveaux besoins identifiés par Logan. Tout est centralisé dans un tableau de bord clair et confidentiel.',
  },
  {
    question: 'L\'inscription est-elle gratuite et combien de temps prend-elle ?',
    answer:
      'Oui, l\'inscription est entièrement gratuite pour les candidats — sans frais d\'adhésion, sans commission et sans engagement. Le parcours d\'inscription prend moins de 10 minutes : vous renseignez votre séniorité, vos domaines d\'expertise, votre projet professionnel et vos préférences de confidentialité. Votre profil est ensuite validé manuellement par l\'équipe Logan sous 48 heures.',
  },
  {
    question: 'Puis-je me désinscrire à tout moment ?',
    answer:
      'Oui. Vous pouvez supprimer votre compte et l\'ensemble de vos données à tout moment depuis votre espace personnel. La suppression est définitive et immédiate : votre profil est retiré du réseau et aucune information n\'est conservée.',
  },
  {
    question: 'Intégrer Logan, c\'est envoyer un signal au marché que je suis en recherche active ?',
    answer:
      'Absolument pas. Logan est là pour renforcer votre attractivité tout en vous conférant la discrétion la plus totale. Ainsi, vous restez connecté à votre marché et maître de décider quand l\'activer, tout en bénéficiant, en temps utiles, d\'un accompagnement sur-mesure et d\'une visibilité inégalée.',
  },
];

const cabinetFAQ: FAQItem[] = [
  {
    question: 'Comment fonctionne l\'accès aux profils candidats ?',
    answer:
      'Vous accédez à un vivier de profils entièrement anonymisés présentant l\'expertise, la séniorité, les langues pratiquées et le projet professionnel de chaque candidat. L\'identité et le cabinet d\'origine restent strictement confidentiels. Lorsqu\'un profil retient votre attention, vous manifestez votre intérêt et Logan organise la mise en relation après avoir obtenu l\'accord explicite du candidat. Chaque mise en relation passe exclusivement par Logan, qui joue le rôle d\'intermédiaire de confiance.',
  },
  {
    question: 'Comment Logan garantit-il la confidentialité de mes recherches ?',
    answer:
      'Le cloisonnement est au cœur de la plateforme. Vos recherches et mandats ne sont jamais visibles par les candidats ni par les autres cabinets. Seul Logan connaît la nature de vos besoins et assure la mise en relation de manière ciblée et discrète, dans le respect absolu de la confidentialité de votre stratégie de recrutement.',
  },
  {
    question: 'Puis-je publier une recherche ciblée sur la plateforme ?',
    answer:
      'Oui. En complément de l\'exploration libre du vivier, vous pouvez publier un mandat de recherche confidentiel en précisant vos critères : domaine d\'expertise, niveau de séniorité, langues, type de cabinet d\'origine. Logan identifie alors les profils les plus pertinents et vous les propose directement.',
  },
  {
    question: 'Quels types de profils sont disponibles et comment sont-ils vérifiés ?',
    answer:
      'Logan réunit des avocats d\'affaires à tous les stades de leur carrière — collaborateurs juniors, mid-levels, seniors, counsels et associés — issus des cabinets les plus reconnus du marché parisien et international. Chaque inscription fait l\'objet d\'une validation manuelle par l\'équipe Logan sous 48 heures : nous vérifions la cohérence du parcours, la pertinence des informations et l\'adéquation avec les standards du réseau.',
  },
  {
    question: 'Quel est le modèle tarifaire de Logan ?',
    answer:
      'Logan repose sur un modèle hybride : un abonnement donnant un accès permanent au vivier de candidats qualifiés, associé à un fee de placement significativement réduit par rapport aux standards du marché. Ce modèle vous permet de recruter de manière proactive, au bon moment, avec une parfaite maîtrise budgétaire.',
  },
  {
    question: 'Quel accompagnement Logan propose-t-il ?',
    answer:
      'Logan ne se limite pas à la mise en relation. Notre équipe vous accompagne de bout en bout : qualification du besoin, présélection des profils, coordination des entretiens, débriefings réguliers et suivi post-intégration. L\'objectif est de garantir non seulement la pertinence du matching, mais aussi la réussite durable de la collaboration.',
  },
];

const FAQSection = () => {
  const [tab, setTab] = useState<Tab>('candidat');
  const items = tab === 'candidat' ? candidatFAQ : cabinetFAQ;
  const midpoint = Math.ceil(items.length / 2);
  const col1 = items.slice(0, midpoint);
  const col2 = items.slice(midpoint);

  return (
    <section className="pt-24 md:pt-36 pb-0" style={{ background: 'hsl(0 0% 8%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="text-[11px] tracking-[0.25em] uppercase text-white/30 font-sans font-medium mb-6">
            Questions fréquentes
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.8rem] font-serif font-normal text-white tracking-[-0.02em] mb-5">
            FAQ
          </h2>
        </motion.div>

        {/* Tab toggle — underline style */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-14"
        >
          <div className="inline-flex gap-0 border-b border-white/10">
            {(['candidat', 'cabinet'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'relative px-6 py-3 text-sm font-sans font-medium transition-all duration-300 capitalize',
                  tab === t
                    ? 'text-white'
                    : 'text-white/35 hover:text-white/60'
                )}
              >
                {t === 'candidat' ? 'Candidats' : 'Cabinets'}
                {tab === t && (
                  <motion.div
                    layoutId="faq-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-white"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Two columns */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12"
          >
            <div>
              <Accordion type="single" collapsible className="space-y-0">
                {col1.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`left-${i}`}
                    className="border-b border-white/[0.08] first:border-t first:border-white/[0.08] rounded-none px-0 overflow-hidden"
                  >
                    <AccordionTrigger className="text-left font-sans text-sm md:text-[15px] font-medium text-white/85 hover:text-white hover:no-underline py-6 gap-4 transition-colors">
                      <span className="flex items-baseline gap-3">
                        <span className="text-white/20 font-sans text-xs tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/55 font-sans text-sm leading-relaxed pb-6 text-justify">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div>
              <Accordion type="single" collapsible className="space-y-0">
                {col2.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`right-${i}`}
                    className="border-b border-white/[0.08] first:border-t first:border-white/[0.08] rounded-none px-0 overflow-hidden"
                  >
                    <AccordionTrigger className="text-left font-sans text-sm md:text-[15px] font-medium text-white/85 hover:text-white hover:no-underline py-6 gap-4 transition-colors">
                      <span className="flex items-baseline gap-3">
                        <span className="text-white/20 font-sans text-xs tabular-nums">{String(midpoint + i + 1).padStart(2, '0')}</span>
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/55 font-sans text-sm leading-relaxed pb-6 text-justify">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FAQSection;
