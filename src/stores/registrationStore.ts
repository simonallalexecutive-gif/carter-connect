import { create } from 'zustand';
import type { RegistrationState } from '@/types';

const initialState = {
  currentStep: 1,
  linkedinUrl: '',
  password: '',
  passwordConfirm: '',
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  photo: null as File | null,
  photoPreviewUrl: '',
  sermentMois: null as number | null,
  sermentAnnee: null as number | null,
  cabinet: '',
  cabNat: '',
  cabTier: '',
  departement: '',
  legal500: null as boolean | null,
  legal500Suivi: '',
  retrocession: '',
  bonus: '',
  hasObjectifFacturable: null as boolean | null,
  objectifFacturable: '',
  objectifFacturableReel: '',
  assocClientele: '',
  // Associé / Counsel
  isAssocieOrCounsel: false,
  chiffreAffairesPortable: '',
  businessPlanFile: null as File | null,
  assocExpertiseSummary: '',
  assocProjet: '',
  assocAttentes: [] as string[],
  assocCabTypes: [] as string[],
  // Taille opérations & disponibilité
  tailleOperations: [] as string[],
  disponibilite: '',
  // Rétrocession flexibility
  conserverRetrocession: null as boolean | null,
  raisonsBaisseRetro: [] as string[],
  // RDV
  souhaitePrendreRdv: false,
  creneauPrefere: '',
  // Step 3
  activites: {} as Record<string, boolean>,
  pourcentages: {} as Record<string, number>,
  anglais: '',
  typesClients: [] as string[],
  // Step 4
  qualitesAppreciees: [] as string[],
  axesAmelioration: [] as string[],
  motivation: '',
  bullets: ['', '', ''],
  cabinetsCibles: [] as string[],
  noGo: [] as string[],
  processusCours: '',
  // Step 5
  statutEcoute: '' as '' | 'actif' | 'passif' | 'inactif',
  visibilite: '' as '' | 'confidentiel' | 'partiel',
  cvFile: null as File | null,
  consentement: false,
  consentementExactitude: false,
  consentementMiseEnRelation: false,
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  ...initialState,
  setField: (key, value) => set({ [key]: value } as Partial<RegistrationState>),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 7) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  goToStep: (n) => set({ currentStep: n }),
  reset: () => set(initialState),
}));
