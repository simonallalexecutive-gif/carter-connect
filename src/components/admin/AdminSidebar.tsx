import { Users, Briefcase, GitPullRequest, BarChart3, LogOut, CalendarDays, Building2, CheckCircle2, Bell, ChevronDown } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut } = useAuth();

  const candidatesActive =
    location.pathname.startsWith('/admin/profils') ||
    location.pathname.startsWith('/admin/approuves');

  const cabinetsActive =
    location.pathname.startsWith('/admin/cabinets') ||
    location.pathname.startsWith('/admin/offres');

  const [candidatesOpen, setCandidatesOpen] = useState(candidatesActive);
  const [cabinetsOpen, setCabinetsOpen] = useState(cabinetsActive);

  const TOP_ITEMS = [
    { title: 'Tableau de bord', url: '/admin', icon: BarChart3 },
    { title: 'Agenda', url: '/admin/agenda', icon: CalendarDays },
  ];

  const CANDIDATES_SUB = [
    { title: 'Inscrits', url: '/admin/profils', icon: Users },
    { title: 'Approuvés', url: '/admin/approuves', icon: CheckCircle2 },
  ];

  const CABINETS_SUB = [
    { title: 'Inscrits', url: '/admin/cabinets', icon: Building2 },
    { title: 'Offres', url: '/admin/offres', icon: Briefcase },
  ];

  const BOTTOM_ITEMS = [
    { title: 'Notifications', url: '/admin/notifications', icon: Bell },
    { title: 'Processus', url: '/admin/processus', icon: GitPullRequest },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-6 h-auto">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              {!collapsed ? (
                <span className="font-serif text-[32px] leading-none tracking-[0.04em] text-foreground">Logan</span>
              ) : (
                <span className="font-serif text-[32px] leading-none tracking-[0.04em] text-foreground">L</span>
              )}
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-6">
            <SidebarMenu>

              {/* Top items */}
              {TOP_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Candidats group */}
              <SidebarMenuItem>
                {collapsed ? (
                  /* En mode réduit : icône simple active si sous-page candidats */
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin/profils"
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <Users className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <div>
                    {/* Parent "Candidats" */}
                    <button
                      onClick={() => setCandidatesOpen((v) => !v)}
                      className={cn(
                        'flex w-full items-center gap-2 px-2 py-1.5 rounded-sm text-[13px] transition-colors',
                        candidatesActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">Candidats</span>
                      <ChevronDown
                        className={cn('h-3.5 w-3.5 transition-transform', candidatesOpen && 'rotate-180')}
                      />
                    </button>

                    {/* Sous-items */}
                    {candidatesOpen && (
                      <div className="ml-6 mt-0.5 space-y-0.5">
                        {CANDIDATES_SUB.map((sub) => (
                          <NavLink
                            key={sub.url}
                            to={sub.url}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-sm text-[12px] text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                            activeClassName="bg-sidebar-accent/60 text-sidebar-accent-foreground font-semibold"
                          >
                            <sub.icon className="h-3.5 w-3.5 flex-shrink-0" />
                            {sub.title}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </SidebarMenuItem>

              {/* Cabinets group */}
              <SidebarMenuItem>
                {collapsed ? (
                  <SidebarMenuButton asChild>
                    <NavLink
                      to="/admin/cabinets"
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <Building2 className="h-4 w-4" />
                    </NavLink>
                  </SidebarMenuButton>
                ) : (
                  <div>
                    <button
                      onClick={() => setCabinetsOpen((v) => !v)}
                      className={cn(
                        'flex w-full items-center gap-2 px-2 py-1.5 rounded-sm text-[13px] transition-colors',
                        cabinetsActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">Cabinets</span>
                      <ChevronDown
                        className={cn('h-3.5 w-3.5 transition-transform', cabinetsOpen && 'rotate-180')}
                      />
                    </button>
                    {cabinetsOpen && (
                      <div className="ml-6 mt-0.5 space-y-0.5">
                        {CABINETS_SUB.map((sub) => (
                          <NavLink
                            key={sub.url}
                            to={sub.url}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-sm text-[12px] text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                            activeClassName="bg-sidebar-accent/60 text-sidebar-accent-foreground font-semibold"
                          >
                            <sub.icon className="h-3.5 w-3.5 flex-shrink-0" />
                            {sub.title}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </SidebarMenuItem>

              {/* Bottom items */}
              {BOTTOM_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="text-[13px]">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
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

export default AdminSidebar;
