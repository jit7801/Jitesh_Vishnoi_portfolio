import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { GraduationCap, Award, Compass, TrendingUp } from 'lucide-react';

const JOURNEY = [
  {
    year: '2025 – Present',
    title: 'Bachelor of Technology (B.Tech)',
    subtitle: 'JIET Jodhpur',
    desc: 'Focusing on core computer science, engineering physics, software architectures, and mathematical modeling.',
    icon: <GraduationCap className="w-5 h-5 text-[#00f5ff]" />,
    color: 'border-[#00f5ff] text-[#00f5ff]',
  },
  {
    year: '2025 – Present',
    title: 'Bachelor of Science (B.Sc.) in AI & Data Science',
    subtitle: 'Indian Institute of Technology Jodhpur',
    desc: 'Specialized program concentrating on neural networks, machine learning algorithms, database paradigms, and statistical inference.',
    icon: <Award className="w-5 h-5 text-[#8b5cf6]" />,
    color: 'border-[#8b5cf6] text-[#8b5cf6]',
  },
  {
    year: '2026',
    title: 'Building AI Applications & Open Source',
    subtitle: 'Innovation Phase',
    desc: 'Creating open-source repositories, building real-world AI microservices, and contributing to the AI ecosystem.',
    icon: <Compass className="w-5 h-5 text-[#0055ff]" />,
    color: 'border-[#0055ff] text-[#0055ff]',
  },
  {
    year: '2028 & Beyond',
    title: 'Research & Entrepreneurship',
    subtitle: 'Future Horizon',
    desc: 'Exploring deep learning research, launching technology solutions, and driving career growth in advanced engineering.',
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
    color: 'border-emerald-400 text-emerald-400',
  },
];

export const Education: React.FC = () => {
  const { setCursorType } = useApp();

  return (
    <section
      id="education"
      className="relative w-full min-h-screen py-32 z-10 font-space-grotesk"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">Journey & Education</h2>
          <p className="text-xs text-white/70 mt-3 font-mono">CHRONICLES OF INTELLECTUAL PATHS</p>
        </div>

        {/* Timeline List */}
        <div className="relative border-l border-white/15 pl-6 md:pl-10 flex flex-col gap-12 ml-4">
          {JOURNEY.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-15% 0px -15% 0px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onMouseEnter={() => setCursorType('magnetic')}
              onMouseLeave={() => setCursorType('default')}
              className="relative group"
            >
              {/* Timeline Icon Node */}
              <div
                className={`absolute -left-[45px] md:-left-[59px] top-1 w-10 h-10 rounded-full bg-[#080808] border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 z-10 ${item.color
                  }`}
              >
                {item.icon}
              </div>

              {/* Card */}
              <div className="glass rounded-2xl p-6 md:p-8 border border-white/5 group-hover:border-white/10 hover:bg-[#121212]/50 transition-all duration-500">
                <span className="text-xs font-mono text-highlight-cyan tracking-wider mb-2 block">
                  {item.year}
                </span>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-glow-blue transition-all duration-300">
                  {item.title}
                </h3>
                <h4 className="text-xs font-semibold text-white/70 mb-4 font-mono tracking-wider uppercase">
                  {item.subtitle}
                </h4>
                <p className="text-xs md:text-sm text-white/80 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Education;
