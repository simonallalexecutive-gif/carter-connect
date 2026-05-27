/**
 * Serializer / hydrator for the cabinet onboarding store.
 * Persisted to `cabinet_accounts.submission_data` (JSONB) plus dedicated
 * columns for `contacts`, `searches`, `logo_url`, `palier`, `cabinet_name`.
 */

export const CABINET_PERSISTED_KEYS = [
  // Identity
  'cabinetName', 'cabinetLogoUrl', 'selectedFirm',
  'detectedNat', 'detectedRankings',
  'email',
  // Subscription
  'palier',
  // Legacy
  'typeCab', 'depts', 'l500', 'ranking', 'pratique',
] as const;

export function serializeCabinet(store: any): Record<string, any> {
  const out: Record<string, any> = {};
  for (const key of CABINET_PERSISTED_KEYS) {
    if (key in store) out[key] = store[key];
  }
  return out;
}

export function hydrateCabinet(
  row: {
    cabinet_name?: string | null;
    logo_url?: string | null;
    palier?: string | null;
    submission_data?: Record<string, any> | null;
    contacts?: any[] | null;
    searches?: any[] | null;
  } | null | undefined,
  setField: (key: any, value: any) => void,
) {
  if (!row) return;
  const d = row.submission_data || {};

  if (row.cabinet_name) setField('cabinetName', row.cabinet_name);
  if (row.logo_url) setField('cabinetLogoUrl', row.logo_url);
  if (row.palier) setField('palier', row.palier);
  if (Array.isArray(row.contacts) && row.contacts.length) {
    setField('contacts', row.contacts);
  }
  if (Array.isArray(row.searches)) setField('searches', row.searches);

  for (const key of CABINET_PERSISTED_KEYS) {
    if (key in d && d[key] !== undefined && d[key] !== null && d[key] !== '') {
      setField(key, d[key]);
    }
  }
}
