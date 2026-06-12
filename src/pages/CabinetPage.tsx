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
import { Building2, Eye, FileText, LogOut, Home, Bell, Settings, Search, Phone } from 'lucide-react';
import CabinetNotificationAlerts from '@/components/cabinet/CabinetNotificationAlerts';
import CandidateBooking from '@/components/candidate/CandidateBooking';
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

type CabinetTabKey = 'dashboard' | 'explore' | 'newSearch' | 'activeSearches' | 'account' | 'booking';

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

  const navItem = (
    key: string,
    label: string,
    Icon: typeof Building2,
    onClick: () => void,
    isActive: boolean
  ) => (
    <SidebarMenuItem key={key}>
      <SidebarMenuButton
        onClick={onClick}
        isActive={isActive}
        tooltip={label}
        className={`rounded-sm transition-colors ${
          isActive
            ? 'bg-white/10 text-white font-semibold'
            : 'text-white/55 hover:bg-white/8 hover:text-white'
        }`}
      >
        <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
        {!collapsed && <span className="text-[13px]">{label}</span>}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-white/10 bg-[hsl(0,0%,7%)]">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-6 h-auto">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              <span className="font-serif text-[32px] leading-none tracking-[0.04em] text-white">
                {collapsed ? 'L' : 'Logan'}
              </span>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {CABINET_TABS.map((tab) =>
                navItem(tab.key, tab.label, tab.icon, () => setActiveTab(tab.key), activeTab === tab.key)
              )}
              {navItem('alerts', 'Alertes prioritaires', Bell, onOpenAlerts, false)}
              {navItem('booking', 'Fixer un call', Phone, () => setActiveTab('booking'), activeTab === 'booking')}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/10 pt-2">
        <SidebarMenu>
          {navItem('account', 'Mon compte', Settings, () => setActiveTab('account'), activeTab === 'account')}
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

const CabinetDashboardLayout = () => {
  const s = useCabinetStore();
  const { user } = useAuth();
  useLoadCabinetProfile(user);

  const contact = s.contacts?.[0];
  const fullName = [contact?.prenom, contact?.nom].filter(Boolean).join(' ') || s.cabinetName || '';
  const contactStatus = contact?.role || '';
  const cabinetLabel = s.cabinetName || '';
  const [showAlerts, setShowAlerts] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  const getActiveTab = (): CabinetTabKey => {
    if (showBooking) return 'booking';
    if (showAccount) return 'account';
    if (s.dashboardView === 'explore') return 'explore';
    if (s.dashboardView === 'newSearch') return 'newSearch';
    if (s.dashboardView === 'activeSearches') return 'activeSearches';
    return 'dashboard';
  };

  const setActiveTab = (tab: CabinetTabKey) => {
    setShowAccount(false);
    setShowBooking(false);
    if (tab === 'account') {
      setShowAccount(true);
      s.setField('dashboardView', 'home');
    } else if (tab === 'booking') {
      setShowBooking(true);
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
              {fullName && (
                <div className="flex items-center gap-2 text-[11px] font-sans text-muted-foreground">
                  <span className="text-foreground font-medium">Bienvenue, {fullName}</span>
                  {contactStatus && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{contactStatus}</span>
                    </>
                  )}
                  {cabinetLabel && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{cabinetLabel}</span>
                    </>
                  )}
                </div>
              )}
            </header>
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-background">
              {showBooking ? <CandidateBooking userType="cabinet" /> : showAccount ? <CabinetAccount /> : <CabinetDashboard />}
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
  const [authChecked, setAuthChecked] = useState(false);

  // Skip the confidentiality intro if user already saw it on RegisterPage
  useEffect(() => {
    const startStep = searchParams.get('start');
    if (startStep === '2' && step === 1) {
      setStep(2);
    }
  }, [searchParams, step, setStep]);

  useEffect(() => {
    const checkSession = async () => {
      // Ne pas rediriger vers le dashboard si l'utilisateur est en train de s'inscrire
      if (searchParams.get('start') === '2') {
        setAuthChecked(true);
        return;
      }
      const { data: { session } } = await (supabase.auth as any).getSession();
      if (session?.user) {
        const { data: cabinet } = await supabase
          .from('cabinet_accounts')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        if (cabinet) {
          const name = session.user.user_metadata?.full_name || '';
          if (name) setField('cabinetName', name);
          setStep(6);
        }
      }
      setAuthChecked(true);
    };
    if (step === 1) checkSession();
    else setAuthChecked(true);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        if (searchParams.get('start') === '2') return;
        const checkCabinet = async () => {
          const { data: cabinet } = await supabase
            .from('cabinet_accounts')
            .select('id')
            .eq('user_id', session.user.id)
            .single();
          if (cabinet) {
            const name = session.user.user_metadata?.full_name || '';
            if (name) setField('cabinetName', name);
            setStep(6);
          }
        };
        checkCabinet();
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Pendant la vérification de session — ne rien afficher pour éviter le flash
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="font-serif text-[28px] tracking-[0.04em] text-foreground/30 animate-pulse">Logan</span>
      </div>
    );
  }

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
