import { Users, Briefcase, GitPullRequest, BarChart3, LogOut, CalendarDays, UserPlus } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, Link } from 'react-router-dom';
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

const NAV_ITEMS = [
  { title: 'Tableau de bord', url: '/admin', icon: BarChart3 },
  { title: 'Agenda', url: '/admin/agenda', icon: CalendarDays },
  { title: 'Inscrire un candidat', url: '/admin/inscrire', icon: UserPlus },
  { title: 'Profils candidats', url: '/admin/profils', icon: Users },
  { title: 'Offres cabinets', url: '/admin/offres', icon: Briefcase },
  { title: 'Processus', url: '/admin/processus', icon: GitPullRequest },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="py-6 h-auto">
            <Link to="/" className="hover:opacity-70 transition-opacity">
              {!collapsed && (
                <span className="font-serif text-[32px] leading-none tracking-[0.04em] text-foreground">
                  Logan
                </span>
              )}
              {collapsed && <span className="font-serif text-[32px] leading-none tracking-[0.04em] text-foreground">L</span>}
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-6">
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-sm transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
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
