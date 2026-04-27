/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Terminal, Cpu, Database } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('snake-high-score') || '0'));

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="w-full h-screen bg-glitch-bg flex flex-col items-center justify-center relative select-none p-4 overflow-hidden">
      {/* Background Static & Noise */}
      <div className="absolute inset-0 bg-scanner opacity-20 pointer-events-none z-50" />
      <div className="absolute inset-0 bg-black mix-blend-overlay opacity-10 pointer-events-none" />

      {/* Main Machine Frame */}
      <div className="w-full max-w-6xl h-full flex flex-col gap-4 tearing-effect">
        
        {/* Terminal Header */}
        <header className="flex items-center justify-between p-4 border-glitch bg-black/80">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-glitch-cyan text-black">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-glitch uppercase glitch">
                SYSTEM_PULSE_OVERRIDE
              </h1>
              <div className="flex gap-4 text-[10px] font-mono text-glitch-cyan opacity-60">
                <span>[ STATUS: UNSTABLE ]</span>
                <span>[ CORE_CORE: 0x8F ]</span>
              </div>
            </div>
          </div>

          <div className="flex gap-10">
            <div className="text-right">
              <p className="text-[12px] uppercase text-glitch-magenta font-bold">ARCADE_LEGACY</p>
              <p className="text-4xl font-sans tracking-tight text-white">{highScore.toString().padStart(6, '0')}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] uppercase text-glitch-cyan font-bold">NEURAL_YIELD</p>
              <p className="text-4xl font-sans tracking-tight text-white">{score.toString().padStart(6, '0')}</p>
            </div>
          </div>
        </header>

        {/* Neural Grid + Control Deck */}
        <div className="flex-grow grid grid-cols-12 gap-4">
          
          {/* Game Deck */}
          <main className="col-span-8 border-glitch bg-black relative flex flex-col p-2">
             <div className="flex justify-between items-center px-4 py-1 text-[10px] font-mono text-white/40 border-b border-white/10 mb-2">
                <span>VIEWPORT_01 :: RELATIVE_COORD</span>
                <span className="animate-pulse">RECV_DATA...</span>
             </div>
             <div className="flex-grow flex items-center justify-center p-4">
               <SnakeGame onScoreUpdate={handleScoreUpdate} />
             </div>
             <div className="absolute top-1/2 left-2 -translate-y-1/2 flex flex-col gap-2">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-glitch-cyan/20 rounded-full" />
                ))}
             </div>
          </main>

          {/* Service Deck */}
          <aside className="col-span-4 flex flex-col gap-4">
            <MusicPlayer />
            
            <section className="flex-grow border-glitch bg-black/60 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Database className="w-5 h-5 text-glitch-magenta" />
                <h3 className="text-xl font-bold uppercase text-glitch-magenta tracking-tighter">Machine_Log</h3>
              </div>
              
              <div className="space-y-4 font-mono text-xs text-white/50 lowercase">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>mem_leak:</span>
                  <span className="text-glitch-magenta">detected</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>sync_status:</span>
                  <span className="text-glitch-cyan">0x00FFED</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span>packet_loss:</span>
                  <span className="text-red-500">12.5%</span>
                </div>
                
                <div className="mt-auto pt-4">
                  <div className="mb-2 flex justify-between uppercase font-bold text-[10px]">
                    <span className="text-glitch-cyan">Energy_Drain</span>
                    <span className="text-white">88%</span>
                  </div>
                  <div className="w-full h-4 bg-white/5 border border-white/10 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '88%' }}
                      className="h-full bg-glitch-magenta"
                    />
                  </div>
                </div>
              </div>
            </section>
          </aside>

        </div>

        {/* Bottom Status Bar */}
        <footer className="h-8 bg-white text-black flex items-center px-4 justify-between text-[11px] font-bold uppercase italic">
          <div className="flex gap-6">
            <span>[ SYSTEM PORT: 0x3 ]</span>
            <span>[ CONNECTION: SECURE ]</span>
          </div>
          <div className="flex gap-4">
            <span className="animate-pulse">CRITICAL_OVERHEAT_WARNING</span>
            <Terminal className="w-3 h-3 self-center" />
          </div>
        </footer>
      </div>
    </div>
  );
}


