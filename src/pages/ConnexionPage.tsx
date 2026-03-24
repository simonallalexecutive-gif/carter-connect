import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoBanner from '@/components/layout/LogoBanner';
import Footer from '@/components/layout/Footer';

const ConnexionPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col theme-light">
      {/* Light header with dark text */}
      <div className="w-full bg-white border-b border-border">
        <div className="px-6 sm:px-8 lg:px-10 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <span className="font-serif text-[31px] tracking-[0.04em] text-foreground">Logan</span>
          </Link>
        </div>
      </div>
      <main className="flex-1 flex items-center justify-center pt-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg text-center"
        >
          <div className="w-12 h-px bg-foreground/20 mx-auto mb-8" />
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            Connexion
          </h1>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed mb-10">
            Accédez à votre espace Logan
          </p>

          <div className="flex flex-col gap-4 max-w-sm mx-auto">
            <Link to="/connexion/candidat">
              <Button
                size="lg"
                className="w-full font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group justify-between"
              >
                <span className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Espace candidat
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/auth?redirect=/cabinet">
              <Button
                size="lg"
                variant="outline"
                className="w-full font-sans text-sm font-medium px-8 py-6 rounded-sm tracking-wide group justify-between"
              >
                <span className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5" />
                  Espace cabinet
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ConnexionPage;
