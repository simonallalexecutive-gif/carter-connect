import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="px-6 sm:px-8 lg:px-10 flex items-center h-20">
        <Link to="/" className="flex items-center">
          <span className="font-serif text-2xl tracking-[-0.02em] text-white">Logan</span>
        </Link>
        <nav className="flex items-center gap-6 ml-8">
          <Link to="/inscription?espace=candidat" className="font-serif text-[15px] font-normal text-white/80 hover:text-white transition-colors duration-300">
            Espace candidat
          </Link>
          <Link to="/inscription?espace=cabinet" className="font-serif text-[15px] font-normal text-white/80 hover:text-white transition-colors duration-300">
            Espace cabinet
          </Link>
          {!loading && (
            user ? (
              <button
                onClick={signOut}
                className="font-sans text-[13px] font-light text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-4 py-2 transition-colors duration-300"
              >
                Déconnexion
              </button>
            ) : (
              <Link to="/auth" className="font-sans text-[13px] font-medium bg-white text-black hover:bg-white/90 rounded-sm px-4 py-2 transition-colors duration-300">
                Explorer
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
