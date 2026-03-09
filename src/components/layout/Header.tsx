import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDark = isHome || location.pathname === '/inscription';

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
      isDark ? "bg-transparent" : "bg-background/95 backdrop-blur-sm border-b border-border"
    )}>
      <div className="carter-container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5">
          <Scale className={cn("w-6 h-6", isDark ? "text-carter-accent" : "text-carter-accent")} />
          <span className={cn(
            "font-serif text-xl font-bold",
            isDark ? "text-cream-light" : "text-foreground"
          )}>
            Carter
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/inscription">
            <Button
              size="sm"
              className="bg-carter-red hover:bg-carter-red-light text-accent-foreground font-sans text-sm"
            >
              Rejoindre Carter
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
