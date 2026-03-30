export interface SeniorityInfo {
  label: string;
  years: number;
  colorClass: string;
}

export interface RegistrationState {
  currentStep: number;
  // Step 2 - Identity
  linkedinUrl: string;
  password: string;
  passwordConfirm: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  photo: File | null;
  photoPreviewUrl: string;
  sermentMois: number | null;
  sermentAnnee: number | null;
  cabinet: string;
  cabNat: string;
  cabTier: string;
  departement: string;
  legal500: boolean | null;
  legal500Suivi: string;
  retrocession: string;
  bonus: string;
  hasObjectifFacturable: boolean | null;
  objectifFacturable: string;
  objectifFacturableReel: string;
  assocClientele: string;
  // Associé / Counsel
  isAssocieOrCounsel: boolean;
  statutAssoc: 'counsel' | 'associe' | '';
  chiffreAffairesPortable: string;
  businessPlanFile: File | null;
  assocExpertiseSummary: string;
  assocProjet: string;
  assocAttentes: string[];
  assocCabTypes: string[];
  // Taille opérations & disponibilité
  tailleOperations: string[];
  disponibilite: string;
  // Rétrocession flexibility
  conserverRetrocession: boolean | null;
  raisonsBaisseRetro: string[];
  // RDV
  souhaitePrendreRdv: boolean;
  creneauPrefere: string;
  // Step 3 - Activity
  activites: Record<string, boolean>;
  pourcentages: Record<string, number>;
  sousActivites: Record<string, Record<string, number>>;
  positionnementPreteur: number;
  clienteleFrancaise: number;
  positionnementRestr: string[];
  positionnementRestrPct: Record<string, number>;
  clienteleRestr: string[];
  clienteleRestrPct: Record<string, number>;
  restrFinancier: number;
  // Droit Social
  socialConseil: number;
  socialRelationType: '' | 'individuelles' | 'collectives' | 'les_deux';
  socialIndividuel: number;
  socialEmployeur: number;
  socialPosCabinet: Record<string, number>;
  socialClientele: string[];
  socialExpertises: string[];
  // M&A / PE / VC
  maPeFonds: number;
  maSanteVendeur: number;
  maVcFonds: number;
  maIndusSecteurs: string[];
  maIndusClientele: string[];
  maSanteClientele: string[];
  maVcStades: string[];
  // Concurrence
  concAcquereur: number;
  concCtxDefense: number;
  concDomestique: number;
  concOpsTypes: string[];
  concCtxInterventions: string[];
  concConsMissions: string[];
  concSecteurs: string[];
  concAutorites: string[];
  // Fiscal
  fiscInvestisseur: number;
  fiscCtxDefense: number;
  fiscDomestique: number;
  fiscTransacOps: string[];
  fiscCtxDossiers: string[];
  fiscConsMissions: string[];
  fiscClientele: string[];
  fiscComplexite: string[];
  fiscSpecialisations: string[];
  // Droit Public
  dpubPublique: number;
  dpubCtxDefense: number;
  dpubDomestique: number;
  dpubContratsInterventions: string[];
  dpubCtxInterventions: string[];
  dpubConsDomaines: string[];
  dpubClientele: string[];
  dpubDimensionProjets: string[];
  dpubSecteurs: string[];
  anglais: string;
  typesClients: string[];
  // Step 4 - Project
  qualitesAppreciees: string[];
  axesAmelioration: string[];
  motivation: string;
  bullets: string[];
  cabinetsCibles: string[];
  noGo: string[];
  noGoCabinets: string[];
  processusCours: string;
  // Step 5 - Status
  statutEcoute: 'actif' | 'passif' | 'inactif' | '';
  visibilite: 'confidentiel' | 'semi-confidentiel' | '';
  cvFile: File | null;
  isAdminMode: boolean;
  consentement: boolean;
  consentementExactitude: boolean;
  consentementMiseEnRelation: boolean;
  // Actions
  setField: <K extends keyof RegistrationState>(key: K, value: RegistrationState[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (n: number) => void;
  reset: () => void;
}
