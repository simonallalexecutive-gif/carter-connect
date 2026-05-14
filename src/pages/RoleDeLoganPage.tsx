import { motion } from 'motion/react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const RoleDeLoganPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-24 px-4 sm:px-8 lg:px-10 max-w-4xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground tracking-[-0.02em] mb-8"
        >
          Le rôle de <em className="italic">Logan</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-base sm:text-lg text-muted-foreground leading-[1.8] text-justify"
        >
          Logan agit comme une infrastructure confidentielle au service des cabinets et des avocats
          les plus exigeants. Notre rôle est d'orchestrer des rencontres rares, structurées et
          décisives — en garantissant à chaque partie la confidentialité, la précision et la
          pertinence qu'exige le marché du droit des affaires.
        </motion.p>
      </main>
      <Footer />
    </div>
  );
};

export default RoleDeLoganPage;
