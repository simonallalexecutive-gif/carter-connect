import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/layout/Footer';
import { motion } from 'motion/react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { usePQE } from '@/hooks/usePQE';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Building2, Star, Briefcase, FileText, Clock, Bell, Send } from 'lucide-react';

import CandidateOffers from '@/components/candidate/CandidateOffers';
import CandidateProfile from '@/components/candidate/CandidateProfile';
import CandidateProcesses from '@/components/candidate/CandidateProcesses';
import CandidateRequests from '@/components/candidate/CandidateRequests';
import CandidateNotifications from '@/components/candidate/CandidateNotifications';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

type TabKey = 'offres' | 'profil' | 'processus' | 'demandes' | 'notifications';

const TABS: { key: TabKey; label: string; icon: typeof Briefcase }[] = [
  { key: 'offres', label: 'Offres', icon: Briefcase },
  { key: 'processus', label: 'Processus', icon: Clock },
  { key: 'demandes', label: 'Demandes', icon: Send },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'profil', label: 'Profil', icon: FileText },
];

const CandidateDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('offres');
  const { photoPreviewUrl, prenom, nom, departement, cabinet, sermentMois, sermentAnnee } = useRegistrationStore();
  const seniorityInfo = usePQE(sermentMois, sermentAnnee);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading || !user) return null;

  const notifCount = 2; // mock unread count

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full bg-black">
        <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-serif text-xl tracking-[-0.02em] text-white hover:text-white/80 transition-colors duration-300">
              Logan
            </Link>
            <span className="w-px h-4 bg-white/20 mx-3" />
            <span className="text-[10px] text-white/40 tracking-[0.12em] uppercase font-sans font-light">Espace Candidat</span>
          </div>

          {/* Tab navigation — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 text-[12px] font-sans font-medium tracking-wide transition-colors duration-200 rounded-sm ${
                  activeTab === tab.key
                    ? 'text-white bg-white/10'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.key === 'notifications' && notifCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold flex items-center justify-center">{notifCount}</span>
                  )}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/" className="font-sans text-[12px] font-light text-white/50 hover:text-white transition-colors duration-300 hidden sm:block">
              Accueil
            </Link>
            <button
              onClick={signOut}
              className="font-sans text-[12px] font-light text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-3 py-1.5 transition-colors duration-300"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Mobile tab bar */}
      <div className="md:hidden border-b border-border bg-background sticky top-0 z-20">
        <div className="flex overflow-x-auto px-4 gap-0.5 py-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors rounded-sm ${
                activeTab === tab.key
                  ? 'text-foreground bg-secondary'
                  : 'text-muted-foreground'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.key === 'notifications' && notifCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-foreground text-background text-[9px] font-bold flex items-center justify-center">{notifCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Compact hero */}
      <section className="bg-black py-10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, hsl(0 0% 50%), transparent 70%)' }} />
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto relative z-10"
        >
          <div className="flex items-center gap-5">
            <motion.div variants={fadeUp}>
              <Avatar className="w-14 h-14 border-2 border-white/20">
                {photoPreviewUrl ? <AvatarImage src={photoPreviewUrl} alt="Photo" /> : null}
                <AvatarFallback className="bg-white/10 text-white text-sm font-serif">
                  {prenom && nom ? `${prenom[0]}${nom[0]}` : <User className="w-6 h-6" />}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="min-w-0">
              <motion.h1 variants={fadeUp} className="text-2xl md:text-3xl font-serif font-normal text-white leading-tight tracking-[-0.01em]">
                Bienvenue{prenom ? `, ${prenom}` : user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}
              </motion.h1>
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold text-black bg-white rounded-sm px-2.5 py-1 uppercase tracking-wide">
                  {seniorityInfo?.label || 'Senior'}
                </span>
                {departement && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-white/60 bg-white/10 border border-white/15 rounded-sm px-2.5 py-1">
                    <Star className="w-3 h-3" />{departement}
                  </span>
                )}
                {cabinet && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-white/60 bg-white/10 border border-white/15 rounded-sm px-2.5 py-1">
                    <Building2 className="w-3 h-3" />{cabinet}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <main className="flex-1 py-10 px-6 sm:px-8 lg:px-10 max-w-5xl mx-auto w-full">
        {activeTab === 'offres' && <CandidateOffers />}
        {activeTab === 'profil' && <CandidateProfile />}
        {activeTab === 'processus' && <CandidateProcesses />}
        {activeTab === 'demandes' && <CandidateRequests />}
        {activeTab === 'notifications' && <CandidateNotifications />}
      </main>

      {/* Footer info */}
      <div className="max-w-5xl mx-auto w-full px-6 sm:px-8 lg:px-10 pb-8">
        <div className="pt-6 border-t border-border flex justify-between items-center">
          <p className="text-xs text-muted-foreground font-sans">Connecté en tant que {user.email}</p>
          <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground font-sans underline transition-colors">Déconnexion</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CandidateDashboard;
