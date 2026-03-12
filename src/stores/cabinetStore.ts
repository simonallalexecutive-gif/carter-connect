import { create } from 'zustand';

export interface CabinetContact {
  prenom: string;
  nom: string;
  email: string;
  mobile: string;
  role: string;
}

export interface CabinetSearch {
  id: string;
  deptKey: string;
  deptLabel: string;
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
  // Search details (same as before)
  seniorities: string[];
  expertise: string[];
  activitySplit: Record<string, number>;
  cabinetActivites: Record<string, boolean>;
  english: string;
  l500cand: boolean;
  natOrigin: string;
  prefFirms: string[];
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
  bonusDesc: string;
  hasHeures: boolean;
  tt: string;
  confNiveau: string;
  profileTypes: string[];
  searchAssocie: boolean;
  assocCAMin: string;
  assocCAMax: string;
  assocExpertiseDesc: string;
  assocClienteleDesc: string;
  assocProjetDesc: string;
}

export interface CabinetState {
  // Registration flow
  step: number; // 1=Hero, 2=Identity, 3=Subscription, 4=Validation, 5=Confirm, 6=Dashboard

  // Step 2 - Identity (simplified)
  cabinetName: string;
  selectedFirm: string;
  // Auto-detected from firm selection
  detectedNat: string;
  detectedRankings: { key: string; label: string; tier: number }[];
  // Account
  email: string;
  password: string;
  // Contacts
  contacts: CabinetContact[];

  // Step 3 - Subscription
  palier: string;

  // Step 4 - Validation
  approveCount: number;

  // Dashboard
  dashboardView: 'home' | 'explore' | 'newSearch';
  searches: CabinetSearch[];

  // Current search being created (temporary)
  currentSearchDept: string;
  currentSearchDeptLabel: string;
  currentSearchStep: number; // 0=dept selection, 1=search form, 2=validation
  seniorities: string[];
  expertise: string[];
  activitySplit: Record<string, number>;
  cabinetActivites: Record<string, boolean>;
  english: string;
  l500cand: boolean;
  natOrigin: string;
  prefFirms: string[];
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
  bonusDesc: string;
  hasHeures: boolean;
  tt: string;
  confNiveau: string;
  profileTypes: string[];
  searchAssocie: boolean;
  assocCAMin: string;
  assocCAMax: string;
  assocExpertiseDesc: string;
  assocClienteleDesc: string;
  assocProjetDesc: string;

  // Legacy (kept for compatibility)
  typeCab: string;
  depts: string[];
  l500: boolean;
  ranking: string;
  pratique: string;
  refPrenom: string;
  refNom: string;
  mobile: string;
  ref2Prenom: string;
  ref2Nom: string;
  ref2Email: string;
  ref2Mobile: string;
  showRef2: boolean;

  // Actions
  setStep: (step: number) => void;
  setField: <K extends keyof CabinetState>(key: K, value: CabinetState[K]) => void;
  addContact: () => void;
  removeContact: (index: number) => void;
  updateContact: (index: number, field: keyof CabinetContact, value: string) => void;
  toggleSeniority: (sen: string) => void;
  toggleExpertise: (exp: string) => void;
  updateSplit: (key: string, value: number) => void;
  redistributeSplit: () => void;
  resetSearch: () => void;
  saveCurrentSearch: () => void;
  reset: () => void;
  toggleDept: (dept: string) => void;
}

const searchDefaults = {
  seniorities: [] as string[],
  expertise: [] as string[],
  activitySplit: {} as Record<string, number>,
  cabinetActivites: {} as Record<string, boolean>,
  english: '',
  l500cand: false,
  natOrigin: '',
  prefFirms: [] as string[],
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
  bonusDesc: '',
  hasHeures: false,
  tt: '',
  confNiveau: '',
  profileTypes: [] as string[],
  searchAssocie: false,
  assocCAMin: '',
  assocCAMax: '',
  assocExpertiseDesc: '',
  assocClienteleDesc: '',
  assocProjetDesc: '',
};

const initialState = {
  step: 1,
  cabinetName: '',
  selectedFirm: '',
  detectedNat: '',
  detectedRankings: [] as { key: string; label: string; tier: number }[],
  email: '',
  password: '',
  contacts: [{ prenom: '', nom: '', email: '', mobile: '', role: '' }] as CabinetContact[],
  palier: 'business',
  approveCount: 0,
  dashboardView: 'home' as const,
  searches: [] as CabinetSearch[],
  currentSearchDept: '',
  currentSearchDeptLabel: '',
  currentSearchStep: 0,
  ...searchDefaults,
  // Legacy
  typeCab: '',
  depts: [] as string[],
  l500: false,
  ranking: '',
  pratique: '',
  refPrenom: '',
  refNom: '',
  mobile: '',
  ref2Prenom: '',
  ref2Nom: '',
  ref2Email: '',
  ref2Mobile: '',
  showRef2: false,
};

export const useCabinetStore = create<CabinetState>((set, get) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setField: (key, value) => set({ [key]: value } as any),
  addContact: () => set((s) => ({
    contacts: [...s.contacts, { prenom: '', nom: '', email: '', mobile: '' }],
  })),
  removeContact: (index) => set((s) => ({
    contacts: s.contacts.filter((_, i) => i !== index),
  })),
  updateContact: (index, field, value) => set((s) => ({
    contacts: s.contacts.map((c, i) => i === index ? { ...c, [field]: value } : c),
  })),
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
  resetSearch: () => set({
    currentSearchDept: '',
    currentSearchDeptLabel: '',
    currentSearchStep: 0,
    ...searchDefaults,
  }),
  saveCurrentSearch: () => {
    const s = get();
    const newSearch: CabinetSearch = {
      id: `SRCH-${Date.now()}`,
      deptKey: s.currentSearchDept,
      deptLabel: s.currentSearchDeptLabel,
      status: 'active',
      createdAt: new Date().toISOString(),
      seniorities: s.seniorities,
      expertise: s.expertise,
      activitySplit: s.activitySplit,
      cabinetActivites: s.cabinetActivites,
      english: s.english,
      l500cand: s.l500cand,
      natOrigin: s.natOrigin,
      prefFirms: s.prefFirms,
      contexte: s.contexte,
      eqAssocies: s.eqAssocies,
      eqCounsels: s.eqCounsels,
      eqCollab: s.eqCollab,
      equipeDesc: s.equipeDesc,
      profilLibre: s.profilLibre,
      retroMin: s.retroMin,
      retroMax: s.retroMax,
      heures: s.heures,
      bonusEnabled: s.bonusEnabled,
      bonusTypes: s.bonusTypes,
      bonusDesc: s.bonusDesc,
      hasHeures: s.hasHeures,
      tt: s.tt,
      confNiveau: s.confNiveau,
      searchAssocie: s.searchAssocie,
      assocCAMin: s.assocCAMin,
      assocCAMax: s.assocCAMax,
      assocExpertiseDesc: s.assocExpertiseDesc,
      assocClienteleDesc: s.assocClienteleDesc,
      assocProjetDesc: s.assocProjetDesc,
      profileTypes: s.profileTypes,
    };
    set({
      searches: [...s.searches, newSearch],
      dashboardView: 'home',
      currentSearchDept: '',
      currentSearchDeptLabel: '',
      currentSearchStep: 0,
      ...searchDefaults,
    });
  },
  reset: () => set(initialState),
}));
