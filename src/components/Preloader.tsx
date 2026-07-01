import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const loadingTexts = [
  'INITIALIZING QUANTUM LAYER...',
  'BOOTING SYSTEM CORE...',
  'GENERATING NEURAL MATRIX...',
  'CALIBRATING 3D SPACE...',
  'ESTABLISHING STORYLINE TETHER...',
  'SYSTEM READY.',
];

export const Preloader: React.FC = () => {
  const { loading, setLoading } = useApp();
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Increment progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500); // Small delay for smooth exit
          return 100;
        }
        // Random increments for a realistic feel
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [setLoading]);

  useEffect(() => {
    // Rotate through texts based on progress
    const stage = Math.floor((progress / 100) * (loadingTexts.length - 1));
    setTextIndex(stage);
  }, [progress]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 bg-[#080808] z-99999 flex flex-col items-center justify-center font-space-grotesk px-4 select-none"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />

          {/* Futuristic Scanner lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent opacity-20 absolute animate-[scan_3s_linear_infinite]" />
          </div>

          <style>{`
            @keyframes scan {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
          `}</style>

          <div className="relative flex flex-col items-center max-w-md w-full">
            {/* Glowing Ring */}
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-accent-blue/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute w-[110px] h-[110px] rounded-full border border-highlight-cyan/40 border-t-transparent border-b-transparent"
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />
              <div className="text-3xl font-bold tracking-widest text-glow-cyan text-[#00f5ff]">
                {progress}%
              </div>
            </div>

            {/* Loading text messages */}
            <div className="h-6 mb-4 flex items-center justify-center">
              <motion.p
                key={textIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs font-mono tracking-wider text-accent-blue"
              >
                {loadingTexts[textIndex]}
              </motion.p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-blue via-highlight-cyan to-accent-purple"
                style={{ width: `${progress}%` }}
                layoutId="progressBar"
              />
            </div>

            <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-white/40">
              <span>SYS_INIT: OK</span>
              <span>JITESH_VISHNOI_PORTFOLIO_V1.0</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
