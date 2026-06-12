import { Link } from 'react-router-dom';
import logoMonogram from '@/assets/logo-logan-monogram.png';

const Footer = () => (
  <footer className="bg-transparent pt-20 pb-0">
    <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24">
      {/* Top grid */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr_1fr] gap-12 md:gap-8 pb-16 border-b border-white/10 items-start">
        {/* Brand */}
        <div>
          <img src={logoMonogram} alt="Logan" className="h-12 w-12 mb-1 -ml-4 -mt-1 opacity-80 brightness-0 invert" />
          <p className="font-sans text-xs text-white/50 font-light leading-relaxed max-w-xs pl-0">
            Réseau confidentiel de mise en relation entre avocats d'affaires et cabinets de premier plan.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-6">Navigation</p>
          <ul className="space-y-3">
            <li>
              <a href="/" className="font-sans text-sm text-white/70 hover:text-white transition-colors duration-300 font-light">
                Accueil
              </a>
            </li>
            <li>
              <Link to="/connexion" className="font-sans text-sm text-white/70 hover:text-white transition-colors duration-300 font-light">
                Connexion
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-6">Contact</p>
          <ul className="space-y-3">
            <li className="font-sans text-sm text-white/70 font-light">contact@loganexecutive.com</li>
            <li className="font-sans text-sm text-white/70 font-light">+33 6 50 75 96 85</li>
            <li className="font-sans text-sm text-white/70 font-light leading-relaxed">
              12 rue de la Paix<br />75002 Paris
            </li>
          </ul>
        </div>

        {/* Échangeons */}
        <div>
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-6">Échangeons</p>
          <p className="font-sans text-sm text-white/70 font-light leading-relaxed">
            Vous souhaitez en savoir plus ?<br />Contactez-nous.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 pb-6">
        <p className="text-[11px] font-sans font-light text-white/35 text-center">
          © {new Date().getFullYear()} Logan. Tous droits réservés.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/mentions-legales" className="text-[11px] font-sans font-light text-white/35 hover:text-white/60 transition-colors duration-300">
            Mentions légales
          </Link>
          <span className="text-white/15 text-[11px]">·</span>
          <Link to="/politique-confidentialite" className="text-[11px] font-sans font-light text-white/35 hover:text-white/60 transition-colors duration-300">
            Politique de confidentialité
          </Link>
          <span className="text-white/15 text-[11px]">·</span>
          <Link to="/cgu" className="text-[11px] font-sans font-light text-white/35 hover:text-white/60 transition-colors duration-300">
            CGU
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
