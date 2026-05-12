import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminKPIs from '@/components/admin/AdminKPIs';
import AdminProfiles from '@/components/admin/AdminProfiles';
import AdminOffers from '@/components/admin/AdminOffers';
import AdminProcesses from '@/components/admin/AdminProcesses';
import AdminAgenda from '@/components/admin/AdminAgenda';
import AdminRegistration from '@/components/admin/AdminRegistration';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/connexion?redirect=/admin', { replace: true }); return; }
    (async () => {
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
      const ok = (data ?? []).some((r: any) => r.role === 'admin');
      setIsAdmin(ok);
      if (!ok) navigate('/', { replace: true });
    })();
  }, [user, loading, navigate]);

  if (loading || isAdmin === null) {
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
            <header className="h-14 flex items-center border-b border-border bg-card px-4 gap-3">
              <SidebarTrigger />
              <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground">Espace administrateur</span>
            </header>
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
              <Routes>
                <Route index element={<AdminKPIs />} />
                <Route path="agenda" element={<AdminAgenda />} />
                <Route path="inscrire" element={<AdminRegistration />} />
                <Route path="profils" element={<AdminProfiles />} />
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
