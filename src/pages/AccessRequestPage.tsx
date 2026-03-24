import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AccessRequestPage = () => {
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
            Demander un accès
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-8 max-w-md mx-auto">
            Logan est un réseau confidentiel et sélectif. Chaque profil est étudié attentivement et validé sous 48h par notre équipe.
          </p>

          <div className="space-y-4 mb-10 text-left max-w-sm mx-auto">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-foreground/60 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-sans text-foreground/80">
                Processus de sélection rigoureux pour garantir la qualité du réseau
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-foreground/60 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-sans text-foreground/80">
                Réponse sous 48h après examen de votre candidature
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-foreground/60 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-sans text-foreground/80">
                Accès complet à la plateforme une fois votre profil validé
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription?espace=candidat">
              <Button
                size="lg"
                className="font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group w-full sm:w-auto"
              >
                Espace candidat
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
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
      </main>
      <Footer />
    </div>
  );
};

export default AccessRequestPage;
