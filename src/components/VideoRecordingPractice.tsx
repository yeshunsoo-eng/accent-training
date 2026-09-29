import { useState, useEffect, useRef, useCallback } from "react";
import { recordActivity } from "@/lib/stats";
import { Circle, Square, Download, RotateCcw, Shuffle, Camera } from "lucide-react";

const DURATIONS = [5, 10, 15, 20];

const TOPICS = [
  "Describe your ideal weekend",
  "Talk about a book or film you love",
  "Explain how to cook your favourite meal",
  "Describe your hometown to a visitor",
  "What would you do with a year off?",
  "Tell the story of a memorable trip",
  "Talk about a person who inspires you",
  "Describe your daily routine in detail",
  "Pros and cons of working from home",
  "Your plans for the next five years",
];

const randomTopic = () => TOPICS[Math.floor(Math.random() * TOPICS.length)];

function pickMime() {
  const types = ["video/mp4", "video/webm;codecs=vp9,opus", "video/webm"];
  return types.find((t) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) || "";
}

export default function VideoRecordingPractice() {
  const [duration, setDuration] = useState(5);
  const [topicMode, setTopicMode] = useState<"suggested" | "own">("suggested");
  const [topic, setTopic] = useState(randomTopic());
  const [ownTopic, setOwnTopic] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startCamera = useCallback(async () => {
    setError("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      setStream(s);
    } catch {
      setError("Couldn't access the camera. Please allow camera and microphone access.");
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream, videoUrl]);

  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  useEffect(() => {
    if (!recording) setTimeLeft(duration * 60);
  }, [duration, recording]);

  const stopRecording = useCallback(() => {
    recorderRef.current?.state === "recording" && recorderRef.current.stop();
    setRecording(false);
    const elapsed = Math.max(0, duration * 60 - timeLeft);
    if (elapsed > 0) recordActivity({ seconds: elapsed, videoSeconds: elapsed });
  }, [duration, timeLeft]);

  useEffect(() => {
    if (!recording) return;
    if (timeLeft <= 0) { stopRecording(); return; }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [recording, timeLeft, stopRecording]);

  const startRecording = () => {
    if (!stream) return;
    chunksRef.current = [];
    const mimeType = pickMime();
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
    rec.onstop = () => {
      const b = new Blob(chunksRef.current, { type: rec.mimeType || "video/mp4" });
      setBlob(b);
      setVideoUrl(URL.createObjectURL(b));
    };
    rec.start(1000);
    recorderRef.current = rec;
    setTimeLeft(duration * 60);
    setRecording(true);
  };

  const exportVideo = async () => {
    if (!blob) return;
    const ext = blob.type.includes("mp4") ? "mp4" : "webm";
    const file = new File([blob], `accent-practice-${Date.now()}.${ext}`, { type: blob.type });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "Accent practice" }); return; } catch { /* fall through */ }
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
  };

  const retake = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setBlob(null);
    setTimeLeft(duration * 60);
  };

  const activeTopic = topicMode === "own" ? ownTopic || "Your own topic" : topic;
  const mm = Math.floor(timeLeft / 60);
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {!recording && !videoUrl && (
        <>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Duration</p>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d) => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${duration === d ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                  {d} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Topic</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {(["suggested", "own"] as const).map((m) => (
                <button key={m} onClick={() => setTopicMode(m)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${topicMode === m ? "bg-primary text-primary-foreground shadow-md" : "bg-secondary text-secondary-foreground"}`}>
                  {m === "suggested" ? "Suggest one" : "My own topic"}
                </button>
              ))}
            </div>
            {topicMode === "suggested" ? (
              <div className="flex items-center gap-3 bg-card border border-border/60 rounded-xl p-4">
                <p className="flex-1 text-foreground">{topic}</p>
                <button onClick={() => setTopic(randomTopic())} aria-label="New topic"
                  className="p-2 rounded-full bg-secondary text-secondary-foreground active:scale-95">
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <input value={ownTopic} onChange={(e) => setOwnTopic(e.target.value)}
                placeholder="What will you talk about?"
                className="w-full bg-card border border-border/60 rounded-xl p-4 text-foreground outline-none focus:ring-2 focus:ring-primary" />
            )}
          </div>
        </>
      )}

      {/* Camera / playback */}
      <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-foreground/90 shadow-lg">
        {videoUrl ? (
          <video src={videoUrl} controls playsInline className="w-full h-full object-cover" />
        ) : stream ? (
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <Camera className="w-10 h-10 text-background/70" />
            <button onClick={startCamera}
              className="px-5 py-3 rounded-full bg-primary text-primary-foreground font-medium active:scale-95">
              Open front camera
            </button>
            {error && <p className="text-sm text-background/80">{error}</p>}
          </div>
        )}

        {stream && !videoUrl && (
          <>
            <div className="absolute top-3 left-3 right-3 bg-background/85 backdrop-blur rounded-xl px-4 py-2 text-sm text-foreground">
              {activeTopic}
            </div>
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/85 backdrop-blur rounded-full px-4 py-1.5 tabular-nums font-display text-foreground">
              {recording && <span className="w-2.5 h-2.5 rounded-full bg-destructive animate-pulse" />}
              {mm}:{ss}
            </div>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
              {recording ? (
                <button onClick={stopRecording} aria-label="Stop"
                  className="w-16 h-16 rounded-full bg-background flex items-center justify-center active:scale-95">
                  <Square className="w-6 h-6 text-destructive fill-current" />
                </button>
              ) : (
                <button onClick={startRecording} aria-label="Record"
                  className="w-16 h-16 rounded-full border-4 border-background flex items-center justify-center active:scale-95">
                  <Circle className="w-12 h-12 text-destructive fill-current" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {videoUrl && (
        <div className="flex gap-3">
          <button onClick={retake}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-secondary text-secondary-foreground font-medium active:scale-95">
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
          <button onClick={exportVideo}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-primary-foreground font-medium active:scale-95">
            <Download className="w-4 h-4" /> Save to phone
          </button>
        </div>
      )}
    </div>
  );
}
