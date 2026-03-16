import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${scrolled ? 'bg-black' : 'bg-transparent'}`}>
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <span className="font-serif text-[31px] tracking-[0.04em] text-white">Logan</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/inscription?espace=candidat" className="font-serif text-sm font-normal text-white/60 hover:text-white transition-colors duration-300 tracking-wide">
            Espace candidat
          </Link>
          <Link to="/inscription?espace=cabinet" className="font-serif text-sm font-normal text-white/60 hover:text-white transition-colors duration-300 tracking-wide">
            Espace cabinet
          </Link>
          {!loading && (
            user ? (
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
                to="/demo"
                className="font-sans text-sm font-medium text-black bg-white hover:bg-white/90 rounded-sm px-5 py-2 transition-colors duration-300 tracking-wide inline-flex items-center gap-2 group"
              >
                Prendre rendez-vous
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
