import { useState } from 'react';
import { motion } from 'motion/react';
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
    question: 'Mon profil peut-il être identifié par mon cabinet actuel ?',
    answer:
      'Non. Votre identité — nom, prénom et cabinet d\'origine — n\'est jamais accessible aux cabinets recruteurs. Seul Logan peut, avec votre accord explicite, organiser un rapprochement avec un cabinet ayant manifesté un intérêt pour votre profil. Le cas échéant, la mise en relation s\'effectue dans un cadre classique : transmission de votre CV et accompagnement complet tout au long du processus de recrutement.',
  },
  {
    question: 'Mon profil peut-il être deviné grâce aux informations affichées ?',
    answer:
      'Non. Logan applique un principe de cloisonnement strict : les membres d\'un même cabinet ne peuvent jamais apparaître sur leurs espaces respectifs. Les informations visibles (séniorité, domaines d\'expertise, type de cabinet) sont formulées de manière à rendre toute identification impossible.',
  },
  {
    question: 'Mon profil est-il strictement protégé ?',
    answer:
      'Oui. Lors de votre inscription, vous choisissez l\'un des deux statuts de visibilité :\n\n• Confidentiel — Fermé : votre profil est enregistré mais non consultable par les cabinets. Logan vous contacte uniquement si une opportunité pertinente se présente.\n\n• Confidentiel — Ouvert : les cabinets peuvent consulter votre profil (séniorité, expertise, projet professionnel) sans jamais accéder à votre identité ni au nom de votre cabinet actuel.\n\nVous pouvez modifier ce statut à tout moment depuis votre espace personnel.',
  },
  {
    question: 'Les cabinets peuvent-ils me contacter directement ?',
    answer:
      'Non. Logan est l\'unique intermédiaire entre vous et les cabinets. Qu\'il s\'agisse d\'un mandat de recrutement ou d\'une démarche spontanée, c\'est toujours Logan qui initie la mise en relation — et la décision de rencontrer ou non un cabinet vous appartient entièrement. Vous restez ainsi attractif en continu sur le marché, sans jamais perdre le contrôle de vos démarches.',
  },
  {
    question: 'Quel est l\'intérêt de rejoindre Logan ?',
    answer:
      'Logan vous offre une visibilité permanente et maîtrisée sur votre marché, dans un cadre strictement confidentiel. Vous êtes informé en continu de la dynamique du marché et des intérêts manifestés par les cabinets, sans avoir à entreprendre de démarches actives. Lorsqu\'une opportunité correspond à vos aspirations, vous décidez d\'y répondre — au moment qui vous convient. Plus besoin d\'attendre qu\'un chasseur de têtes vous sollicite : Logan vous offre transparence, suivi personnalisé et accompagnement sur mesure.',
  },
  {
    question: 'En quoi Logan se distingue-t-il de l\'approche classique d\'un chasseur de têtes ?',
    answer:
      'Logan ne remplace pas l\'approche traditionnelle : il la complète en proposant un modèle inédit, pensé pour répondre aux attentes des candidats. Un espace plus dynamique, une visibilité continue, une transparence totale sur les opportunités et un accompagnement structuré — le tout dans un environnement confidentiel que vous contrôlez.',
  },
  {
    question: 'Les autres candidats inscrits peuvent-ils voir mon profil ?',
    answer:
      'Non. L\'accès au réseau de profils est réservé exclusivement aux cabinets partenaires. Aucun candidat ne peut consulter le profil d\'un autre candidat.',
  },
];

