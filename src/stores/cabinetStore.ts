import { create } from 'zustand';

export interface CabinetState {
  step: number;
  // Step 2 - Identity
  cabinetName: string;
  typeCab: string;
  depts: string[];
  l500: boolean;
  ranking: string;
  pratique: string;
  selectedFirm: string;
  refPrenom: string;
  refNom: string;
  email: string;
  mobile: string;
  ref2Prenom: string;
  ref2Nom: string;
  ref2Email: string;
  ref2Mobile: string;
  showRef2: boolean;
  // Step 3 - Search
  seniorities: string[];
  expertise: string[];
  activitySplit: Record<string, number>;
  cabinetActivites: Record<string, boolean>;
  english: string;
  l500cand: boolean;
  natOrigin: string;
  contexte: string;
  eqAssocies: string;
  eqCounsels: string;
  eqCollab: string;
  equipeDesc: string;
  profilLibre: string;
  retroMin: string;
  retroMax: string;
  heures: string;
  bonusEnabled: boolean;
  bonusTypes: string[];
  hasHeures: boolean;
  tt: string;
  confNiveau: string;
  // Step 4 - Subscription
  palier: string;
  // Step 5 - Validation
  approveCount: number;
  // Actions
  setStep: (step: number) => void;
  setField: <K extends keyof CabinetState>(key: K, value: CabinetState[K]) => void;
  toggleDept: (dept: string) => void;
  toggleSeniority: (sen: string) => void;
  toggleExpertise: (exp: string) => void;
  updateSplit: (key: string, value: number) => void;
  redistributeSplit: () => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  cabinetName: '',
  typeCab: '',
  depts: [] as string[],
  l500: false,
  ranking: '',
  pratique: '',
  selectedFirm: '',
  refPrenom: '',
  refNom: '',
  email: '',
  mobile: '',
  ref2Prenom: '',
  ref2Nom: '',
  ref2Email: '',
  ref2Mobile: '',
  showRef2: false,
  seniorities: [] as string[],
  expertise: [] as string[],
  activitySplit: {} as Record<string, number>,
  english: '',
  l500cand: false,
  natOrigin: '',
  contexte: '',
  eqAssocies: '',
  eqCounsels: '',
  eqCollab: '',
  equipeDesc: '',
  profilLibre: '',
  retroMin: '',
  retroMax: '',
  heures: '',
  bonusEnabled: false,
  bonusTypes: [] as string[],
  hasHeures: false,
  tt: '',
  confNiveau: '',
  palier: 'standard',
  approveCount: 0,
};

export const useCabinetStore = create<CabinetState>((set, get) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setField: (key, value) => set({ [key]: value } as any),
  toggleDept: (dept) => set((s) => ({
    depts: s.depts.includes(dept) ? s.depts.filter((d) => d !== dept) : [...s.depts, dept],
  })),
  toggleSeniority: (sen) => set((s) => ({
    seniorities: s.seniorities.includes(sen) ? s.seniorities.filter((x) => x !== sen) : [...s.seniorities, sen],
  })),
  toggleExpertise: (exp) => {
    const s = get();
    const newExpertise = s.expertise.includes(exp)
      ? s.expertise.filter((x) => x !== exp)
      : [...s.expertise, exp];
    const newSplit = { ...s.activitySplit };
    if (!s.expertise.includes(exp)) {
      newSplit[exp] = 0;
    } else {
      delete newSplit[exp];
    }
    // Redistribute
    if (newExpertise.length > 0) {
      const equal = Math.floor(100 / newExpertise.length);
      const rem = 100 - equal * newExpertise.length;
      newExpertise.forEach((k, i) => { newSplit[k] = equal + (i === 0 ? rem : 0); });
    }
    set({ expertise: newExpertise, activitySplit: newSplit });
  },
  updateSplit: (key, value) => set((s) => ({
    activitySplit: { ...s.activitySplit, [key]: value },
  })),
  redistributeSplit: () => {
    const s = get();
    if (!s.expertise.length) return;
    const equal = Math.floor(100 / s.expertise.length);
    const rem = 100 - equal * s.expertise.length;
    const newSplit: Record<string, number> = {};
    s.expertise.forEach((k, i) => { newSplit[k] = equal + (i === 0 ? rem : 0); });
    set({ activitySplit: newSplit });
  },
  reset: () => set(initialState),
}));
