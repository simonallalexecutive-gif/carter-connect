import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';

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
      <main className="flex-1 flex items-center justify-center pt-20 pb-20 px-6">
        <AnimatePresence mode="wait">
          {!showStatusSelect ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-md text-center"
            >
              <span className="font-serif text-[32px] tracking-[0.04em] text-foreground block mb-12">Logan</span>

              <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-4 tracking-[-0.02em]">
                Demander un accès
              </h1>
              <p className="text-[0.88rem] font-sans font-light text-muted-foreground leading-relaxed mb-14 max-w-sm mx-auto">
                Un cercle privé d'excellence, structuré et piloté par des chasseurs spécialisés, dédié aux profils et cabinets d'affaires les plus exigeants du marché.
              </p>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button
                  size="lg"
                  className="font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group w-full"
                  onClick={() => setShowStatusSelect(true)}
                >
                  Espace candidat
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Link to="/inscription?espace=cabinet">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group w-full"
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
              className="w-full max-w-md text-center"
            >
              <span className="font-serif text-[32px] tracking-[0.04em] text-foreground block mb-12">Logan</span>

              <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-3 tracking-[-0.02em]">
                Espace candidat
              </h1>
              <p className="text-sm text-muted-foreground font-sans font-light leading-relaxed mb-10">
                Sélectionnez votre statut pour démarrer votre inscription
              </p>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
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
                className="inline-flex items-center gap-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors mt-10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Retour
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AccessRequestPage;
