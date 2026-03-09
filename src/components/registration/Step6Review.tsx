import { motion } from 'framer-motion';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { usePQE } from '@/hooks/usePQE';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT } from '@/lib/constants';
import { User, Briefcase, Target, Shield, CheckCircle2, Scale, Eye, Lock, CalendarCheck } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CHART_COLORS = [
  'hsl(210, 55%, 35%)',
  'hsl(220, 62%, 15%)',
  'hsl(210, 45%, 45%)',
  'hsl(220, 50%, 30%)',
  'hsl(210, 35%, 55%)',
  'hsl(220, 35%, 45%)',
];

type PreviewMode = 'recap' | 'cabinet' | 'carter';

const Step6Review = () => {
  const store = useRegistrationStore();
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('recap');

  const practiceActivities = store.departement
    ? (ACTIVITES_BY_PRACTICE[store.departement] || ACTIVITES_DEFAULT)
    : ACTIVITES_DEFAULT;
  const allActivites = practiceActivities.sections.flatMap(s => s.items);
  const activeActivites = allActivites.filter(a => store.activites[a.key]);

  const chartData = useMemo(() => {
    return activeActivites.map(item => ({
      name: item.label,
      value: store.pourcentages[item.key] || 10,
    }));
  }, [activeActivites, store.pourcentages]);

  const totalPercent = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 0.68, 0, 1.2] }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      {/* Carter header */}
      <div className="flex items-center gap-3 mb-8">
        <Scale className="w-6 h-6 text-carter-accent" />
        <span className="font-sans text-lg font-light tracking-[0.15em] uppercase text-foreground">Carter</span>
      </div>

      <h2 className="text-3xl font-serif text-foreground mb-2">Récapitulatif</h2>
      <p className="text-muted-foreground font-sans font-light mb-6">Vérifiez vos informations avant de soumettre votre profil.</p>

      {/* Preview mode tabs */}
      <div className="flex gap-1 mb-8 p-1 bg-muted rounded-lg">
        <button
          onClick={() => setPreviewMode('recap')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md font-sans text-sm transition-all",
            previewMode === 'recap' ? "bg-popover text-foreground shadow-sm font-medium" : "text-muted-foreground"
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          Récapitulatif
        </button>
        <button
          onClick={() => setPreviewMode('cabinet')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md font-sans text-sm transition-all",
            previewMode === 'cabinet' ? "bg-popover text-foreground shadow-sm font-medium" : "text-muted-foreground"
          )}
        >
          <Eye className="w-4 h-4" />
          Vue cabinet
        </button>
        <button
          onClick={() => setPreviewMode('carter')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-md font-sans text-sm transition-all",
            previewMode === 'carter' ? "bg-popover text-foreground shadow-sm font-medium" : "text-muted-foreground"
          )}
        >
          <Lock className="w-4 h-4" />
          Vue Carter
        </button>
      </div>

      {/* RECAP VIEW */}
      {previewMode === 'recap' && (
        <div className="space-y-6">
          <div className="carter-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-carter-accent" />
              <h3 className="font-serif text-lg">Identité</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div><span className="text-muted-foreground font-light">Nom</span><p className="font-medium">{store.prenom} {store.nom}</p></div>
              <div><span className="text-muted-foreground font-light">Email</span><p className="font-medium">{store.email}</p></div>
              {store.telephone && <div><span className="text-muted-foreground font-light">Téléphone</span><p className="font-medium">{store.telephone}</p></div>}
              <div><span className="text-muted-foreground font-light">Séniorité</span><div className="mt-1">{pqe && <SeniorityBadge info={pqe} />}</div></div>
              {store.disponibilite && <div><span className="text-muted-foreground font-light">Disponibilité</span><p className="font-medium">{store.disponibilite}</p></div>}
              {store.tailleOperations.length > 0 && <div><span className="text-muted-foreground font-light">Taille opérations</span><p className="font-medium">{store.tailleOperations.join(', ')}</p></div>}
            </div>
          </div>

          <div className="carter-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-carter-accent" />
              <h3 className="font-serif text-lg">Cabinet & Pratique</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div><span className="text-muted-foreground font-light">Département</span><p className="font-medium">{store.departement}</p></div>
              <div><span className="text-muted-foreground font-light">Cabinet</span><p className="font-medium">{store.cabinet}</p></div>
              {store.cabNat && <div><span className="text-muted-foreground font-light">Nationalité</span><p className="font-medium">{store.cabNat}</p></div>}
              {store.cabTier && <div><span className="text-muted-foreground font-light">Tier Legal 500</span><p className="font-medium">{store.cabTier}</p></div>}
              {store.isAssocieOrCounsel && store.chiffreAffairesPortable && (
                <div><span className="text-muted-foreground font-light">CA portable</span><p className="font-medium">{store.chiffreAffairesPortable} €</p></div>
              )}
            </div>
          </div>

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
            {store.anglais && <p className="text-sm font-sans font-light"><span className="text-muted-foreground">Anglais : </span>{store.anglais}</p>}
            {store.typesClients.length > 0 && (
              <div className="mt-2">
                <span className="text-sm text-muted-foreground font-sans font-light">Clients : </span>
                <span className="text-sm font-sans font-light">{store.typesClients.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="carter-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-carter-accent" />
              <h3 className="font-serif text-lg">Projet</h3>
            </div>
            <div className="space-y-3 text-sm font-sans font-light">
              {store.motivation && (
                <div><span className="text-muted-foreground">Motivation</span><p className="mt-1">{store.motivation}</p></div>
              )}
              {store.qualitesAppreciees.length > 0 && (
                <div><span className="text-muted-foreground">Qualités recherchées : </span>{store.qualitesAppreciees.join(', ')}</div>
              )}
              {store.cabinetsCibles.length > 0 && (
                <div><span className="text-muted-foreground">Cibles : </span>{store.cabinetsCibles.join(', ')}</div>
              )}
              {store.souhaitePrendreRdv && store.creneauPrefere && (
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-carter-accent" />
                  <span className="text-muted-foreground">RDV souhaité : </span>{store.creneauPrefere}
                </div>
              )}
            </div>
          </div>

          <div className="carter-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-carter-accent" />
              <h3 className="font-serif text-lg">Statut</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-sans">
              <div><span className="text-muted-foreground font-light">Écoute</span><p className="font-medium capitalize">{store.statutEcoute}</p></div>
              <div><span className="text-muted-foreground font-light">Visibilité</span><p className="font-medium capitalize">{store.visibilite}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* CABINET VIEW — Anonymized with enhanced data */}
      {previewMode === 'cabinet' && (
        <div className="space-y-6">
          <div className="carter-card border-carter-accent/20 p-4 bg-carter-accent-pale">
            <p className="text-sm font-sans font-light text-carter-accent flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Voici ce que les cabinets partenaires verront. Votre identité est totalement protégée.
            </p>
          </div>

          <div className="carter-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full gradient-navy flex items-center justify-center text-cream-light font-sans text-lg font-light">
                ?
              </div>
              <div>
                <p className="font-serif text-lg text-foreground">Profil anonyme</p>
                <div className="mt-1">{pqe && <SeniorityBadge info={pqe} />}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-sans mb-6">
              <div><span className="text-muted-foreground font-light">Pratique</span><p className="font-medium">{store.departement}</p></div>
              <div><span className="text-muted-foreground font-light">Nationalité cabinet</span><p className="font-medium">{store.cabNat || '—'}</p></div>
              <div><span className="text-muted-foreground font-light">Classement Legal 500</span><p className="font-medium">{store.cabTier || '—'}</p></div>
              {store.retrocession && <div><span className="text-muted-foreground font-light">Rétrocession</span><p className="font-medium">{store.retrocession} €</p></div>}
              {store.disponibilite && <div><span className="text-muted-foreground font-light">Disponibilité</span><p className="font-medium">{store.disponibilite}</p></div>}
              {store.tailleOperations.length > 0 && <div><span className="text-muted-foreground font-light">Taille opérations</span><p className="font-medium">{store.tailleOperations.join(', ')}</p></div>}
              {store.anglais && <div><span className="text-muted-foreground font-light">Anglais</span><p className="font-medium">{store.anglais}</p></div>}
              {store.conserverRetrocession !== null && (
                <div>
                  <span className="text-muted-foreground font-light">Flexibilité rétrocession</span>
                  <p className="font-medium">{store.conserverRetrocession ? 'Souhaite maintenir' : 'Ouvert à discussion'}</p>
                </div>
              )}
            </div>

            {/* Clientèle */}
            {store.typesClients.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-3">Clientèle</h4>
                <div className="flex flex-wrap gap-2">
                  {store.typesClients.map(c => (
                    <span key={c} className="px-3 py-1 rounded-full bg-carter-accent-pale text-foreground text-xs font-sans font-light border border-carter-accent/10">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {activeActivites.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-3">Activités</h4>
                <div className="flex flex-wrap gap-2">
                  {activeActivites.map(a => (
                    <span key={a.key} className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-sans font-light">
                      {a.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pie chart for cabinet view */}
            {chartData.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-3">Répartition de l'activité</h4>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={28} outerRadius={55} dataKey="value" paddingAngle={2}>
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${Math.round((value / totalPercent) * 100)}%`, '']} contentStyle={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-1">
                    {chartData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs font-sans font-light">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-muted-foreground ml-auto">{Math.round((item.value / totalPercent) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Motivation */}
            {store.motivation && (
              <div className="mb-6">
                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-2">Projet</h4>
                <p className="text-sm font-sans font-light text-foreground">{store.motivation}</p>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <p className="text-xs font-sans font-light text-muted-foreground">
                Les informations suivantes ne sont pas visibles : nom, prénom, email, téléphone, nom du cabinet actuel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CARTER VIEW — Full profile */}
      {previewMode === 'carter' && (
        <div className="space-y-6">
          <div className="carter-card border-primary/20 p-4 bg-primary/5">
            <p className="text-sm font-sans font-light text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-carter-accent" />
              Vue interne Carter — toutes les informations sont visibles par notre équipe uniquement.
            </p>
          </div>

          <div className="gradient-navy rounded-xl p-6 text-cream-light">
            <div className="flex items-center gap-4 mb-4">
              {store.photoPreviewUrl ? (
                <img src={store.photoPreviewUrl} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-cream-light/20" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-cream-light/10 flex items-center justify-center font-sans text-xl font-light">
                  {store.prenom?.[0]}{store.nom?.[0]}
                </div>
              )}
              <div>
                <p className="font-serif text-xl">{store.prenom} {store.nom}</p>
                <p className="text-sm font-sans font-light text-cream-light/60">{store.email}</p>
                {store.telephone && <p className="text-sm font-sans font-light text-cream-light/60">{store.telephone}</p>}
              </div>
            </div>
            <div className="mt-2">{pqe && <SeniorityBadge info={pqe} />}</div>
          </div>

          <div className="carter-card p-6">
            <div className="grid grid-cols-2 gap-4 text-sm font-sans mb-6">
              <div><span className="text-muted-foreground font-light">Cabinet</span><p className="font-medium">{store.cabinet}</p></div>
              <div><span className="text-muted-foreground font-light">Pratique</span><p className="font-medium">{store.departement}</p></div>
              {store.cabNat && <div><span className="text-muted-foreground font-light">Nationalité</span><p className="font-medium">{store.cabNat}</p></div>}
              {store.cabTier && <div><span className="text-muted-foreground font-light">Tier</span><p className="font-medium">{store.cabTier}</p></div>}
              {store.disponibilite && <div><span className="text-muted-foreground font-light">Disponibilité</span><p className="font-medium">{store.disponibilite}</p></div>}
              {store.tailleOperations.length > 0 && <div><span className="text-muted-foreground font-light">Taille opérations</span><p className="font-medium">{store.tailleOperations.join(', ')}</p></div>}
              {store.anglais && <div><span className="text-muted-foreground font-light">Anglais</span><p className="font-medium">{store.anglais}</p></div>}
              {store.isAssocieOrCounsel && store.chiffreAffairesPortable && (
                <div><span className="text-muted-foreground font-light">CA portable</span><p className="font-medium">{store.chiffreAffairesPortable} €</p></div>
              )}
            </div>

            {(store.retrocession || store.bonus) && (
              <div className="gradient-navy rounded-lg p-4 mb-6">
                <h4 className="text-xs font-sans font-medium text-cream-light/60 uppercase tracking-wider mb-3">Rémunération</h4>
                <div className="grid grid-cols-2 gap-4 text-sm font-sans text-cream-light">
                  {store.retrocession && <div><span className="text-cream-light/60 font-light">Rétrocession</span><p className="font-medium">{store.retrocession} €</p></div>}
                  {store.bonus && <div><span className="text-cream-light/60 font-light">Bonus</span><p className="font-medium">{store.bonus} €</p></div>}
                  {store.hasObjectifFacturable && store.objectifFacturable && (
                    <div><span className="text-cream-light/60 font-light">Objectif heures</span><p className="font-medium">{store.objectifFacturable}h</p></div>
                  )}
                  {store.hasObjectifFacturable && store.objectifFacturableReel && (
                    <div><span className="text-cream-light/60 font-light">Réalisé</span><p className="font-medium">{store.objectifFacturableReel}h</p></div>
                  )}
                </div>
                {store.conserverRetrocession !== null && (
                  <div className="mt-3 pt-3 border-t border-cream-light/10 text-sm font-sans text-cream-light/70 font-light">
                    {store.conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
                    {!store.conserverRetrocession && store.raisonsBaisseRetro.length > 0 && (
                      <span> ({store.raisonsBaisseRetro.join(', ')})</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Clientèle */}
            {store.typesClients.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-2">Clientèle</h4>
                <div className="flex flex-wrap gap-2">
                  {store.typesClients.map(c => (
                    <span key={c} className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-sans font-light">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {activeActivites.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {activeActivites.map(a => (
                    <span key={a.key} className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-sans">
                      {a.label} {store.pourcentages[a.key] ? `${store.pourcentages[a.key]}%` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {store.motivation && (
              <div className="mt-4">
                <h4 className="text-xs font-sans font-medium text-muted-foreground uppercase tracking-wider mb-2">Motivation</h4>
                <p className="text-sm font-sans font-light">{store.motivation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={store.prevStep} className="font-sans font-light">Retour</Button>
        <Button onClick={store.nextStep} className="bg-carter-accent hover:bg-carter-accent-light text-accent-foreground font-sans font-medium px-8">
          Soumettre mon profil
        </Button>
      </div>
    </motion.div>
  );
};

export default Step6Review;
