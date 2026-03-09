import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => (
  <footer className="bg-black pt-20 pb-10">
    <div className="w-full px-8 md:px-16 lg:px-24">
      {/* Top grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-white/10">
        {/* Brand */}
        <div className="md:col-span-4">
          <span className="font-serif text-2xl text-white tracking-[-0.02em] block mb-4">Logan</span>
          <p className="font-sans text-xs text-white/40 font-light leading-relaxed max-w-xs">
            Réseau confidentiel de mise en relation entre avocats d'affaires et cabinets de premier plan.
          </p>
        </div>

        {/* Navigation */}
        <div className="md:col-span-2">
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-white/30 mb-6">Navigation</p>
          <ul className="space-y-3">
            {[
              { label: 'Accueil', to: '/' },
              { label: 'Espace candidat', to: '/inscription?espace=candidat' },
              { label: 'Espace cabinet', to: '/inscription?espace=cabinet' },
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="font-sans text-sm text-white/50 hover:text-white transition-colors duration-300 font-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:col-span-3">
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-white/30 mb-6">Contact</p>
          <ul className="space-y-3">
            <li className="font-sans text-sm text-white/50 font-light">contact@logan.law</li>
            <li className="font-sans text-sm text-white/50 font-light">+33 1 00 00 00 00</li>
            <li className="font-sans text-sm text-white/50 font-light leading-relaxed">
              12 rue de la Paix<br />75002 Paris
            </li>
          </ul>
        </div>

        {/* CTA — à droite */}
        <div className="md:col-span-3 md:text-right">
          <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-white/30 mb-6">Échangeons</p>
          <p className="font-sans text-sm text-white/50 font-light leading-relaxed mb-6">
            Vous souhaitez en savoir plus ?<br />Prenons rendez-vous.
          </p>
          <Link to="/contact">
            <Button className="bg-white text-black hover:bg-white/90 font-sans text-sm font-medium rounded-sm px-6 py-5 group transition-all duration-300">
              Prendre rendez-vous
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
        <p className="text-[11px] font-sans font-light text-white/25">
          © {new Date().getFullYear()} Logan. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          {['Mentions légales', 'Politique de confidentialité', 'CGU'].map((item) => (
            <a key={item} href="#" className="text-[11px] font-sans font-light text-white/25 hover:text-white/50 transition-colors duration-300">
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
