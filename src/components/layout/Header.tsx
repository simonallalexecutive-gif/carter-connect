import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${scrolled || menuOpen ? 'bg-black' : 'bg-transparent'}`}>
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <span className="font-serif text-[31px] tracking-[0.04em] text-white">Logan</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/demander-acces" className="font-sans text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 tracking-wide">
            Demander un accès
          </Link>
          <Link to="/rendez-vous" className="font-sans text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 tracking-wide">
            Prendre RDV
          </Link>
          {!loading && user ? (
            <>
              <Link to="/espace-candidat" className="font-sans text-[13px] font-light text-white/60 hover:text-white transition-colors duration-300">
                Mon espace
              </Link>
              <button
                onClick={signOut}
                className="font-sans text-[13px] font-light text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-4 py-2 transition-colors duration-300"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/connexion"
              className="font-sans text-sm font-medium text-black bg-white hover:bg-white/90 rounded-sm px-5 py-2 transition-colors duration-300 tracking-wide inline-flex items-center gap-2 group"
            >
              Connexion
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2 -mr-2"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="md:hidden bg-black min-h-[calc(100dvh-5rem)] flex flex-col px-6 pt-8 pb-12 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            to="/demander-acces"
            onClick={() => setMenuOpen(false)}
            className="font-sans text-lg font-medium text-white/70 hover:text-white transition-colors tracking-wide"
          >
            Demander un accès
          </Link>
          <Link
            to="/rendez-vous"
            onClick={() => setMenuOpen(false)}
            className="font-sans text-lg font-medium text-white/70 hover:text-white transition-colors tracking-wide"
          >
            Prendre RDV
          </Link>
          {!loading && user ? (
            <>
              <Link to="/espace-candidat" onClick={() => setMenuOpen(false)} className="font-sans text-lg font-medium text-white/70 hover:text-white transition-colors">
                Mon espace
              </Link>
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="font-sans text-lg font-medium text-white/80 hover:text-white border border-white/20 rounded-sm px-5 py-3 transition-colors mt-2 text-left"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/connexion"
              onClick={() => setMenuOpen(false)}
              className="font-sans text-base font-medium text-black bg-white hover:bg-white/90 rounded-sm px-6 py-3.5 transition-colors tracking-wide inline-flex items-center gap-2 group mt-4 w-fit"
            >
              Connexion
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
