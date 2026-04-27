export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type Point = { x: number; y: number };
