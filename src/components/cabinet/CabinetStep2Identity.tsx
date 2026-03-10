import { useState, useMemo } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FIRMS_DB, NAT_LABELS, NAT_FLAGS, DEPARTMENTS, CABINET_TYPES, L500_URLS, DEPT_KEY_MAP, getFirmTier } from '@/lib/cabinetConstants';
import { cn } from '@/lib/utils';
import { formatPhoneWithDots } from '@/lib/formatters';

const CabinetStep2Identity = () => {
  const s = useCabinetStore();
  const [acQuery, setAcQuery] = useState('');
  const [acOpen, setAcOpen] = useState(false);

  const firmNames = Object.keys(FIRMS_DB);
  const filtered = useMemo(() => {
    if (!acQuery || acQuery.length < 2) return [];
    const q = acQuery.toLowerCase();
    return firmNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 10);
  }, [acQuery]);

  const selectFirm = (name: string) => {
    s.setField('cabinetName', name);
    s.setField('selectedFirm', name);
    setAcQuery(name);
    setAcOpen(false);
    const firm = FIRMS_DB[name];
    if (firm) {
      const tier = getFirmTier(firm, s.depts);
      s.setField('ranking', tier);
      s.setField('typeCab', NAT_LABELS[firm.nat] || '');
      if (tier) {
        s.setField('l500', true);
      }
    }
  };

  const canContinue = s.cabinetName.trim() && s.email.trim();

  const l500Detected = s.selectedFirm && FIRMS_DB[s.selectedFirm] && s.ranking;

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 1 / 4
      </div>
      <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Votre cabinet</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
        Renseignez les informations de votre cabinet. Ces données permettent à LOGAN de valider votre accès et de personnaliser les profils présentés.
      </p>

      {/* Cabinet name with autocomplete */}
      <div className="mb-6">
        <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Nom du cabinet</label>
        <div className="relative">
          <Input
            value={acQuery || s.cabinetName}
            onChange={(e) => {
              setAcQuery(e.target.value);
              s.setField('cabinetName', e.target.value);
              setAcOpen(true);
            }}
            onFocus={() => acQuery.length >= 2 && setAcOpen(true)}
            placeholder="Tapez le nom de votre cabinet…"
            className="bg-background"
          />
          {acOpen && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-background border border-foreground border-t-0 rounded-b z-50 max-h-64 overflow-y-auto shadow-lg">
              {filtered.map((name) => {
                const firm = FIRMS_DB[name];
                const tier = getFirmTier(firm, s.depts);
                return (
                  <div
                    key={name}
                    className="px-4 py-3 cursor-pointer hover:bg-secondary flex items-center justify-between border-b border-border last:border-b-0"
                    onClick={() => selectFirm(name)}
                  >
                    <span className="text-sm font-medium text-foreground">{name}</span>
                    <div className="flex items-center gap-2">
                      {tier && <span className="text-[9px] font-bold tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm bg-foreground text-background">{tier}</span>}
                      <span className="text-sm">{NAT_FLAGS[firm.nat] || ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {l500Detected && (
          <div className="bg-foreground rounded mt-2.5 p-3.5 flex items-center gap-3.5">
            <span className="text-xl flex-shrink-0">⚡</span>
            <div className="flex-1">
              <div className="text-xs font-bold text-white mb-0.5">{s.selectedFirm} — détecté dans le Legal 500 Paris</div>
              <div className="text-[11px] text-white/55">
                <span className="inline-block text-[9px] font-bold tracking-[0.08em] uppercase px-1.5 py-0.5 bg-white text-foreground rounded-sm mr-1.5">{s.ranking}</span>
                {NAT_FLAGS[FIRMS_DB[s.selectedFirm]?.nat] || ''} {NAT_LABELS[FIRMS_DB[s.selectedFirm]?.nat] || ''}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cabinet type */}
      <div className="mb-6">
        <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Type de cabinet</label>
        <div className="flex gap-2 flex-wrap">
          {CABINET_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => s.setField('typeCab', t)}
              className={cn(
                'px-4 py-2 rounded-sm border text-xs transition-all',
                s.typeCab === t
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Departments */}
      <div className="mb-6">
        <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Département(s) concerné(s)</label>
        <div className="flex gap-2 flex-wrap">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              onClick={() => s.toggleDept(d)}
              className={cn(
                'px-4 py-2 rounded-sm border text-xs transition-all',
                s.depts.includes(d)
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
          L'abonnement LOGAN est annuel et illimité pour l'ensemble du cabinet — aucune limite par département.
        </p>
      </div>

      {/* Legal 500 toggle */}
      <div className="mb-6">
        <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Classement Legal 500</label>
        <button
          onClick={() => s.setField('l500', !s.l500)}
          className={cn(
            'w-full flex items-center justify-between p-4 rounded border transition-all',
            s.l500 ? 'border-foreground bg-secondary' : 'border-border bg-background'
          )}
        >
          <div className="text-left">
            <div className="text-sm text-foreground">Notre cabinet figure dans le Legal 500 Paris</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Utilisé pour positionner votre profil cabinet auprès des candidats</div>
          </div>
          <div className={cn('w-9 h-5 rounded-full relative transition-colors flex-shrink-0', s.l500 ? 'bg-foreground' : 'bg-border')}>
            <div className={cn('absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] transition-transform shadow-sm', s.l500 ? 'translate-x-4' : 'translate-x-[3px]')} />
          </div>
        </button>
        {s.l500 && (
          <div className="mt-2.5 grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Ranking</label>
              <div className="flex gap-1.5 flex-wrap">
                {['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map((t) => (
                  <button
                    key={t}
                    onClick={() => s.setField('ranking', t)}
                    className={cn(
                      'px-3 py-1.5 rounded-sm border text-xs transition-all',
                      s.ranking === t ? 'bg-foreground text-background border-foreground' : 'bg-background text-muted-foreground border-border hover:border-foreground'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-1.5 block">Pratique Legal 500</label>
              <select
                value={s.pratique}
                onChange={(e) => s.setField('pratique', e.target.value)}
                className="w-full px-3 py-2.5 rounded border border-border bg-background text-sm text-foreground focus:border-foreground focus:ring-0 outline-none appearance-none"
              >
                <option value="">Sélectionner…</option>
                <option>Banque & Finance — Transactions</option>
                <option>Corporate / M&A</option>
                <option>Private Equity</option>
                <option>Droit Social</option>
                <option>Immobilier</option>
                <option>Restructuring / Insolvabilité</option>
                <option>Fiscal</option>
                <option>Contentieux commercial</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-border my-8" />

      {/* Referent */}
      <div className="mb-6">
        <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Référent au sein du cabinet</label>
        <div className="grid grid-cols-2 gap-3">
          <Input value={s.refPrenom} onChange={(e) => s.setField('refPrenom', e.target.value)} placeholder="Prénom" className="bg-background" />
          <Input value={s.refNom} onChange={(e) => s.setField('refNom', e.target.value)} placeholder="Nom" className="bg-background" />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Email professionnel</label>
        <Input value={s.email} onChange={(e) => s.setField('email', e.target.value)} type="email" placeholder="prenom.nom@cabinet.com" className="bg-background" />
      </div>

      <div className="mb-6">
        <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">
          Téléphone portable <span className="font-normal normal-case tracking-normal text-[10px] text-border">recommandé</span>
        </label>
        <Input value={s.mobile} onChange={(e) => s.setField('mobile', formatPhoneWithDots(e.target.value))} type="tel" placeholder="06.50.10.20.30" className="bg-background" />
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setStep(1)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button onClick={() => s.setStep(3)} disabled={!canContinue} className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8">
          Continuer →
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep2Identity;
