import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import motionIntro from '@/assets/motion-intro.mp4';
import motionScene1 from '@/assets/motion-scene1.mp4';
import motionScene2 from '@/assets/motion-scene2.mp4';

/* ─── Scenes ─── */
interface Scene {
  video: string;
  lines: { text: string; delay: number; style?: 'title' | 'subtitle' | 'tag' | 'cta' }[];
  duration: number; // ms
}

const scenes: Scene[] = [
  {
    video: motionIntro,
    duration: 10000,
    lines: [
      { text: 'Logan', delay: 0.3, style: 'title' },
      { text: 'La plateforme confidentielle de mise en relation', delay: 1.2, style: 'subtitle' },
      { text: 'entre avocats d\'affaires et cabinets de premier plan.', delay: 2.0, style: 'subtitle' },
    ],
  },
  {
    video: motionScene1,
    duration: 10000,
    lines: [
      { text: 'Étape 01', delay: 0.2, style: 'tag' },
      { text: 'Créez votre profil', delay: 0.6, style: 'title' },
      { text: 'confidentiel', delay: 1.0, style: 'title' },
      { text: 'Votre identité reste strictement protégée.', delay: 1.8, style: 'subtitle' },
      { text: 'Nom et cabinet jamais révélés aux recruteurs.', delay: 2.6, style: 'subtitle' },
      { text: 'Profil validé sous 48h par l\'équipe Logan.', delay: 3.4, style: 'subtitle' },
    ],
  },
  {
    video: motionScene2,
    duration: 10000,
    lines: [
      { text: 'Étape 02', delay: 0.2, style: 'tag' },
      { text: 'Recevez des opportunités', delay: 0.6, style: 'title' },
      { text: 'ciblées', delay: 1.0, style: 'title' },
      { text: 'Matching intelligent basé sur votre expertise.', delay: 1.8, style: 'subtitle' },
      { text: 'Vous restez invisible jusqu\'à votre accord.', delay: 2.6, style: 'subtitle' },
      { text: '0% commission côté candidat. Toujours.', delay: 3.4, style: 'subtitle' },
    ],
  },
  {
    video: motionIntro,
    duration: 10000,
    lines: [
      { text: 'Étape 03', delay: 0.2, style: 'tag' },
      { text: 'Mise en relation', delay: 0.6, style: 'title' },
      { text: 'orchestrée', delay: 1.0, style: 'title' },
      { text: 'Votre consultant Logan prépare l\'échange.', delay: 1.8, style: 'subtitle' },
      { text: 'Identité révélée à l\'entretien seulement.', delay: 2.6, style: 'subtitle' },
      { text: 'Rejoindre Logan →', delay: 4.0, style: 'cta' },
    ],
  },
];

/* ─── Component ─── */
const DemoPage = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(Date.now());
  const videoRef = useRef<HTMLVideoElement>(null);

  const scene = scenes[currentScene];
  const totalScenes = scenes.length;

  // Auto-advance scenes
  useEffect(() => {
    if (!isPlaying) return;

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(elapsed / scene.duration, 1);
      setProgress(pct);

      if (pct >= 1) {
        if (currentScene < totalScenes - 1) {
          setCurrentScene(c => c + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, 50);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentScene, isPlaying, scene.duration, totalScenes]);

  // Reset video element on scene change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) videoRef.current.play().catch(() => {});
    }
  }, [currentScene, isPlaying]);

  const togglePlay = () => {
    if (!isPlaying && currentScene >= totalScenes - 1) {
      // Restart from beginning
      setCurrentScene(0);
      setProgress(0);
    }
    setIsPlaying(p => !p);
  };

  const goToScene = (idx: number) => {
    setCurrentScene(idx);
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden select-none">
      {/* Video background */}
      <AnimatePresence mode="wait">
        <motion.video
          key={currentScene}
          ref={videoRef}
          src={scene.video}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.45, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40 z-[1]" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl tracking-[-0.02em] text-white/70 hover:text-white transition-colors">
          Logan
        </Link>
        <Link to="/inscription?espace=candidat">
          <Button size="sm" className="bg-white text-black hover:bg-white/90 text-[11px] font-medium rounded-full px-5 font-sans">
            S'inscrire <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </header>

      {/* Text content — centered */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6 sm:px-10 lg:px-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl w-full"
          >
            {scene.lines.map((line, i) => (
              <motion.div
                key={`${currentScene}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: line.delay,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line.style === 'tag' && (
                  <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-6 font-sans">
                    {line.text}
                  </p>
                )}
                {line.style === 'title' && (
                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.05] tracking-[-0.02em]">
                    {line.text}
                  </h2>
                )}
                {line.style === 'subtitle' && (
                  <p className="text-sm sm:text-base text-white/45 font-sans font-light leading-relaxed mt-2 max-w-lg">
                    {line.text}
                  </p>
                )}
                {line.style === 'cta' && (
                  <Link to="/inscription?espace=candidat" className="inline-block mt-8">
                    <Button size="lg" className="bg-white text-black hover:bg-white/90 font-sans text-sm font-medium px-10 py-6 rounded-full group">
                      {line.text.replace(' →', '')}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 sm:px-10 pb-8">
        {/* Scene progress bars */}
        <div className="flex gap-1.5 mb-5 max-w-md">
          {scenes.map((_, i) => (
            <button
              key={i}
              onClick={() => goToScene(i)}
              className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden cursor-pointer group"
            >
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width:
                    i < currentScene
                      ? '100%'
                      : i === currentScene
                        ? `${progress * 100}%`
                        : '0%',
                  transition: i < currentScene ? 'none' : 'width 50ms linear',
                }}
              />
            </button>
          ))}
        </div>

        {/* Play/pause + scene info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <span className="text-[11px] text-white/30 font-sans">
              {currentScene + 1} / {totalScenes}
            </span>
          </div>

          <span className="text-[10px] text-white/20 font-sans tracking-[0.1em] uppercase">
            Platform Overview
          </span>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
