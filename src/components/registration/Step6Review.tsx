import { motion } from 'motion/react';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrationStore } from '@/stores/registrationStore';
import { Button } from '@/components/ui/button';
import { usePQE } from '@/hooks/usePQE';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT } from '@/lib/constants';
import { Eye, Lock, ArrowLeft, Check } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { toast } from 'sonner';

const CHART_COLORS = [
  'hsl(215, 60%, 30%)',
  'hsl(215, 50%, 42%)',
  'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)',
  'hsl(218, 40%, 36%)',
  'hsl(222, 50%, 28%)',
];

type PreviewMode = 'recap' | 'cabinet' | 'carter';

const Step6Review = () => {
  const store = useRegistrationStore();
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('recap');
  const [submitting, setSubmitting] = useState(false);

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

  const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="carter-card p-8">
      <p className="carter-label mb-4">{title}</p>
      {children}
    </div>
  );

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <span className="text-xs text-muted-foreground font-sans font-light">{label}</span>
      <p className="text-sm font-sans font-medium mt-0.5">{value}</p>
    </div>
  );

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const { error } = await (supabase.auth as any).signUp({
        email: store.email,
        password: store.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            full_name: `${store.prenom} ${store.nom}`.trim(),
            user_type: 'candidat',
          },
        },
      });

      if (error) throw error;
      toast.success('Inscription créée. Vérifiez votre email pour activer votre accès.');
      store.nextStep();
    } catch (error: any) {
      toast.error(error.message || 'Impossible de créer votre inscription');
    } finally {
      setSubmitting(false);
    }
  };

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      {/* Carter header */}
      <span className="font-display text-xl tracking-[-0.02em] text-foreground block mb-8">Logan</span>

      <div className="carter-divider mb-6" />
      <h2 className="text-3xl font-serif text-foreground mb-2 font-normal tracking-[-0.02em]">Récapitulatif</h2>
      <p className="text-muted-foreground font-sans text-sm font-light mb-8">Vérifiez vos informations avant de soumettre votre profil.</p>

      {/* Preview mode tabs */}
      <div className="flex gap-px mb-10 bg-border rounded-sm overflow-hidden">
        {[
          { key: 'recap' as const, label: 'Récapitulatif', icon: Check },
          { key: 'cabinet' as const, label: 'Vue cabinet', icon: Eye },
          { key: 'carter' as const, label: 'Vue Logan', icon: Lock },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setPreviewMode(tab.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-3 font-sans text-xs tracking-wider uppercase transition-all duration-300",
              previewMode === tab.key ? "bg-card text-foreground font-medium" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* RECAP VIEW */}
      {previewMode === 'recap' && (
        <div className="space-y-6">
          <SectionCard title="Identité">
            <div className="flex items-start gap-5 mb-4">
              {store.photoPreviewUrl ? (
                <img src={store.photoPreviewUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-border flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center font-serif text-xl text-foreground flex-shrink-0">
                  {store.prenom?.[0]}{store.nom?.[0]}
                </div>
              )}
              <div>
                <p className="font-serif text-lg text-foreground">{store.prenom} {store.nom}</p>
                <p className="text-sm font-sans font-light text-muted-foreground">{store.email}</p>
                {store.telephone && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5">{store.telephone}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {pqe && <div><span className="text-xs text-muted-foreground font-sans font-light">Séniorité</span><div className="mt-1"><SeniorityBadge info={pqe} /></div></div>}
              {store.linkedinUrl && <DataRow label="LinkedIn" value={store.linkedinUrl} />}
            </div>
          </SectionCard>

          <SectionCard title="Cabinet & Pratique">
            <div className="grid grid-cols-2 gap-4">
              <DataRow label="Département" value={store.departement} />
              <DataRow label="Cabinet" value={store.cabinet} />
              {store.cabNat && <DataRow label="Nationalité" value={store.cabNat} />}
              {store.cabTier && <DataRow label="Tier Legal 500" value={store.cabTier} />}
              {store.isAssocieOrCounsel && store.chiffreAffairesPortable && <DataRow label="CA portable" value={`${store.chiffreAffairesPortable} €`} />}
            </div>
          </SectionCard>

          <SectionCard title="Activité">
            {chartData.length > 0 && (
              <div className="flex items-start gap-6 mb-4">
                <div className="w-32 h-32 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" innerRadius={28} outerRadius={55} dataKey="value" paddingAngle={2}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${Math.round((value / totalPercent) * 100)}%`, '']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="space-y-1.5">
                    {chartData.map((item, i) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs font-sans font-light">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-foreground">{item.name}</span>
                        <span className="text-muted-foreground ml-auto">{Math.round((item.value / totalPercent) * 100)}%</span>
                      </div>
                    ))}
                  </div>
                  {store.tailleOperations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {store.tailleOperations.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{t}</span>
                      ))}
                    </div>
                  )}
                  {store.typesClients.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {store.typesClients.map(c => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {chartData.length === 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeActivites.map(a => (
                  <span key={a.key} className="px-3 py-1 rounded-sm bg-foreground text-background text-xs font-sans font-light">
                    {a.label} {store.pourcentages[a.key] ? `${store.pourcentages[a.key]}%` : ''}
                  </span>
                ))}
              </div>
            )}
            {store.anglais && <p className="text-sm font-sans font-light"><span className="text-muted-foreground">Anglais : </span>{store.anglais}</p>}
          </SectionCard>

          <SectionCard title="Projet">
            <div className="space-y-3 text-sm font-sans font-light">
              {store.motivation && <div><span className="text-muted-foreground text-xs">Motivation</span><p className="mt-1">{store.motivation}</p></div>}
              {store.qualitesAppreciees.length > 0 && <p><span className="text-muted-foreground text-xs">Qualités : </span>{store.qualitesAppreciees.join(', ')}</p>}
              {store.cabinetsCibles.length > 0 && <p><span className="text-muted-foreground text-xs">Cibles : </span>{store.cabinetsCibles.join(', ')}</p>}
              {store.souhaitePrendreRdv && store.creneauPrefere && <p><span className="text-muted-foreground text-xs">RDV souhaité : </span>{store.creneauPrefere}</p>}
            </div>
          </SectionCard>

          <SectionCard title="Statut">
            <div className="grid grid-cols-2 gap-4">
              <DataRow label="Écoute" value={store.statutEcoute} />
              <DataRow label="Visibilité" value={store.visibilite} />
            </div>
          </SectionCard>
        </div>
      )}

      {/* CABINET VIEW */}
      {previewMode === 'cabinet' && (
        <div className="space-y-6">
          <div className="rounded-sm p-4 bg-white border border-border">
            <p className="text-sm font-sans font-light text-black flex items-center gap-2">
              <Eye className="w-4 h-4 text-black/60" />
              Voici ce que les cabinets partenaires verront. Votre identité est totalement protégée.
            </p>
          </div>

          <div className="carter-card p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground font-serif text-xl">
                ?
              </div>
              <div>
                <p className="font-serif text-lg text-foreground">Profil anonyme</p>
                <div className="mt-1">{pqe && <SeniorityBadge info={pqe} hideExactPQE />}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <DataRow label="Pratique" value={store.departement} />
              <DataRow label="Nationalité cabinet" value={store.cabNat || '—'} />
              <DataRow label="Classement Legal 500" value={store.cabTier || '—'} />
              {store.retrocession && <DataRow label="Rétrocession" value={`${store.retrocession} €`} />}
              {store.anglais && <DataRow label="Anglais" value={store.anglais} />}
              {store.conserverRetrocession !== null && <DataRow label="Flexibilité rétrocession" value={store.conserverRetrocession ? 'Souhaite maintenir' : 'Ouvert à discussion'} />}
            </div>

            {/* Activity pie chart + side info */}
            {chartData.length > 0 && (
              <div className="mb-8">
                <p className="carter-label mb-4">Répartition de l'activité</p>
                <div className="flex items-start gap-8">
                  <div className="w-36 h-36 flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={30} outerRadius={60} dataKey="value" paddingAngle={2}>
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`${Math.round((value / totalPercent) * 100)}%`, '']}
                          contentStyle={{ fontSize: '11px', borderRadius: '4px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {/* Legend */}
                    <div className="space-y-1.5">
                      {chartData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2 text-xs font-sans font-light">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-muted-foreground ml-auto">{Math.round((item.value / totalPercent) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                    {/* Positioning tags beside pie chart */}
                    {store.tailleOperations.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Taille opérations</p>
                        <div className="flex flex-wrap gap-1.5">
                          {store.tailleOperations.map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {store.typesClients.length > 0 && (
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Clientèle</p>
                        <div className="flex flex-wrap gap-1.5">
                          {store.typesClients.map(c => (
                            <span key={c} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Axes d'amélioration */}
            {store.axesAmelioration.length > 0 && (
              <div className="mb-8">
                <p className="carter-label mb-3">Axes d'amélioration recherchés</p>
                <div className="flex flex-wrap gap-2">
                  {store.axesAmelioration.map(a => (
                    <span key={a} className="px-3 py-1.5 rounded-sm bg-accent/10 text-accent text-xs font-sans font-medium border border-accent/20">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {store.motivation && (
              <div className="mb-6">
                <p className="carter-label mb-2">Projet</p>
                <p className="text-sm font-sans font-light text-foreground">{store.motivation}</p>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <p className="text-xs font-sans font-light text-muted-foreground">
                Non visible : nom, prénom, email, téléphone, nom du cabinet actuel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CARTER VIEW */}
      {previewMode === 'carter' && (
        <div className="space-y-6">
          <div className="border border-accent/20 rounded-sm p-4 bg-accent/5">
            <p className="text-sm font-sans font-light text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              Vue interne Logan — toutes les informations sont visibles par notre équipe uniquement.
            </p>
          </div>

          <div className="bg-card rounded-sm p-8 border border-border">
            <div className="flex items-center gap-4 mb-6">
              {store.photoPreviewUrl ? (
                <img src={store.photoPreviewUrl} alt="" className="w-16 h-16 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center font-serif text-xl text-foreground">
                  {store.prenom?.[0]}{store.nom?.[0]}
                </div>
              )}
              <div>
                <p className="font-serif text-xl text-foreground">{store.prenom} {store.nom}</p>
                <p className="text-sm font-sans font-light text-muted-foreground">{store.email}</p>
                {store.telephone && <p className="text-xs font-sans font-light text-muted-foreground">{store.telephone}</p>}
              </div>
            </div>
            <div className="mb-6">{pqe && <SeniorityBadge info={pqe} />}</div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <DataRow label="Cabinet" value={store.cabinet} />
              <DataRow label="Pratique" value={store.departement} />
              {store.cabNat && <DataRow label="Nationalité" value={store.cabNat} />}
              {store.cabTier && <DataRow label="Tier" value={store.cabTier} />}
              {store.tailleOperations.length > 0 && <DataRow label="Taille opérations" value={store.tailleOperations.join(', ')} />}
              {store.anglais && <DataRow label="Anglais" value={store.anglais} />}
              {store.isAssocieOrCounsel && store.chiffreAffairesPortable && <DataRow label="CA portable" value={`${store.chiffreAffairesPortable} €`} />}
            </div>

            {(store.retrocession || store.bonus) && (
              <div className="bg-secondary rounded-sm p-6 mb-8 border border-border">
                <p className="carter-label mb-4">Rémunération</p>
                <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                  {store.retrocession && <DataRow label="Rétrocession" value={`${store.retrocession} €`} />}
                  {store.bonus && <DataRow label="Bonus" value={`${store.bonus} €`} />}
                  {store.hasObjectifFacturable && store.objectifFacturable && <DataRow label="Objectif heures" value={`${store.objectifFacturable}h`} />}
                  {store.hasObjectifFacturable && store.objectifFacturableReel && <DataRow label="Réalisé" value={`${store.objectifFacturableReel}h`} />}
                </div>
                {store.conserverRetrocession !== null && (
                  <p className="mt-4 pt-3 border-t border-border text-sm font-sans text-muted-foreground font-light">
                    {store.conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
                    {!store.conserverRetrocession && store.raisonsBaisseRetro.length > 0 && ` (${store.raisonsBaisseRetro.join(', ')})`}
                  </p>
                )}
              </div>
            )}

            {store.typesClients.length > 0 && (
              <div className="mb-6">
                <p className="carter-label mb-3">Clientèle</p>
                <div className="flex flex-wrap gap-2">
                  {store.typesClients.map(c => (
                    <span key={c} className="px-3 py-1 rounded-sm bg-secondary text-foreground text-xs font-sans font-light">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {activeActivites.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {activeActivites.map(a => (
                    <span key={a.key} className="px-3 py-1 rounded-sm bg-foreground text-background text-xs font-sans font-light">
                      {a.label} {store.pourcentages[a.key] ? `${store.pourcentages[a.key]}%` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {store.motivation && (
              <div>
                <p className="carter-label mb-2">Motivation</p>
                <p className="text-sm font-sans font-light">{store.motivation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-10">
        <Button variant="outline" onClick={store.prevStep} className="font-sans font-light rounded-sm gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <Button onClick={store.nextStep} className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans font-medium px-8 rounded-sm">
          Soumettre mon profil
        </Button>
      </div>
    </motion.div>
  );
};

export default Step6Review;
