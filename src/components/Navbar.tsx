import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const navItems = [
  { label: 'Core', index: 0, id: 'hero' },
  { label: 'Story', index: 1, id: 'story' },
  { label: 'Skills', index: 2, id: 'skills' },
  { label: 'Projects', index: 3, id: 'projects' },
  { label: 'Journey', index: 4, id: 'education' },
  { label: 'Sandbox', index: 5, id: 'playground' },
  { label: 'Contact', index: 6, id: 'contact' },
];

export const Navbar: React.FC = () => {
  const { activeSection, setCursorType } = useApp();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate scroll progress percentage
      if (totalScrollHeight > 0) {
        setScrollProgress((currentScrollY / totalScrollHeight) * 100);
      }

      // Navbar auto-hide logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false); // Scrolling down, hide
      } else {
        setVisible(true); // Scrolling up, show
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/5 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-blue via-highlight-cyan to-accent-purple origin-left"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Navbar */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-3xl font-space-grotesk"
          >
            <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl border border-white/5">
              {/* Logo / Brand */}
              <div
                className="text-sm font-bold tracking-wider cursor-pointer flex items-center gap-2"
                onClick={() => handleNavClick('hero')}
                onMouseEnter={() => setCursorType('hover')}
                onMouseLeave={() => setCursorType('default')}
              >
                <span className="w-2 h-2 rounded-full bg-highlight-cyan animate-pulse" />
                <span className="bg-gradient-to-r from-white to-white/75 bg-clip-text text-transparent font-semibold">
                  JV.CORE
                </span>
              </div>

              {/* Nav Links */}
              <ul className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.index;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleNavClick(item.id)}
                        onMouseEnter={() => setCursorType('hover')}
                        onMouseLeave={() => setCursorType('default')}
                        className={`relative px-4 py-1.5 text-xs tracking-wider font-medium transition-colors duration-300 rounded-full ${
                          isActive ? 'text-white' : 'text-white/50 hover:text-white/80'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeNavBg"
                            className="absolute inset-0 bg-accent-blue/15 border border-accent-blue/30 rounded-full -z-10"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Menu Button - simple indicator of current section */}
              <div className="md:hidden text-xs font-semibold text-highlight-cyan px-3 py-1 bg-highlight-cyan/10 border border-highlight-cyan/20 rounded-full">
                {navItems[activeSection]?.label || 'Core'}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
