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
    question: 'Mon profil est-il strictement protégé ?',
    answer:
      'Oui. Lors de votre inscription, vous choisissez l\'un des deux statuts de visibilité :\n\n• Confidentiel — Fermé : votre profil est enregistré mais non consultable par les cabinets. Logan vous contacte uniquement si une opportunité pertinente se présente.\n\n• Confidentiel — Ouvert : les cabinets peuvent consulter votre profil (séniorité, expertise, projet professionnel) sans jamais accéder à votre identité ni au nom de votre cabinet actuel.\n\nVous pouvez modifier ce statut à tout moment depuis votre espace personnel.',
  },
  {
    question: 'Mon profil peut-il être identifié par mon cabinet actuel ?',
    answer:
      'Non. Votre identité — nom, prénom et cabinet d\'origine — n\'est jamais accessible aux cabinets recruteurs. Seul Logan peut, avec votre accord explicite, organiser un rapprochement avec un cabinet ayant manifesté un intérêt pour votre profil. Le cas échéant, la mise en relation s\'effectue dans un cadre classique : transmission de votre CV et accompagnement complet tout au long du processus de recrutement.',
  },
  {
    question: 'Mon profil peut-il être deviné grâce aux informations affichées ?',
    answer:
      'Non. Logan applique un principe de cloisonnement strict : les membres d\'un même cabinet ne peuvent jamais apparaître sur leurs espaces respectifs. Au-delà de ce cloisonnement, les informations visibles sont volontairement généralisées — fourchettes de séniorité, catégories d\'expertise larges, type de structure — de sorte qu\'aucun recoupement ne permette d\'identifier un candidat, même au sein d\'un marché restreint.',
  },
  {
    question: 'Mon CV est-il partagé sans mon accord ?',
    answer:
      'Jamais. Votre CV n\'est transmis à un cabinet qu\'après votre autorisation explicite, dans le cadre d\'une mise en relation validée par Logan. Aucun document n\'est diffusé, partagé ou rendu accessible sans que vous n\'ayez donné votre consentement préalable — à chaque étape, vous gardez le contrôle.',
  },
  {
    question: 'Les cabinets peuvent-ils me contacter directement ?',
    answer:
      'Non. Logan est l\'unique intermédiaire entre vous et les cabinets. Qu\'il s\'agisse d\'un mandat de recrutement ou d\'une démarche spontanée, c\'est toujours Logan qui initie la mise en relation — et la décision de rencontrer ou non un cabinet vous appartient entièrement. Vous restez ainsi attractif en continu sur le marché, sans jamais perdre le contrôle de vos démarches.',
  },
  {
    question: 'Les autres candidats inscrits peuvent-ils voir mon profil ?',
    answer:
      'Non. L\'accès au réseau de profils est réservé exclusivement aux cabinets partenaires. Aucun candidat ne peut consulter le profil d\'un autre candidat. Votre espace est strictement personnel et cloisonné.',
  },
  {
    question: 'En quoi Logan se distingue-t-il de l\'approche classique d\'un chasseur de têtes ?',
    answer:
      'Logan ne remplace pas la chasse de têtes traditionnelle : il la complète en y ajoutant une dimension inédite. Là où l\'approche classique repose sur des sollicitations ponctuelles, Logan vous offre un espace personnel dédié avec une visibilité continue sur votre marché, un matching intelligent alimenté par l\'IA et validé par l\'intervention humaine, et une transparence totale sur l\'avancement de chaque processus. Vous passez d\'une posture passive à une posture informée et maîtrisée.',
  },
  {
    question: 'Quel est l\'intérêt de rejoindre Logan ?',
    answer:
      'Logan vous permet de rester visible aux yeux du marché sans effort et sans risque. Concrètement : vous êtes alerté lorsqu\'un cabinet s\'intéresse à votre profil, vous suivez en temps réel les dynamiques de votre segment d\'expertise, et vous pouvez saisir une opportunité au moment précis où elle correspond à vos aspirations — sans avoir à multiplier les démarches ni dépendre du calendrier d\'un chasseur de têtes.',
  },
  {
    question: 'Comment suis-je informé des opportunités ?',
    answer:
      'Depuis votre espace personnel, vous recevez des notifications dès qu\'un cabinet manifeste un intérêt pour votre profil ou qu\'une opportunité correspond à vos critères. Vous pouvez également consulter à tout moment la dynamique de votre marché : mouvements, tendances, et nouveaux besoins identifiés par Logan. Tout est centralisé dans un tableau de bord clair et confidentiel.',
  },
  {
    question: 'L\'inscription est-elle gratuite ?',
    answer:
      'Oui, l\'inscription est entièrement gratuite pour les candidats — sans frais d\'adhésion, sans commission et sans engagement. Logan se rémunère exclusivement auprès des cabinets recruteurs. Vous bénéficiez de l\'ensemble des fonctionnalités de la plateforme sans aucun coût, à tout moment.',
  },
  {
    question: 'Combien de temps prend l\'inscription ?',
    answer:
      'Moins de 10 minutes. Le parcours d\'inscription est conçu pour être rapide et fluide : vous renseignez votre séniorité, vos domaines d\'expertise, votre projet professionnel et vos préférences de confidentialité. Une fois soumis, votre profil est validé manuellement par l\'équipe Logan sous 48 heures.',
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
      'Vous accédez à un vivier de profils entièrement anonymisés présentant l\'expertise, la séniorité, les langues pratiquées et le projet professionnel de chaque candidat. L\'identité et le cabinet d\'origine restent strictement confidentiels. Lorsqu\'un profil retient votre attention, vous manifestez votre intérêt et Logan se charge d\'organiser la mise en relation après avoir obtenu l\'accord explicite du candidat.',
  },
  {
    question: 'Puis-je contacter un candidat directement ?',
    answer:
      'Non. Chaque mise en relation passe exclusivement par Logan, qui joue le rôle d\'intermédiaire de confiance. Cette intermédiation garantit la confidentialité du processus pour les deux parties, préserve la qualité de l\'expérience candidat et assure un accompagnement structuré à chaque étape, de la prise de contact jusqu\'à la finalisation du recrutement.',
  },
  {
    question: 'Comment Logan garantit-il la confidentialité de mes recherches ?',
    answer:
      'Le cloisonnement est au cœur de la plateforme. Vos recherches et mandats ne sont jamais visibles par les candidats ni par les autres cabinets. Seul Logan connaît la nature de vos besoins et assure la mise en relation de manière ciblée et discrète, dans le respect absolu de la confidentialité de votre stratégie de recrutement.',
  },
  {
    question: 'Puis-je publier une recherche ciblée sur la plateforme ?',
    answer:
      'Oui. En complément de l\'exploration libre du vivier, vous pouvez publier un mandat de recherche confidentiel en précisant vos critères : domaine d\'expertise, niveau de séniorité, langues, type de cabinet d\'origine. Logan identifie alors les profils les plus pertinents et vous les propose directement, accélérant ainsi le processus de rapprochement.',
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
    question: 'Quel accompagnement Logan propose-t-il tout au long du processus ?',
    answer:
      'Logan ne se limite pas à la mise en relation. Notre équipe vous accompagne de bout en bout : qualification du besoin, présélection des profils, coordination des entretiens, débriefings réguliers et suivi post-intégration. L\'objectif est de garantir non seulement la pertinence du matching, mais aussi la réussite durable de la collaboration.',
  },
];

const FAQSection = () => {
  const [tab, setTab] = useState<Tab>('candidat');
  const items = tab === 'candidat' ? candidatFAQ : cabinetFAQ;

  return (
    <section className="py-24 md:py-32 bg-white">
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
          <div className="inline-flex rounded-full border border-foreground/15 bg-foreground/[0.03] p-1">
            {(['candidat', 'cabinet'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 capitalize',
                  tab === t
                    ? 'bg-foreground text-white shadow-sm'
                    : 'text-foreground/50 hover:text-foreground'
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
          <Accordion type="single" collapsible className="space-y-0">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-foreground/[0.08] first:border-t first:border-foreground/[0.08] rounded-none px-0 overflow-hidden"
              >
                <AccordionTrigger className="text-left font-sans text-sm md:text-[15px] font-medium text-foreground/85 hover:text-foreground hover:no-underline py-6 gap-4 transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/55 font-sans text-sm leading-relaxed pb-6">
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
