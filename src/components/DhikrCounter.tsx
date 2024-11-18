import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, RotateCcw, Home } from 'lucide-react';

interface DhikrCounterProps {
  title: string;
  target?: number;
  startValue?: number;
  isDescending?: boolean;
  vibrationEnabled?: boolean;
  soundEnabled?: boolean;
  vibrateThreshold?: number;
  onComplete?: () => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function DhikrCounter({
  title,
  target = 33,
  startValue = 0,
  isDescending = false,
  vibrationEnabled = true,
  soundEnabled = true,
  vibrateThreshold = 3,
  onComplete,
  onNext,
  onBack
}: DhikrCounterProps) {
  const initialCount = isDescending ? target : startValue;
  const [count, setCount] = useState(initialCount);
  const [showComplete, setShowComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const progress = isDescending
    ? ((target - count) / target) * 100
    : (count / target) * 100;

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3');
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const isComplete = isDescending ? count <= 0 : count >= target;
    
    if (isComplete && !showComplete) {
      setShowComplete(true);
      onComplete?.();
      
      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [count, target, isDescending, showComplete, soundEnabled, onComplete]);

  const increment = () => {
    if (showComplete) return;
    
    setCount(prev => {
      const newCount = isDescending ? prev - 1 : prev + 1;
      
      if (vibrationEnabled) {
        const remaining = isDescending ? newCount : target - newCount;
        if (remaining <= vibrateThreshold && 'vibrate' in navigator) {
          navigator.vibrate(150);
        }
      }
      
      return newCount;
    });
  };

  const reset = () => {
    setCount(initialCount);
    setShowComplete(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      <div className="flex items-center p-4">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-100" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        <div className="text-3xl font-arabic mb-12 text-gray-100">{title}</div>
        
        <div className="w-[300px] h-[300px] rounded-full bg-gray-800 relative">
          <svg
            className="absolute inset-0 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              className="stroke-emerald-500"
              fill="none"
              strokeWidth="10"
              strokeDasharray={`${progress * 2.827} 282.7`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>
          
          <button
            onClick={increment}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-7xl font-bold text-emerald-500">{count}</div>
          </button>
        </div>
      </div>

      {showComplete && (
        <div className="absolute inset-0 bg-black/50 flex flex-col backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 bg-gray-900/80">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-100"
            >
              <RotateCcw className="w-4 h-4" />
              Tekrar Et
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-100"
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            {onNext && (
              <button
                onClick={() => {
                  reset();
                  onNext();
                }}
                className="w-full max-w-sm px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors text-lg font-medium"
              >
                Sonraki Zikir
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}