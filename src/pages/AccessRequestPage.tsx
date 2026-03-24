import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const statuses = [
  { label: 'Associé', description: "Partner au sein d'un cabinet d'avocats d'affaires" },
  { label: 'Counsel', description: "Counsel ou Of Counsel en cabinet d'affaires" },
  { label: 'Collaborateur', description: "Collaborateur en cabinet d'avocats d'affaires" },
];

const AccessRequestPage = () => {
  const [showStatusSelect, setShowStatusSelect] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 px-6">
        <AnimatePresence mode="wait">
          {!showStatusSelect ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-2xl text-center"
            >
              <div className="w-12 h-px bg-black/20 mx-auto mb-8" />
              <h1 className="font-serif text-3xl md:text-4xl text-black mb-6">
                Demander un accès
              </h1>
              <p className="text-[0.92rem] md:text-[0.98rem] font-sans font-[430] text-black/60 leading-relaxed mb-10 max-w-xl mx-auto">
                Un cercle privé d'excellence, structuré et piloté par des chasseurs spécialisés,<br />
                dédié aux profils et cabinets d'affaires les plus exigeants du marché
              </p>

              <div className="space-y-4 mb-10 text-left max-w-sm mx-auto">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-black/50 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-sans text-black/70">
                    Processus de sélection rigoureux pour garantir la qualité du réseau
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-black/50 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-sans text-black/70">
                    Chaque profil est étudié attentivement et validé sous 48h
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-black/50 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-sans text-black/70">
                    Accès complet à la plateforme une fois votre profil validé
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group w-full sm:w-auto"
                  onClick={() => setShowStatusSelect(true)}
                >
                  Espace candidat
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link to="/inscription?espace=cabinet">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group w-full sm:w-auto"
                  >
                    Espace cabinet
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg text-center"
            >
              <div className="w-12 h-px bg-black/20 mx-auto mb-8" />
              <h1 className="font-serif text-3xl md:text-4xl text-black mb-4">
                Espace candidat
              </h1>
              <p className="text-sm text-black/50 font-sans leading-relaxed mb-10">
                Sélectionnez votre statut pour démarrer votre inscription
              </p>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                {statuses.map((s) => (
                  <Link key={s.label} to="/inscription?espace=candidat">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full font-sans text-sm font-medium px-6 py-6 rounded-sm tracking-wide group justify-between text-left"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{s.label}</span>
                        <span className="text-xs text-muted-foreground font-normal mt-0.5">{s.description}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => setShowStatusSelect(false)}
                className="inline-flex items-center gap-2 text-sm font-sans text-black/50 hover:text-black transition-colors mt-8"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default AccessRequestPage;
