import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface NavDropdownProps {
  label: string;
  items: { label: string; to: string }[];
}

const NavDropdown = ({ label, items }: NavDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 font-sans text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 tracking-wide"
      >
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-3 min-w-[200px] bg-black/90 backdrop-blur-md border border-white/10 rounded-md py-1.5 shadow-2xl">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 font-sans text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <span className="font-serif text-[31px] tracking-[0.04em] text-white">Logan</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link to="/inscription?espace=candidat" className="font-sans text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 tracking-wide">
            Espace candidat
          </Link>
          <Link to="/inscription?espace=cabinet" className="font-sans text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 tracking-wide">
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
                className="font-sans text-sm font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-5 py-2 transition-colors duration-300 tracking-wide"
              >
                Prendre rendez-vous
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
