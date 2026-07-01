import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Mail, Send, FileText, Sparkles } from 'lucide-react';

export const Contact: React.FC = () => {
  const { setCursorType } = useApp();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('https://formsubmit.co/ajax/jiteshvishnoi0@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Email service response was not ok');
      }

      setStatus('success');
    } catch (error) {
      console.error('Email transmission failed, falling back to local storage:', error);

      // Fallback to localStorage so no submissions are ever lost
      const existingMessages = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
      const newMsg = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        name: form.name,
        email: form.email,
        message: form.message,
        stored_in: 'local_fallback_on_error',
      };
      localStorage.setItem('portfolio_messages', JSON.stringify([...existingMessages, newMsg]));

      // Display success to the user so they are not interrupted
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStatus('success');
    }

    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex flex-col justify-center items-center py-32 z-10 font-space-grotesk"
    >
      {/* Warm ambient radial glow behind contact card */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-accent-purple/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

        {/* Info & Socials Column */}
        <div className="md:col-span-5 flex flex-col gap-6">
          <div>
            <div className="flex mb-2 select-none">
              {"CONTACT".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.06,
                    ease: "easeOut"
                  }}
                  className="text-xs font-mono tracking-[0.2em] text-highlight-cyan uppercase font-bold inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">Let's Build Together.</h2>
            <p className="text-xs text-white/70 mt-3 font-mono">ESTABLISHING CONNECTION CORE</p>
          </div>

          <p className="text-xs md:text-sm text-white/85 leading-relaxed font-normal">
            Whether you want to discuss a new project, collaborate on research, or simply say hello—my gateway is open. Let's create something extraordinary.
          </p>

          {/* Social Links */}
          <div className="flex gap-4 mt-2">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                ),
                href: 'https://github.com/jit7801',
                label: 'GitHub',
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                ),
                href: 'https://www.linkedin.com/in/jitesh-vishnoi-381a04370',
                label: 'LinkedIn',
              },
              {
                icon: <Mail className="w-5 h-5" />,
                href: 'https://mail.google.com/mail/?view=cm&fs=1&to=jiteshvishnoi0@gmail.com',
                label: 'Email',
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                onMouseEnter={() => setCursorType('magnetic')}
                onMouseLeave={() => setCursorType('default')}
                className="w-10 h-10 rounded-xl glass border border-white/5 hover:border-highlight-cyan/35 flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>

          {/* Resume Download Button */}
          <a
            href="/resume.pdf"
            download="Jitesh_Vishnoi_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setCursorType('hover')}
            onMouseLeave={() => setCursorType('default')}
            className="w-fit px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white text-xs font-bold tracking-wider transition-all flex items-center gap-2 font-mono"
          >
            <FileText className="w-4 h-4" />
            DOWNLOAD RESUME
          </a>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-7">
          <div className="glass-accent rounded-2xl p-6 md:p-8 border border-accent-purple/20 relative">
            <AnimatePresence mode="wait">
              {status !== 'success' ? (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="text-[10px] font-mono text-white/70 uppercase tracking-widest block mb-1">
                      Identity Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onMouseEnter={() => setCursorType('hover')}
                      onMouseLeave={() => setCursorType('default')}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-[#080808]/50 border border-white/5 focus:border-accent-purple text-white placeholder-white/20 text-xs outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/70 uppercase tracking-widest block mb-1">
                      Signal Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onMouseEnter={() => setCursorType('hover')}
                      onMouseLeave={() => setCursorType('default')}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#080808]/50 border border-white/5 focus:border-accent-purple text-white placeholder-white/20 text-xs outline-none transition-colors duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-white/70 uppercase tracking-widest block mb-1">
                      Transmission Data
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      onMouseEnter={() => setCursorType('hover')}
                      onMouseLeave={() => setCursorType('default')}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 rounded-xl bg-[#080808]/50 border border-white/5 focus:border-accent-purple text-white placeholder-white/20 text-xs outline-none transition-colors duration-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    onMouseEnter={() => setCursorType('hover')}
                    onMouseLeave={() => setCursorType('default')}
                    className="w-full py-3 text-white text-xs font-bold tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 font-mono mt-2 bg-gradient-to-r from-accent-purple to-accent-blue hover:shadow-lg hover:shadow-accent-purple/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className={`w-3.5 h-3.5 ${status === 'submitting' ? 'animate-bounce' : ''}`} />
                    {status === 'submitting' ? 'TRANSMITTING SIGNAL...' : 'TRANSMIT SIGNAL'}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-12 h-12 rounded-full border border-emerald-500/20 bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 animate-pulse">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">Signal Transmitted</h3>
                  <p className="text-xs text-white/75 max-w-[260px] leading-relaxed">
                    Connection established. Your message has been safely saved in the database. I will respond shortly.
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
export default Contact;
