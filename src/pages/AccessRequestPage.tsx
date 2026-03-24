import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const AccessRequestPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl text-center"
        >
          <div className="w-12 h-px bg-black/20 mx-auto mb-8" />
          <h1 className="font-serif text-3xl md:text-4xl text-black mb-6">
            Demander un accès
          </h1>
          <p className="text-[0.92rem] md:text-[0.98rem] font-sans font-[430] text-black/60 leading-relaxed mb-10 max-w-xl mx-auto">
            Un cercle privé d'excellence, structuré et orchestré par des chasseurs spécialisés,<br />
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
