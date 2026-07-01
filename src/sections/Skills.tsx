import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, Cpu, Orbit } from 'lucide-react';

const SKILL_DETAILS: Record<
  string,
  { level: string; desc: string; related: string[]; icon: React.ReactNode }
> = {
  HTML: {
    level: 'Advanced',
    desc: 'Structuring clean, accessible, and SEO-friendly document models. Experienced in building responsive JSX layouts for modern web frameworks like React.',
    related: ['HTML5', 'JSX', 'Semantic HTML', 'Web Accessibility (a11y)'],
    icon: <Shield className="w-5 h-5 text-[#ff5252]" />,
  },
  CSS: {
    level: 'Advanced',
    desc: 'Designing modern, immersive layouts with responsive styling systems. Proficient in CSS3 grid systems, flexbox, custom properties, and fluid keyframe animations.',
    related: ['CSS3', 'Flexbox / Grid', 'Custom Properties', 'Keyframe Animations'],
    icon: <Sparkles className="w-5 h-5 text-[#32ff7e]" />,
  },
  JavaScript: {
    level: 'Advanced',
    desc: 'Creating interactive client-side logic and highly optimized web interfaces. Experienced with ES6+ syntax, asynchronous operations, React component lifecycle, and 3D web graphics.',
    related: ['ES6+', 'React', 'Three.js', 'GSAP', 'API Integration', 'Promises & Async'],
    icon: <Cpu className="w-5 h-5 text-[#fffa65]" />,
  },
  C: {
    level: 'Advanced',
    desc: 'Systems-level programming and firmware engineering. Experienced in C/C++ embedded programming for ESP32 and Arduino microcontrollers, PID control loop logic, and hardware sensor integration via I2C.',
    related: ['Embedded Systems', 'C/C++', 'Arduino IDE / ESP32', 'I2C Communication', 'PID Control'],
    icon: <Cpu className="w-5 h-5 text-[#18dcff]" />,
  },
  'Tailwind CSS': {
    level: 'Advanced',
    desc: 'Designing utility-first fluid layouts quickly. Constructing custom theme configurations, responsive grids, and clean design systems.',
    related: ['Tailwind v4', 'Custom Themes', 'Utility Classes', 'Responsive Styling'],
    icon: <Shield className="w-5 h-5 text-[#7efff5]" />,
  },
  Java: {
    level: 'Intermediate',
    desc: 'Understanding OOP design principles and software architecture. Proficient in core Java data structures, algorithms, and application development flow.',
    related: ['OOP Principles', 'Data Structures', 'Algorithms', 'Software Design'],
    icon: <Cpu className="w-5 h-5 text-[#ff9f40]" />,
  },
  Python: {
    level: 'Advanced',
    desc: 'Developing machine learning models and data pipelines. Expert in training predictive regressions, processing datasets with Pandas/NumPy, and building Streamlit web applications.',
    related: ['Scikit-learn', 'Pandas & NumPy', 'Streamlit', 'Regression Modeling', 'Machine Learning'],
    icon: <Sparkles className="w-5 h-5 text-[#05c46b]" />,
  },
  Git: {
    level: 'Advanced',
    desc: 'Managing codebase versioning, orchestrating team branches, resolving merge conflicts, and configuring CI/CD deployment pipelines.',
    related: ['GitHub', 'Gitflow', 'Version Control', 'GitHub Actions'],
    icon: <Shield className="w-5 h-5 text-[#ff4d4d]" />,
  },
  'Artificial Intelligence': {
    level: 'Specialist / Advanced',
    desc: 'Designing neural networks, computer vision algorithms, NLP processing layers, and deploying generative models in the cloud.',
    related: ['Deep Learning', 'Computer Vision', 'NLP', 'TensorFlow', 'PyTorch'],
    icon: <Cpu className="w-5 h-5 text-[#7d5fff]" />,
  },
  'Machine Learning': {
    level: 'Specialist / Advanced',
    desc: 'Implementing predictive data pipelines, regression models, classification frameworks, and clustering algorithms.',
    related: ['Supervised Learning', 'Scikit-Learn', 'Feature Engineering', 'XGBoost'],
    icon: <Orbit className="w-5 h-5 text-[#ff3385]" />,
  },
};

