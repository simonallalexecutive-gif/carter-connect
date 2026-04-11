import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LogoBannerProps {
  subtitle?: string;
  variant?: 'default' | 'matte' | 'light';
}

const LogoBanner = ({ subtitle, variant = 'default' }: LogoBannerProps) => {
  const { user, loading, signOut } = useAuth();
  const isLight = variant === 'light';

  return (
    <div className={`w-full ${isLight ? 'bg-white' : variant === 'matte' ? 'bg-background' : 'bg-black'}`}>
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20">
        <div className="flex items-center">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
            <span className={`font-serif text-[31px] tracking-[0.04em] ${isLight ? 'text-black' : 'text-white'}`}>Logan</span>
          </Link>
          {subtitle && (
            <>
              <span className={`w-px h-5 mx-4 ${isLight ? 'bg-black/15' : 'bg-white/20'}`} />
              <span className={`text-[11px] tracking-[0.12em] uppercase font-sans font-light ${isLight ? 'text-black/40' : 'text-white/40'}`}>{subtitle}</span>
            </>
          )}
        </div>
        <nav className="flex items-center gap-8">
          {!loading && (
            user ? (
              <button
                onClick={signOut}
                className={`font-sans text-[8.5px] font-light tracking-[0.08em] uppercase transition-colors duration-300 ${isLight ? 'text-black/50 hover:text-black' : 'text-white/60 hover:text-white'}`}
              >
                Déconnexion
              </button>
            ) : (
              <Link to="/" className={`font-sans text-[13px] font-medium rounded-sm px-4 py-2 transition-colors duration-300 ${isLight ? 'bg-black text-white hover:bg-black/90' : 'bg-white text-black hover:bg-white/90'}`}>
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
