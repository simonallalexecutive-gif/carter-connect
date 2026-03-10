import { Link } from 'react-router-dom';

interface LogoBannerProps {
  subtitle?: string;
}

const LogoBanner = ({ subtitle }: LogoBannerProps) => (
  <div className="w-full bg-black">
    <div className="px-6 sm:px-8 lg:px-10 flex items-center h-14">
      <Link to="/" className="font-serif text-xl tracking-[-0.02em] text-white hover:text-white/80 transition-colors">
        Logan
      </Link>
      {subtitle && (
        <>
          <span className="w-px h-4 bg-white/20 mx-3" />
          <span className="text-[10px] text-white/40 tracking-[0.1em] uppercase font-sans">{subtitle}</span>
        </>
      )}
    </div>
  </div>
);

export default LogoBanner;
