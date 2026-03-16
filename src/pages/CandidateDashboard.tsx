import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Building2, Star, Briefcase, FileText, Clock, Bell, Send, LogOut, Home, Phone } from 'lucide-react';
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

import CandidateOffers from '@/components/candidate/CandidateOffers';
import CandidateProfile from '@/components/candidate/CandidateProfile';
import CandidateProcesses from '@/components/candidate/CandidateProcesses';
import CandidateRequests from '@/components/candidate/CandidateRequests';
import CandidateNotifications from '@/components/candidate/CandidateNotifications';
import CandidateBooking from '@/components/candidate/CandidateBooking';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

type TabKey = 'offres' | 'profil' | 'processus' | 'demandes' | 'notifications' | 'booking';

const TABS: { key: TabKey; label: string; icon: typeof Briefcase }[] = [
  { key: 'offres', label: 'Offres', icon: Briefcase },
  { key: 'processus', label: 'Processus', icon: Clock },
  { key: 'demandes', label: 'Demandes', icon: Send },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'booking', label: 'Fixer un call', icon: Phone },
  { key: 'profil', label: 'Profil', icon: FileText },
];

const CandidateSidebar = ({
  activeTab,
  setActiveTab,
  notifCount,
}: {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  notifCount: number;
}) => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { signOut } = useAuth();
  const { photoPreviewUrl, prenom, nom } = useRegistrationStore();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-black">
      <SidebarContent className="bg-black text-white py-6 flex flex-col justify-between h-full">
        <div>
          {/* Logo */}
          <div className={`px-4 mb-8 ${collapsed ? 'text-center' : ''}`}>
            <Link to="/" className="font-serif text-xl tracking-[-0.02em] text-white hover:text-white/80 transition-colors">
              {collapsed ? 'L' : 'Logan'}
            </Link>
            {!collapsed && (
              <p className="text-[9px] text-white/40 tracking-[0.12em] uppercase font-sans mt-1">Espace Candidat</p>
            )}
          </div>

          {/* Avatar */}
          {!collapsed && (
            <div className="px-4 mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9 border border-white/20">
                  {photoPreviewUrl ? <AvatarImage src={photoPreviewUrl} alt="Photo" /> : null}
                  <AvatarFallback className="bg-white/10 text-white text-[10px] font-sans">
                    {prenom && nom ? `${prenom[0]}${nom[0]}` : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-[12px] font-serif text-white truncate">{prenom && nom ? `${prenom} ${nom}` : 'Candidat'}</p>
                  <p className="text-[9px] text-white/40 font-sans">Connecté</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav items */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {TABS.map((tab) => (
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
                      {tab.key === 'notifications' && notifCount > 0 && (
                        <span className={`${collapsed ? '' : 'ml-auto'} w-5 h-5 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center`}>
                          {notifCount}
                        </span>
                      )}
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

const CandidateDashboardContent = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('offres');
  const { photoPreviewUrl, prenom, nom, departement, cabinet, sermentMois, sermentAnnee } = useRegistrationStore();
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const notifCount = 2;

  return (
    <>
      <CandidateSidebar activeTab={activeTab} setActiveTab={setActiveTab} notifCount={notifCount} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar with sidebar trigger + welcome */}
        <header className="flex items-center border-b border-border bg-[hsl(0_0%_96%)] px-6 py-7 gap-5">
          <SidebarTrigger className="text-foreground/60 hover:text-foreground" />
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <Avatar className="w-11 h-11 border border-border shrink-0">
              {photoPreviewUrl ? <AvatarImage src={photoPreviewUrl} alt="Photo" /> : null}
              <AvatarFallback className="bg-secondary text-foreground text-[11px] font-serif">
                {prenom && nom ? `${prenom[0]}${nom[0]}` : <User className="w-4 h-4" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-serif font-normal text-foreground leading-tight tracking-[-0.01em]">
                Bienvenue{prenom ? `, ${prenom}` : user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {departement && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-foreground/60 bg-secondary border border-border rounded-sm px-2 py-0.5">
                    <Star className="w-2.5 h-2.5" />{departement}
                  </span>
                )}
                {cabinet && (
                  <span className="inline-flex items-center gap-1 text-[9px] text-foreground/60 bg-secondary border border-border rounded-sm px-2 py-0.5">
                    <Building2 className="w-2.5 h-2.5" />{cabinet}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 py-10 px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto w-full">
          {activeTab === 'offres' && <CandidateOffers />}
          {activeTab === 'profil' && <CandidateProfile />}
          {activeTab === 'processus' && <CandidateProcesses />}
          {activeTab === 'demandes' && <CandidateRequests />}
          {activeTab === 'notifications' && <CandidateNotifications />}
          {activeTab === 'booking' && <CandidateBooking />}
        </main>

        {/* Footer info */}
        <div className="max-w-5xl mx-auto w-full px-6 sm:px-8 lg:px-10 pb-8">
          <div className="pt-6 border-t border-border flex justify-between items-center">
            <p className="text-xs text-muted-foreground font-sans">Connecté en tant que {user.email}</p>
          </div>
        </div>
      </div>
    </>
  );
};

const CandidateDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CandidateDashboardContent />
      </div>
    </SidebarProvider>
  );
};

export default CandidateDashboard;
