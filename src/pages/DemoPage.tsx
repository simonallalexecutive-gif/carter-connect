import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Play, Shield, Eye, EyeOff, Users, Search, Handshake, Building2, UserCheck, Bell, BarChart3, Clock, CheckCircle2, LayoutDashboard, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Perspective = 'candidat' | 'cabinet' | 'dashboard';

interface Slide {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  points: { icon: React.ReactNode; text: string }[];
  visual?: React.ReactNode;
}

// ── Mockups espace cabinet ────────────────────────────────────────────────────

const SearchFormMockup = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-lg mx-auto text-[11px]">
    {/* Top bar */}
    <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-3">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      <span className="text-gray-400 text-[10px] tracking-wide">loganexecutive.com · Espace cabinet</span>
    </div>
    <div className="flex">
      {/* Sidebar mini */}
      <div className="w-28 bg-white border-r border-gray-100 py-4 flex flex-col gap-1 px-3 flex-shrink-0">
        <div className="font-serif text-[16px] text-gray-900 mb-4 px-1">Logan</div>
        {['Tableau de bord', 'Mes recherches', 'Alertes', 'Fixer un call'].map((item, i) => (
          <div key={item} className={cn('px-2 py-1.5 rounded text-[9px] text-gray-500 cursor-default', i === 1 && 'bg-gray-100 text-gray-800 font-medium')}>{item}</div>
        ))}
      </div>
      {/* Content */}
      <div className="flex-1 p-4">
        <div className="text-[8px] tracking-[0.14em] uppercase text-gray-400 mb-1">Étape 2 / 4</div>
        <div className="font-serif text-[17px] text-gray-900 mb-3">Ma recherche</div>

        <div className="mb-3">
          <div className="text-[8px] tracking-[0.12em] uppercase text-gray-400 mb-1.5">Type de profil recherché</div>
          <div className="flex gap-1.5">
            {['Collaborateur', 'Counsel', 'Associé'].map((t, i) => (
              <div key={t} className={cn('flex-1 text-center py-1.5 rounded border text-[9px]', i === 0 ? 'border-gray-900 text-gray-900 font-medium' : 'border-gray-200 text-gray-400')}>{t}</div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-[8px] tracking-[0.12em] uppercase text-gray-400 mb-1.5">Séniorité recherchée</div>
          <div className="flex gap-1.5">
            {[['0–3 ans', 'Junior'], ['3–6 ans', 'Mid Level'], ['+6 ans', 'Sénior']].map(([yr, lvl], i) => (
              <div key={yr} className={cn('flex-1 text-center py-1.5 rounded border', i === 1 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-500')}>
                <div className="text-[9px] font-medium">{yr}</div>
                <div className="text-[7px] opacity-60">{lvl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="text-[8px] tracking-[0.12em] uppercase text-gray-400 mb-1.5">Département</div>
          <div className="flex flex-wrap gap-1">
            {['Corporate/M&A/PE', 'Banking & Finance', 'Employment'].map((d, i) => (
              <div key={d} className={cn('px-2 py-1 rounded-full border text-[8px]', i < 2 ? 'border-gray-900 text-gray-900 font-medium' : 'border-gray-200 text-gray-400')}>{d}</div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <div className="bg-gray-900 text-white px-4 py-1.5 rounded text-[9px] font-medium">Suivant →</div>
        </div>
      </div>
    </div>
  </div>
);

const MarketMockup = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-lg mx-auto text-[11px]">
    <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-3">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      <span className="text-gray-400 text-[10px] tracking-wide">loganexecutive.com · Explorer le marché</span>
    </div>
    <div className="flex">
      <div className="w-28 bg-white border-r border-gray-100 py-4 flex flex-col gap-1 px-3 flex-shrink-0">
        <div className="font-serif text-[16px] text-gray-900 mb-4 px-1">Logan</div>
        {['Tableau de bord', 'Mes recherches', 'Explorer', 'Alertes'].map((item, i) => (
          <div key={item} className={cn('px-2 py-1.5 rounded text-[9px] text-gray-500 cursor-default', i === 2 && 'bg-gray-100 text-gray-800 font-medium')}>{item}</div>
        ))}
      </div>
      <div className="flex-1 p-4">
        <div className="font-serif text-[16px] text-gray-900 mb-1">Explorer le marché</div>
        <div className="text-[9px] text-gray-400 mb-3">Profils anonymisés — cliquez pour consulter le détail</div>
        <div className="flex gap-1 mb-3 flex-wrap">
          {['Tous', 'Corporate/M&A', 'B&F', 'Employment'].map((f, i) => (
            <div key={f} className={cn('px-2 py-0.5 rounded-full text-[8px] border', i === 0 ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500')}>{f}</div>
          ))}
        </div>
        <div className="space-y-1.5">
          {[
            { id: 'C-2024-042', level: 'Senior', domain: 'Banking & Finance · 5 ans', status: 'À L\'ÉCOUTE', tags: ['Cabinet Français', 'Chambers', 'Legal 500'], active: false },
            { id: 'C-2024-057', level: 'Mid Level', domain: 'Corporate/M&A · 4 ans', status: 'À L\'ÉCOUTE', tags: ['Cabinet Français', 'Chambers'], active: false },
            { id: 'C-2024-071', level: 'Mid Level', domain: 'Banking & Finance · 3 ans', status: 'ACTIVE', tags: ['Cabinet Anglais', 'Chambers'], active: true },
          ].map(p => (
            <div key={p.id} className="border border-gray-100 rounded p-2.5 flex items-center justify-between hover:bg-gray-50 cursor-default">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[8px] text-gray-400">{p.id}</span>
                  <span className={cn('text-[7px] font-semibold tracking-wide', p.active ? 'text-blue-500' : 'text-gray-400')}>● {p.status}</span>
                </div>
                <div className="font-medium text-[10px] text-gray-900">{p.level}</div>
                <div className="text-[8px] text-gray-500">{p.domain}</div>
                <div className="flex gap-1 mt-1">
                  {p.tags.map(t => <span key={t} className="text-[7px] px-1.5 py-0.5 rounded border border-gray-200 text-gray-500">{t}</span>)}
                </div>
              </div>
              <div className="text-[8px] text-gray-400 font-medium">VOIR →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProfileDrawerMockup = () => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-lg mx-auto text-[11px]">
    <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center gap-3">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
      </div>
      <span className="text-gray-400 text-[10px] tracking-wide">Profil anonyme · C-2024-042</span>
    </div>
    <div className="p-4">
      <div className="text-[8px] tracking-[0.14em] uppercase text-gray-400 mb-2">Profil anonymisé</div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <UserCheck className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <div className="font-serif text-[13px] text-gray-900">Profil anonyme</div>
          <div className="text-[9px] text-gray-400">C-2024-042 · Collaborateur — Senior · 5 ans</div>
          <div className="flex gap-2 mt-0.5">
            <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Chambers</span>
            <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">Legal 500</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-3">
        {[
          ['Pratique', 'Banque & Finance'],
          ['Cabinet d\'origine', 'Cabinet français'],
          ['Chambers', 'Band 1/Band 2 — B&F'],
          ['Anglais', 'Bilingue'],
        ].map(([label, val]) => (
          <div key={label}>
            <div className="text-[7px] tracking-[0.12em] uppercase text-gray-400 mb-0.5">{label}</div>
            <div className="text-[10px] font-medium text-gray-900">{val}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 mb-3">
        <div className="text-[7px] tracking-[0.12em] uppercase text-gray-400 mb-2">Rémunération</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[8px] text-gray-400 mb-0.5">Rétrocession actuelle</div>
            <div className="font-serif text-[13px] text-gray-900 font-semibold">65–72 K€ fixe</div>
          </div>
          <div>
            <div className="text-[8px] text-gray-400 mb-0.5">Rétrocession suggérée Logan</div>
            <div className="font-serif text-[13px] text-gray-900 font-semibold">165 K€</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <div className="flex-1 text-center py-1.5 bg-gray-900 text-white rounded text-[9px] font-medium cursor-default">Manifester l'intérêt →</div>
        <div className="px-3 py-1.5 border border-gray-200 rounded text-[9px] text-gray-500 cursor-default">Passer</div>
      </div>
    </div>
  </div>
);

// ── Slides ────────────────────────────────────────────────────────────────────

const candidatSlides: Slide[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Créez votre profil confidentiel',
    subtitle: 'Inscription en 5 minutes — votre identité reste strictement protégée.',
    points: [
      { icon: <EyeOff className="w-4 h-4" />, text: 'Votre nom et votre cabinet actuel ne sont jamais révélés aux recruteurs.' },
      { icon: <UserCheck className="w-4 h-4" />, text: 'Renseignez votre expertise, séniorité, langues et aspirations.' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Profil validé sous 48h par l\'équipe Logan.' },
    ],
    visual: (
      <div className="bg-foreground rounded-lg p-6 text-background max-w-sm mx-auto">
        <div className="text-[8px] tracking-[0.16em] uppercase text-background/30 mb-3">Profil anonymisé</div>
        <div className="font-serif text-lg font-bold mb-1">Collaborateur · M&A / PE</div>
        <div className="text-xs text-background/50 mb-4">5 ans PQE · Cabinet US Tier 1</div>
        <div className="flex gap-1.5 flex-wrap">
          {['M&A Industriel', 'Private Equity', 'Bilingue'].map(t => (
            <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border border-background/15 text-background/60">{t}</span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-background/10 text-[11px] text-background/40 flex items-center gap-2">
          <EyeOff className="w-3.5 h-3.5" /> Identité protégée
        </div>
      </div>
    ),
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: 'Recevez des opportunités ciblées',
    subtitle: 'Les cabinets publient leurs besoins — Logan vous présente ceux qui matchent.',
    points: [
      { icon: <Search className="w-4 h-4" />, text: 'Matching intelligent basé sur votre expertise, séniorité et préférences.' },
      { icon: <Eye className="w-4 h-4" />, text: 'Consultez les fiches d\'opportunité : département, taille d\'équipe, rémunération.' },
      { icon: <Shield className="w-4 h-4" />, text: 'Le cabinet ne sait pas que vous existez tant que vous n\'avez pas dit oui.' },
    ],
    visual: (
      <div className="bg-foreground rounded-lg overflow-hidden max-w-sm mx-auto">
        <div className="p-5 border-b border-background/[0.06]">
          <div className="text-[8px] tracking-[0.16em] uppercase text-background/30 mb-2">Opportunité · Présentée par LOGAN</div>
          <div className="font-serif text-base font-bold text-background mb-1">Senior · Banque & Finance</div>
          <div className="text-[11px] text-background/45">Cabinet anonyme · Tier 1</div>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[8px] uppercase text-background/30 mb-1">Rétrocession</div>
            <div className="font-serif text-sm font-bold text-background">65–80 K€</div>
          </div>
          <div>
            <div className="text-[8px] uppercase text-background/30 mb-1">Équipe</div>
            <div className="font-serif text-sm font-bold text-background">2 associés · 5 collabs</div>
          </div>
        </div>
        <div className="p-5 pt-0">
          <div className="w-full py-2.5 bg-background text-foreground font-bold text-xs rounded text-center">Je suis intéressé(e) →</div>
        </div>
      </div>
    ),
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: 'Mise en relation orchestrée',
    subtitle: 'Logan lève le rideau uniquement avec votre accord explicite.',
    points: [
      { icon: <Users className="w-4 h-4" />, text: 'Votre consultant Logan prépare l\'échange : contexte, attentes, timing.' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Entretien organisé — le cabinet découvre votre identité à ce moment seulement.' },
      { icon: <Shield className="w-4 h-4" />, text: '0% commission côté candidat. Toujours. Sans exception.' },
    ],
    visual: (
      <div className="max-w-sm mx-auto space-y-3">
        {[
          { step: '1', label: 'Intérêt mutuel confirmé', done: true },
          { step: '2', label: 'Brief de votre consultant Logan', done: true },
          { step: '3', label: 'Levée de rideau & entretien', done: false },
        ].map(s => (
          <div key={s.step} className={cn(
            'flex items-center gap-4 p-4 rounded-lg border transition-all',
            s.done ? 'bg-foreground text-background border-foreground' : 'bg-secondary border-border'
          )}>
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
              s.done ? 'bg-background text-foreground' : 'bg-foreground text-background'
            )}>{s.done ? '✓' : s.step}</div>
            <span className={cn('text-sm font-medium', s.done ? 'text-background' : 'text-foreground')}>{s.label}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const cabinetSlides: Slide[] = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: 'Publiez votre recherche',
    subtitle: 'Décrivez le profil idéal — Logan cible les candidats pertinents.',
    points: [
      { icon: <Search className="w-4 h-4" />, text: 'Séniorité, expertise, taille d\'opérations, anglais, cabinet d\'origine…' },
      { icon: <Shield className="w-4 h-4" />, text: '3 niveaux de confidentialité : confidentielle, semi-confidentielle, ouverte.' },
      { icon: <Users className="w-4 h-4" />, text: 'Précisez vos cabinets prioritaires pour des alertes ciblées.' },
    ],
    visual: (
      <div className="bg-secondary rounded-lg p-6 max-w-sm mx-auto">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-4">Votre recherche</div>
        <div className="space-y-3">
          {[
            { label: 'Séniorité', value: 'Mid Level · Sénior' },
            { label: 'Expertise', value: 'M&A Industriel, PE / LBO' },
            { label: 'Anglais', value: 'Courant / Bilingue' },
            { label: 'Confidentialité', value: '🔒 Confidentielle' },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-baseline py-1.5 border-b border-border last:border-b-0">
              <span className="text-[11px] text-muted-foreground">{r.label}</span>
              <span className="text-xs font-medium text-foreground">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: 'Consultez le vivier premium',
    subtitle: 'Accédez en temps réel aux profils anonymisés à l\'écoute du marché.',
    points: [
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Score de matching intelligent : expertise, séniorité, motivations.' },
      { icon: <Bell className="w-4 h-4" />, text: 'Alertes prioritaires dès qu\'un profil correspond à vos critères.' },
      { icon: <Clock className="w-4 h-4" />, text: 'Recrutement stratégique : identifiez les talents avant vos concurrents.' },
    ],
    visual: (
      <div className="max-w-sm mx-auto space-y-2.5">
        {[
          { id: 'C-042', title: 'Senior Associate Finance · 5 ans', match: 92, tags: ['Financement', 'PE'], tier: 'Cabinet US Tier 1' },
          { id: 'C-057', title: 'Collaborateur M&A · 4 ans', match: 88, tags: ['M&A', 'PE'], tier: 'Cabinet FR Tier 1' },
          { id: 'C-071', title: 'Collaborateur Finance · 3 ans', match: 79, tags: ['Financement', 'Restructuring'], tier: 'Cabinet UK Tier 2' },
        ].map(p => (
          <div key={p.id} className="bg-foreground rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center text-background font-serif text-sm font-bold flex-shrink-0">
              {p.match}%
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-background truncate">{p.title}</div>
              <div className="text-[10px] text-background/40 mt-0.5">{p.tier}</div>
              <div className="flex gap-1 mt-1.5">
                {p.tags.map(t => (
                  <span key={t} className="text-[9px] px-2 py-0.5 rounded-full border border-background/15 text-background/50">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: 'Un modèle hybride gagnant',
    subtitle: 'Abonnement mensuel + fee de placement réduit vs chasseurs traditionnels.',
    points: [
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Starter à 1.500€/mois (fee 18%) — Business à 3.000€/mois (fee 15%) — Enterprise sur devis (fee 12%).' },
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Jusqu\'à 50% d\'économie vs un chasseur classique (20–25% de fee).' },
      { icon: <Clock className="w-4 h-4" />, text: 'Accès permanent au vivier : recrutez quand l\'opportunité se présente, pas dans l\'urgence.' },
    ],
    visual: (
      <div className="max-w-sm mx-auto">
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Starter', price: '1.500€', fee: '18%' },
            { name: 'Business', price: '3.000€', fee: '15%', badge: true },
            { name: 'Enterprise', price: 'Devis', fee: '12%' },
          ].map(p => (
            <div key={p.name} className={cn(
              'rounded-lg p-4 text-center border',
              p.badge ? 'bg-foreground text-background border-foreground' : 'bg-secondary border-border'
            )}>
              <div className="text-[9px] font-bold tracking-[0.1em] uppercase mb-2" style={{ opacity: 0.5 }}>{p.name}</div>
              <div className="font-serif text-base font-bold mb-1">{p.price}</div>
              <div className="text-[10px]" style={{ opacity: 0.5 }}>/mois</div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: p.badge ? 'rgba(255,255,255,0.1)' : undefined }}>
                <div className="font-serif text-lg font-bold">{p.fee}</div>
                <div className="text-[9px]" style={{ opacity: 0.4 }}>fee placement</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded bg-secondary border border-border text-center">
          <span className="text-[11px] text-muted-foreground">Chasseur classique : </span>
          <span className="text-[11px] font-bold text-foreground line-through">20–25% fee</span>
        </div>
      </div>
    ),
  },
];

const dashboardSlides: Slide[] = [
  {
    icon: <LayoutDashboard className="w-8 h-8" />,
    title: 'Votre recherche, structurée en 4 étapes',
    subtitle: 'Un formulaire guidé pour définir précisément le profil que vous recherchez — séniorité, département, rémunération, confidentialité.',
    points: [
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Choisissez le type de profil : Collaborateur, Counsel ou Associé.' },
      { icon: <Search className="w-4 h-4" />, text: 'Précisez le niveau de séniorité, le département et les expertises requises.' },
      { icon: <Shield className="w-4 h-4" />, text: 'Définissez le niveau de confidentialité de votre recherche en toute autonomie.' },
    ],
    visual: <SearchFormMockup />,
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: 'Un vivier de profils en temps réel',
    subtitle: 'Parcourez l\'ensemble des avocats inscrits sur Logan — profils entièrement anonymisés, filtrables par pratique, classement et séniorité.',
    points: [
      { icon: <EyeOff className="w-4 h-4" />, text: 'Chaque profil est anonymisé : aucun nom, aucun cabinet d\'origine visible.' },
      { icon: <Bell className="w-4 h-4" />, text: 'Les profils "Active" sont prioritairement à l\'écoute du marché — à traiter en premier.' },
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Filtrez par pratique (M&A, B&F, Employment…), classements Chambers / Legal 500, séniorité.' },
    ],
    visual: <MarketMockup />,
  },
  {
    icon: <UserCheck className="w-8 h-8" />,
    title: 'Une fiche détaillée par profil',
    subtitle: 'Cliquez sur un profil pour accéder à l\'intégralité de sa fiche : expertise, rémunération actuelle, activité, positionnement — et manifestez votre intérêt en un clic.',
    points: [
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Rétrocession actuelle et rétrocession suggérée Logan — calibrée au marché.' },
      { icon: <Search className="w-4 h-4" />, text: 'Répartition de l\'activité, positionnement, clientèle et pratique de l\'anglais.' },
      { icon: <Handshake className="w-4 h-4" />, text: 'Manifestez votre intérêt : Logan orchestre la mise en relation de manière confidentielle.' },
    ],
    visual: <ProfileDrawerMockup />,
  },
];

// ── Slide variants ────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const TAB_LABELS: { key: Perspective; label: string }[] = [
  { key: 'candidat', label: 'Focus candidat' },
  { key: 'cabinet', label: 'Focus cabinet' },
  { key: 'dashboard', label: 'Espace cabinet' },
];

// ── Component ─────────────────────────────────────────────────────────────────

const DemoPage = () => {
  const [perspective, setPerspective] = useState<Perspective>('candidat');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides =
    perspective === 'candidat' ? candidatSlides :
    perspective === 'cabinet' ? cabinetSlides :
    dashboardSlides;

  const slide = slides[currentSlide];

  const switchPerspective = (p: Perspective) => {
    setPerspective(p);
    setCurrentSlide(0);
    setDirection(0);
  };

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(c => c + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(c => c - 1);
    }
  };

  const isDashboard = perspective === 'dashboard';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-[32px] tracking-[0.04em] text-foreground">Logan</Link>
        <Link to="/inscription?espace=candidat">
          <Button variant="outline" size="sm" className="text-xs rounded-sm">
            S'inscrire <ArrowRight className="w-3 h-3 ml-1.5" />
          </Button>
        </Link>
      </header>

      {/* Intro */}
      <div className="text-center pt-12 pb-8 px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4"
        >
          Découvrir Logan
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground font-light max-w-md mx-auto leading-relaxed"
        >
          Explorez le parcours Logan selon votre perspective — candidat, cabinet, ou découvrez l'espace cabinet en détail.
        </motion.p>
      </div>

      {/* Perspective toggle */}
      <div className="flex justify-center mb-10 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex bg-secondary rounded-sm p-1 border border-border"
        >
          {TAB_LABELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchPerspective(key)}
              className={cn(
                'px-5 py-2.5 text-xs font-medium rounded-sm transition-all',
                perspective === key
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {key === 'dashboard' && <LayoutDashboard className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
              {label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Dashboard intro banner */}
      <AnimatePresence>
        {isDashboard && (
          <motion.div
            key="dashboard-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-5xl w-full px-6 mb-6"
          >
            <div className="bg-foreground/[0.04] border border-border rounded-sm px-6 py-4 flex items-start gap-4">
              <LayoutDashboard className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-foreground mb-1">Aperçu de l'espace cabinet</p>
                <p className="text-[12px] text-muted-foreground font-light leading-relaxed">
                  Voici ce à quoi ressemble votre espace personnel Logan dès votre inscription. Chaque cabinet dispose d'un tableau de bord dédié pour piloter ses recherches, accéder au vivier de profils et orchestrer ses mises en relation — en toute confidentialité.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide area */}
      <div className="flex-1 px-6 pb-12 max-w-5xl mx-auto w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-8 justify-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentSlide ? 1 : -1); setCurrentSlide(i); }}
              className={cn(
                'h-1 rounded-full transition-all duration-500',
                i === currentSlide ? 'w-10 bg-foreground' : 'w-5 bg-border hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${perspective}-${currentSlide}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={cn(
              'grid gap-10 items-center min-h-[400px]',
              isDashboard ? 'md:grid-cols-[1fr_1.3fr]' : 'md:grid-cols-2'
            )}>
              {/* Left: Content */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
                    {slide.icon}
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
                    {isDashboard ? 'Espace cabinet' : `Étape ${currentSlide + 1} / ${slides.length}`}
                  </div>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-3 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
                  {slide.subtitle}
                </p>

                <div className="space-y-4">
                  {slide.points.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex gap-3 items-start"
                    >
                      <div className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center flex-shrink-0 text-muted-foreground">
                        {point.icon}
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed pt-1">{point.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center justify-center"
              >
                {slide.visual}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="text-sm rounded-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
          </Button>

          {currentSlide === slides.length - 1 ? (
            <Link to={
              perspective === 'candidat' ? '/inscription?start=2' :
              perspective === 'dashboard' ? '/cabinet/start' :
              '/cabinet?start=2'
            }>
              <Button className="bg-foreground text-background hover:bg-foreground/90 text-sm font-bold rounded-sm px-8">
                {perspective === 'candidat' ? 'Créer mon profil' :
                 perspective === 'dashboard' ? 'Inscrire mon cabinet' :
                 'Inscrire mon cabinet'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={goNext}
              className="bg-foreground text-background hover:bg-foreground/90 text-sm font-bold rounded-sm px-8"
            >
              Suivant <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
