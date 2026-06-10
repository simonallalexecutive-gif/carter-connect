import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const NotreOffrePage = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <div className="bg-black min-h-screen">

      {/* Header minimal */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-[28px] tracking-[0.04em] text-white hover:opacity-70 transition-opacity">
          Logan
        </Link>
        <Link
          to="/connexion"
          className="text-[12px] font-sans font-normal px-3.5 py-1.5 rounded-sm bg-white text-black hover:bg-white/90 transition-colors tracking-wide"
        >
          Connexion
        </Link>
      </header>

      {/* ── Hero : citation ──────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.img
          src="/quote-bg.jpg"
          alt=""
          aria-hidden
          style={{ y: bgY, willChange: 'transform' }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center gap-12">

          <motion.p
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-[300] text-[1.85rem] sm:text-[2.4rem] md:text-[2.9rem] text-white leading-[1.1] tracking-normal"
          >
            Logan est la nouvelle infrastructure privilégiée et confidentielle du marché des avocats.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-10 h-px bg-white/30 origin-center"
          />

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic font-light text-[0.93rem] sm:text-[1.02rem] leading-[1.8] text-white/50 max-w-xl mx-auto"
          >
            <span className="font-serif text-white/20 text-2xl align-top mr-1 leading-none">"</span>
            Logan se positionne comme l'infrastructure la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.
            <span className="font-serif text-white/20 text-2xl align-bottom ml-1 leading-none">"</span>
          </motion.blockquote>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-[9px] font-sans tracking-[0.32em] uppercase text-white/25"
          >
            L'équipe Logan
          </motion.span>

        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]" />
        </motion.div>
      </section>

      {/* ── Section : qui sommes-nous ────────────────────────────────────── */}
      <section className="bg-black px-6 sm:px-10 py-32 md:py-40">
        <div className="max-w-2xl mx-auto">

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-[9px] font-sans font-semibold tracking-[0.28em] uppercase text-white/25 mb-10"
          >
            Qui sommes-nous
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-[300] text-[2rem] sm:text-[2.5rem] text-white leading-[1.12] mb-14"
          >
            Pensé par des spécialistes<br className="hidden sm:block" /> du marché juridique.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-8 h-px bg-white/20 origin-left mb-14"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-light text-[1rem] sm:text-[1.05rem] text-white/55 leading-[1.85]"
          >
            Logan a été pensé et conçu par des consultants et chasseurs de têtes spécialisés sur le marché des avocats. Notre objectif est de repenser différemment notre rôle et notre collaboration, tant côté candidats que cabinets d'avocats — en proposant à chacun un espace confidentiel, structuré et qualifié pour accélérer leur recrutement, tout en conservant une intermédiation premium capable de les accompagner à chaque étape de leur processus.
          </motion.p>

        </div>
      </section>

      {/* ── Footer minimal ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/8 px-8 py-10 flex items-center justify-between">
        <span className="font-serif text-[22px] tracking-[0.04em] text-white/30">Logan</span>
        <Link
          to="/cabinet-start"
          className="text-[11px] font-sans tracking-[0.14em] uppercase text-white/30 hover:text-white/60 transition-colors"
        >
          Inscrire mon cabinet →
        </Link>
      </footer>

    </div>
  );
};

export default NotreOffrePage;
