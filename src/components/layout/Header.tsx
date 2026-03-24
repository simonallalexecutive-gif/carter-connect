import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  // Handle scroll-to from navigation state
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.state]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${scrolled || menuOpen ? 'bg-black' : 'bg-transparent'}`}>
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-16">
        {/* Left: Logo + center nav links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center">
            <span className="font-serif text-[22px] tracking-[0.04em] text-white">Logan</span>
          </Link>

          {/* Center nav — Harvey-style */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scrollToSection('notre-vision')}
              className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-sans font-normal text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
            >
              Vision
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            <button
              onClick={() => scrollToSection('notre-approche')}
              className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-sans font-normal text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
            >
              Approche
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            <button
              onClick={() => scrollToSection('nos-engagements')}
              className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-sans font-normal text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
            >
              Engagements
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="flex items-center gap-1 px-3 py-1.5 text-[13px] font-sans font-normal text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
            >
              FAQ
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </nav>
        </div>

        {/* Right: Connexion, Prendre RDV + Demander un accès button */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/connexion"
            className="text-[13px] font-sans font-normal text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
          >
            Connexion
          </Link>
          <Link
            to="/rendez-vous"
            className="text-[13px] font-sans font-normal text-white/60 hover:text-white transition-colors duration-200 tracking-wide"
          >
            Prendre RDV
          </Link>
        </div>

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
        <div className="md:hidden bg-black min-h-[calc(100dvh-4rem)] flex flex-col px-6 pt-8 pb-12 gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <button onClick={() => scrollToSection('notre-vision')} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide text-left">
            Notre vision
          </button>
          <button onClick={() => scrollToSection('notre-approche')} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide text-left">
            Notre approche
          </button>
          <button onClick={() => scrollToSection('nos-engagements')} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide text-left">
            Nos engagements
          </button>
          <button onClick={() => scrollToSection('faq')} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide text-left">
            FAQ
          </button>

          <div className="h-px bg-white/10 my-2" />

          <Link to="/connexion" onClick={() => setMenuOpen(false)} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide">
            Connexion
          </Link>
          <Link to="/rendez-vous" onClick={() => setMenuOpen(false)} className="font-sans text-base font-normal text-white/70 hover:text-white transition-colors tracking-wide">
            Prendre RDV
          </Link>
          <Link
            to="/demander-acces"
            onClick={() => setMenuOpen(false)}
            className="font-sans text-sm font-normal text-white border border-white/30 rounded-sm px-6 py-3 transition-colors tracking-wide inline-flex items-center gap-2 mt-2 w-fit"
          >
            Demander un accès
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
