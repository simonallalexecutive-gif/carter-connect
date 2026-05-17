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
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NAT_FLAGS, NAT_LABELS } from '@/lib/legal500Rankings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
                  {s.cabinetLogoUrl && <AvatarImage src={s.cabinetLogoUrl} alt={s.cabinetName || 'Cabinet'} className="object-cover" />}
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
            <header className="flex items-center border-b border-white/[0.08] px-6 py-10 gap-5 bg-[hsl(0,0%,7%)]">
              <SidebarTrigger className="text-white/50 hover:text-white" />
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <Avatar className="w-11 h-11 border border-white/[0.15] shrink-0">
                  {s.cabinetLogoUrl && <AvatarImage src={s.cabinetLogoUrl} alt={s.cabinetName || 'Cabinet'} className="object-cover" />}
                  <AvatarFallback className="bg-white/[0.08] text-white text-[11px] font-sans">
                    {s.cabinetName ? s.cabinetName[0].toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="font-serif text-xl tracking-[-0.02em] text-white leading-tight">
                    {s.cabinetName || 'Cabinet'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {s.palier && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-white/70 bg-white/[0.06] border border-white/[0.12] rounded-sm px-2 py-0.5 font-sans">
                        Abonnement actif · {s.palier.charAt(0).toUpperCase() + s.palier.slice(1)}
                      </span>
                    )}
                    {s.detectedNat && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-white/50 bg-white/[0.06] border border-white/[0.12] rounded-sm px-2 py-0.5">
                        {NAT_FLAGS[s.detectedNat]} {NAT_LABELS[s.detectedNat]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Content wrapper — white background */}
            <div className="flex-1 flex flex-col theme-light-registration bg-background text-foreground">
              <main className="flex-1 py-10 px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto w-full">
                {showAccount ? <CabinetAccount /> : <CabinetDashboard />}
              </main>

              <div className="max-w-5xl mx-auto w-full px-6 sm:px-8 lg:px-10 pb-8">
                <div className="pt-6 border-t border-border flex justify-between items-center">
                  <p className="text-xs text-muted-foreground font-sans">
                    Connecté en tant que {user?.email || s.cabinetName}
                  </p>
                </div>
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
  const [emailPending, setEmailPending] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

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
        const ut = session.user.user_metadata?.user_type;
        if (ut === 'candidat') {
          window.location.replace('/espace-candidat');
          return;
        }
        if (!session.user.email_confirmed_at) {
          setEmailPending(session.user.email || '');
          return;
        }
        const name = session.user.user_metadata?.full_name || '';
        if (name) setField('cabinetName', name);
        try {
          await (supabase as any)
            .from('cabinet_accounts')
            .upsert(
              { user_id: session.user.id, cabinet_name: name || 'Cabinet' },
              { onConflict: 'user_id' }
            );
        } catch (e) {
          console.error('cabinet_accounts upsert failed', e);
        }
        setEmailPending(null);
        setStep(6);
      }
    };
    if (step === 1) checkSession();
  }, []);

  useEffect(() => {
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const ut = session.user.user_metadata?.user_type;
        if (ut === 'candidat') {
          window.location.replace('/espace-candidat');
          return;
        }
        if (!session.user.email_confirmed_at) {
          setEmailPending(session.user.email || '');
          return;
        }
        const name = session.user.user_metadata?.full_name || '';
        if (name) setField('cabinetName', name);
        (supabase as any)
          .from('cabinet_accounts')
          .upsert(
            { user_id: session.user.id, cabinet_name: name || 'Cabinet' },
            { onConflict: 'user_id' }
          )
          .then(() => {})
          .catch((e: any) => console.error('cabinet_accounts upsert failed', e));
        setEmailPending(null);
        setStep(6);
      }
      if (event === 'USER_UPDATED' && session?.user?.email_confirmed_at) {
        setEmailPending(null);
        setStep(6);
      }
      if (event === 'SIGNED_OUT') {
        setEmailPending(null);
        setStep(1);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleResendEmail = async () => {
    if (!emailPending) return;
    setResending(true);
    try {
      const { error } = await (supabase.auth as any).resend({
        type: 'signup',
        email: emailPending,
        options: { emailRedirectTo: `${window.location.origin}/cabinet` },
      });
      if (error) throw error;
      toast.success('Email de vérification renvoyé');
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de l\'envoi');
    } finally {
      setResending(false);
    }
  };

  const handleSignOut = async () => {
    await (supabase.auth as any).signOut();
    setEmailPending(null);
    setStep(1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Email verification gate — block dashboard access until email is confirmed
  if (emailPending) {
    return (
      <div className="min-h-screen flex flex-col theme-dark-registration bg-background text-foreground">
        <LogoBanner subtitle="Espace Cabinet" variant="matte" />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-[520px] w-full text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-white/10 border border-white/15 flex items-center justify-center mx-auto mb-7">
              <Mail className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-3xl text-white mb-4 tracking-[-0.01em]">Vérifiez votre email</h1>
            <p className="text-sm text-white/60 leading-relaxed mb-2">
              Un lien de confirmation a été envoyé à
            </p>
            <p className="text-sm text-white font-medium mb-7">{emailPending}</p>
            <p className="text-xs text-white/50 leading-relaxed mb-8">
              Cliquez sur le lien dans cet email pour activer votre compte cabinet et accéder à votre espace.
              Cette étape garantit la confidentialité et la sécurité de votre accès.
            </p>
            <div className="flex flex-col gap-3 max-w-[320px] mx-auto">
              <Button
                onClick={handleResendEmail}
                disabled={resending}
                className="bg-white text-black hover:bg-white/90 font-sans text-sm py-5 rounded-sm"
              >
                {resending ? 'Envoi…' : 'Renvoyer l\'email de vérification'}
              </Button>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/5 font-sans text-xs"
              >
                Se déconnecter
              </Button>
            </div>
          </div>
        </main>
        <Footer />
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
