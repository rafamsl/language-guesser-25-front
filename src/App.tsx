import React from 'react';
import { useGameStore } from './store';
import { AudioPlayer } from './components/AudioPlayer';
import { Globe2, Play, Share2, Trophy, Copy } from 'lucide-react';
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

  const shareToTwitter = () => {
    if (!scores) return;
    const text = `🌍 EchoLingo: ${totalScore}/500 points! Can you beat my score?\n${scores.map(score => {
      const emoji = score.score === 100 ? '🎯' : score.score === 70 ? '👌' : '❌';
      return emoji;
    }).join('')}`;
    const url = 'https://splendid-salamander-7089cc.netlify.app/';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = 'https://splendid-salamander-7089cc.netlify.app/';
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    if (!scores) return;
    const text = `🌍 EchoLingo: ${totalScore}/500 points! ${scores.map(score => {
      const emoji = score.score === 100 ? '🎯' : score.score === 70 ? '👌' : '❌';
      return emoji;
    }).join('')} Play at: https://splendid-salamander-7089cc.netlify.app/`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
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

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium">Share your results:</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShare}
                  className="bg-gray-200 text-gray-800 py-3 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy size={20} />
                  Copy to Clipboard
                </button>
                <button
                  onClick={shareToTwitter}
                  className="bg-[#1DA1F2] text-white py-3 rounded-full hover:bg-[#1a94df] transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M22 4.01c-1 .49-1.98.689-3 .99-1.121-1.265-2.783-1.335-4.38-.737S11.977 6.323 12 8v1c-3.245.083-6.135-1.395-8-4 0 0-4.182 7.433 4 11-1.872 1.247-3.739 2.088-6 2 3.308 1.803 6.913 2.423 10.034 1.517 3.58-1.04 6.522-3.723 7.651-7.742a13.84 13.84 0 0 0 .497-3.753C20.18 7.773 21.692 5.25 22 4.009z" />
                  </svg>
                  Twitter
                </button>
                <button
                  onClick={shareToFacebook}
                  className="bg-[#4267B2] text-white py-3 rounded-full hover:bg-[#3b5998] transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </button>
                <button
                  onClick={shareToWhatsApp}
                  className="bg-[#25D366] text-white py-3 rounded-full hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 0 1-1.516-5.26c0-5.445 4.455-9.885 9.942-9.885a9.865 9.865 0 0 1 7.022 2.91 9.788 9.788 0 0 1 2.909 6.99c-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
                  </svg>
                  WhatsApp
                </button>
              </div>
              <button
                onClick={resetGame}
                className="bg-indigo-600 text-white py-3 rounded-full hover:bg-indigo-700 transition-colors mt-3"
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
