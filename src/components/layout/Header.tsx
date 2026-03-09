import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDark = isHome;
  const isInscription = location.pathname === '/inscription';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isDark ? "bg-transparent" : "bg-background/95 backdrop-blur-sm border-b border-border"
    )}>
      <div className="carter-container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <span className={cn("font-serif text-2xl tracking-[-0.02em]", isDark ? "text-white" : "text-foreground")}>
            Carter
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link
            to="/inscription?espace=candidat"
            className={cn("font-sans text-[13px] font-light transition-colors duration-300", isDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground")}
          >
            Espace candidat
          </Link>
          <Link
            to="/inscription?espace=cabinet"
            className={cn("font-sans text-[13px] font-light transition-colors duration-300", isDark ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground")}
          >
            Espace cabinet
          </Link>
          <Link
            to="/contact"
            className={cn("font-sans text-[13px] font-light transition-colors duration-300 border rounded-sm px-4 py-2", isDark ? "text-white/80 hover:text-white border-white/20 hover:border-white/40" : "text-foreground/80 hover:text-foreground border-border hover:border-accent/30")}
          >
            Prendre RDV
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
