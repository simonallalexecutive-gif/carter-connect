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
      'Vous accédez à un vivier de profils entièrement anonymisés : expertise, séniorité, langues, projet professionnel. L\'identité du candidat et son cabinet d\'origine restent confidentiels. Lorsqu\'un profil retient votre attention, Logan organise la mise en relation après avoir obtenu l\'accord explicite du candidat.',
  },
  {
    question: 'Puis-je contacter un candidat directement ?',
    answer:
      'Non. Chaque mise en relation passe exclusivement par Logan. Cette intermédiation garantit la confidentialité du processus, la qualité de l\'expérience pour les deux parties et un accompagnement structuré jusqu\'à la finalisation du recrutement.',
  },
  {
    question: 'Quels types de profils sont disponibles sur la plateforme ?',
    answer:
      'Logan réunit des avocats d\'affaires à tous les stades de leur carrière — collaborateurs juniors, mid-levels, seniors, counsels et associés — issus des cabinets d\'affaires les plus reconnus du marché parisien et international (Magic Circle, cabinets US, cabinets français de premier plan).',
  },
  {
    question: 'Comment les profils sont-ils vérifiés ?',
    answer:
      'Chaque inscription fait l\'objet d\'une validation par l\'équipe Logan sous 48 heures. Nous vérifions la cohérence des informations renseignées, le parcours professionnel et la pertinence du profil au regard des standards du réseau.',
  },
  {
    question: 'Quel est le modèle tarifaire ?',
    answer:
      'Logan propose un modèle hybride conçu pour optimiser vos coûts de recrutement : un abonnement mensuel donnant un accès permanent au vivier de candidats, associé à un fee de placement significativement réduit par rapport aux standards du marché (chasseurs classiques : 20 à 25 % de fee). Ce modèle vous permet de recruter de manière proactive, au bon moment, sans surprises tarifaires.',
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
