import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const headerRef = { current: null as HTMLElement | null };
    const heroH = window.innerHeight;

    const onScroll = () => {
      const y = window.scrollY;

      // Hide/show based on scroll direction (only after hero)
      if (y > heroH) {
        setHidden(y > lastScrollY.current);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;

      // Detect background luminance
      const header = headerRef.current ?? document.querySelector('header');
      if (header) {
        headerRef.current = header;
        header.style.pointerEvents = 'none';
      }
      const el = document.elementFromPoint(window.innerWidth / 2, 32);
      if (header) header.style.pointerEvents = '';
      if (!el) return;
      let target: Element | null = el;
      let bg = '';
      while (target && target !== document.body) {
        const style = window.getComputedStyle(target);
        bg = style.backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') break;
        target = target.parentElement;
      }
      if (!bg || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        bg = window.getComputedStyle(document.body).backgroundColor;
      }
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        const match = bg.match(/\d+/g);
        if (match) {
          const [r, g, b] = match.map(Number);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          setIsDarkBg(luminance < 0.5);
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const useWhiteText = isDarkBg;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollToSection = useCallback((sectionId: string) => {
    setMenuOpen(false);
    if (!isLanding) {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, [isLanding, navigate]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.state]);

  const textClass = menuOpen
    ? 'text-white'
    : useWhiteText
      ? 'text-white/70 hover:text-white'
      : 'text-foreground/70 hover:text-foreground';

  const logoClass = menuOpen
    ? 'text-white'
    : useWhiteText
      ? 'text-white'
      : 'text-foreground';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${menuOpen ? 'bg-black' : 'bg-transparent'} ${hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <span className={`font-serif text-[32px] tracking-[0.04em] transition-colors duration-500 ${logoClass}`}>Logan</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Notre approche', section: 'notre-approche' },
              { label: 'Notre fonctionnement', section: 'fonctionnement' },
            ].map(({ label, section }) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
className={`flex items-center gap-1 px-2.5 py-1.5 text-[12.3px] font-sans font-semibold transition-colors duration-200 tracking-wide text-white hover:text-white/80`}
              >
                {label}
                <ChevronDown className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
            <Link
              to="/rendez-vous"
className={`flex items-center gap-1 px-2.5 py-1.5 text-[12.3px] font-sans font-semibold transition-colors duration-200 tracking-wide text-white hover:text-white/80`}
            >
              Prendre RDV
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center">
          <Link
            to="/connexion"
            className={`text-[12.3px] font-sans font-semibold px-2.5 py-1.5 transition-colors duration-200 tracking-wide text-white hover:text-white/80`}
          >
            Connexion
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 -mr-2 ${logoClass}`}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black min-h-[calc(100dvh-4rem)] flex flex-col px-6 pt-8 pb-12 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <button onClick={() => scrollToSection('notre-approche')} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide text-left">Notre approche</button>
          <button onClick={() => scrollToSection('fonctionnement')} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide text-left">Notre fonctionnement</button>
          <div className="h-px bg-white/10 my-2" />
          <Link to="/connexion" onClick={() => setMenuOpen(false)} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide">Connexion</Link>
          <Link to="/rendez-vous" onClick={() => setMenuOpen(false)} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide">Prendre RDV</Link>
          <Link to="/demander-acces" onClick={() => setMenuOpen(false)} className="font-sans text-sm font-normal text-white border border-white/30 rounded-sm px-6 py-3 transition-colors tracking-wide inline-flex items-center gap-2 mt-2 w-fit">Demander un accès</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
