import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';
import { useLoadCandidateProfile } from '@/hooks/useLoadCandidateProfile';
import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { FileText, LogOut, Home, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

import CandidateProfile from '@/components/candidate/CandidateProfile';
import CandidateBooking from '@/components/candidate/CandidateBooking';
import CandidateDashboardOverview from '@/components/candidate/CandidateDashboardOverview';

type TabKey = 'dashboard' | 'profil' | 'booking';

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: Home },
  { key: 'booking', label: 'Fixer un call', icon: Phone },
];

const CandidateSidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}) => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { signOut } = useAuth();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10"
      style={{ background: '#0a0a0a' }}
    >
      <SidebarContent style={{ background: '#0a0a0a' }}>
        <SidebarGroup>
          <SidebarGroupLabel className="py-7 h-auto">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              <span className="font-serif text-[34px] leading-none tracking-[0.04em] text-white">
                {collapsed ? 'L' : 'Logan'}
              </span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {TABS.map((tab) => (
                <SidebarMenuItem key={tab.key}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(tab.key)}
                    isActive={activeTab === tab.key}
                    tooltip={tab.label}
                    className={`rounded-sm transition-colors text-white/60 hover:text-white hover:bg-white/10 ${
                      activeTab === tab.key ? 'bg-white/15 text-white font-medium' : ''
                    }`}
                  >
                    <tab.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span className="text-[13px]">{tab.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter style={{ background: '#0a0a0a' }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab('profil')}
              isActive={activeTab === 'profil'}
              tooltip="Mon profil"
              className={`rounded-sm transition-colors text-white/60 hover:text-white hover:bg-white/10 ${
                activeTab === 'profil' ? 'bg-white/15 text-white font-medium' : ''
              }`}
            >
              <FileText className="mr-2 h-4 w-4" />
              {!collapsed && <span className="text-[13px]">Mon profil</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 text-[12px] text-white/30 hover:text-white/70 transition-colors w-full"
        >
          <LogOut className="h-3.5 w-3.5" />
          {!collapsed && 'Déconnexion'}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

const CandidateHeader = () => {
  const store = useRegistrationStore();
  const pqe = usePQE(store.sermentMois, store.sermentAnnee);

  const statutLabel = store.statutEcoute === 'actif' ? 'En recherche active'
    : store.statutEcoute === 'passif' ? 'À l\'écoute'
    : null;

  const pills = [
    store.cabinet,
    store.departement,
    store.sermentAnnee ? `Serment ${store.sermentAnnee}` : null,
    statutLabel,
  ].filter(Boolean) as string[];

  return (
    <header
      className="flex items-center justify-between border-b border-white/10 px-10 gap-6 flex-shrink-0 py-[52px]"
      style={{ background: '#0a0a0a' }}
    >
      <div className="flex items-center gap-5">
        <SidebarTrigger className="text-white/50 hover:text-white" />
        <div className="w-px h-10 bg-white/10" />
        {(store.prenom || store.nom) && (
          <div>
            <p className="text-[10px] font-sans font-semibold tracking-[0.18em] uppercase text-white/30 mb-1">Espace candidat</p>
            <p className="text-[31px] font-sans font-medium text-white leading-none">
              {store.prenom} {store.nom}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {pills.map(p => (
          <span key={p} className="text-[15px] font-sans font-normal tracking-wide px-5 py-2.5 rounded-sm bg-white/10 text-white/80 border border-white/10 whitespace-nowrap">
            {p}
          </span>
        ))}
      </div>
    </header>
  );
};

const CandidateDashboardContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const { loaded: profileLoaded } = useLoadCandidateProfile(user);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  const [candidateStatus, setCandidateStatus] = React.useState<string | null>(null);
  const [statusLoading, setStatusLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) return;

    const userType = (user as any).user_metadata?.user_type;
    if (userType === 'cabinet') {
      navigate('/cabinet');
      return;
    }

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

  if (loading || !user || !profileLoaded || statusLoading) return null;

  if (candidateStatus !== 'approved') {
    return (
      <div className="min-h-screen w-screen bg-black flex items-center justify-center px-6" style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9999}}>
        <div className="text-center max-w-md">
          <p className="font-display text-xl text-white mb-8">Logan</p>
          <h1 className="text-2xl font-serif text-white mb-4">Profil en cours de validation</h1>
          <p className="text-white/60 font-sans font-light leading-relaxed">
            Votre profil est en cours d'examen par l'équipe Logan. Vous recevrez un email dès que votre accès sera activé.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CandidateSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <CandidateHeader />
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-background">
          {activeTab === 'dashboard' && <CandidateDashboardOverview />}
          {activeTab === 'profil' && <CandidateProfile />}
          {activeTab === 'booking' && <CandidateBooking />}
        </main>
      </div>
    </>
  );
};

const CandidateDashboard = () => {
  return (
    <div className="theme-admin">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <CandidateDashboardContent />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CandidateDashboard;
