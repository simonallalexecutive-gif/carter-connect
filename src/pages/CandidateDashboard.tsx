import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';
import { useLoadCandidateProfile } from '@/hooks/useLoadCandidateProfile';
import { useRegistrationStore } from '@/stores/registrationStore';
import { FileText, LogOut, Home, Phone, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

import CandidateBooking from '@/components/candidate/CandidateBooking';
import CandidateDashboardOverview from '@/components/candidate/CandidateDashboardOverview';
import Step6Review from '@/components/registration/Step6Review';

type TabKey = 'dashboard' | 'profil' | 'booking';

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: Home },
  { key: 'profil', label: 'Mon profil', icon: FileText },
  { key: 'booking', label: 'Fixer un call', icon: Phone },
];

/* ── Sidebar candidat — même structure que cabinet ── */
const CandidateSidebar = ({
  activeTab,
  setActiveTab,
  collapsed,
  onToggle,
  headerOnly = false,
  navOnly = false,
}: {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  collapsed: boolean;
  onToggle: () => void;
  headerOnly?: boolean;
  navOnly?: boolean;
}) => {
  const { signOut } = useAuth();

  const itemCls = (active: boolean) =>
    `flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-[13px] transition-colors ${
      active
        ? 'bg-white/10 text-white font-semibold'
        : 'text-white/60 hover:bg-white/8 hover:text-white'
    }`;

  const w = collapsed ? 'w-14' : 'w-56';

  if (headerOnly) return (
    <div
      className={`${w} flex-shrink-0 bg-[hsl(0,0%,7%)] flex items-center px-4 transition-all duration-200 border-b border-[hsl(0,0%,18%)] ${
        collapsed ? 'justify-center' : 'justify-between'
      }`}
    >
      <Link to="/" className="hover:opacity-70 transition-opacity">
        <span className="font-serif text-[28px] leading-none tracking-[0.04em] text-white">
          {collapsed ? 'L' : 'Logan'}
        </span>
      </Link>
      {!collapsed && (
        <button
          onClick={onToggle}
          className="text-white/40 hover:text-white transition-colors p-1"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {collapsed && (
        <button onClick={onToggle} className="text-white/40 hover:text-white transition-colors p-1 mt-1">
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  if (navOnly) return (
    <div
      className={`${w} flex-shrink-0 bg-[hsl(0,0%,7%)] flex flex-col transition-all duration-200 border-r border-black/[0.1]`}
    >
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={itemCls(activeTab === tab.key)}
          >
            <tab.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{tab.label}</span>}
          </button>
        ))}
      </nav>
      <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] text-white/30 hover:text-white/60 transition-colors rounded-sm"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );

  return null;
};

/* ── Layout principal ── */
const CandidateDashboardLayout = ({ candidateStatus }: { candidateStatus: string }) => {
  const store = useRegistrationStore();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const fullName = [store.prenom, store.nom].filter(Boolean).join(' ');
  const cabinetLabel = store.cabinet || '';

  if (candidateStatus !== 'approved') {
    return (
      <div className="min-h-screen w-screen bg-black flex flex-col px-6" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
        {/* Top-left Logan link */}
        <div className="flex-shrink-0 pt-8 pl-2">
          <a href="/" className="font-serif text-xl text-white hover:text-white/80 transition-colors">Logan</a>
        </div>
        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-serif text-white mb-4">Profil en cours de validation</h1>
            <p className="text-white/60 font-sans font-light leading-relaxed">
              Votre profil est en cours d'examen par l'équipe Logan. Vous recevrez un email dès que votre accès sera activé.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-admin h-screen flex flex-col w-full bg-background overflow-hidden">

      {/* ── Ligne de tête : logo (sidebar) + header ── */}
      <div className="flex h-16 flex-shrink-0">
        <CandidateSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          headerOnly
        />
        <header className="flex-1 flex items-center justify-between bg-background px-6 gap-3 border-b border-black/[0.1]">
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
            Espace candidat
          </span>
          {fullName && (
            <div className="flex items-center gap-2 text-[11px] font-sans text-muted-foreground">
              <span className="text-foreground font-medium">Bienvenue, {fullName}</span>
              {cabinetLabel && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span>{cabinetLabel}</span>
                </>
              )}
            </div>
          )}
        </header>
      </div>

      {/* ── Ligne du bas : nav + contenu ── */}
      <div className="flex flex-1 min-h-0">
        <CandidateSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          navOnly
        />
        <main className={`flex-1 overflow-y-auto ${activeTab === 'profil' ? '' : 'p-8 lg:p-12 bg-background'}`}>
          {activeTab === 'dashboard' && <CandidateDashboardOverview />}
          {activeTab === 'profil' && <Step6Review readOnly hideStepHeader />}
          {activeTab === 'booking' && <CandidateBooking />}
        </main>
      </div>

    </div>
  );
};

/* ── Page racine ── */
const CandidateDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { loaded: profileLoaded } = useLoadCandidateProfile(user);
  const [candidateStatus, setCandidateStatus] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const userType = (user as any).user_metadata?.user_type;
    if (userType === 'cabinet') { navigate('/cabinet'); return; }

    supabase
      .from('cabinet_accounts')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data: cab }) => {
        if (cab) { navigate('/cabinet'); return; }
        supabase
          .from('candidate_registrations')
          .select('status')
          .eq('user_id', user.id)
          .single()
          .then(({ data }) => {
            setCandidateStatus(data?.status || null);
            setStatusLoading(false);
          });
      });
  }, [user]);

  if (loading || !user || !profileLoaded || statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="font-serif text-[28px] tracking-[0.04em] text-foreground/30 animate-pulse">Logan</span>
      </div>
    );
  }

  return <CandidateDashboardLayout candidateStatus={candidateStatus || ''} />;
};

export default CandidateDashboard;
