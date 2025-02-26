import React from 'react';
import { useGameStore } from './store';
import { AudioPlayer } from './components/AudioPlayer';
import { Globe2, Play, Share2, Trophy } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const {
    samples,
    guesses,
    scores,
    totalScore,
    gameStatus,
    isLoading,
    error,
    setGuess,
    startGame,
    submitGuesses,
    resetGame
  } = useGameStore();

  const handleShare = () => {
    if (!scores) return;
    
    const shareText = `🌍 Language Game ${new Date().toLocaleDateString()}\n\n` +
      `Score: ${totalScore}/500\n\n` +
      scores.map(score => {
        const emoji = score.score === 100 ? '🎯' : score.score === 70 ? '👌' : '❌';
        return emoji;
      }).join('') +
      '\n\nPlay at: https://splendid-salamander-7089cc.netlify.app/';

    navigator.clipboard.writeText(shareText).then(() => {
        alert("Text copied to clipboard!");
    });
};
  const allLanguagesSelected = samples.length > 0 && 
    samples.every(sample => guesses[sample.order]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button
            onClick={resetGame}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <Globe2 className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">EchoLingo</h1>
          <p className="text-gray-600">Test your language recognition skills!</p>
        </header>

        {gameStatus === 'welcome' && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Today's Challenge!</h2>
            <p className="text-gray-600 mb-6">
              Listen to 5 audio samples and guess their languages. How many can you get right?
            </p>
            <button
              onClick={() => startGame()}
              disabled={isLoading}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isLoading ? 'Loading...' : (
                <>
                  <Play size={20} />
                  Start Game
                </>
              )}
            </button>
          </div>
        )}

        {gameStatus === 'playing' && (
          <div>
            {samples.map((sample) => (
              <AudioPlayer
                key={sample.order}
                order={sample.order}
                audioUrl={sample.audio_url}
                text={sample.text}
                onLanguageSelect={(order, language) => setGuess(order, language)}
                selectedLanguage={guesses[sample.order]}
              />
            ))}

            <button
              onClick={() => submitGuesses()}
              disabled={!allLanguagesSelected || isLoading}
              className={clsx(
                "w-full py-3 rounded-full transition-colors flex items-center justify-center gap-2",
                allLanguagesSelected
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {isLoading ? 'Submitting...' : 'Submit Answers'}
            </button>
          </div>
        )}

        {gameStatus === 'results' && scores && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <Trophy className="text-yellow-500 mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-bold mb-2">Your Results</h2>
              <p className="text-4xl font-bold text-indigo-600 mb-2">
                {totalScore}/500
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {scores.map((score) => (
                <div
                  key={score.order}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Sample {score.order}</span>
                    <span className="text-lg font-bold">{score.score}%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Your guess: {score.guessed_language}</p>
                    <p>Correct: {score.correct_language}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleShare}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Share Results
              </button>
              <button
                onClick={resetGame}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-full hover:bg-gray-300 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
