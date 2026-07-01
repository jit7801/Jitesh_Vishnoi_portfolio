import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Terminal } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'system' | 'welcome';
}

const CanvasMatrix: React.FC<{ active: boolean; onComplete: () => void }> = ({ active, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = canvas.parentElement?.clientHeight || 320;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const columns = Math.floor(canvas.width / 14);
    const drops = Array(columns).fill(1);
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";

    let animationFrameId: number;
    let frameCount = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 8, 8, 0.08)'; // trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '12px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        const y = drops[i] * 14;

        // Lead character highlighted in white
        ctx.fillStyle = '#ffffff';
        ctx.fillText(char, x, y);

        // Trail in cyber green
        ctx.fillStyle = '#00ff7f';
        ctx.fillText(char, x, y - 14);

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frameCount++;
      if (frameCount < 150) { // ~2.5 seconds at 60fps
        animationFrameId = requestAnimationFrame(draw);
      } else {
        onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [active, onComplete]);

  if (!active) return null;
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 rounded-3xl z-30 pointer-events-none bg-[#080808]/95"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export const Playground: React.FC = () => {
  const { setCursorType } = useApp();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'QUANTUM OS v3.8.4 - ACTIVE GATEWAY CONNECTION', type: 'system' },
    { text: '      _ ___ _____ _____ ____  _   _ \n     | |_ _|_   _| ____/ ___|| | | |\n  _  | || |  | | |  _| \\___ \\| |_| |\n | |_| || |  | | | |___ ___) |  _  |\n  \\___/|___| |_| |_____|____/|_| |_|', type: 'welcome' },
    { text: 'System terminal established. Enter "help" to scan index.', type: 'output' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, isProcessing]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, { text: `guest@jitesh-portfolio ~ $ ${trimmed}`, type: 'input' }]);
    
    const newCmdHistory = [trimmed, ...commandHistory];
    setCommandHistory(newCmdHistory);
    setHistoryIndex(-1);
    setInput('');

    const command = trimmed.toLowerCase().split(' ')[0];

    let procMsg = 'System: Parsing instruction...';
    if (command === 'skills') procMsg = 'System: Scanning technical matrix...';
    else if (command === 'projects') procMsg = 'System: Fetching project metadata...';
    else if (command === 'about' || command === 'bio') procMsg = 'System: Resolving identity database...';
    else if (command === 'resume') procMsg = 'System: Re-routing to secure download server...';
    else if (command === 'contact') procMsg = 'System: Opening portal communications...';
    else if (command === 'matrix') procMsg = 'System: Initializing sequence override...';

    setIsProcessing(true);
    setProcessingText(procMsg);

    setTimeout(() => {
      let outputs: TerminalLine[] = [];

      switch (command) {
        case 'help':
        case '?':
          outputs = [
            { text: '--- AVAILABLE COMMANDS ---', type: 'system' },
            { text: '  about / bio    : Brief identity summary of Jitesh Vishnoi', type: 'output' },
            { text: '  skills         : Lists programming and hardware skills', type: 'output' },
            { text: '  projects       : Lists key featured engineering projects', type: 'output' },
            { text: '  resume         : Downloads Jitesh\'s professional resume (PDF)', type: 'output' },
            { text: '  matrix         : Boots up a quantum digital rain sequence', type: 'output' },
            { text: '  clear / cls    : Clears the terminal screen buffer', type: 'output' },
            { text: '  contact        : Shows communication gateways/emails', type: 'output' },
          ];
          break;
        case 'about':
        case 'bio':
          outputs = [
            { text: '--- IDENTITY DATA READOUT ---', type: 'system' },
            { text: 'Name       : Jitesh Vishnoi', type: 'output' },
            { text: 'Education  : B.Tech in CSE (AI & ML) & B.Sc in AI & Data Science (IIT Jodhpur)', type: 'output' },
            { text: 'Focus      : Advanced Machine Learning, Embedded Systems, and Immersive 3D Web Graphics.', type: 'output' },
            { text: 'Motto      : Crafting elegant software systems that mesh physics, intelligence, and modern design.', type: 'output' },
          ];
          break;
        case 'skills':
          outputs = [
            { text: '--- SKILL MATRIX READOUT ---', type: 'system' },
            { text: '[Languages]   Python, SQL, C, C++, Java, JavaScript (ES6+), HTML5, CSS3', type: 'output' },
            { text: '[Databases]   MySQL, Vercel', type: 'output' },
            { text: '[Embedded]    ESP32, Arduino, MPU6050, MAX30102, PID Control, Blynk.cloud', type: 'output' },
            { text: '[AI/ML]       Scikit-learn, Regression Modeling, Neural Networks, Pandas, NumPy', type: 'output' },
          ];
          break;
        case 'projects':
          outputs = [
            { text: '--- PROJECTS DATA BUFFER ---', type: 'system' },
            { text: '1. Predict.in : House Price Predictor powered by ML regression (Python, Flask, React)', type: 'output' },
            { text: '2. Futuristo  : Cyber system telemetry dashboard with Flowise AI (React, Tailwind)', type: 'output' },
            { text: '3. SupportDesk: AI-supported customer desk via Tidio integration (React, Lyro AI)', type: 'output' },
            { text: '4. Self-Balancing Robot: Physics stabilization hardware (C++, ESP32, PID control)', type: 'output' },
            { text: '5. IoT Health Monitor: Biosensor telemetry system (ESP32, MAX30102, Blynk)', type: 'output' },
          ];
          break;
        case 'resume':
          outputs = [
            { text: 'System: Secure file transmission payload ready.', type: 'system' },
            { text: 'Link: Download triggered for Jitesh_Vishnoi_Resume.pdf', type: 'welcome' },
          ];
          const downloadLink = document.createElement('a');
          downloadLink.href = '/resume.pdf';
          downloadLink.download = 'Jitesh_Vishnoi_Resume.pdf';
          downloadLink.target = '_blank';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          break;
        case 'clear':
        case 'cls':
          setHistory([]);
          setIsProcessing(false);
          return;
        case 'contact':
          outputs = [
            { text: '--- GATEWAY CHANNELS ---', type: 'system' },
            { text: 'Email     : jiteshvishnoi0@gmail.com', type: 'output' },
            { text: 'LinkedIn  : linkedin.com/in/jitesh-vishnoi-381a04370', type: 'output' },
            { text: 'GitHub    : github.com/jit7801', type: 'output' },
            { text: 'Action    : Or simply submit a transmission in the form below!', type: 'welcome' },
          ];
          break;
        case 'matrix':
          outputs = [];
          setIsMatrixActive(true);
          break;
        default:
          outputs = [
            { text: `Error: Command "${command}" not recognized.`, type: 'error' },
            { text: 'Type "help" or "?" for all available instructions.', type: 'output' },
          ];
          break;
      }

      setHistory(prev => [...prev, ...outputs]);
      setIsProcessing(false);
    }, 450);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInput(commandHistory[nextIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const prevIndex = historyIndex - 1;
      if (prevIndex >= 0) {
        setHistoryIndex(prevIndex);
        setInput(commandHistory[prevIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <section
      id="playground"
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 py-24 md:py-32 z-10 font-space-grotesk text-center"
    >
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 245, 255, 0.35);
        }
        @keyframes crt-flicker {
          0% { opacity: 0.94; }
          50% { opacity: 1; }
          100% { opacity: 0.96; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .crt-glow {
          box-shadow: 0 0 45px rgba(0, 245, 255, 0.35), inset 0 0 25px rgba(0, 245, 255, 0.1);
          animation: crt-flicker 0.18s infinite;
        }
        .crt-glow:hover {
          box-shadow: 0 0 65px rgba(0, 245, 255, 0.55), inset 0 0 35px rgba(0, 245, 255, 0.15);
        }
      `}</style>

      <div className="max-w-3xl flex flex-col items-center gap-6 w-full">
        {/* Title */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 text-white">Interactive Console</h2>
          <p className="text-xs text-white/60 mt-2 font-mono">RETRO PORTFOLIO COMMAND SHELL</p>
        </div>

        <p className="text-xs md:text-sm text-white/85 leading-relaxed font-normal max-w-xl">
          Boot up the command terminal below. Access data indexes, check skills, download my resume, or run visual commands directly through our console gateway.
        </p>

        {/* CRT Shell Frame */}
        <div 
          onClick={handleContainerClick}
          onMouseEnter={() => setCursorType('hover')}
          onMouseLeave={() => setCursorType('default')}
          className="w-full max-w-2xl bg-[#080808]/94 rounded-3xl border border-highlight-cyan/35 p-5 md:p-6 shadow-2xl relative group transition-all duration-500 flex flex-col mt-4 select-none cursor-text crt-glow"
        >
          {/* Canvas Matrix Overlay */}
          <CanvasMatrix active={isMatrixActive} onComplete={() => {
            setIsMatrixActive(false);
            setHistory(prev => [
              ...prev, 
              { text: 'System: Matrix override sequence completed. Standard terminal control restored.', type: 'system' }
            ]);
          }} />

          {/* CRT Screen Scanlines & Ambient Noise Glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden z-20">
            {/* CRT grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_95%,rgba(0,245,255,0.12)_95%)] bg-[size:100%_4px]" />
            {/* Pulsing scanline rolling down the screen */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.08] z-20"
              style={{
                background: 'linear-gradient(rgba(18,18,18,0) 0%, rgba(0, 245, 255, 0.8) 10%, rgba(18,18,18,0) 20%)',
                animation: 'scanline 5s linear infinite'
              }}
            />
            {/* Ambient CRT screen glow */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-45 group-hover:opacity-60 transition-opacity duration-500" 
              style={{ background: 'radial-gradient(circle at center, rgba(0, 245, 255, 0.08) 0%, rgba(0, 0, 0, 0) 80%)' }}
            />
          </div>

          {/* Terminal Window Header Bar */}
          <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4 w-full text-white/50 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              <span className="text-[10px] font-mono tracking-widest uppercase ml-2 text-white/45">quantum_shell.sh</span>
            </div>
            <Terminal className="w-3.5 h-3.5 opacity-85 text-highlight-cyan" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 245, 255, 0.5))' }} />
          </div>

          {/* Terminal Log Output Buffer */}
          <div 
            ref={containerRef}
            className="flex-1 w-full h-[280px] overflow-y-auto font-mono text-left text-xs flex flex-col gap-1.5 scrollbar-thin select-text pr-2 z-10"
          >
            {history.map((line, index) => {
              let colorClass = 'text-white/85';
              if (line.type === 'welcome') colorClass = 'text-[#00ff7f] font-bold text-glow-green';
              if (line.type === 'error') colorClass = 'text-[#ff5252] font-semibold';
              if (line.type === 'system') colorClass = 'text-highlight-cyan font-semibold text-glow-cyan';
              if (line.type === 'input') colorClass = 'text-white';
              
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.25 }}
                  className={`whitespace-pre-wrap ${colorClass}`}
                  style={line.type === 'welcome' ? { textShadow: '0 0 10px rgba(0, 255, 127, 0.9), 0 0 4px rgba(0, 255, 127, 0.5)' } : line.type === 'system' ? { textShadow: '0 0 10px rgba(0, 245, 255, 0.9), 0 0 4px rgba(0, 245, 255, 0.5)' } : undefined}
                >
                  {line.text}
                </motion.div>
              );
            })}

            {/* Simulated loading indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-highlight-cyan font-mono text-xs italic mt-1 text-glow-cyan"
                style={{ textShadow: '0 0 10px rgba(0, 245, 255, 0.9), 0 0 4px rgba(0, 245, 255, 0.5)' }}
              >
                {processingText}
              </motion.div>
            )}
          </div>

          {/* Prompt / Input Row */}
          <div className="flex items-center gap-2 border-t border-white/10 pt-3 mt-3 w-full text-xs font-mono select-none z-10">
            <span className="text-[#00f5ff] shrink-0 text-glow-cyan" style={{ textShadow: '0 0 10px rgba(0, 245, 255, 0.9)' }}>guest@jitesh-portfolio ~ $</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isMatrixActive || isProcessing}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono caret-transparent w-full text-xs focus:ring-0 focus:border-none p-0 m-0"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            {/* Custom blinking green block cursor */}
            <span className="w-2 h-4 bg-[#00ff7f] animate-blink shrink-0 shadow-[0_0_10px_rgba(0,255,127,1),0_0_20px_rgba(0,255,127,0.6)]" />
          </div>
        </div>

        {/* Hotkeys indicator */}
        <p className="text-[10px] text-white/40 leading-relaxed font-mono mt-2 select-none">
          HINT: TYPE <span className="text-highlight-cyan font-bold">help</span> TO VIEW GATEWAY LOGS · USE <span className="text-highlight-cyan font-bold">↑/↓</span> ARROWS TO RECALL COMMAND HISTORY
        </p>
      </div>
    </section>
  );
};
export default Playground;
