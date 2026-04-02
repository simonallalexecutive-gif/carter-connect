import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';

const AccessRequestPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <h1 className="font-sans text-xl md:text-2xl font-light text-foreground mb-3 tracking-[-0.01em]">
            Créer mon profil
          </h1>
          <p className="text-muted-foreground font-sans text-xs font-light mb-14">
            3 à 5 minutes
          </p>

          <p className="text-[0.88rem] font-sans font-light text-muted-foreground leading-relaxed mb-14 max-w-sm mx-auto">
            Un cercle privé d'excellence, structuré et piloté par des chasseurs spécialisés, dédié aux profils et cabinets d'affaires les plus exigeants du marché.
          </p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link to="/inscription?espace=candidat">
              <Button
                size="lg"
                className="font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group w-full"
              >
                Espace candidat
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
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
      </main>
    </div>
  );
};

export default AccessRequestPage;
