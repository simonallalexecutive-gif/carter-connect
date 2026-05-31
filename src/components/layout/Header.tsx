import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const textColor = menuOpen ? 'text-white' : onLight ? 'text-black' : 'text-white';
  const hoverColor = onLight && !menuOpen ? 'hover:text-black/60' : 'hover:text-white/80';
  const navLinkBase = `text-[12.3px] font-sans font-normal px-2.5 py-1.5 transition-colors duration-200 tracking-wide ${textColor} ${hoverColor}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${menuOpen ? 'bg-black' : 'bg-transparent'} ${hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <span className={`font-serif text-[32px] tracking-[0.04em] transition-colors duration-500 ${textColor}`}>Logan</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-2">
            {/* Onglets retirés à la demande : Notre approche, Demo, FAQ */}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/rendez-vous"
            className={`text-[12.3px] font-sans font-semibold px-3.5 py-1.5 rounded-sm border transition-colors duration-200 tracking-wide ${textColor} ${onLight && !menuOpen ? 'border-black/40 hover:bg-black/5' : 'border-white/50 hover:bg-white/10'}`}
          >
            Prendre RDV
          </Link>
          <Link
            to="/connexion"
            className="text-[12.3px] font-sans font-semibold px-3.5 py-1.5 rounded-sm bg-white text-black border border-white hover:bg-white/90 transition-colors duration-200 tracking-wide"
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

          <Link to="/rendez-vous" onClick={() => setMenuOpen(false)} className="font-sans text-base font-normal text-white border border-white/40 rounded-sm px-5 py-2.5 transition-colors tracking-wide inline-flex w-fit">Prendre RDV</Link>
          <Link to="/connexion" onClick={() => setMenuOpen(false)} className="font-sans text-base font-medium text-black bg-white border border-white rounded-sm px-5 py-2.5 transition-colors tracking-wide inline-flex w-fit">Connexion</Link>
          <Link to="/demander-acces" onClick={() => setMenuOpen(false)} className="font-sans text-sm font-normal text-white border border-white/30 rounded-sm px-6 py-3 transition-colors tracking-wide inline-flex items-center gap-2 mt-2 w-fit">Demander un accès</Link>
        </div>
      )}

    </header>
  );
};

export default Header;
