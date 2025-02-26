export interface Sample {
  language: string;
  audio_url: string;
  text: string;
  order: number;
}

export interface GameResponse {
  samples: Sample[];
  message: string;
}

export interface LanguageGuess {
  order: number;
  correct_language: string;
  guessed_language: string;
}

export interface ScoreResult {
  order: number;
  score: number;
  correct_language: string;
  guessed_language: string;
}

export interface ScoreResponse {
  scores: ScoreResult[];
  total_score: number;
  message: string;
}

export interface GameStorage {
  currentGame: {
    samples: Sample[];
    fetchDate: string;
    hasPlayed: boolean;
  };
  lastScore?: {
    total_score: number;
    date: string;
  };
}

export interface GameState {
  samples: Sample[];
  guesses: Record<number, string>;
  scores: ScoreResult[] | null;
  totalScore: number | null;
  gameStatus: 'welcome' | 'playing' | 'results';
  isLoading: boolean;
  error: string | null;
  setGuess: (order: number, language: string) => void;
  startGame: () => Promise<void>;
  submitGuesses: () => Promise<void>;
  resetGame: () => void;
}