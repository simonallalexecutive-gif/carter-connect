import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminKPIs from '@/components/admin/AdminKPIs';
import AdminProfiles from '@/components/admin/AdminProfiles';
import AdminOffers from '@/components/admin/AdminOffers';
import AdminCabinets from '@/components/admin/AdminCabinets';
import AdminProcesses from '@/components/admin/AdminProcesses';
import AdminAgenda from '@/components/admin/AdminAgenda';
import AdminRegistration from '@/components/admin/AdminRegistration';
import { useAuth } from '@/hooks/useAuth';

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?redirect=/admin', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Chargement…</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="theme-admin">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center justify-between border-b border-border bg-background px-6 gap-3">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Espace administrateur</span>
              </div>
              <span className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground hidden sm:block">Logan</span>
            </header>
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-background">
              <Routes>
                <Route index element={<AdminKPIs />} />
                <Route path="agenda" element={<AdminAgenda />} />
                <Route path="inscrire" element={<AdminRegistration />} />
                <Route path="profils" element={<AdminProfiles />} />
                <Route path="cabinets" element={<AdminCabinets />} />
                <Route path="offres" element={<AdminOffers />} />
                <Route path="processus" element={<AdminProcesses />} />
              </Routes>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AdminPage;
