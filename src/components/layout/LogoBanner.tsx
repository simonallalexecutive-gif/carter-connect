import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LogoBannerProps {
  subtitle?: string;
}

const LogoBanner = ({ subtitle }: LogoBannerProps) => {
  const { user, loading, signOut } = useAuth();

  return (
    <div className="w-full bg-black">
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20">
        <div className="flex items-center">
          <Link to="/" className="font-serif text-2xl tracking-[-0.02em] text-white hover:text-white/80 transition-colors duration-300">
            Logan
          </Link>
          {subtitle && (
            <>
              <span className="w-px h-5 bg-white/20 mx-4" />
              <span className="text-[11px] text-white/40 tracking-[0.12em] uppercase font-sans font-light">{subtitle}</span>
            </>
          )}
        </div>
        <nav className="flex items-center gap-8">
          {!loading && (
            user ? (
              <button
                onClick={signOut}
                className="font-sans text-[13px] font-light text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-4 py-2 transition-colors duration-300"
              >
                Déconnexion
              </button>
            ) : (
              <Link to="/" className="font-sans text-[13px] font-medium bg-white text-black hover:bg-white/90 rounded-sm px-4 py-2 transition-colors duration-300">
                Accueil
              </Link>
            )
          )}
        </nav>
      </div>
    </div>
  );
};

export default LogoBanner;
