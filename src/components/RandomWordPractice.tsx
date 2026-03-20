import { useState, useEffect, useCallback, useRef } from "react";
import { getRandomWord } from "@/data/words";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";

const DURATIONS = [
  { label: "2 min", seconds: 120 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
];

export default function RandomWordPractice() {
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [wordKey, setWordKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(DURATIONS[0]);
  const [timeLeft, setTimeLeft] = useState(DURATIONS[0].seconds);
  const [wordsSpoken, setWordsSpoken] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextWord = useCallback(() => {
    setCurrentWord(getRandomWord());
    setWordKey((k) => k + 1);
    setWordsSpoken((c) => c + 1);
  }, []);

  const speakWord = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentWord);
      utterance.lang = "en-GB";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentWord]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      resetSession();
      return;
    }
    setIsRunning(!isRunning);
  };

  const resetSession = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration.seconds);
    setWordsSpoken(0);
    setCurrentWord(getRandomWord());
    setWordKey((k) => k + 1);
  };

  const selectDuration = (d: typeof DURATIONS[0]) => {
    setSelectedDuration(d);
    setTimeLeft(d.seconds);
    setIsRunning(false);
    setWordsSpoken(0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 1 - timeLeft / selectedDuration.seconds;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      {/* Duration selector */}
      <div className="flex gap-2">
        {DURATIONS.map((d) => (
          <button
            key={d.label}
            onClick={() => selectDuration(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedDuration === d
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke="hsl(var(--timer-track))"
            strokeWidth="4"
          />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke="hsl(var(--timer-fill))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="text-center z-10">
          <span className="text-3xl font-display text-foreground tabular-nums">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          <p className="text-xs text-muted-foreground mt-1">{wordsSpoken} words</p>
        </div>
      </div>

      {/* Word display */}
      <div className="min-h-[120px] flex flex-col items-center justify-center">
        <p
          key={wordKey}
          className="text-5xl word-display-text animate-word-swap leading-tight"
        >
          {currentWord}
        </p>
        <button
          onClick={speakWord}
          className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Volume2 className="w-4 h-4" />
          Listen
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={resetSession}
          className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95"
          aria-label="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={toggleTimer}
          className={`p-5 rounded-full text-primary-foreground shadow-lg transition-all active:scale-95 ${
            isRunning ? "bg-accent" : "bg-primary"
          } ${isRunning ? "" : "animate-pulse-ring"}`}
          aria-label={isRunning ? "Pause" : "Start"}
        >
          {timeLeft === 0 ? (
            <RotateCcw className="w-7 h-7" />
          ) : isRunning ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-0.5" />
          )}
        </button>

        <button
          onClick={nextWord}
          className="px-5 py-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95 text-sm font-medium"
        >
          Next word
        </button>
      </div>

      {timeLeft === 0 && (
        <div className="text-center animate-fade-up">
          <p className="text-lg font-display text-primary">Session complete!</p>
          <p className="text-sm text-muted-foreground">
            You practised {wordsSpoken} words. Great work!
          </p>
        </div>
      )}
    </div>
  );
}
