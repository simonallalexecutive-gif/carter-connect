import { Link } from 'react-router-dom';

const MentionsLegalesPage = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <header className="px-8 h-16 flex items-center border-b border-black/8">
      <Link to="/" className="font-serif text-[28px] tracking-[0.04em] text-black hover:opacity-60 transition-opacity">
        Logan
      </Link>
    </header>

    <main className="flex-1 max-w-2xl mx-auto px-6 py-20">
      <p className="text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-black/30 mb-4">Légal</p>
      <h1 className="font-serif font-[300] text-[2rem] text-black mb-12">Mentions légales</h1>

      <div className="space-y-10 font-sans font-light text-[0.93rem] leading-[1.85] text-black/65">

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">Éditeur du site</h2>
          <p>Logan Executive</p>
          <p>Société en cours de constitution</p>
          <p>12 rue de la Paix, 75002 Paris</p>
          <p>contact@loganexecutive.com</p>
          <p>+33 6 50 75 96 85</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">Directeur de la publication</h2>
          <p>Simon Allal</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">Hébergeur</h2>
          <p>Vercel Inc.</p>
          <p>340 Pine Street, Suite 701</p>
          <p>San Francisco, CA 94104 — États-Unis</p>
          <p><a href="https://vercel.com" className="underline underline-offset-2 hover:text-black transition-colors">vercel.com</a></p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, visuels, structure) est la propriété exclusive de Logan Executive et est protégé par les lois en vigueur sur la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation préalable.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">Données personnelles</h2>
          <p>Les données collectées sur ce site sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Pour toute demande relative à vos données personnelles, contactez-nous à <a href="mailto:contact@loganexecutive.com" className="underline underline-offset-2 hover:text-black transition-colors">contact@loganexecutive.com</a>.</p>
        </section>

      </div>
    </main>
  </div>
);

export default MentionsLegalesPage;
