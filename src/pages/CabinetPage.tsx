import { useCabinetStore } from '@/stores/cabinetStore';
import Footer from '@/components/layout/Footer';
import LogoBanner from '@/components/layout/LogoBanner';
import CabinetStepProgress from '@/components/cabinet/CabinetStepProgress';
import CabinetConfidentialityIntro from '@/components/registration/CabinetConfidentialityIntro';
import CabinetStep2Identity from '@/components/cabinet/CabinetStep2Identity';
import CabinetStep4Subscription from '@/components/cabinet/CabinetStep4Subscription';
import CabinetStep5Validation from '@/components/cabinet/CabinetStep5Validation';
import CabinetStep6Confirm from '@/components/cabinet/CabinetStep6Confirm';
import CabinetDashboard from '@/components/cabinet/CabinetDashboard';
import CabinetAccount from '@/components/cabinet/CabinetAccount';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useLoadCabinetProfile } from '@/hooks/useLoadCabinetProfile';
import { Building2, Eye, FileText, LogOut, Home, Bell, Settings, Search } from 'lucide-react';
import CabinetNotificationAlerts from '@/components/cabinet/CabinetNotificationAlerts';
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

type CabinetTabKey = 'dashboard' | 'explore' | 'newSearch' | 'activeSearches' | 'account';

const CABINET_TABS: { key: CabinetTabKey; label: string; icon: typeof Building2 }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: Building2 },
  { key: 'activeSearches', label: 'Mes recherches actives', icon: Search },
];

const CabinetSidebar = ({
  activeTab,
  setActiveTab,
  onOpenAlerts,
}: {
  activeTab: CabinetTabKey;
  setActiveTab: (tab: CabinetTabKey) => void;
  onOpenAlerts: () => void;
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
              {CABINET_TABS.map((tab) => (
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
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onOpenAlerts}
                  tooltip="Alertes prioritaires"
                  className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  {!collapsed && <span className="text-[13px]">Alertes prioritaires</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setActiveTab('account')}
              isActive={activeTab === 'account'}
              tooltip="Mon compte"
              className={`text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors ${
                activeTab === 'account' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' : ''
              }`}
            >
              <Settings className="mr-2 h-4 w-4" />
              {!collapsed && <span className="text-[13px]">Mon compte</span>}
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

const CabinetDashboardLayout = () => {
  const s = useCabinetStore();
  const { user } = useAuth();
  useLoadCabinetProfile(user);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const getActiveTab = (): CabinetTabKey => {
    if (showAccount) return 'account';
    if (s.dashboardView === 'explore') return 'explore';
    if (s.dashboardView === 'newSearch') return 'newSearch';
    if (s.dashboardView === 'activeSearches') return 'activeSearches';
    return 'dashboard';
  };

  const setActiveTab = (tab: CabinetTabKey) => {
    setShowAccount(false);
    if (tab === 'account') {
      setShowAccount(true);
      s.setField('dashboardView', 'home');
    } else if (tab === 'explore') {
      s.setField('dashboardView', 'explore');
    } else if (tab === 'newSearch') {
      s.resetSearch();
      s.setField('dashboardView', 'newSearch');
    } else if (tab === 'activeSearches') {
      s.setField('dashboardView', 'activeSearches');
    } else {
      s.setField('dashboardView', 'home');
    }
  };

  return (
    <div className="theme-admin">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <CabinetSidebar activeTab={getActiveTab()} setActiveTab={setActiveTab} onOpenAlerts={() => setShowAlerts(true)} />

          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center justify-between border-b border-border bg-background px-6 gap-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Espace cabinet</span>
              </div>
              <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground hidden sm:block">Logan</span>
            </header>
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-background">
              {showAccount ? <CabinetAccount /> : <CabinetDashboard />}
            </main>
          </div>
        </div>
        {showAlerts && <CabinetNotificationAlerts onClose={() => setShowAlerts(false)} />}
      </SidebarProvider>
    </div>
  );
};

const CabinetPage = () => {
  const step = useCabinetStore((s) => s.step);
  const setStep = useCabinetStore((s) => s.setStep);
  const setField = useCabinetStore((s) => s.setField);
  const [searchParams] = useSearchParams();

  // Skip the confidentiality intro if user already saw it on RegisterPage
  useEffect(() => {
    const startStep = searchParams.get('start');
    if (startStep === '2' && step === 1) {
      setStep(2);
    }
  }, [searchParams, step, setStep]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await (supabase.auth as any).getSession();
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || '';
        if (name) setField('cabinetName', name);
        setStep(6);
      }
    };
    if (step === 1) checkSession();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const name = session.user.user_metadata?.full_name || '';
        if (name) setField('cabinetName', name);
        setStep(6);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Dashboard mode: full sidebar layout, no Footer
  if (step === 6) {
    return <CabinetDashboardLayout />;
  }

  // Registration flow
  return (
    <div className={`min-h-screen flex flex-col ${step >= 2 ? 'theme-light-registration' : 'theme-dark-registration'} bg-background text-foreground`}>
      {step >= 2 && step <= 4 ? (
        <>
          <LogoBanner subtitle="Espace Cabinet" variant="default" />
          <div className="sticky top-0 z-40 bg-black border-b border-white/10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
            <CabinetStepProgress dark />
          </div>
        </>
      ) : (
        <LogoBanner subtitle="Espace Cabinet" variant={step >= 2 ? 'light' : 'matte'} />
      )}
      <main className={step === 1 ? '' : 'flex-1 py-11 px-6 md:px-12'}>
        {step === 1 && <CabinetConfidentialityIntro onContinue={() => setStep(2)} />}
        {step === 2 && <CabinetStep2Identity />}
        {step === 3 && <CabinetStep4Subscription />}
        {step === 4 && <CabinetStep5Validation />}
        {step === 5 && <CabinetStep6Confirm />}
      </main>
      <Footer />
    </div>
  );
};

export default CabinetPage;
