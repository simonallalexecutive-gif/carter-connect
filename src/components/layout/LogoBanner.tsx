import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface LogoBannerProps {
  subtitle?: string;
  variant?: 'default' | 'matte';
}

const LogoBanner = ({ subtitle, variant = 'default' }: LogoBannerProps) => {
  const { user, loading, signOut } = useAuth();

  return (
    <div className={`w-full ${variant === 'matte' ? 'bg-background' : 'bg-black'}`}>
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20">
        <div className="flex items-center">
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-300">
            <span className="font-serif text-[31px] tracking-[0.04em] text-white">Logan</span>
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
                className="font-sans text-[8.5px] font-light text-white/60 hover:text-white tracking-[0.08em] uppercase transition-colors duration-300"
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
