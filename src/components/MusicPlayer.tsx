import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Waves } from 'lucide-react';
import { motion } from 'motion/react';
import { TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <aside className="border-glitch bg-black/90 flex flex-col p-6 gap-6 relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      
      {/* Decorative Glitch Overlay */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-glitch-magenta/10 -rotate-12 translate-x-8 -translate-y-8" />

      <div className="flex items-start gap-6">
        <div className="w-20 h-20 bg-white p-1 border-4 border-glitch-magenta relative group">
          <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden">
             <Music className={`w-8 h-8 text-glitch-magenta ${isPlaying ? 'animate-bounce' : ''}`} />
             {isPlaying && (
               <div className="absolute inset-0 bg-glitch-magenta/20 animate-pulse pointer-events-none" />
             )}
          </div>
        </div>
        
        <div className="flex flex-col justify-center min-w-0">
          <h2 className="text-2xl font-bold leading-none text-white uppercase glitch truncate">
            {currentTrack.title}
          </h2>
          <p className="text-lg text-glitch-magenta font-black uppercase tracking-tighter truncate mt-2">
            {currentTrack.artist}
          </p>
          <div className="mt-2 flex gap-1">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="w-3 h-1 bg-glitch-cyan animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
             ))}
          </div>
        </div>
      </div>

      {/* Jarring Waveform */}
      <div className="h-10 flex items-center justify-between gap-[2px]">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={isPlaying ? { height: [`${10 + Math.random() * 90}%`, `${10 + Math.random() * 90}%`] } : { height: '10%' }}
            transition={{ repeat: Infinity, duration: 0.3, delay: i * 0.02 }}
            className={`w-1 font-bold ${i % 3 === 0 ? 'bg-white' : i % 2 === 0 ? 'bg-glitch-cyan' : 'bg-glitch-magenta'}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {/* Raw Progress Bar */}
        <div className="w-full h-4 bg-white/10 border-2 border-white/20 p-0.5">
          <motion.div
            className="h-full bg-white relative overflow-hidden"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          >
            <div className="absolute inset-0 bg-glitch-cyan opacity-40 animate-pulse" />
          </motion.div>
        </div>
        
        <div className="flex items-center justify-between gap-4">
          <button onClick={handlePrev} className="text-xl font-black text-white hover:text-glitch-cyan transition-colors border-b-4 border-glitch-cyan pb-1">
            PREV_CHUNK
          </button>
          
          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-white text-black flex items-center justify-center hover:bg-glitch-cyan hover:scale-110 active:scale-95 transition-all shadow-xl border-glitch"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>

          <button onClick={handleNext} className="text-xl font-black text-white hover:text-glitch-magenta transition-colors border-b-4 border-glitch-magenta pb-1">
            NEXT_CHUNK
          </button>
        </div>
      </div>

      {/* Raw Track List */}
      <div className="border-t-2 border-white/20 pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Waves className="w-4 h-4 text-glitch-cyan" />
          <h3 className="text-[12px] font-black uppercase text-glitch-cyan">CORE_LIBRARY :: {TRACKS.length}</h3>
        </div>
        
        <div className="space-y-1 max-h-[120px] overflow-y-auto font-mono text-[11px] lowercase scroll-auto">
          {TRACKS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => setCurrentTrackIndex(index)}
              className={`w-full flex items-center justify-between px-3 py-1.5 transition-all ${
                currentTrackIndex === index 
                ? 'bg-glitch-cyan text-black font-bold' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="truncate flex-grow text-left">
                {index === currentTrackIndex ? '> ' : '  '}{track.title}_{index}
              </span>
              <span className="opacity-50 ml-4">{track.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

