import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDark = isHome || location.pathname === '/inscription';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isDark ? "bg-transparent" : "bg-background/95 backdrop-blur-sm border-b border-border"
    )}>
      <div className="carter-container flex items-center justify-between h-20">
        {/* Logo — wordmark style like Harvey */}
        <Link to="/" className="flex items-center">
          <span className="font-serif text-2xl tracking-[-0.02em] text-foreground">
            Carter
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link
            to="/inscription"
            className="font-sans text-[13px] font-light text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Espace candidat
          </Link>
          <Link
            to="/cabinet"
            className="font-sans text-[13px] font-light text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            Espace cabinet
          </Link>
          <Link
            to="/contact"
            className="font-sans text-[13px] font-light text-foreground/80 hover:text-foreground transition-colors duration-300 border border-border rounded-sm px-4 py-2 hover:border-accent/30"
          >
            Prendre RDV
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
