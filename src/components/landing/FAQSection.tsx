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
      'Non, les cabinets n\'auront jamais accès directement à votre identité (nom et prénom) et ne peuvent pas identifier non plus le nom de votre cabinet actuel. Seul Logan pourra, avec votre accord explicite, organiser un rapprochement avec un cabinet qui a manifesté un intérêt pour votre profil. Dans ce dernier cas, la mise en relation se fera dans des conditions classiques avec transmission du CV et accompagnement complet tout au long du processus de recrutement.',
  },
  {
    question: 'Mon profil peut-il être deviné par mon cabinet actuel avec les informations transmises ?',
    answer:
      'Non, Logan s\'assure que les membres d\'un même cabinet ne puissent apparaître sur leurs espaces respectifs.',
  },
  {
    question: 'Mon profil est-il strictement protégé ?',
    answer:
      'Oui, en vous inscrivant à Logan, vous avez deux options concernant votre statut de visibilité : confidentiel — fermé, ce qui signifie que vous êtes bien inscrits, que Logan peut vous contacter si une opportunité paraît cohérente et pertinente pour vous, mais les cabinets ne peuvent explorer votre profil ; confidentiel — ouvert, les cabinets pourront consulter votre profil (séniorité, expertise, projet) mais à aucun moment votre identité (nom, prénom) et l\'origine de votre cabinet.',
  },
  {
    question: 'Les cabinets peuvent-ils me contacter directement ?',
    answer:
      'Non, Logan est le seul à pouvoir vous mettre en relation avec un cabinet qui aura manifesté son intérêt pour votre profil, soit dans le cadre d\'un mandat soit par opportunisme en dehors de toute recherche. Vous restez alors attractif en continu aux yeux du marché pour ne louper aucune opportunité mais la décision de rencontrer ou non un cabinet, par notre intermédiaire, vous appartient.',
  },
  {
    question: 'Quel intérêt de rejoindre Logan ?',
    answer:
      'Logan vous permet de rester visible, tout en préservant votre anonymat et tout en assurant la confidentialité de vos démarches, aux yeux de votre marché de sorte que vous pourrez en continu être informé de sa dynamique, des intérêts manifestés par les cabinets, et de rester alerte dans un espace protégé qui vous permet, sans effort, de répondre, quand vous le souhaitez, à l\'opportunité que vous avez toujours recherché, sans devoir attendre nécessairement d\'être contacté par un chasseur de têtes dans les conditions habituelles : Logan vous offre votre espace pour une parfaite transparence de vos démarches, un parfait suivi, un parfait accompagnement.',
  },
  {
    question: 'En quoi cette plateforme apporte quelque chose de plus que l\'approche classique de chasseurs de têtes ?',
    answer:
      'Logan s\'ajoute à l\'approche classique et n\'a pas pour objectif de la remplacer : elle est complémentaire et en même temps propose une toute nouvelle approche en phase avec les attentes des candidats — un espace plus dynamique, plus transparent, plus attractif.',
  },
  {
    question: 'Les candidats inscrits sur la plateforme peuvent-ils consulter mon profil ?',
    answer:
      'Non, seuls les cabinets peuvent explorer le réseau des candidats inscrits sur la plateforme.',
  },
];

const cabinetFAQ: FAQItem[] = [
  {
    question: 'Comment fonctionne l\'accès aux profils des candidats ?',
    answer:
      'Vous accédez à un vivier de profils anonymisés — expertise, séniorité, projet professionnel — sans jamais connaître l\'identité du candidat. Si un profil vous intéresse, Logan organise la mise en relation après accord explicite du candidat.',
  },
  {
    question: 'Puis-je contacter directement un candidat ?',
    answer:
      'Non, toutes les mises en relation passent par Logan. C\'est cette intermédiation qui garantit la confidentialité et la qualité du processus pour les deux parties.',
  },
  {
    question: 'Quels types de profils sont disponibles sur Logan ?',
    answer:
      'Logan réunit des avocats d\'affaires de tous niveaux de séniorité (collaborateurs juniors à counsels/associés), issus des cabinets d\'affaires les plus reconnus du marché parisien et international.',
  },
  {
    question: 'Comment sont validés les profils candidats ?',
    answer:
      'Chaque profil est vérifié et validé par l\'équipe Logan sous 48h avant d\'être rendu accessible. Nous nous assurons de la cohérence et de la qualité des informations renseignées.',
  },
  {
    question: 'Quel est le modèle tarifaire de Logan ?',
    answer:
      'Logan propose un modèle hybride : un abonnement mensuel donnant accès au vivier de candidats, combiné à un fee de placement réduit par rapport aux standards du marché (chasseurs classiques : 20–25%).',
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
