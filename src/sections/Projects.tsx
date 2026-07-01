import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ExternalLink, Code } from 'lucide-react';

const PROJECTS = [
  {
    title: 'Predict.in',
    desc: 'A comprehensive House Price Predictor powered by machine learning regression. Allows users to estimate real estate valuations across cities by inputting parameters like area, BHK layout, age, and stories.',
    stack: ['Machine Learning', 'Python', 'Flask', 'React', 'Tailwind CSS'],
    github: 'https://github.com/jit7801/predict-in',
    live: 'https://predictin.netlify.app',
    case: '#',
    color: 'text-glow-blue text-[#0055ff]',
  },
  {
    title: 'Futuristo',
    desc: 'A futuristic cyber-styled dashboard ("Quantum Intelligence Interface v2.0") displaying system metrics such as core throughput, signal strength, and uptime. Integrates a floating Flowise AI chat assistant.',
    stack: ['React', 'Flowise AI', 'Tailwind CSS', 'Vite', 'Glassmorphism'],
    github: 'https://github.com/jit7801/futuristo',
    live: 'https://futuristo.netlify.app',
    case: '#',
    color: 'text-glow-cyan text-[#00f5ff]',
  },
  {
    title: 'SupportDesk',
    desc: 'An AI-powered customer support desk featuring a clean dashboard, third-party integrations, and a live chat widget. Integrates Lyro AI Agent via Tidio to automate client support workflows.',
    stack: ['React', 'Lyro AI', 'Tidio Integration', 'Tailwind CSS', 'Node.js'],
    github: 'https://github.com/jit7801/SupportDesk',
    live: 'https://chatbotbyjitesh.netlify.app',
    case: '#',
    color: 'text-glow-purple text-[#8b5cf6]',
  },
  {
    title: 'Self-Balancing Robot',
    desc: 'Designed and developed a two-wheeled self-balancing robot capable of maintaining stability in real time using sensor feedback and embedded programming. This project strengthened my understanding of robotics, control systems, and hardware-software integration.',
    stack: ['ESP32 / Arduino', 'C/C++', 'MPU6050 IMU Sensor', 'PID Control', 'Motor Drivers', 'Embedded Systems'],
    github: 'https://github.com/jit7801/self-balancing-robot',
    live: '#',
    case: '#',
    color: 'text-glow-orange text-[#ff9f40]',
  },
  {
    title: 'IoT Health Monitoring System',
    desc: 'Built an IoT-based health monitoring system capable of collecting sensor data and transmitting it wirelessly for real-time monitoring. The project focused on IoT communication, embedded systems, and reliable sensor integration.',
    stack: ['ESP32', 'IoT', 'Arduino IDE', 'C/C++', 'Health Sensors', 'Wi-Fi Communication'],
    github: 'https://github.com/jit7801/iot-health-monitor',
    live: '#',
    case: '#',
    color: 'text-glow-teal text-[#05c46b]',
  },
];

export const Projects: React.FC = () => {
  const { zoomedProject, setZoomedProject, setCursorType } = useApp();

  return (
    <section
      id="projects"
      className="relative w-full min-h-screen flex flex-col justify-center py-32 z-10 font-space-grotesk"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">Featured Projects</h2>
          <p className="text-xs text-white/70 mt-3 font-mono">HOVER TO OPEN CUBES · CLICK TO TELEPORT</p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {PROJECTS.map((project, idx) => {
            const isZoomed = zoomedProject === idx;
            return (
              <motion.div
                key={idx}
                onMouseEnter={() => {
                  setZoomedProject(idx);
                  setCursorType('magnetic');
                }}
                onMouseLeave={() => {
                  setZoomedProject(null);
                  setCursorType('default');
                }}
                onClick={() => {
                  setZoomedProject(isZoomed ? null : idx);
                }}
                className={`glass rounded-2xl p-6 md:p-8 border flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 relative ${
                  isZoomed ? 'border-highlight-cyan bg-[#121212]/80' : 'border-white/5 bg-[#121212]/30'
                }`}
              >
                {/* Hologram lines overlay */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-5 pointer-events-none bg-[linear-gradient(rgba(18,18,18,0)_95%,rgba(255,255,255,0.15)_95%)] bg-[size:100%_20px]" />

                <div>
                  {/* Title */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-mono text-white/60">PROJECT_0{idx + 1}</span>
                    <Code className="w-4 h-4 text-white/20" />
                  </div>

                  <h3 className={`text-xl md:text-2xl font-bold mb-4 transition-all duration-300 ${
                    isZoomed ? 'text-[#00f5ff] text-glow-cyan' : 'text-white'
                  }`}>
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-white/80 leading-relaxed font-normal mb-6">
                    {project.desc}
                  </p>
                </div>

                {/* Footer with Stack and Links */}
                <div>
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-white/75"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  {project.live !== '#' && (
                    <div className="flex gap-2 w-full pt-4 border-t border-white/5">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={() => setCursorType('hover')}
                        onMouseLeave={() => setCursorType('default')}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full py-2 rounded-xl bg-accent-blue/15 hover:bg-accent-blue/30 border border-accent-blue/30 text-white flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wider transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Projects;
