import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const heroH = window.innerHeight;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > heroH) {
        setHidden(y > lastScrollY.current);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${menuOpen ? 'bg-black' : 'bg-transparent'} ${hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <span className="font-serif text-[32px] tracking-[0.04em] transition-colors duration-500 text-white">Logan</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/rendez-vous"
            className="text-[12.3px] font-sans font-semibold px-2.5 py-1.5 transition-colors duration-200 tracking-wide text-white hover:text-white/80"
          >
            Prendre RDV
          </Link>
          <Link
            to="/connexion"
            className="text-[12.3px] font-sans font-semibold px-2.5 py-1.5 transition-colors duration-200 tracking-wide text-white hover:text-white/80"
          >
            Connexion
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 -mr-2 text-white"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-black min-h-[calc(100dvh-4rem)] flex flex-col px-6 pt-8 pb-12 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="h-px bg-white/10 my-2" />
          <Link to="/rendez-vous" onClick={() => setMenuOpen(false)} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide">Prendre RDV</Link>
          <Link to="/connexion" onClick={() => setMenuOpen(false)} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide">Connexion</Link>
          <Link to="/demander-acces" onClick={() => setMenuOpen(false)} className="font-sans text-sm font-normal text-white border border-white/30 rounded-sm px-6 py-3 transition-colors tracking-wide inline-flex items-center gap-2 mt-2 w-fit">Demander un accès</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
