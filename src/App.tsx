import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { AppProvider, useApp } from './context/AppContext';
import SceneContainer from './three/SceneContainer';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';

// Section overlays
import Hero from './sections/Hero';
import Story from './sections/Story';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Education from './sections/Education';
import Playground from './sections/Playground';
import Contact from './sections/Contact';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function AppContent() {
  const { setActiveSection, loading } = useApp();

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Sync Lenis with GSAP ScrollTrigger via the GSAP ticker (prevents double-ticking)
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. Set up GSAP ScrollTriggers for each chapter section
    const sections = ['hero', 'story', 'skills', 'projects', 'education', 'playground', 'contact'];

    sections.forEach((id, index) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(index);
          }
        },
      });
    });

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setActiveSection]);

  return (
    <div className="relative text-white select-none">
      {/* 1. Global Preloader */}
      <Preloader />

      {/* 2. Custom Cinematic Cursor */}
      <CustomCursor />

      {/* 3. Floating Navigation bar & Scroll Progress */}
      {!loading && <Navbar />}

      {/* 4. Background 3D Universe Canvas & Ambient Dimmer Overlay */}
      <SceneContainer />
      <div className="fixed inset-0 bg-vignette-overlay pointer-events-none z-0" />

      {/* 5. Scrollable HTML Overlays */}
      <main className="relative z-10 lenis-target">
        <Hero />
        <Story />
        <Skills />
        <Projects />
        <Education />
        <Playground />
        <Contact />

        {/* Clean Static Footer */}
        <footer className="w-full py-8 border-t border-white/5 flex items-center justify-center text-xs font-mono text-white/30 max-w-5xl mx-auto px-6 relative z-10 bg-[#080808]">
          <div className="text-center select-text">
            <p className="tracking-wider">
              Copyright &copy; 2026 <span className="text-white">Jitesh Vishnoi</span>. All Rights Reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
