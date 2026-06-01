import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';

const AccessRequestPage = () => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-20 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <h1 className="font-sans text-xl md:text-2xl font-light text-black mb-3 tracking-[-0.01em]">
            Créer mon profil
          </h1>
          <p className="text-black/60 font-sans text-xs font-light mb-14">
            3 à 5 minutes
          </p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link to="/inscription?espace=candidat">
              <Button
                size="lg"
                className="font-sans text-sm font-normal px-8 py-6 rounded-sm tracking-wide w-full bg-black text-white hover:bg-black/90"
              >
                Espace candidat
              </Button>
            </Link>
            <Link to="/inscription?espace=cabinet">
              <Button
                size="lg"
                variant="outline"
                className="font-sans text-sm font-normal px-8 py-6 rounded-sm tracking-wide w-full border-black/30 bg-black text-white hover:bg-black/90 hover:text-white"
              >
                Espace cabinet
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AccessRequestPage;
