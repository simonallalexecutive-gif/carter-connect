import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      'Oui. Votre identité — nom, prénom et cabinet d\'origine — n\'est jamais accessible aux cabinets recruteurs. Seul Logan peut, avec votre accord explicite, organiser un rapprochement. Les informations visibles sont volontairement généralisées.',
  },
  {
    question: 'Mon cabinet actuel peut-il avoir connaissance de ma présence sur Logan ?',
    answer:
      'Non, les membres d\'un même cabinet ne peuvent jamais apparaître sur leurs espaces respectifs. De manière générale, aucun élément ne permet à un cabinet de reconnaître votre identité ni celle de votre cabinet actuel.',
  },
  {
    question: 'Mon CV peut-il être partagé sans mon accord ?',
    answer:
      'Jamais. Votre CV n\'est transmis à un cabinet qu\'après votre autorisation explicite, dans le cadre d\'une mise en relation validée par Logan. De même, les cabinets ne peuvent jamais vous contacter directement — Logan est l\'unique intermédiaire à chaque étape.',
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
      'Logan repose sur un modèle hybride : un abonnement donnant un accès permanent au vivier de candidats qualifiés, associé à un fee de placement significativement réduit par rapport aux standards du marché. Ce modèle vous permet de recruter de manière proactive, au bon moment, avec une parfaite maîtrise budgétaire.',
  },
];

const FAQSection = () => {
  const [tab, setTab] = useState<Tab>('candidat');
  const items = tab === 'candidat' ? candidatFAQ : cabinetFAQ;

  return (
    <section className="py-32 md:py-44 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">

          {/* LEFT — sticky title block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-32 lg:self-start"
          >
            <p className="text-[11px] tracking-[0.25em] uppercase text-black/30 font-sans font-medium mb-8">
              FAQ
            </p>
            <h2 className="font-serif text-[2.25rem] sm:text-5xl md:text-[4.25rem] leading-[1.05] tracking-[-0.015em] text-black/90 font-normal mb-8">
              Questions.
            </h2>
            <p className="text-sm md:text-[15px] text-black/55 font-sans leading-relaxed max-w-md mb-10">
              Logan opère sous des standards stricts de confidentialité et de sécurité, protégeant l'identité et les intérêts de ses membres à chaque étape.
            </p>

            {/* Tab toggle */}
            <div className="inline-flex gap-0 border-b border-black/10 mb-10">
              {(['candidat', 'cabinet'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'relative px-5 py-3 text-sm font-sans font-medium transition-all duration-300 capitalize',
                    tab === t ? 'text-black' : 'text-black/35 hover:text-black/60'
                  )}
                >
                  {t === 'candidat' ? 'Candidats' : 'Cabinets'}
                  {tab === t && (
                    <motion.div
                      layoutId="faq-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px bg-black"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <Link
              to="/prendre-rdv"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-black bg-black text-white text-[13px] tracking-[0.05em] font-sans font-medium hover:bg-white hover:text-black transition-all duration-300 group"
            >
              Échanger avec Logan
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>

          {/* RIGHT — single column accordion */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Accordion type="single" collapsible className="space-y-0">
                  {items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`item-${i}`}
                      className="border-b border-black/[0.12] first:border-t first:border-black/[0.12] rounded-none px-0 overflow-hidden group"
                    >
                      <AccordionTrigger
                        className={cn(
                          'text-left font-serif text-xl md:text-[1.6rem] font-normal text-black/85 hover:text-black hover:no-underline py-8 gap-6 transition-colors leading-snug tracking-[-0.01em]',
                          '[&>svg]:hidden',
                          '[&[data-state=open]_.faq-plus]:rotate-45'
                        )}
                      >
                        <span className="flex-1">{item.question}</span>
                        <span className="faq-plus shrink-0 w-10 h-10 rounded-full border border-black/20 flex items-center justify-center transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                          <Plus className="w-4 h-4" strokeWidth={1.5} />
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-black/55 font-sans text-[15px] leading-relaxed pb-8 pr-16 text-justify">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
