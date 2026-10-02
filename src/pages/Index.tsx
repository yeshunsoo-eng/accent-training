import { useState } from "react";
import { Mic, Headphones, ArrowLeft, Video, Dumbbell, ChartNoAxesCombined } from "lucide-react";
import RandomWordPractice from "@/components/RandomWordPractice";
import ListenAndFollow from "@/components/ListenAndFollow";
import VideoRecordingPractice from "@/components/VideoRecordingPractice";
import StatsPanel from "@/components/StatsPanel";
import { Button } from "@/components/ui/button";

type Mode = "home" | "random" | "listen" | "video";
type Tab = "training" | "insights";

const Index = () => {
  const [mode, setMode] = useState<Mode>("home");
  const [tab, setTab] = useState<Tab>("training");

  if (mode !== "home") {
    return (
      <div className="min-h-screen bg-background px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={() => setMode("home")}
            variant="ghost"
            size="sm"
            className="-ml-3 mb-6 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Training
          </Button>

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

  const exercises = [
    { id: "random" as const, title: "Random Word Practice", description: "Speak one word at a time and build clear pronunciation.", detail: "2–5 min", icon: Mic, tone: "primary" },
    { id: "listen" as const, title: "Listen & Follow Along", description: "Mimic a native speaker’s rhythm and intonation.", detail: "Daily phrases", icon: Headphones, tone: "accent" },
    { id: "video" as const, title: "Video Recording Practice", description: "Speak to camera, review your delivery, and save it.", detail: "5–20 min", icon: Video, tone: "primary" },
  ];

  return (
    <div className="min-h-screen bg-background pb-28">
      <main className="mx-auto w-full max-w-md px-4 pt-8 sm:pt-12">
        {tab === "training" ? (
          <section className="animate-fade-up">
            <header className="mb-8">
              <p className="mb-1 text-sm font-semibold text-primary">Accent Coach</p>
              <h1 className="text-4xl font-display text-foreground">Training</h1>
              <p className="mt-2 text-muted-foreground">Choose a practice and give your voice a few focused minutes.</p>
            </header>

            <div className="space-y-3">
              {exercises.map((exercise) => (
                <Button
                  key={exercise.id}
                  onClick={() => setMode(exercise.id)}
                  variant="outline"
                  className="group h-auto w-full justify-start whitespace-normal rounded-lg border-border/70 bg-card p-5 text-left hover:bg-card/80 hover:text-foreground"
                >
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${exercise.tone === "accent" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                    <exercise.icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-lg text-foreground">{exercise.title}</span>
                      <span className="shrink-0 text-xs font-medium text-muted-foreground">{exercise.detail}</span>
                    </span>
                    <span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">{exercise.description}</span>
                  </span>
                </Button>
              ))}
            </div>

            <p className="mt-8 text-center text-xs text-muted-foreground">Your recordings and progress stay on this device.</p>
          </section>
        ) : (
          <section>
            <header className="mb-8 animate-fade-up">
              <p className="mb-1 text-sm font-semibold text-primary">Your progress</p>
              <h1 className="text-4xl font-display text-foreground">Insights</h1>
              <p className="mt-2 text-muted-foreground">See your consistency and the practice you have completed.</p>
            </header>
            <StatsPanel />
          </section>
        )}
      </main>

      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
          <Button
            variant="ghost"
            onClick={() => setTab("training")}
            aria-current={tab === "training" ? "page" : undefined}
            className={`h-14 flex-col gap-1 hover:bg-transparent ${tab === "training" ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Dumbbell className="h-5 w-5" />
            <span className="text-xs">Training</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setTab("insights")}
            aria-current={tab === "insights" ? "page" : undefined}
            className={`h-14 flex-col gap-1 hover:bg-transparent ${tab === "insights" ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <ChartNoAxesCombined className="h-5 w-5" />
            <span className="text-xs">Insights</span>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
