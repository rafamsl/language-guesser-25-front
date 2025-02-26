import { create } from 'zustand';
import axios from 'axios';
import { startOfDay, isAfter } from 'date-fns';
import { GameState, GameStorage, LanguageGuess } from './types';

const API_BASE_URL = 'https://language-guesser-25.onrender.com';

const loadGameFromStorage = (): GameStorage | null => {
  const stored = localStorage.getItem('languageGame');
  return stored ? JSON.parse(stored) : null;
};

const saveGameToStorage = (game: GameStorage) => {
  localStorage.setItem('languageGame', JSON.stringify(game));
};

const shouldFetchNewGame = (stored: GameStorage | null): boolean => {
  if (!stored) return true;

  const now = new Date();
  const storedDate = new Date(stored.currentGame.fetchDate);
  const today8AM = new Date(now);
  today8AM.setHours(8, 0, 0, 0);

  // If it's past 8 AM CET and the stored game is from before 8 AM, fetch new game
  return isAfter(now, today8AM) && isAfter(today8AM, storedDate);
};

export const useGameStore = create<GameState>((set, get) => ({
  samples: [],
  guesses: {},
  scores: null,
  totalScore: null,
  gameStatus: 'welcome',
  isLoading: false,
  error: null,

  setGuess: (order: number, language: string) => {
    set(state => ({
      guesses: { ...state.guesses, [order]: language }
    }));
  },

  startGame: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = loadGameFromStorage();
      
      if (stored && !shouldFetchNewGame(stored)) {
        set({
          samples: stored.currentGame.samples,
          gameStatus: stored.currentGame.hasPlayed ? 'results' : 'playing'
        });
      } else {
        const { data } = await axios.get(`${API_BASE_URL}/game/new`);
        const newGame: GameStorage = {
          currentGame: {
            samples: data.samples,
            fetchDate: new Date().toISOString(),
            hasPlayed: false
          }
        };
        saveGameToStorage(newGame);
        set({
          samples: data.samples,
          gameStatus: 'playing',
          guesses: {},
          scores: null,
          totalScore: null
        });
      }
    } catch (error) {
      set({ error: 'Failed to start game. Please try again.' });
    } finally {
      set({ isLoading: false });
    }
  },

  submitGuesses: async () => {
    const { samples, guesses } = get();
    set({ isLoading: true, error: null });

    try {
      const guessArray: LanguageGuess[] = samples.map(sample => ({
        order: sample.order,
        correct_language: sample.language,
        guessed_language: guesses[sample.order] || ''
      }));

      const { data } = await axios.post(`${API_BASE_URL}/game/score`, {
        guesses: guessArray
      });
      
      const stored = loadGameFromStorage();
      if (stored) {
        stored.currentGame.hasPlayed = true;
        stored.lastScore = {
          total_score: data.total_score,
          date: new Date().toISOString()
        };
        saveGameToStorage(stored);
      }

      set({
        scores: data.scores,
        totalScore: data.total_score,
        gameStatus: 'results'
      });
    } catch (error) {
      set({ error: 'Failed to submit answers. Please try again.' });
    } finally {
      set({ isLoading: false });
    }
  },

  resetGame: () => {
    set({
      guesses: {},
      scores: null,
      totalScore: null,
      gameStatus: 'welcome',
      error: null
    });
  }
}));