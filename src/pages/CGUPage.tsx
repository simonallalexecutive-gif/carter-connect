import { Link } from 'react-router-dom';

const CGUPage = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <header className="px-8 h-16 flex items-center border-b border-black/8">
      <Link to="/" className="font-serif text-[28px] tracking-[0.04em] text-black hover:opacity-60 transition-opacity">
        Logan
      </Link>
    </header>

    <main className="flex-1 max-w-2xl mx-auto px-6 py-20">
      <p className="text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-black/30 mb-4">Légal</p>
      <h1 className="font-serif font-[300] text-[2rem] text-black mb-3">Conditions Générales d'Utilisation</h1>
      <p className="text-[11px] font-sans text-black/30 italic mb-12">Document en cours de finalisation — dernière mise à jour : juin 2025</p>

      <div className="space-y-10 font-sans font-light text-[0.93rem] leading-[1.85] text-black/65">

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">1. Objet</h2>
          <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Logan (ci-après « le Service »), réseau confidentiel de mise en relation entre avocats d'affaires et cabinets de premier plan.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">2. Accès au service</h2>
          <p>L'accès au Service est réservé aux personnes physiques ou morales ayant fait l'objet d'une validation préalable par l'équipe Logan. Toute inscription est soumise à une vérification manuelle. Logan se réserve le droit de refuser ou de suspendre tout accès sans justification.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">3. Confidentialité et anonymat</h2>
          <p>L'identité des candidats inscrits sur la plateforme est strictement protégée. Aucune information permettant d'identifier un candidat ne peut être transmise à un cabinet sans le consentement explicite et préalable du candidat concerné. De même, les informations communiquées par les cabinets dans le cadre de leurs recherches sont traitées de manière confidentielle.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">4. Rôle de Logan</h2>
          <p>Logan agit en qualité d'intermédiaire exclusif entre les candidats et les cabinets. Aucune mise en relation directe entre les parties ne peut avoir lieu en dehors de l'intermédiation de Logan. Logan n'est partie à aucun contrat conclu entre un candidat et un cabinet à l'issue d'une mise en relation.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">5. Gratuité pour les candidats</h2>
          <p>L'inscription et l'utilisation du Service sont entièrement gratuites pour les candidats. Aucune commission ni frais ne pourra être prélevé sur un candidat à quelque étape que ce soit du processus.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">6. Données personnelles</h2>
          <p>Les données personnelles collectées dans le cadre de l'utilisation du Service sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). L'utilisateur dispose d'un droit d'accès, de rectification et de suppression de ses données à tout moment depuis son espace personnel ou en contactant Logan à <a href="mailto:contact@loganexecutive.com" className="underline underline-offset-2 hover:text-black transition-colors">contact@loganexecutive.com</a>.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">7. Résiliation</h2>
          <p>Tout utilisateur peut résilier son compte à tout moment depuis son espace personnel. La suppression est définitive et immédiate : toutes les données associées au compte sont effacées du Service.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">8. Modification des CGU</h2>
          <p>Logan se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle. La poursuite de l'utilisation du Service après notification vaut acceptation des nouvelles conditions.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">9. Droit applicable</h2>
          <p>Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux compétents de Paris.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">10. Contact</h2>
          <p>Pour toute question relative aux présentes CGU : <a href="mailto:contact@loganexecutive.com" className="underline underline-offset-2 hover:text-black transition-colors">contact@loganexecutive.com</a></p>
        </section>

      </div>
    </main>
  </div>
);

export default CGUPage;
