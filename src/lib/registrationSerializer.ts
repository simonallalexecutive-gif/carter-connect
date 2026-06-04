/**
 * Single source of truth for serializing/hydrating a candidate registration
 * to/from `candidate_registrations.submission_data` (JSONB).
 *
 * Excludes transient/internal store fields (File objects, currentStep, password, etc.).
 */
import type { RegistrationState } from '@/types';

// Keys persisted to submission_data. Keep in sync with RegistrationState.
export const CANDIDATE_PERSISTED_KEYS = [
  // Identity
  'prenom', 'nom', 'email', 'telephone', 'linkedinUrl', 'photoPreviewUrl', 'photoStoragePath',
  'sermentMois', 'sermentAnnee',
  // Current firm / package
  'cabinet', 'previousCabinets', 'cabNat', 'cabTier', 'departement',
  'legal500', 'legal500Suivi',
  'retrocession', 'bonus',
  'hasObjectifFacturable', 'objectifFacturable', 'objectifFacturableReel',
  'conserverRetrocession', 'raisonsBaisseRetro',
  // Associé / Counsel
  'isAssocieOrCounsel', 'statutAssoc', 'chiffreAffairesPortable',
  'assocExpertiseSummary', 'assocProjet', 'assocAttentes', 'assocCabTypes', 'assocClientele',
  // Operations
  'tailleOperations', 'disponibilite',
  // RDV
  'souhaitePrendreRdv', 'creneauPrefere',
  // Step 3 — Activity
  'activites', 'pourcentages', 'sousActivites',
  'positionnementPreteur', 'clienteleFrancaise',
  'positionnementRestr', 'positionnementRestrPct',
  'clienteleRestr', 'clienteleRestrPct', 'restrFinancier',
  // Droit Social
  'socialConseil', 'socialRelationType', 'socialIndividuel', 'socialEmployeur',
  'socialPosCabinet', 'socialClientele', 'socialExpertises',
  // M&A / PE / VC
  'maPeFonds', 'maSanteVendeur', 'maVcFonds',
  'maIndusSecteurs', 'maIndusClientele', 'maSanteClientele',
  'maVcStades', 'maPublicOps', 'maClientele', 'vcSecteurs',
  // Concurrence
  'concAcquereur', 'concCtxDefense', 'concDomestique',
  'concOpsTypes', 'concCtxInterventions', 'concConsMissions', 'concSecteurs', 'concAutorites',
  // Fiscal
  'fiscInvestisseur', 'fiscCtxDefense', 'fiscDomestique',
  'fiscTransacOps', 'fiscCtxDossiers', 'fiscConsMissions',
  'fiscClientele', 'fiscComplexite', 'fiscSpecialisations',
  // Tax (new questionnaire)
  'taxConseilPct', 'taxClients',
  'taxCorporatePct', 'taxTransacPct',
  'taxHasPatrimonial', 'taxPatrimonialPct', 'taxPatrimonialTypes',
  'taxHasPrixTransfert', 'taxPrixTransfertPct',
  'taxHasTva', 'taxTvaPct', 'taxInternationalPct',
  // Droit Public
  'dpubPublique', 'dpubCtxDefense', 'dpubDomestique',
  'dpubContratsInterventions', 'dpubCtxInterventions', 'dpubConsDomaines',
  'dpubClientele', 'dpubDimensionProjets', 'dpubSecteurs',
  // Arbitration
  'arbInstitutions', 'arbSecteurs', 'arbPositionnements', 'arbDomestique',
  // Projects & Energy
  'projSecteursEnergie', 'projTypesInfra', 'projPositionnements', 'projTaille', 'projDomestique',
  // Real Estate
  'reBauxAM', 'reShareDeal', 'reAssetDealPct', 'reConstructionPct',
  'reHasFinancement', 'reFinancementPct', 'reShareDealCorporate', 'reShareDealMode',
  'reAssetTypes', 'reHasContentieux', 'reContentieuxPct', 'reContentieuxDomaines',
  'reHasUrbanisme', 'reUrbanismeConseilPct', 'reUrbanismeContentieuxPct',
  // Profile context
  'anglais', 'typesClients',
  // Step 4 — Next move
  'moveRemuneration', 'moveEvolution', 'moveManagement', 'moveExposition', 'moveCulture',
  'movePriorities', 'qualitesAppreciees', 'axesAmelioration',
  'motivation', 'notaBene', 'bullets',
  'cabinetsCibles', 'noGo', 'noGoCabinets', 'processusCours',
  // Step 5 — Status
  'statutEcoute', 'visibilite', 'cvStoragePath',
] as const;

export function serializeRegistration(
  store: any,
  extras: Record<string, any> = {},
): Record<string, any> {
  const out: Record<string, any> = { ...extras };
  for (const key of CANDIDATE_PERSISTED_KEYS) {
    if (key in store) out[key] = store[key];
  }
  return out;
}

export function hydrateRegistration(
  data: Record<string, any> | null | undefined,
  setField: (key: any, value: any) => void,
) {
  if (!data) return;
  for (const key of CANDIDATE_PERSISTED_KEYS) {
    if (key in data) {
      setField(key, data[key]);
    }
  }
}
