import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const [hidden, setHidden] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const heroH = window.innerHeight;

    const detectBackground = () => {
      const y = 40;
      const els = document.elementsFromPoint(window.innerWidth / 2, y);
      for (const el of els) {
        if (el.closest('header')) continue;
        const bg = getComputedStyle(el).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          const match = bg.match(/\d+/g);
          if (match) {
            const [r, g, b] = match.map(Number);
            setOnLight((r * 299 + g * 587 + b * 114) / 1000 > 128);
          }
          return;
        }
      }
      setOnLight(false);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y > heroH) {
        setHidden(y > lastScrollY.current);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
      detectBackground();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    // Détecte aussi au chargement initial après le rendu
    setTimeout(detectBackground, 100);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const textColor = menuOpen ? 'text-white' : onLight ? 'text-black' : 'text-white';
  const hoverColor = onLight && !menuOpen ? 'hover:text-black/60' : 'hover:text-white/80';
  const navLinkBase = `text-[12.3px] font-sans font-normal px-2.5 py-1.5 transition-colors duration-200 tracking-wide ${textColor} ${hoverColor}`;

  const minimalNav = location.pathname === '/demander-acces' || location.pathname === '/rendez-vous';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${menuOpen ? 'bg-black' : 'bg-transparent'} ${hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <span className={`font-serif text-[32px] tracking-[0.04em] transition-colors duration-500 ${textColor}`}>Logan</span>
          </Link>

          {!minimalNav && (
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <Link to="/#notre-approche" className={navLinkBase}>Notre approche</Link>

              {/* Demo dropdown */}
              <div ref={demoRef} className="relative">
                <button
                  onClick={() => setDemoOpen(v => !v)}
                  className={`${navLinkBase} flex items-center gap-1`}
                >
                  Demo
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${demoOpen ? 'rotate-180' : ''}`} />
                </button>
                {demoOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-black/95 backdrop-blur-sm border border-white/10 rounded-sm shadow-xl py-1 z-50">
                    <Link
                      to="/demo?tab=candidat"
                      onClick={() => setDemoOpen(false)}
                      className="block px-4 py-2.5 text-[11.5px] font-sans text-white/60 hover:text-white hover:bg-white/5 transition-colors tracking-wide"
                    >
                      Focus candidat
                    </Link>
                    <div className="mx-4 my-1 border-t border-white/8" />
                    <Link
                      to="/demo?tab=dashboard"
                      onClick={() => setDemoOpen(false)}
                      className="block px-4 py-2.5 text-[11.5px] font-sans text-white/60 hover:text-white hover:bg-white/5 transition-colors tracking-wide"
                    >
                      Focus cabinet
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/#qui-sommes-nous" className={navLinkBase}>Qui sommes-nous</Link>
              <Link to="/#faq" className={navLinkBase}>FAQ</Link>
            </nav>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/connexion"
            className="text-[12.3px] font-sans font-normal px-3.5 py-1.5 rounded-sm bg-white text-black border border-white hover:bg-white/90 transition-colors duration-200 tracking-wide"
          >
            Connexion
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-2 -mr-2 ${textColor}`}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black min-h-[calc(100dvh-4rem)] flex flex-col px-6 pt-8 pb-12 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">

          <Link to="/connexion" onClick={() => setMenuOpen(false)} className="font-sans text-base font-medium text-black bg-white border border-white rounded-sm px-5 py-2.5 transition-colors tracking-wide inline-flex w-fit">Connexion</Link>
          <Link to="/demander-acces" onClick={() => setMenuOpen(false)} className="font-sans text-sm font-normal text-white border border-white/30 rounded-sm px-6 py-3 transition-colors tracking-wide inline-flex items-center gap-2 mt-2 w-fit">Demander un accès</Link>
        </div>
      )}

    </header>
  );
};

export default Header;
