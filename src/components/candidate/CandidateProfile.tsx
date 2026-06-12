import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { useAuth } from '@/hooks/useAuth';
import { FileText, X, ShieldCheck, Plus, Check, Pencil } from 'lucide-react';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { useRef, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { buildQuantizedChartData } from '@/lib/percentages';
import { ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT, CABINET_META } from '@/lib/constants';
import { CHAMBERS_DB, getChambersRankingByPractice } from '@/lib/chambersRankings';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const CHART_COLORS = [
  'hsl(215, 60%, 30%)', 'hsl(215, 50%, 42%)', 'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)', 'hsl(218, 40%, 36%)', 'hsl(222, 50%, 28%)',
];

const CandidateProfile = () => {
  const { user } = useAuth();
  const store = useRegistrationStore();
  const navigate = useNavigate();
  const seniorityInfo = usePQE(store.sermentMois, store.sermentAnnee);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditProfile = () => {
    // Active le mode édition dans le store et redirige vers step 2
    store.setField('isEditMode', true);
    navigate('/inscription?mode=edit&start=2');
  };

  const practiceActivities = store.departement
    ? (ACTIVITES_BY_PRACTICE[store.departement] || ACTIVITES_DEFAULT)
    : ACTIVITES_DEFAULT;
  const allActivites = practiceActivities.sections.flatMap(s => s.items);
  const activeActivites = allActivites.filter(a => store.activites[a.key]);

  const chartData = useMemo(() => buildQuantizedChartData(
    activeActivites.map((item, i) => ({
      key: item.key, name: item.label,
      raw: store.pourcentages[item.key] || 10,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }))
  ), [activeActivites, store.pourcentages]);

  const chambersInfo = useMemo(() => {
    if (!store.cabinet || !store.departement) return null;
    const firm = CHAMBERS_DB[store.cabinet];
    if (!firm) return { isIntegrated: false };
    const ranking = getChambersRankingByPractice(store.cabinet, store.departement);
    return { isIntegrated: true, band: ranking ?? null };
  }, [store.cabinet, store.departement]);

  const SectionBlock = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-card p-5">
      <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-sans font-light mb-3">{title}</p>
      {children}
    </div>
  );

  const DataRow = ({ label, value }: { label: string; value: string }) => (
    <div>
      <span className="text-[9px] text-muted-foreground font-sans font-light">{label}</span>
      <p className="text-[13px] font-sans font-normal mt-0.5 text-foreground">{value || '—'}</p>
    </div>
  );

  const TagList = ({ items, label }: { items: string[]; label?: string }) => {
    if (!items || items.length === 0) return null;
    return (
      <div>
        {label && <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>}
        <div className="flex flex-wrap gap-1.5">
          {items.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{t}</span>)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-sans font-medium text-foreground">Mon profil</h2>
      </div>

      <div className="border border-border rounded-sm overflow-hidden">

        <SectionBlock title="Identité">
          <div className="flex items-start gap-5 mb-5">
            {store.photoPreviewUrl
              ? <img src={store.photoPreviewUrl} alt="" className="w-14 h-14 rounded-full object-cover border border-border flex-shrink-0" />
              : <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center font-serif text-lg flex-shrink-0">{store.prenom?.[0]}{store.nom?.[0]}</div>
            }
            <div>
              <p className="font-serif text-lg text-foreground">{store.prenom} {store.nom}</p>
              <p className="text-sm font-sans font-light text-muted-foreground">{store.email || user?.email}</p>
              {store.telephone && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5">{store.telephone}</p>}
              {store.linkedinUrl && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5 truncate max-w-xs">{store.linkedinUrl}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seniorityInfo && <div><span className="text-[10px] text-muted-foreground font-sans font-light">Séniorité</span><div className="mt-1"><SeniorityBadge info={seniorityInfo} /></div></div>}
            <DataRow label="Cabinet" value={store.cabinet} />
            <DataRow label="Répertorié Chambers" value={chambersInfo?.isIntegrated ? 'Oui' : 'Non'} />
            <DataRow label="Pratique" value={store.departement} />
          </div>
        </SectionBlock>

        {(store.retrocession || store.bonus) && (
          <SectionBlock title="Rémunération">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {store.retrocession && <DataRow label="Rétrocession" value={`${store.retrocession} €`} />}
              {store.bonus && <DataRow label="Bonus" value={`${store.bonus} €`} />}
              {store.hasObjectifFacturable && store.objectifFacturable && <DataRow label="Objectif heures" value={`${store.objectifFacturable}h`} />}
              {store.hasObjectifFacturable && store.objectifFacturableReel && <DataRow label="Réalisé" value={`${store.objectifFacturableReel}h`} />}
            </div>
            {store.conserverRetrocession !== null && (
              <p className="mt-4 pt-3 border-t border-border text-xs font-sans text-muted-foreground font-light">
                {store.conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
                {!store.conserverRetrocession && store.raisonsBaisseRetro.length > 0 && ` — ${store.raisonsBaisseRetro.join(', ')}`}
              </p>
            )}
          </SectionBlock>
        )}

        <SectionBlock title="Activité">
          {chartData.length > 0 && (
            <div className="flex flex-col md:flex-row gap-6 items-start mb-4">
              <div className="w-36 h-36 flex-shrink-0 self-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={32} outerRadius={60} dataKey="value" paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2} labelLine={false}>
                      {chartData.map((item, i) => <Cell key={item.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-1.5">
                {chartData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-sans font-light">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-foreground">{item.name}</span>
                    <span className="text-muted-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <TagList items={store.tailleOperations} label="Taille opérations" />
            <TagList items={store.typesClients} label="Clientèle" />
          </div>
          {store.anglais && <p className="text-xs font-sans font-light mt-3"><span className="text-muted-foreground">Anglais : </span>{store.anglais}</p>}
        </SectionBlock>

        {store.isAssocieOrCounsel && (
          <SectionBlock title={store.statutAssoc === 'associe' ? 'Associé' : 'Counsel'}>
            <div className="grid grid-cols-2 gap-4">
              {store.chiffreAffairesPortable && <DataRow label="CA portable" value={`${store.chiffreAffairesPortable} €`} />}
              {store.assocExpertiseSummary && <DataRow label="Expertise" value={store.assocExpertiseSummary} />}
            </div>
            <TagList items={store.assocAttentes} label="Attentes" />
            <TagList items={store.assocCabTypes} label="Types de cabinets visés" />
          </SectionBlock>
        )}

        <SectionBlock title="Projet">
          <div className="space-y-3">
            {store.movePriorities.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Priorités</p>
                <div className="flex flex-wrap gap-1.5">
                  {store.movePriorities.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-sans font-light">
                      <Check className="w-2.5 h-2.5" />{p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {store.motivation && <div><p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Motivation</p><p className="text-sm font-sans font-light">{store.motivation}</p></div>}
            <div className="grid grid-cols-2 gap-3">
              <TagList items={store.cabinetsCibles} label="Cabinets cibles" />
              <TagList items={store.noGoCabinets} label="Cabinets exclus" />
            </div>
          </div>
        </SectionBlock>

        <SectionBlock title="Statut">
          <div className="grid grid-cols-2 gap-4">
            <DataRow label="Écoute" value={store.statutEcoute === 'actif' ? 'En recherche active' : store.statutEcoute === 'passif' ? "À l'écoute" : '—'} />
            <DataRow label="Visibilité" value={store.visibilite === 'confidentiel' ? 'Confidentiel – fermé' : store.visibilite === 'semi-confidentiel' ? 'Confidentiel – ouvert' : '—'} />
            {store.disponibilite && <DataRow label="Disponibilité" value={store.disponibilite} />}
          </div>
        </SectionBlock>
      </div>

      <div className="border border-border rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground">CV</span>
            <span className="text-[10px] text-muted-foreground/60 font-sans font-light">optionnel</span>
          </div>
          {!store.cvFile && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs font-sans font-light text-muted-foreground hover:text-foreground transition-colors">
              <Plus className="w-3.5 h-3.5" />Ajouter
            </button>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={e => store.setField('cvFile', e.target.files?.[0] || null)} className="hidden" />
        {store.cvFile && (
          <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-sm border border-border bg-card">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-sans font-light truncate flex-1">{store.cvFile.name}</span>
            <button type="button" onClick={() => store.setField('cvFile', null)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        <div className="flex items-start gap-1.5 mt-2">
          <ShieldCheck className="w-3 h-3 text-muted-foreground/50 mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground/60 font-sans font-light leading-relaxed">Logan s'engage à ne jamais transmettre votre CV sans votre accord explicite.</p>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
