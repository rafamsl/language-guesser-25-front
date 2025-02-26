import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, Eye, EyeOff } from 'lucide-react';
import { LANGUAGES } from '../constants';

interface AudioPlayerProps {
  order: number;
  audioUrl: string;
  text: string;
  onLanguageSelect: (order: number, language: string) => void;
  selectedLanguage?: string;
  disabled?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  order,
  audioUrl,
  text,
  onLanguageSelect,
  selectedLanguage,
  disabled
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          disabled={disabled}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <div className="flex-1">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Volume2 className="text-gray-500" size={24} />
      </div>

      <div className="space-y-4">
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedLanguage || ''}
          onChange={(e) => onLanguageSelect(order, e.target.value)}
          disabled={disabled}
        >
          <option value="">Select a language</option>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowText(!showText)}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {showText ? <EyeOff size={16} /> : <Eye size={16} />}
            {showText ? 'Hide text' : 'Reveal text'}
          </button>
          {showText && (
            <p className="text-sm text-gray-600 font-mono">{text}</p>
          )}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
};