import { Link } from 'react-router-dom';

const PolitiqueConfidentialitePage = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <header className="px-8 h-16 flex items-center border-b border-black/8">
      <Link to="/" className="font-serif text-[28px] tracking-[0.04em] text-black hover:opacity-60 transition-opacity">
        Logan
      </Link>
    </header>

    <main className="flex-1 max-w-2xl mx-auto px-6 py-20">
      <p className="text-[10px] font-sans font-semibold tracking-[0.22em] uppercase text-black/30 mb-4">Légal</p>
      <h1 className="font-serif font-[300] text-[2rem] text-black mb-3">Politique de confidentialité</h1>
      <p className="text-[11px] font-sans text-black/30 italic mb-12">Dernière mise à jour : juin 2025</p>

      <div className="space-y-10 font-sans font-light text-[0.93rem] leading-[1.85] text-black/65">

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">1. Responsable du traitement</h2>
          <p>Logan Executive — Simon Allal<br />12 rue de la Paix, 75002 Paris<br /><a href="mailto:contact@loganexecutive.com" className="underline underline-offset-2 hover:text-black transition-colors">contact@loganexecutive.com</a></p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">2. Données collectées</h2>
          <p className="mb-3">Dans le cadre de l'utilisation du Service, Logan collecte les données suivantes :</p>
          <ul className="space-y-2 pl-4">
            {[
              'Données d\'identification : nom, prénom, adresse email, numéro de téléphone',
              'Données professionnelles : cabinet d\'origine, séniorité, pratique, expérience, formation',
              'Données de rémunération : rétrocession actuelle et souhaitée (facultatif)',
              'Données de navigation : adresse IP, type de navigateur, pages visitées',
              'Données de projet : mobilité, disponibilité, aspirations professionnelles',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-[0.6rem] w-1 h-1 rounded-full bg-black/25 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">3. Finalités et base légale</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-black/75 mb-1">Gestion des comptes et mise en relation</p>
              <p>Base légale : exécution du contrat. Ces données sont nécessaires au fonctionnement du Service et à l'intermédiation entre candidats et cabinets.</p>
            </div>
            <div>
              <p className="font-medium text-black/75 mb-1">Communication</p>
              <p>Base légale : intérêt légitime. Envoi de notifications relatives aux opportunités, mises en relation et actualités du Service.</p>
            </div>
            <div>
              <p className="font-medium text-black/75 mb-1">Amélioration du Service</p>
              <p>Base légale : intérêt légitime. Analyse anonymisée des usages pour améliorer l'expérience utilisateur.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">4. Durée de conservation</h2>
          <p>Les données sont conservées pendant toute la durée d'activité du compte. En cas de suppression du compte, l'ensemble des données personnelles est effacé sous 30 jours. Les données de facturation sont conservées 10 ans conformément aux obligations légales.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">5. Destinataires des données</h2>
          <p className="mb-3">Vos données personnelles ne sont jamais vendues ni cédées à des tiers. Elles peuvent être transmises aux seules personnes suivantes :</p>
          <ul className="space-y-2 pl-4">
            <li className="flex items-start gap-2"><span className="mt-[0.6rem] w-1 h-1 rounded-full bg-black/25 flex-shrink-0" /><span>L'équipe Logan (accès restreint et confidentiel)</span></li>
            <li className="flex items-start gap-2"><span className="mt-[0.6rem] w-1 h-1 rounded-full bg-black/25 flex-shrink-0" /><span>Les cabinets partenaires, uniquement avec votre consentement explicite et préalable</span></li>
            <li className="flex items-start gap-2"><span className="mt-[0.6rem] w-1 h-1 rounded-full bg-black/25 flex-shrink-0" /><span>Nos prestataires techniques (hébergement Vercel, authentification Supabase) dans le strict cadre de leurs missions</span></li>
          </ul>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">6. Transferts hors UE</h2>
          <p>Certains de nos prestataires techniques (Vercel, Supabase) sont basés aux États-Unis. Ces transferts sont encadrés par des garanties appropriées (clauses contractuelles types de la Commission européenne).</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">7. Vos droits</h2>
          <p className="mb-3">Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="space-y-2 pl-4">
            {[
              'Droit d\'accès à vos données',
              'Droit de rectification',
              'Droit à l\'effacement (droit à l\'oubli)',
              'Droit à la limitation du traitement',
              'Droit à la portabilité',
              'Droit d\'opposition',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-[0.6rem] w-1 h-1 rounded-full bg-black/25 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">Pour exercer ces droits, contactez-nous à <a href="mailto:contact@loganexecutive.com" className="underline underline-offset-2 hover:text-black transition-colors">contact@loganexecutive.com</a>. En cas de réponse insatisfaisante, vous pouvez introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black transition-colors">CNIL</a>.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">8. Sécurité</h2>
          <p>Logan met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation. L'authentification est sécurisée et les données sont chiffrées en transit et au repos.</p>
        </section>

        <section>
          <h2 className="font-sans font-semibold text-[0.75rem] tracking-[0.18em] uppercase text-black/40 mb-3">9. Contact</h2>
          <p><a href="mailto:contact@loganexecutive.com" className="underline underline-offset-2 hover:text-black transition-colors">contact@loganexecutive.com</a></p>
        </section>

      </div>
    </main>
  </div>
);

export default PolitiqueConfidentialitePage;
