import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const statuses = [
  { label: 'Associé', description: 'Partner au sein d\'un cabinet d\'avocats d\'affaires' },
  { label: 'Counsel', description: 'Counsel ou Of Counsel en cabinet d\'affaires' },
  { label: 'Collaborateur', description: 'Collaborateur en cabinet d\'avocats d\'affaires' },
];

const ConnexionCandidatPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col theme-light">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg text-center"
        >
          <div className="w-12 h-px bg-foreground/20 mx-auto mb-8" />
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Espace candidat
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-10">
            Sélectionnez votre statut pour accéder à votre espace
          </p>

          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            {statuses.map((s) => (
              <Link key={s.label} to={`/auth?redirect=/espace-candidat`}>
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
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ConnexionCandidatPage;
