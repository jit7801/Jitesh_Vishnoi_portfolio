import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCursorType } = useApp();

  const titleWords = "Hi, I'm Jitesh Vishnoi".split(" ");
  const titles = ["AI Enthusiast", "Web Developer", "Creative Technologist", "Problem Solver"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.4 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col justify-center items-center px-6 md:px-12 select-none z-10 font-space-grotesk"
    >
      {/* Content wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl flex flex-col gap-6 items-center text-center"
      >
        {/* Animated Headline */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {titleWords.map((word, idx) => (
            <motion.h1
              key={idx}
              variants={childVariants}
              className="text-5xl md:text-8xl font-bold tracking-tight text-white"
            >
              {word}
            </motion.h1>
          ))}
        </div>

        {/* Dynamic Titles */}
        <motion.div variants={childVariants} className="flex flex-wrap gap-3 md:gap-4 items-center justify-center mt-2">
          {titles.map((title, idx) => (
            <React.Fragment key={title}>
              <span
                className="text-sm md:text-lg font-medium text-white/80 tracking-wider hover:text-highlight-cyan transition-colors duration-300"
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
              >
                {title}
              </span>
              {idx < titles.length - 1 && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/50 hidden sm:inline-block" />
              )}
            </React.Fragment>
          ))}
        </motion.div>

        {/* Subtitle */}
        <motion.p
          variants={childVariants}
          className="text-sm md:text-base text-white/70 max-w-lg mt-4 font-normal leading-relaxed mx-auto"
        >
          Exploring the intersection of advanced artificial intelligence, 3D graphics, and immersive web experiences. Welcome to my digital universe.
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer text-white/60 hover:text-highlight-cyan transition-colors duration-300"
        onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
        onMouseEnter={() => setCursorType('hover')}
        onMouseLeave={() => setCursorType('default')}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to Begin</span>
        <ArrowDown className="w-4 h-4" />
      </motion.div>
    </section>
  );
};
export default Hero;