const cabinetFAQ: FAQItem[] = [
  {
    question: 'Comment fonctionne l\'accès aux profils candidats ?',
    answer:
      'Vous accédez à un vivier de profils entièrement anonymisés présentant l\'expertise, la séniorité, les langues pratiquées et le projet professionnel de chaque candidat. L\'identité et le cabinet d\'origine restent strictement confidentiels. Lorsqu\'un profil retient votre attention, vous manifestez votre intérêt et Logan se charge d\'organiser la mise en relation après avoir obtenu l\'accord explicite du candidat.',
  },
  {
    question: 'Puis-je contacter un candidat directement ?',
    answer:
      'Non. Chaque mise en relation passe exclusivement par Logan, qui joue le rôle d\'intermédiaire de confiance. Cette intermédiation garantit la confidentialité du processus pour les deux parties, préserve la qualité de l\'expérience candidat et assure un accompagnement structuré à chaque étape, de la prise de contact jusqu\'à la finalisation du recrutement.',
  },
  {
    question: 'Quels types de profils sont disponibles sur la plateforme ?',
    answer:
      'Logan réunit des avocats d\'affaires à tous les stades de leur carrière — collaborateurs juniors, mid-levels, seniors, counsels et associés — issus des cabinets d\'affaires les plus reconnus du marché parisien et international : Magic Circle, cabinets US, cabinets français indépendants de premier plan. Chaque profil est qualifié manuellement avant d\'intégrer le réseau.',
  },
  {
    question: 'Comment les profils sont-ils vérifiés avant d\'intégrer le réseau ?',
    answer:
      'Chaque inscription fait l\'objet d\'une validation manuelle par l\'équipe Logan sous 48 heures. Nous vérifions la cohérence du parcours professionnel, la pertinence des informations renseignées et l\'adéquation du profil avec les standards d\'exigence du réseau. Seuls les profils validés sont rendus accessibles aux cabinets partenaires.',
  },
  {
    question: 'Quel est le modèle tarifaire de Logan ?',
    answer:
      'Logan repose sur un modèle hybride pensé pour optimiser vos coûts de recrutement : un abonnement donnant un accès permanent au vivier de candidats qualifiés, associé à un fee de placement significativement réduit par rapport aux standards du marché (les chasseurs classiques facturent généralement entre 20 et 25 %). Ce modèle vous permet de recruter de manière proactive, au bon moment, avec une parfaite maîtrise budgétaire.',
  },
  {
    question: 'Puis-je publier une recherche ciblée sur la plateforme ?',
    answer:
      'Oui. En complément de l\'exploration libre du vivier, vous pouvez publier un mandat de recherche confidentiel en précisant vos critères : domaine d\'expertise, niveau de séniorité, langues, type de cabinet d\'origine. Logan identifie alors les profils les plus pertinents et vous les propose directement, accélérant ainsi le processus de rapprochement.',
  },
  {
    question: 'Comment Logan garantit-il la confidentialité de mes recherches ?',
    answer:
      'Le cloisonnement est au cœur de la plateforme. Vos recherches et mandats ne sont jamais visibles par les candidats ni par les autres cabinets. Seul Logan connaît la nature de vos besoins et assure la mise en relation de manière ciblée et discrète, dans le respect absolu de la confidentialité de votre stratégie de recrutement.',
  },
  {
    question: 'Quel accompagnement Logan propose-t-il tout au long du processus ?',
    answer:
      'Logan ne se limite pas à la mise en relation. Notre équipe vous accompagne de bout en bout : qualification du besoin, présélection des profils, coordination des entretiens, débriefings réguliers et suivi post-intégration. L\'objectif est de garantir non seulement la pertinence du matching, mais aussi la réussite durable de la collaboration.',
  },
];

const FAQSection = () => {
  const [tab, setTab] = useState<Tab>('candidat');
  const items = tab === 'candidat' ? candidatFAQ : cabinetFAQ;

  return (
    <section className="py-24 md:py-32 bg-[hsl(0_0%_96%)] relative">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 font-sans font-medium mb-4">
            Questions fréquentes
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-[2.5rem] font-serif font-normal text-foreground tracking-[-0.02em]">
            FAQ
          </h2>
        </motion.div>

        {/* Tab toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex rounded-full border border-border bg-background p-1">
            {(['candidat', 'cabinet'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 capitalize',
                  tab === t
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Accordion */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border bg-background rounded-lg px-6 overflow-hidden data-[state=open]:shadow-sm transition-shadow"
              >
                <AccordionTrigger className="text-left font-sans text-sm md:text-[15px] font-medium text-foreground hover:no-underline py-5 gap-4">
                  <span className="flex items-start gap-3">
                    <span className="text-xs font-serif text-muted-foreground/50 mt-0.5 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-sans text-sm leading-relaxed pl-8 pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
