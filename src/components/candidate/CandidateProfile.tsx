import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { useAuth } from '@/hooks/useAuth';
import { User, Building2, Star, Mail, Phone, Pencil, Plus, FileText, X, ShieldCheck, Check, Eye } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SeniorityBadge from '@/components/shared/SeniorityBadge';
import { useNavigate } from 'react-router-dom';
import { useRef, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { buildQuantizedChartData } from '@/lib/percentages';
import { ACTIVITES_BY_PRACTICE, ACTIVITES_DEFAULT, CABINET_META } from '@/lib/constants';
import { CHAMBERS_DB, CHAMBERS_DEPARTMENTS } from '@/lib/chambersRankings';

const CHART_COLORS = [
  'hsl(215, 60%, 30%)',
  'hsl(215, 50%, 42%)',
  'hsl(220, 55%, 22%)',
  'hsl(210, 45%, 52%)',
  'hsl(218, 40%, 36%)',
  'hsl(222, 50%, 28%)',
];

const DEPT_TO_CHAMBERS: Record<string, string> = {
  'Corporate': 'ma',
  'M&A (dominante)': 'ma',
  'Private Equity (dominante)': 'pe',
  'Financement LBO': 'banque',
  'Financement de projets': 'projets',
  'Restructuring': 'restructuring',
  'Droit Social': 'social',
  'Immobilier': 'immo',
};

const CandidateProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const store = useRegistrationStore();
  const {
    photoPreviewUrl, prenom, nom, email, telephone,
    departement, cabinet, sermentMois, sermentAnnee,
    activites, pourcentages, statutEcoute, visibilite,
    qualitesAppreciees, axesAmelioration, motivation,
    movePriorities, cabinetsCibles, noGoCabinets,
    retrocession, bonus, anglais, typesClients,
    tailleOperations, conserverRetrocession, cvFile,
    linkedinUrl, hasObjectifFacturable, objectifFacturable, objectifFacturableReel,
    isAssocieOrCounsel, statutAssoc, chiffreAffairesPortable, assocExpertiseSummary,
    assocAttentes, assocCabTypes, disponibilite, raisonsBaisseRetro,
  } = store;
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const practiceActivities = departement
    ? (ACTIVITES_BY_PRACTICE[departement] || ACTIVITES_DEFAULT)
    : ACTIVITES_DEFAULT;
  const allActivites = practiceActivities.sections.flatMap(s => s.items);
  const activeActivites = allActivites.filter(a => activites[a.key]);

  const chartData = useMemo(() => {
    return buildQuantizedChartData(
      activeActivites.map((item, index) => ({
        key: item.key,
        name: item.label,
        raw: pourcentages[item.key] || 10,
        color: CHART_COLORS[index % CHART_COLORS.length],
      })),
    );
  }, [activeActivites, pourcentages]);

  const chambersInfo = useMemo(() => {
    if (!cabinet || !departement) return null;
    const firm = CHAMBERS_DB[cabinet];
    const chambersKey = DEPT_TO_CHAMBERS[departement];
    if (!firm) {
      const fallbackNat = CABINET_META[cabinet]?.nat;
      return { isIntegrated: false, nat: fallbackNat || null };
    }
    const band = chambersKey ? firm.rankings[chambersKey] : undefined;
    return { isIntegrated: true, band: band ?? null };
  }, [cabinet, departement]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    store.setField('cvFile', file);
  };

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
    if (items.length === 0) return null;
    return (
      <div>
        {label && <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>}
        <div className="flex flex-wrap gap-1.5">
          {items.map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-sm bg-secondary text-foreground border border-border">{t}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Full profile recap - single block */}
      <div className="border border-border rounded-sm overflow-hidden">
        {/* Identity */}
        <SectionBlock title="Identité">
          <div className="flex items-start gap-5 mb-5">
            {photoPreviewUrl ? (
              <img src={photoPreviewUrl} alt="" className="w-14 h-14 rounded-full object-cover border border-border flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center font-serif text-lg text-foreground flex-shrink-0">
                {prenom?.[0]}{nom?.[0]}
              </div>
            )}
            <div>
              <p className="font-serif text-lg text-foreground">{prenom} {nom}</p>
              <p className="text-sm font-sans font-light text-muted-foreground">{email || user?.email}</p>
              {telephone && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5">{telephone}</p>}
              {linkedinUrl && <p className="text-xs font-sans font-light text-muted-foreground mt-0.5 truncate max-w-xs">{linkedinUrl}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seniorityInfo && <div><span className="text-[10px] text-muted-foreground font-sans font-light">Séniorité</span><div className="mt-1"><SeniorityBadge info={seniorityInfo} /></div></div>}
            <DataRow label="Cabinet" value={cabinet} />
            <DataRow label="Répertorié Chambers" value={chambersInfo?.isIntegrated ? 'Oui' : 'Non'} />
            <DataRow label="Pratique" value={departement} />
          </div>
        </SectionBlock>

        {/* Rémunération */}
        {(retrocession || bonus) && (
          <SectionBlock title="Rémunération">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {retrocession && <DataRow label="Rétrocession" value={`${retrocession} €`} />}
              {bonus && <DataRow label="Bonus" value={`${bonus} €`} />}
              {hasObjectifFacturable && objectifFacturable && <DataRow label="Objectif heures" value={`${objectifFacturable}h`} />}
              {hasObjectifFacturable && objectifFacturableReel && <DataRow label="Réalisé" value={`${objectifFacturableReel}h`} />}
            </div>
            {conserverRetrocession !== null && (
              <p className="mt-4 pt-3 border-t border-border text-xs font-sans text-muted-foreground font-light">
                {conserverRetrocession ? 'Souhaite conserver sa rétrocession' : 'Ouvert à une baisse de rétrocession'}
                {!conserverRetrocession && raisonsBaisseRetro.length > 0 && ` — ${raisonsBaisseRetro.join(', ')}`}
              </p>
            )}
          </SectionBlock>
        )}

        {/* Activité */}
        <SectionBlock title="Activité">
          {chartData.length > 0 && (
            <div className="flex flex-col md:flex-row gap-6 items-start mb-4">
              <div className="w-36 h-36 flex-shrink-0 self-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={32} outerRadius={60} dataKey="value" paddingAngle={2} stroke="hsl(var(--background))" strokeWidth={2} labelLine={false}>
                      {chartData.map((item, i) => <Cell key={item.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, '']} contentStyle={{ fontSize: '11px', borderRadius: '4px' }} />
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
            <TagList items={tailleOperations} label="Taille opérations" />
            <TagList items={typesClients} label="Clientèle" />
          </div>
          {anglais && <p className="text-xs font-sans font-light mt-3"><span className="text-muted-foreground">Anglais : </span>{anglais}</p>}
        </SectionBlock>

        {/* Associé / Counsel */}
        {isAssocieOrCounsel && (
          <SectionBlock title={statutAssoc === 'associe' ? 'Associé' : 'Counsel'}>
            <div className="grid grid-cols-2 gap-4">
              {chiffreAffairesPortable && <DataRow label="CA portable" value={`${chiffreAffairesPortable} €`} />}
              {assocExpertiseSummary && <DataRow label="Expertise" value={assocExpertiseSummary} />}
            </div>
            <TagList items={assocAttentes} label="Attentes" />
            <TagList items={assocCabTypes} label="Types de cabinets visés" />
          </SectionBlock>
        )}

        {/* Projet */}
        <SectionBlock title="Projet">
          <div className="space-y-3">
            {movePriorities.length > 0 && (
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">Priorités</p>
                <div className="flex flex-wrap gap-1.5">
                  {movePriorities.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground text-background text-[10px] font-sans font-light">
                      <Check className="w-2.5 h-2.5" />{p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {motivation && <div><p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Motivation</p><p className="text-sm font-sans font-light">{motivation}</p></div>}
            <div className="grid grid-cols-2 gap-3">
              <TagList items={cabinetsCibles} label="Cabinets cibles" />
              <TagList items={noGoCabinets} label="Cabinets exclus" />
            </div>
          </div>
        </SectionBlock>

        {/* Statut */}
        <SectionBlock title="Statut">
          <div className="grid grid-cols-2 gap-4">
            <DataRow label="Écoute" value={statutEcoute === 'actif' ? 'En recherche active' : statutEcoute === 'passif' ? 'À l\'écoute' : '—'} />
            <DataRow label="Visibilité" value={visibilite === 'confidentiel' ? 'Confidentiel – fermé' : visibilite === 'semi-confidentiel' ? 'Confidentiel – ouvert' : '—'} />
            {disponibilite && <DataRow label="Disponibilité" value={disponibilite} />}
          </div>
        </SectionBlock>
      </div>

      {/* CV upload - discreet */}
      <div className="border border-border rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground">CV</div>
            <span className="text-[10px] text-muted-foreground/60 font-sans font-light">optionnel</span>
          </div>
          {!cvFile && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-sans font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        {cvFile && (
          <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-sm border border-border bg-card">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-sans font-light text-foreground truncate flex-1">{cvFile.name}</span>
            <button type="button" onClick={() => store.setField('cvFile', null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-start gap-1.5 mt-2">
          <ShieldCheck className="w-3 h-3 text-muted-foreground/50 mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground/60 font-sans font-light leading-relaxed">
            Logan s'engage à ne jamais transmettre votre CV sans votre accord explicite.
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/inscription')}
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-lg text-sm font-bold hover:bg-foreground/90 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Modifier mon profil
        </button>
      </div>
    </div>
  );
};

export default CandidateProfile;
