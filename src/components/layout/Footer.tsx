import { Scale } from 'lucide-react';

const Footer = () => (
  <footer className="gradient-navy py-16">
    <div className="carter-container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-carter-red" />
          <span className="font-serif text-lg font-bold text-cream-light">Carter</span>
        </div>
        <p className="text-sm font-sans text-cream-light/40">
          © {new Date().getFullYear()} Carter. Réseau confidentiel pour avocats d'affaires.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