export const Skills: React.FC = () => {
  const { zoomedPlanet, setZoomedPlanet, setCursorType } = useApp();
  const listRef = React.useRef<HTMLDivElement>(null);

  const skillNames = Object.keys(SKILL_DETAILS);

  // Auto-scroll the selected skill block into view when changed via 3D or list click
  React.useEffect(() => {
    if (zoomedPlanet && listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [zoomedPlanet]);

  return (
    <section
      id="skills"
      className="relative w-full min-h-screen flex flex-col justify-center items-center py-32 z-10 font-space-grotesk"
    >
      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center">
        {/* Centered Header */}
        <div className="text-center max-w-lg mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mt-1 text-white">Skills Universe</h2>
          <p className="text-xs text-white/70 mt-2 font-mono">CLICK A CORE TO TELEPORT CAMERA</p>
        </div>

        {/* Responsive Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start justify-center">

          {/* Left Column: Skill Selector List */}
          <div className="flex flex-col gap-6 w-full max-w-sm justify-self-center md:justify-self-end">
            <motion.div
              ref={listRef}
              data-lenis-prevent
              className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 scroll-smooth"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.03
                  }
                }
              }}
            >
              {skillNames.map((name) => {
                const isActive = zoomedPlanet === name;
                return (
                  <motion.button
                    key={name}
                    data-active={isActive}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { ease: [0.25, 1, 0.5, 1], duration: 0.45 } }
                    }}
                    whileHover={{ scale: 1.02, x: 6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.25 }}
                    onClick={() => setZoomedPlanet(isActive ? null : name)}
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-xs md:text-sm font-semibold tracking-wider transition-colors duration-300 flex items-center justify-between cursor-pointer ${isActive
                        ? 'bg-accent-blue/20 border-accent-blue text-white shadow-lg shadow-accent-blue/15 text-glow-blue'
                        : 'bg-[#121212]/40 border-white/5 text-white/70 hover:bg-[#121212]/60 hover:text-white hover:border-white/15'
                      }`}
                  >
                    <span>{name}</span>
                    <span className="opacity-60">{SKILL_DETAILS[name].icon}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Skill Detail Panel */}
          <div className="w-full max-w-sm justify-self-center md:justify-self-start">
            <AnimatePresence mode="wait">
              {zoomedPlanet ? (
                <motion.div
                  key={zoomedPlanet}
                  initial={{ opacity: 0, x: 30, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 30, scale: 0.97 }}
                  transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.45 }}
                  className="glass-accent rounded-2xl p-6 md:p-8 border border-accent-blue/30 relative text-center flex flex-col items-center"
                >
                  {/* Glowing Corner */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-accent-blue/20 rounded-tr-2xl blur-xl" />

                  <div className="flex flex-col items-center gap-2 mb-4">
                    {SKILL_DETAILS[zoomedPlanet].icon}
                    <h3 className="text-xl md:text-2xl font-bold text-white text-glow-blue">
                      {zoomedPlanet}
                    </h3>
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] font-mono text-highlight-cyan uppercase tracking-wider block mb-1">
                      Proficiency Core
                    </span>
                    <span className="text-sm font-semibold text-white/80">
                      {SKILL_DETAILS[zoomedPlanet].level}
                    </span>
                  </div>

                  <div className="mb-6">
                    <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider block mb-1">
                      System Description
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed font-normal">
                      {SKILL_DETAILS[zoomedPlanet].desc}
                    </p>
                  </div>

                  <div className="w-full">
                    <span className="text-[10px] font-mono text-white/60 uppercase tracking-wider block mb-2">
                      Related Matrix
                    </span>
                    <motion.div
                      className="flex flex-wrap gap-2 justify-center"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.04
                          }
                        }
                      }}
                    >
                      {SKILL_DETAILS[zoomedPlanet].related.map((tech) => (
                        <motion.span
                          key={tech}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1, transition: { ease: [0.25, 1, 0.5, 1], duration: 0.35 } }
                          }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.2 }}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 hover:border-highlight-cyan/40 transition-colors cursor-default"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>

                  {/* Reset Zoom Button */}
                  <button
                    onClick={() => setZoomedPlanet(null)}
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                    className="mt-6 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white/70 hover:text-white text-xs font-semibold rounded-xl transition-all font-mono tracking-wider cursor-pointer"
                  >
                    ORBIT BACK
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.4 }}
                  className="glass rounded-2xl p-6 md:p-8 border border-white/5 flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-4 text-white/60 animate-pulse">
                    <Orbit className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white/80 mb-2">Select Planet</h3>
                  <p className="text-xs text-white/70 max-w-[220px] leading-relaxed">
                    Click a planet in the 3D solar system or use the selector list to analyze the skill matrix.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
export default Skills;
