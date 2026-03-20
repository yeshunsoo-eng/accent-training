import { useState, useCallback, useRef } from "react";
import { listenPhrases } from "@/data/words";
import { Play, ChevronRight, ChevronLeft, RotateCcw, Volume2 } from "lucide-react";

export default function ListenAndFollow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState<number>(0.85);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const phrase = listenPhrases[currentIndex];

  const speak = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(phrase.text);
    utterance.lang = "en-GB";
    utterance.rate = speed;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [phrase.text, speed]);

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const next = () => {
    stop();
    setCurrentIndex((i) => (i + 1) % listenPhrases.length);
  };

  const prev = () => {
    stop();
    setCurrentIndex((i) => (i - 1 + listenPhrases.length) % listenPhrases.length);
  };

  const speeds = [
    { label: "Slow", value: 0.65 },
    { label: "Normal", value: 0.85 },
    { label: "Fast", value: 1.0 },
  ];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      {/* Speed selector */}
      <div className="flex gap-2">
        {speeds.map((s) => (
          <button
            key={s.label}
            onClick={() => setSpeed(s.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              speed === s.value
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Phrase card */}
      <div
        className="w-full bg-card rounded-2xl p-8 shadow-sm border border-border/60 min-h-[200px] flex flex-col justify-between"
      >
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            {phrase.category}
          </span>
          <p
            key={currentIndex}
            className="text-2xl font-display leading-relaxed text-foreground animate-word-swap"
            style={{ lineHeight: 1.5 }}
          >
            {phrase.text}
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          {currentIndex + 1} of {listenPhrases.length}
        </p>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Step 1:</span> Listen to the phrase
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Step 2:</span> Repeat it out loud, mimicking the accent
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Step 3:</span> Listen again and compare
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95"
          aria-label="Previous phrase"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={isSpeaking ? stop : speak}
          className={`p-5 rounded-full text-primary-foreground shadow-lg transition-all active:scale-95 ${
            isSpeaking ? "bg-accent" : "bg-primary"
          }`}
          aria-label={isSpeaking ? "Stop" : "Listen"}
        >
          {isSpeaking ? (
            <Volume2 className="w-7 h-7 animate-pulse" />
          ) : (
            <Play className="w-7 h-7 ml-0.5" />
          )}
        </button>

        <button
          onClick={() => speak()}
          className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95"
          aria-label="Replay"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={next}
          className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all active:scale-95"
          aria-label="Next phrase"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
