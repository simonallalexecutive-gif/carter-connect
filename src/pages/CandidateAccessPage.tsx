import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const REASSURANCES = [
  {
    num: '01',
    text: 'L\'inscription prend moins de 5 minutes.',
  },
  {
    num: '02',
    text: 'Tout est strictement confidentiel. Aucun cabinet ne pourra avoir connaissance de votre identité.',
  },
  {
    num: '03',
    text: 'Vous serez approché uniquement sur la base de votre expertise, de votre séniorité et de votre projet.',
  },
  {
    num: '04',
    text: 'Logan est le seul intermédiaire et vous accompagne dans la plus grande confidentialité tout au long du processus.',
  },
];

const CandidateAccessPage = () => (
  <div className="min-h-screen bg-black">
    <Header />

    <section className="min-h-[100svh] flex flex-col justify-center relative px-6 sm:px-10 lg:px-16 pt-32 pb-24">
      {/* Ambient glow */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse 55% 50% at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)',
            'radial-gradient(ellipse 65% 55% at 48% 45%, rgba(255,255,255,0.055) 0%, transparent 70%)',
            'radial-gradient(ellipse 55% 50% at 52% 42%, rgba(255,255,255,0.04) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">

          {/* Gauche — texte + CTA */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.p variants={fadeUp} className="text-[11px] font-sans tracking-[0.22em] uppercase text-white/35 mb-6">
              Espace candidat
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-serif font-[300] text-[2.2rem] sm:text-[3rem] md:text-[3.6rem] text-white leading-[1.06] tracking-normal mb-8">
              Créez votre profil.<br /><em className="italic">Accédez à votre espace.</em>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/50 font-sans font-light text-[0.93rem] leading-[1.8] max-w-md mb-10">
              Rejoignez le réseau Logan et laissez les meilleures opportunités venir à vous — dans la plus grande discrétion.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link to="/inscription?start=2">
                <Button className="bg-white text-black hover:bg-white/90 font-sans text-[12.3px] font-normal px-7 py-2.5 rounded-sm tracking-wide">
                  Rejoindre Logan
                </Button>
              </Link>
              <Link to="/connexion" className="text-white/35 hover:text-white/65 font-sans text-[12px] tracking-wide transition-colors border-b border-white/15 hover:border-white/40 pb-px">
                Déjà inscrit ? Se connecter →
              </Link>
            </motion.div>
          </motion.div>

          {/* Droite — liste des garanties */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-px bg-white/8"
          >
            {REASSURANCES.map((r, i) => (
              <motion.div
                key={r.num}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="bg-black px-7 py-6 flex gap-5 items-start"
              >
                <span className="text-white/15 font-serif text-sm flex-shrink-0 mt-0.5">{r.num}</span>
                <p className="text-white/55 font-sans font-light text-[0.88rem] leading-[1.75]">{r.text}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default CandidateAccessPage;
