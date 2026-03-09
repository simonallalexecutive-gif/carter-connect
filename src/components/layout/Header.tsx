import { Link } from 'react-router-dom';

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-black">
    <div className="carter-container flex items-center justify-between h-20">
      <Link to="/" className="flex items-center">
        <span className="font-serif text-2xl tracking-[-0.02em] text-white">Carter</span>
      </Link>
      <nav className="flex items-center gap-8">
        <Link to="/inscription?espace=candidat" className="font-sans text-[13px] font-light text-white/60 hover:text-white transition-colors duration-300">
          Espace candidat
        </Link>
        <Link to="/inscription?espace=cabinet" className="font-sans text-[13px] font-light text-white/60 hover:text-white transition-colors duration-300">
          Espace cabinet
        </Link>
        <Link to="/contact" className="font-sans text-[13px] font-light text-white/80 hover:text-white border border-white/20 hover:border-white/40 rounded-sm px-4 py-2 transition-colors duration-300">
          Prendre RDV
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;
