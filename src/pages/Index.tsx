import { useState } from "react";
import { Mic, Headphones, ArrowLeft, Video } from "lucide-react";
import RandomWordPractice from "@/components/RandomWordPractice";
import ListenAndFollow from "@/components/ListenAndFollow";
import VideoRecordingPractice from "@/components/VideoRecordingPractice";
import ProgressCard from "@/components/ProgressCard";
import StatsPanel from "@/components/StatsPanel";

type Mode = "home" | "random" | "listen" | "video";

const Index = () => {
  const [mode, setMode] = useState<Mode>("home");
  const [statsOpen, setStatsOpen] = useState(false);

  if (mode !== "home") {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setMode("home")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-3xl font-display text-foreground mb-2 animate-fade-up">
            {mode === "random" ? "Random Word Practice" : mode === "listen" ? "Listen & Follow Along" : "Video Recording Practice"}
          </h1>
          <p className="text-muted-foreground mb-10 animate-fade-up" style={{ animationDelay: "80ms" }}>
            {mode === "random"
              ? "Say each word clearly. Focus on pronunciation and mouth shape."
              : mode === "listen"
              ? "Listen carefully, then repeat. Match the rhythm and intonation."
              : "Pick a topic and time, then speak to the camera. Watch it back to spot what to improve."}
          </p>

          <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            {mode === "random" ? <RandomWordPractice /> : mode === "listen" ? <ListenAndFollow /> : <VideoRecordingPractice />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-12 animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display text-foreground mb-3" style={{ lineHeight: 1.15 }}>
            Accent Coach
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Train your English pronunciation with guided exercises and real-time practice.
          </p>
        </div>

        {/* Progress summary */}
        <div className="mb-6 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <ProgressCard onOpen={() => setStatsOpen(true)} />
        </div>

        {/* Mode cards */}
        <div className="space-y-4">
          <button
            onClick={() => setMode("random")}
            className="w-full group bg-card hover:bg-card/80 border border-border/60 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-md active:scale-[0.98] animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-display text-foreground mb-1">Random Word Practice</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Words appear one at a time. Speak each clearly for 2–5 minutes to build muscle memory.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode("listen")}
            className="w-full group bg-card hover:bg-card/80 border border-border/60 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-md active:scale-[0.98] animate-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                <Headphones className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-lg font-display text-foreground mb-1">Listen & Follow Along</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hear a native speaker say common phrases, then mimic the accent and rhythm.
                </p>
              </div>
            </div>
          </button>
          <button
            onClick={() => setMode("video")}
            className="w-full group bg-card hover:bg-card/80 border border-border/60 rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-md active:scale-[0.98] animate-fade-up"
            style={{ animationDelay: "280ms" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <Video className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-display text-foreground mb-1">Video Recording Practice</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Record yourself on the front camera for 5–20 minutes on a topic, then save the video.
                </p>
              </div>
            </div>
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-10 animate-fade-up" style={{ animationDelay: "300ms" }}>
          Uses your browser's speech engine · No data leaves your device
        </p>
      </div>

      {statsOpen && <StatsPanel onClose={() => setStatsOpen(false)} />}
    </div>
  );
};

export default Index;
