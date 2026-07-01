import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const milestones = [
  {
    title: 'Curiosity',
    side: 'left',
    description: 'It began with a simple question: How do computers think? This curiosity drove me to explore the inner workings of digital systems and write my very first lines of code.',
    year: '2022',
  },
  {
    title: 'Learning Programming',
    side: 'right',
    description: 'Began my programming journey with Python and SQL, developing a solid understanding of programming fundamentals, database management, and analytical thinking that laid the groundwork for future projects.',
    year: '2023',
  },
  {
    title: 'Building Websites',
    side: 'left',
    description: 'I fell in love with visual creation. Mastering HTML, CSS and JavaScript, I started designing and building responsive, interactive front-ends with modern layouts.',
    year: '2024',
  },
  {
    title: 'Discovering AI',
    side: 'right',
    description: 'Joining IIT Jodhpur opened the gates to advanced computation. I discovered Artificial Intelligence, learning how neural networks process information and make decisions.',
    year: '2025',
  },
  {
    title: 'Machine Learning',
    side: 'left',
    description: 'Specializing in AI & Data Science, I built predictive models and analyzed complex datasets, turning mathematical theory into functional intelligence.',
    year: '2025',
  },
  {
    title: 'Creating Real Projects',
    side: 'right',
    description: 'Bringing it all together. I began developing intelligent web applications that combine robust machine learning backends with beautiful, immersive 3D interfaces.',
    year: '2025',
  },
  {
    title: 'Future Innovations',
    side: 'center',
    description: 'Bridging the gap between design, code, and intelligence. I am committed to pushing the boundaries of technology to create the next generation of digital experiences.',
    year: '2026 & Beyond',
  },
];

export const Story: React.FC = () => {
  const { setCursorType } = useApp();

  return (
    <section id="story" className="relative w-full min-h-screen py-32 z-10 font-space-grotesk">
      {/* Visual connection line for mobile */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-accent-blue/20 to-transparent md:hidden" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col gap-16 md:gap-24">
        {/* Title Block */}
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">My Story</h2>
          <p className="text-xs text-white/70 mt-3 font-mono">SCROLL TO TRACE THE PATHWAY</p>
        </div>

        {/* About Me Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-8 md:p-10 border border-white/5 max-w-4xl mx-auto relative overflow-hidden group hover:border-accent-blue/20 transition-all duration-500"
        >
          {/* Decorative glowing gradient orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-highlight-cyan/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Avatar / Initials container */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-accent-blue via-highlight-cyan to-accent-purple p-[2px] shadow-2xl relative">
                <div className="w-full h-full rounded-full bg-[#0c0f1d] flex items-center justify-center">
                  <span className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-accent-blue to-highlight-cyan bg-clip-text text-transparent tracking-widest">JV</span>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold mt-4 text-white">Jitesh Vishnoi</h3>
              <p className="text-[10px] font-mono text-highlight-cyan tracking-widest uppercase mt-1">AI & Software Engineer</p>
            </div>

            {/* Profile Bio Details */}
            <div className="md:col-span-8 flex flex-col gap-4 text-left">
              <div className="border-l-2 border-highlight-cyan/30 pl-4">
                <p className="text-sm md:text-base text-white/80 leading-relaxed font-normal">
                  I am a computer science engineer specializing in **Artificial Intelligence** and **Data Science**. Currently pursuing a B.Tech from **JIET Jodhpur** alongside a B.Sc. in AI & Data Science from the **Indian Institute of Technology, Jodhpur**.
                </p>
              </div>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed font-normal">
                I build intelligent applications that combine deep learning pipelines with premium user interfaces. From machine learning models (like home price predictors) to interactive dashboards and automated customer support agents, my projects translate advanced algorithms into functional digital solutions.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-2">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-white/60 uppercase tracking-wider">GitHub Nodes</span>
                  <a
                    href="https://github.com/jit7801"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                    className="text-xs font-semibold text-white/70 hover:text-highlight-cyan transition-colors mt-0.5"
                  >
                    @jit7801
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-white/60 uppercase tracking-wider">LinkedIn gateway</span>
                  <a
                    href="https://www.linkedin.com/in/jitesh-vishnoi-381a04370"
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                    className="text-xs font-semibold text-white/70 hover:text-highlight-cyan transition-colors mt-0.5"
                  >
                    jitesh-vishnoi
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono text-white/60 uppercase tracking-wider">Digital core</span>
                  <a
                    href="mailto:jiteshvishnoi0@gmail.com"
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                    className="text-xs font-semibold text-white/70 hover:text-highlight-cyan transition-colors mt-0.5"
                  >
                    jiteshvishnoi0@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline Milestones */}
        <div className="flex flex-col gap-16 md:gap-24 relative mt-8">
          {milestones.map((m, idx) => {
            const isLeft = m.side === 'left';
            const isCenter = m.side === 'center';

            return (
              <div
                key={idx}
                className={`flex w-full ${isCenter ? 'justify-center' : isLeft ? 'justify-start' : 'justify-end'
                  }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-20% 0px -20% 0px' }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                  onMouseEnter={() => setCursorType('magnetic')}
                  onMouseLeave={() => setCursorType('default')}
                  className={`w-full md:w-[46%] ${isCenter ? 'md:w-[60%] text-center' : ''
                    } glass rounded-2xl p-6 md:p-8 border border-white/5 relative group hover:border-accent-blue/30 transition-all duration-500`}
                >
                  {/* Neon side indicator */}
                  <div
                    className={`absolute top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-accent-blue to-highlight-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isLeft ? '-left-[2px]' : '-right-[2px]'
                      } ${isCenter ? 'left-0 right-0 mx-auto h-[3px] top-0 bottom-auto w-1/3' : ''}`}
                  />

                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-highlight-cyan tracking-wider bg-highlight-cyan/10 px-2.5 py-0.5 rounded-full border border-highlight-cyan/25">
                      {m.year}
                    </span>
                    <span className="text-[10px] font-mono text-white/60">0{idx + 1}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-glow-blue transition-all duration-300">
                    {m.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/80 leading-relaxed font-normal">
                    {m.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Story;
