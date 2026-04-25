import { useState, useMemo, useEffect } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CHAMBERS_DB, getFirmChambersRankings, formatChambersBand, CHAMBERS_DEPARTMENTS } from '@/lib/chambersRankings';
import { NAT_FLAGS, NAT_LABELS, getFirmRankings as getLegal500Rankings, formatTier as formatLegal500Tier } from '@/lib/legal500Rankings';
import { cn } from '@/lib/utils';
import { formatPhoneWithDots } from '@/lib/formatters';
import { Plus, Minus, Shield, Building2, Eye, EyeOff } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const CabinetStep2Identity = () => {
  const s = useCabinetStore();
  const [acQuery, setAcQuery] = useState('');
  const [acOpen, setAcOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [cabinetLogoUrl, setCabinetLogoUrl] = useState<string | null>(null);

  const passwordChecks = {
    length: s.password.length >= 8,
    upper: /[A-Z]/.test(s.password),
    lower: /[a-z]/.test(s.password),
    number: /[0-9]/.test(s.password),
    symbol: /[^A-Za-z0-9]/.test(s.password),
  };
  const passwordValid = Object.values(passwordChecks).every(Boolean);

  const firmNames = Object.keys(CHAMBERS_DB);
  const filtered = useMemo(() => {
    if (!acQuery || acQuery.length < 2) return [];
    const q = acQuery.toLowerCase();
    return firmNames.filter((n) => n.toLowerCase().includes(q)).slice(0, 10);
  }, [acQuery]);

  const selectFirm = (name: string) => {
    s.setField('cabinetName', name);
    s.setField('selectedFirm', name);
    const firm = CHAMBERS_DB[name];
    if (firm) s.setField('detectedNat', firm.nat);
    const rankings = getFirmChambersRankings(name);
    s.setField('detectedRankings', rankings.map(r => ({ key: r.key, label: r.label, tier: r.band })));
    setAcQuery(name);
    setAcOpen(false);
    // Try to load cabinet logo
    tryLoadLogo(name);
  };

  const tryLoadLogo = (name: string) => {
    // Map known firm names to domains
    const FIRM_DOMAINS: Record<string, string> = {
      'Bredin Prat': 'bredinprat.com', 'Darrois Villey': 'darroismaillot.com', 'Gide': 'gide.com',
      'De Pardieu Brocas Maffei': 'depardieu.com', 'Cleary Gottlieb': 'clearygottlieb.com',
      'Sullivan & Cromwell': 'sullcrom.com', 'Skadden': 'skadden.com', 'Weil Gotshal': 'weil.com',
      'Linklaters': 'linklaters.com', 'Freshfields': 'freshfields.com', 'Clifford Chance': 'cliffordchance.com',
      'Allen & Overy': 'allenovery.com', 'Latham & Watkins': 'lw.com', 'Davis Polk': 'davispolk.com',
      'Cravath': 'cravath.com', 'White & Case': 'whitecase.com', 'Willkie Farr': 'willkie.com',
      'Fried Frank': 'friedfrank.com', 'Herbert Smith': 'herbertsmithfreehills.com',
      'Hogan Lovells': 'hoganlovells.com', 'Norton Rose': 'nortonrosefulbright.com',
      'DLA Piper': 'dlapiper.com', 'Baker McKenzie': 'bakermckenzie.com',
      'CMS Francis Lefebvre': 'cms.law', 'August & Debouzy': 'august-debouzy.com',
      'Racine': 'racine.eu', 'Mayer Brown': 'mayerbrown.com', 'Jones Day': 'jonesday.com',
      'Goodwin': 'goodwinlaw.com', 'Gibson Dunn': 'gibsondunn.com', 'Shearman': 'shearman.com',
      'Paul Weiss': 'paulweiss.com', 'Orrick': 'orrick.com', 'Dechert': 'dechert.com',
    };
    const domain = Object.entries(FIRM_DOMAINS).find(([k]) => name.includes(k))?.[1];
    if (domain) {
      const logoUrl = `https://logo.clearbit.com/${domain}`;
      const img = new Image();
      img.onload = () => setCabinetLogoUrl(logoUrl);
      img.onerror = () => setCabinetLogoUrl(null);
      img.src = logoUrl;
    } else {
      setCabinetLogoUrl(null);
    }
  };

  const handleNameChange = (value: string) => {
    setAcQuery(value);
    s.setField('cabinetName', value);
    s.setField('selectedFirm', '');
    s.setField('detectedNat', '');
    s.setField('detectedRankings', []);
    setAcOpen(true);
  };

  const contactsValid = s.contacts.every((c) => c.email.trim() && c.mobile.trim());
  const canContinue = s.cabinetName.trim() && s.email.trim() && passwordValid && s.contacts[0]?.prenom.trim() && s.contacts[0]?.nom.trim() && contactsValid;

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 1 / 3
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Votre cabinet</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
        Renseignez le nom de votre cabinet. LOGAN identifiera automatiquement votre nationalité et vos classements Legal 500 pour chaque département.
      </p>

      {/* Cabinet name with autocomplete */}
      <div className="mb-6">
        <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Nom du cabinet</label>
        <div className="relative">
          <Input
            value={acQuery || s.cabinetName}
            onChange={(e) => handleNameChange(e.target.value)}
            onFocus={() => acQuery.length >= 2 && setAcOpen(true)}
            placeholder="Tapez le nom de votre cabinet…"
            className="bg-background"
          />
          {acOpen && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-background border border-foreground border-t-0 rounded-b z-50 max-h-64 overflow-y-auto shadow-lg">
              {filtered.map((name) => {
                const firm = CHAMBERS_DB[name];
                const nat = firm?.nat ?? null;
                return (
                  <div
                    key={name}
                    className="px-4 py-3 cursor-pointer hover:bg-secondary flex items-center justify-between border-b border-border last:border-b-0"
                    onClick={() => selectFirm(name)}
                  >
                    <span className="text-sm font-medium text-foreground">{name}</span>
                    {nat && <span className="text-xs text-muted-foreground">{NAT_FLAGS[nat]} {NAT_LABELS[nat]}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Auto-detected info */}
      {s.selectedFirm && s.detectedNat && (
        <div className="mb-8 p-5 rounded-md border border-border bg-secondary/30 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-foreground" />
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Informations détectées automatiquement</span>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            {cabinetLogoUrl ? (
              <img src={cabinetLogoUrl} alt={s.cabinetName} className="w-8 h-8 rounded object-contain bg-white p-0.5 border border-border" />
            ) : (
              <span className="text-sm font-bold">{NAT_FLAGS[s.detectedNat]}</span>
            )}
            <div>
              <div className="text-sm font-semibold text-foreground">{s.cabinetName}</div>
              <div className="text-xs text-muted-foreground">{NAT_LABELS[s.detectedNat]}</div>
            </div>
          </div>

          {s.detectedRankings.length > 0 && (
            <div>
              <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Classements Chambers</div>
              <div className="grid grid-cols-2 gap-2">
                {s.detectedRankings.map((r) => (
                  <div key={r.key} className="flex items-center justify-between p-2.5 rounded border border-border bg-background">
                    <span className="text-xs text-foreground">{r.label}</span>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-sm',
                      r.tier <= 2 ? 'bg-foreground text-background' : 'bg-secondary text-foreground'
                    )}>
                      Band {r.tier}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal 500 rankings — auto-detected */}
          {(() => {
            const l500 = getLegal500Rankings(s.cabinetName);
            if (l500.length === 0) return null;
            return (
              <div className="mt-4">
                <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2">Classements Legal 500</div>
                <div className="grid grid-cols-2 gap-2">
                  {l500.map((r) => (
                    <div key={`l500-${r.key}`} className="flex items-center justify-between p-2.5 rounded border border-border bg-background">
                      <span className="text-xs text-foreground">{r.label}</span>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-sm',
                        r.tier <= 2 ? 'bg-foreground text-background' : 'bg-secondary text-foreground'
                      )}>
                        {formatLegal500Tier(r.tier)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {s.detectedRankings.length === 0 && getLegal500Rankings(s.cabinetName).length === 0 && (
            <p className="text-xs text-muted-foreground italic">Aucun classement Chambers ni Legal 500 détecté pour ce cabinet.</p>
          )}
        </div>
      )}

      {/* Non-listed cabinet info */}
      {s.cabinetName && !s.selectedFirm && acQuery.length >= 3 && !acOpen && (
        <div className="mb-6 p-4 rounded border border-border bg-secondary/20">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Cabinet non répertorié dans le Legal 500 — votre inscription sera traitée manuellement par l'équipe LOGAN.</span>
          </div>
        </div>
      )}

      <div className="h-px bg-border my-8" />

      {/* Account creation */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Création de votre compte</span>
        </div>
        <div className="mb-4">
          <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Email professionnel</label>
          <Input value={s.email} onChange={(e) => s.setField('email', e.target.value)} type="email" placeholder="prenom.nom@cabinet.com" className="bg-background" />
        </div>
        <div>
          <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Mot de passe</label>
          <div className="relative">
            <Input
              value={s.password}
              onChange={(e) => s.setField('password', e.target.value)}
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 caractères"
              className="bg-background pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {s.password && (
            <div className="mt-2 space-y-1">
              {[
                { key: 'length', label: '8 caractères minimum' },
                { key: 'upper', label: '1 majuscule' },
                { key: 'lower', label: '1 minuscule' },
                { key: 'number', label: '1 chiffre' },
                { key: 'symbol', label: '1 caractère spécial (!@#$…)' },
              ].map((rule) => (
                <div key={rule.key} className="flex items-center gap-2">
                  <div className={cn(
                    'w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold',
                    passwordChecks[rule.key as keyof typeof passwordChecks]
                      ? 'bg-green-600 text-white'
                      : 'bg-border text-muted-foreground'
                  )}>
                    {passwordChecks[rule.key as keyof typeof passwordChecks] ? '✓' : ''}
                  </div>
                  <span className={cn(
                    'text-[10px]',
                    passwordChecks[rule.key as keyof typeof passwordChecks] ? 'text-green-700' : 'text-muted-foreground'
                  )}>{rule.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      {/* Contacts */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground">Interlocuteurs référents</span>
        </div>

        {s.contacts.map((contact, index) => (
          <div key={index} className={cn(
            'mb-4 p-5 border border-border rounded-md',
            index === 0 ? 'bg-background' : 'bg-secondary/30 animate-fade-in'
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-foreground">Référent {index + 1}</span>
              {index > 0 && (
                <button
                  onClick={() => s.removeContact(index)}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minus className="w-3 h-3" />
                  Retirer
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input
                value={contact.prenom}
                onChange={(e) => s.updateContact(index, 'prenom', e.target.value)}
                placeholder="Prénom"
                className="bg-background"
              />
              <Input
                value={contact.nom}
                onChange={(e) => s.updateContact(index, 'nom', e.target.value)}
                placeholder="Nom"
                className="bg-background"
              />
            </div>
            <div className="mb-3">
              <Input
                value={contact.email}
                onChange={(e) => s.updateContact(index, 'email', e.target.value)}
                type="email"
                placeholder="Email professionnel"
                className="bg-background"
              />
            </div>
            <div className="mb-3">
              <Input
                value={contact.mobile}
                onChange={(e) => s.updateContact(index, 'mobile', formatPhoneWithDots(e.target.value))}
                type="tel"
                placeholder="06.50.10.20.30"
                className="bg-background"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-2 block">Rôle dans le cabinet</label>
              <div className="flex gap-1.5 flex-wrap">
                {['Managing Partner', 'Associé(e)', 'RH', 'Secrétaire général', 'Assistant(e)'].map((role) => (
                  <button
                    key={role}
                    onClick={() => s.updateContact(index, 'role', role)}
                    className={cn(
                      'px-3 py-1.5 rounded-sm border text-[11px] transition-all',
                      contact.role === role
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-background text-muted-foreground border-border hover:border-foreground hover:text-foreground'
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={() => s.addContact()}
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter un référent
        </button>
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
