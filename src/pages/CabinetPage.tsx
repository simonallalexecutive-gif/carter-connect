import { useCabinetStore } from '@/stores/cabinetStore';
import Footer from '@/components/layout/Footer';
import LogoBanner from '@/components/layout/LogoBanner';
import CabinetStepProgress from '@/components/cabinet/CabinetStepProgress';
import CabinetStep1Hero from '@/components/cabinet/CabinetStep1Hero';
import CabinetStep2Identity from '@/components/cabinet/CabinetStep2Identity';
import CabinetStep4Subscription from '@/components/cabinet/CabinetStep4Subscription';
import CabinetStep5Validation from '@/components/cabinet/CabinetStep5Validation';
import CabinetStep6Confirm from '@/components/cabinet/CabinetStep6Confirm';
import CabinetDashboard from '@/components/cabinet/CabinetDashboard';
import CabinetAccount from '@/components/cabinet/CabinetAccount';
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { NAT_FLAGS, NAT_LABELS } from '@/lib/legal500Rankings';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Eye, FileText, LogOut, Home, Bell, Settings, Search } from 'lucide-react';
import CabinetNotificationAlerts from '@/components/cabinet/CabinetNotificationAlerts';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

type CabinetTabKey = 'dashboard' | 'explore' | 'newSearch' | 'activeSearches' | 'account';

const CABINET_TABS: { key: CabinetTabKey; label: string; icon: typeof Building2 }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: Building2 },
  { key: 'explore', label: 'Explorer le marché', icon: Eye },
  { key: 'newSearch', label: 'Nouvelle recherche', icon: FileText },
  { key: 'activeSearches', label: 'Mes recherches actives', icon: Search },
  { key: 'account', label: 'Mon compte', icon: Settings },
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
  const s = useCabinetStore();

  return (
    <Sidebar collapsible="icon" className="border-r border-white/[0.06]" style={{ background: 'hsl(0, 0%, 7%)' }}>
      <SidebarContent className="text-white py-6 flex flex-col justify-between h-full" style={{ background: 'hsl(0, 0%, 7%)' }}>
        <div>
          {/* Logo */}
          <div className={`px-4 mb-8 ${collapsed ? 'text-center' : ''}`}>
            <Link to="/" className="font-serif text-xl tracking-[-0.02em] text-white hover:text-white/80 transition-colors">
              {collapsed ? 'L' : 'Logan'}
            </Link>
            {!collapsed && (
              <p className="text-[9px] text-white/40 tracking-[0.12em] uppercase font-sans mt-1">Espace Cabinet</p>
            )}
          </div>

          {/* Cabinet avatar */}
          {!collapsed && (
            <div className="px-4 mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-white/20">
                  <AvatarFallback className="bg-white/10 text-white text-[10px] font-sans">
                    {s.cabinetName ? s.cabinetName[0].toUpperCase() : <Building2 className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[12px] font-sans text-white truncate">{s.cabinetName || 'Mon cabinet'}</p>
                  <p className="text-[9px] text-white/40 font-sans">Connecté</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav items */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {CABINET_TABS.map((tab) => (
                  <SidebarMenuItem key={tab.key}>
                    <SidebarMenuButton
                      onClick={() => setActiveTab(tab.key)}
                      isActive={activeTab === tab.key}
                      tooltip={tab.label}
                      className={`font-sans text-[11px] tracking-wide transition-all duration-200 rounded-md mx-1 ${
                        activeTab === tab.key
                          ? 'bg-white/15 text-white font-medium'
                          : 'text-white/50 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {!collapsed && <span>{tab.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Bottom actions */}
        <div className="px-2 space-y-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={onOpenAlerts} tooltip="Alertes prioritaires" className="text-white/40 hover:text-white hover:bg-white/5 font-sans text-[11px] rounded-md mx-1">
                <Bell className="w-4 h-4" />
                {!collapsed && <span>Alertes prioritaires</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Accueil" className="text-white/40 hover:text-white hover:bg-white/5 font-sans text-[11px] rounded-md mx-1">
                <Link to="/">
                  <Home className="w-4 h-4" />
                  {!collapsed && <span>Accueil</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} tooltip="Déconnexion" className="text-white/40 hover:text-white hover:bg-white/5 font-sans text-[11px] rounded-md mx-1">
                <LogOut className="w-4 h-4" />
                {!collapsed && <span>Déconnexion</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const CabinetDashboardLayout = () => {
  const s = useCabinetStore();
  const { user } = useAuth();
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
      <SidebarProvider>
        <div className="min-h-screen flex w-full theme-dark-registration bg-background text-foreground">
          <CabinetSidebar activeTab={getActiveTab()} setActiveTab={setActiveTab} onOpenAlerts={() => setShowAlerts(true)} />

          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top bar — dark matte card surface */}
            <header className="flex items-center border-b border-white/[0.08] px-6 py-8 gap-5 bg-[hsl(0,0%,7%)]">
              <SidebarTrigger className="text-foreground/60 hover:text-foreground" />
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <Avatar className="w-11 h-11 border border-border shrink-0">
                  <AvatarFallback className="bg-secondary text-foreground text-[11px] font-sans">
                    {s.cabinetName ? s.cabinetName[0].toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-sans font-normal text-foreground leading-tight tracking-[-0.01em]">
                    Bienvenue, {s.cabinetName || 'Cabinet'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {s.palier && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-foreground/80 bg-secondary border border-border rounded-sm px-2 py-0.5 font-sans">
                        Abonnement actif · {s.palier.charAt(0).toUpperCase() + s.palier.slice(1)}
                      </span>
                    )}
                    {s.detectedNat && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground bg-secondary border border-border rounded-sm px-2 py-0.5">
                        {NAT_FLAGS[s.detectedNat]} {NAT_LABELS[s.detectedNat]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 py-10 px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto w-full">
              {showAccount ? <CabinetAccount /> : <CabinetDashboard />}
            </main>

            {/* Footer info */}
            <div className="max-w-5xl mx-auto w-full px-6 sm:px-8 lg:px-10 pb-8">
              <div className="pt-6 border-t border-border flex justify-between items-center">
                <p className="text-xs text-muted-foreground font-sans">
                  Connecté en tant que {user?.email || s.cabinetName}
                </p>
              </div>
            </div>
          </div>
        </div>
        {showAlerts && <CabinetNotificationAlerts onClose={() => setShowAlerts(false)} />}
      </SidebarProvider>
    );
};

const CabinetPage = () => {
  const step = useCabinetStore((s) => s.step);
  const setStep = useCabinetStore((s) => s.setStep);
  const setField = useCabinetStore((s) => s.setField);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await (supabase.auth as any).getSession();
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || '';
        if (name) setField('cabinetName', name);
        setStep(6);
      } else {
        // Only apply ?start=2 if user is NOT logged in
        const startStep = searchParams.get('start');
        if (startStep === '2' && step === 1) {
          setStep(2);
        }
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
    <div className="min-h-screen theme-dark-registration bg-background text-foreground flex flex-col">
      <LogoBanner subtitle="Espace Cabinet" variant="matte" />
      {step >= 2 && step <= 4 && <CabinetStepProgress />}
      <main className={step === 1 ? '' : 'flex-1 py-11 px-6 md:px-12'}>
        {step === 1 && <CabinetStep1Hero />}
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
