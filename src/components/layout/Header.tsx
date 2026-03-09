import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Scale } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDark = isHome || location.pathname === '/inscription';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
      isDark ? "bg-transparent" : "bg-background/95 backdrop-blur-sm border-b border-border"
    )}>
      <div className="carter-container flex items-center justify-between h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Scale className={cn("w-8 h-8", isDark ? "text-carter-accent" : "text-carter-accent")} />
          <span className={cn(
            "font-sans text-2xl font-light tracking-[0.15em] uppercase",
            isDark ? "text-cream-light" : "text-foreground"
          )}>
            Carter
          </span>
        </Link>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1">
          <Link
            to="/inscription"
            className={cn(
              "px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors",
              isDark
                ? "text-cream-light/70 hover:text-cream-light hover:bg-cream-light/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Espace candidat
          </Link>
          <Link
            to="/cabinet"
            className={cn(
              "px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors",
              isDark
                ? "text-cream-light/70 hover:text-cream-light hover:bg-cream-light/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Espace cabinet
          </Link>
          <Link
            to="/contact"
            className={cn(
              "px-4 py-2 rounded-lg font-sans text-sm font-medium transition-colors border",
              isDark
                ? "text-cream-light/80 border-cream-light/20 hover:bg-cream-light/5"
                : "text-foreground border-border hover:bg-muted"
            )}
          >
            Prendre RDV
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
