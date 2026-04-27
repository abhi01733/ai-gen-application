import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Point } from '../types';
import { GRID_SIZE, INITIAL_SPEED, MIN_SPEED, SPEED_INCREMENT } from '../constants';
import { Play, RotateCcw } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export default function SnakeGame({ onScoreUpdate }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem('snake-high-score') || '0'),
    isGameOver: false,
    isPaused: true,
  });

  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 1, y: 0 });

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef<number>(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setGameState(prev => ({ ...prev, score: 0, isGameOver: false, isPaused: false }));
    onScoreUpdate(0);
    speedRef.current = INITIAL_SPEED;
  };

  const gameOver = () => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.score, prev.highScore);
      localStorage.setItem('snake-high-score', newHighScore.toString());
      return { ...prev, isGameOver: true, highScore: newHighScore };
    });
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE,
      };

      setDirection(nextDirection);

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = gameState.score + 10;
        setGameState(prev => ({ ...prev, score: newScore }));
        onScoreUpdate(newScore);
        setFood(generateFood(newSnake));
        speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, generateFood, gameState.score, onScoreUpdate]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setNextDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setNextDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setNextDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setNextDirection({ x: 1, y: 0 }); break;
        case ' ': setGameState(prev => ({ ...prev, isPaused: !prev.isPaused })); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Jarring Grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * size, 0); ctx.lineTo(i * size, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * size); ctx.lineTo(canvas.width, i * size); ctx.stroke();
    }

    // Draw Snake Segments (Cyan/Magenta Glitch)
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = isHead ? '#00ffff' : i % 2 === 0 ? '#ff00ff' : '#ffffff';
      
      ctx.beginPath();
      ctx.rect(
        segment.x * size,
        segment.y * size,
        size,
        size
      );
      ctx.fill();

      if (isHead) {
        ctx.fillStyle = '#000';
        ctx.fillRect(segment.x * size + 4, segment.y * size + 4, 4, 4);
        ctx.fillRect(segment.x * size + size - 8, segment.y * size + 4, 4, 4);
      }
    });

    // Draw Food (White Flash)
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.beginPath();
    ctx.rect(
      food.x * size + 2,
      food.y * size + 2,
      size - 4,
      size - 4
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const gameLoop = useCallback((time: number) => {
    if (!gameState.isPaused && !gameState.isGameOver) {
      if (time - lastUpdateRef.current > speedRef.current) {
        moveSnake();
        lastUpdateRef.current = time;
      }
    }
    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPaused, gameState.isGameOver, moveSnake, draw]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameLoop]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative border-4 border-glitch-cyan">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="block max-w-full h-auto aspect-square bg-black"
        />

        {(gameState.isPaused || gameState.isGameOver) && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center border-4 border-white">
            <div className="text-center p-8 glitch">
              {gameState.isGameOver ? (
                <>
                  <h2 className="text-6xl font-bold text-glitch-magenta mb-4 uppercase tracking-tighter text-glitch">SYNTH_FAIL</h2>
                  <p className="text-white mb-10 font-mono text-xl uppercase tracking-widest max-w-xs mx-auto">Neural thread severed unexpectedly.</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-4 px-10 py-5 bg-glitch-cyan text-black font-black text-2xl uppercase hover:translate-x-1 hover:-translate-y-1 transition-transform border-glitch"
                  >
                    <RotateCcw className="w-8 h-8" />
                    RE_INITIALIZE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-6xl font-bold text-glitch-cyan mb-4 uppercase tracking-tighter text-glitch">CPU_IDLE</h2>
                  <p className="text-white mb-10 font-mono text-xl uppercase tracking-widest max-w-xs mx-auto">Awaiting direct input protocol...</p>
                  <button
                    onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
                    className="flex items-center gap-4 px-10 py-5 bg-glitch-magenta text-white font-black text-2xl uppercase hover:translate-x-1 hover:-translate-y-1 transition-transform border-glitch"
                  >
                    <Play className="w-8 h-8 fill-current" />
                    OVERRIDE_PAUSE
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
