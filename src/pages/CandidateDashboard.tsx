import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import React from 'react';
import { useLoadCandidateProfile } from '@/hooks/useLoadCandidateProfile';
import { Briefcase, FileText, LogOut, Home, Phone } from 'lucide-react';
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

const TABS: { key: TabKey; label: string; icon: typeof Briefcase }[] = [
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-6 h-auto">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              <span className="font-serif text-[32px] leading-none tracking-[0.04em] text-foreground">
                {collapsed ? 'L' : 'Logan'}
              </span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-6">
            <SidebarMenu>
              {TABS.map((tab) => (
                <SidebarMenuItem key={tab.key}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(tab.key)}
                    isActive={activeTab === tab.key}
                    tooltip={tab.label}
                    className={`text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors ${
                      activeTab === tab.key ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : ''
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab('profil')}
              isActive={activeTab === 'profil'}
              tooltip="Mon profil"
              className={`text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors ${
                activeTab === 'profil' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : ''
              }`}
            >
              <FileText className="mr-2 h-4 w-4" />
              {!collapsed && <span className="text-[13px]">Mon profil</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 text-[12px] text-sidebar-foreground/60 hover:text-foreground transition-colors w-full"
        >
          <LogOut className="h-3.5 w-3.5" />
          {!collapsed && 'Déconnexion'}
        </button>
      </SidebarFooter>
    </Sidebar>
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
    if (user) {
      supabase
        .from('candidate_registrations')
        .select('status')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          setCandidateStatus(data?.status || null);
          setStatusLoading(false);
        });
    }
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

      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between border-b border-border bg-background px-6 gap-3">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Espace candidat</span>
          </div>
          
        </header>
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
