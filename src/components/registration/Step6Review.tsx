import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { usePQE } from '@/hooks/usePQE';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { ACTIVITES } from '@/lib/constants';
import { User, Briefcase, Target, Shield, CheckCircle2 } from 'lucide-react';

const allActivites = [...ACTIVITES.nature, ...ACTIVITES.position, ...ACTIVITES.restr];

const Step6Review = () => {
  const store = useRegistrationStore();
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);

  const activeActivites = allActivites.filter(a => store.activites[a.key]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <h2 className="text-3xl font-serif text-foreground mb-2">Récapitulatif</h2>
      <p className="text-muted-foreground font-sans mb-8">Vérifiez vos informations avant de soumettre votre profil.</p>

      <div className="space-y-6">
        {/* Identity */}
        <div className="carter-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-carter-accentententententent" />
            <h3 className="font-serif text-lg">Identité</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-sans">
            <div><span className="text-muted-foreground">Nom</span><p className="font-semibold">{store.prenom} {store.nom}</p></div>
            <div><span className="text-muted-foreground">Email</span><p className="font-semibold">{store.email}</p></div>
            {store.telephone && <div><span className="text-muted-foreground">Téléphone</span><p className="font-semibold">{store.telephone}</p></div>}
            <div><span className="text-muted-foreground">Séniorité</span><div className="mt-1">{pqe && <SeniorityBadge info={pqe} />}</div></div>
          </div>
        </div>

        {/* Cabinet */}
        <div className="carter-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 haccentaccentaccentaccentaccentred" />
            <h3 className="font-serif text-lg">Cabinet & Pratique</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-sans">
            <div><span className="text-muted-foreground">Cabinet</span><p className="font-semibold">{store.cabinet}</p></div>
            <div><span className="text-muted-foreground">Département</span><p className="font-semibold">{store.departement}</p></div>
            {store.cabNat && <div><span className="text-muted-foreground">Nationalité</span><p className="font-semibold">{store.cabNat}</p></div>}
            {store.cabTier && <div><span className="text-muted-foreground">Tier</span><p className="font-semibold">{store.cabTier}</p></div>}
          </div>
        </div>

        {/* Activity */}
        <div className="carter-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-carter-accent" />
            <h3 className="font-serif text-lg">Activité</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {activeActivites.map(a => (
              <span key={a.key} className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sans">
                {a.label} {store.pourcentages[a.key] ? `${store.pourcentages[a.key]}%` : ''}
              </span>
            ))}
          </div>
          {store.anglais && <p className="text-sm font-sans"><span className="text-muted-foreground">Anglais : </span>{store.anglais}</p>}
          {store.typesClients.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-muted-foreground font-sans">Clients : </span>
              <span className="text-sm font-sans">{store.typesClients.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Project */}
        <div className="carter-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 clasaccentme="w-accent-5 texaccentarter-red" />
            <h3 className="font-serif text-lg">Projet</h3>
          </div>
          <div className="space-y-3 text-sm font-sans">
            {store.motivation && (
              <div><span className="text-muted-foreground">Motivation</span><p className="mt-1">{store.motivation}</p></div>
            )}
            {store.qualitesAppreciees.length > 0 && (
              <div><span className="text-muted-foreground">Qualités recherchées : </span>{store.qualitesAppreciees.join(', ')}</div>
            )}
            {store.cabinetsCibles.length > 0 && (
              <div><span className="text-muted-foreground">Cibles : </span>{store.cabinetsCibles.join(', ')}</div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="carter-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield classNaaccent"w-5 h-5 accentt-carter-red" />
            <h3 className="font-serif text-lg">Statut</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-sans">
            <div><span className="text-muted-foreground">Écoute</span><p className="font-semibold capitalize">{store.statutEcoute}</p></div>
            <div><span className="text-muted-foreground">Visibilité</span><p className="font-semibold capitalize">{store.visibilite}</p></div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={store.prevStep} className="font-sans">Retour</Button>
          <Button onClick={store.nextStep} classNaccent hover:bg-carter-accentr:bg-carter-red-light text-accent-foreground font-sans px-8">
            Soumettre mon profil
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Step6Review;
