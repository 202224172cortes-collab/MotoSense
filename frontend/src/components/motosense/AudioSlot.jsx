import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Upload, Square, Pause, Play, X, CheckCircle, FileAudio, Clock } from "lucide-react";

const MIN_SECONDS = 10;

const TABS = [
  { id: "record", label: "Grabar", icon: Mic },
  { id: "upload", label: "Subir", icon: Upload },
];

export default function AudioSlot({ index, label, file, onFile, onRemove, isOtherRecording, onRecordingChange }) {
  const [tab, setTab] = useState("record");
  const [recordState, setRecordState] = useState("idle"); // idle | recording | paused | done
  const [audioUrl, setAudioUrl] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [recSeconds, setRecSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  // when file is cleared from outside, reset local state
  useEffect(() => {
    if (!file) {
      setRecordState("idle");
      setAudioUrl(null);
      setPlaying(false);
      setCurrentTime(0);
    }
  }, [file]);

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const mr = new MediaRecorder(stream);
    mediaRecorderRef.current = mr;
    chunksRef.current = [];
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      clearInterval(timerRef.current);
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setRecordState("done");
      const f = new File([blob], `grabacion_${index + 1}.webm`, { type: "audio/webm" });
      onFile(index, f);
      stream.getTracks().forEach((t) => t.stop());
    };
    mr.start();
    setRecSeconds(0);
    timerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    setRecordState("recording");
    onRecordingChange?.(true);
  }, [index, onFile, onRecordingChange]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      onRecordingChange?.(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      clearInterval(timerRef.current);
      setRecordState("paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
      setRecordState("recording");
    }
  };

  const handleFileSelect = (e) => {

  const f = e.target.files[0];

  if (f) {

    setAudioUrl(
      URL.createObjectURL(f)
    );

    onFile(
      index,
      f
    );
  }

  e.target.value = "";
};

  const handleDrop = (e) => {

  e.preventDefault();

  const f = e.dataTransfer.files[0];

  if (f) {

    setAudioUrl(
      URL.createObjectURL(f)
    );

    onFile(
      index,
      f
    );
  }
};

  const handleRemove = () => {
    clearInterval(timerRef.current);
    setRecordState("idle");
    setAudioUrl(null);
    setPlaying(false);
    setRecSeconds(0);
    onRemove(index);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setPlaying(!playing);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

  const isRecording = recordState === "recording";
  const isPaused = recordState === "paused";
  const isDone = !!file;
  const meetsMinimum = recSeconds >= MIN_SECONDS;
  const formatRec = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const accentColors = ["#CC1100", "#2D2D2D", "#CC1100"];
  const color = accentColors[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl shadow-sm border border-black/[0.06] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: color }}
          >
            {index + 1}
          </div>
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
        {isDone && (
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" style={{ color }} />
            <button onClick={handleRemove} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      {!isDone && (
        <div className="flex mx-4 mb-3 bg-muted rounded-xl p-1 gap-1">
          {TABS.map(({ id, label: tabLabel, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={
                tab === id
                  ? { backgroundColor: color, color: "#fff" }
                  : { color: "hsl(var(--muted-foreground))" }
              }
            >
              <Icon className="w-3.5 h-3.5" /> {tabLabel}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="px-4 pb-4">
        <AnimatePresence mode="wait">
          {isDone ? (
            // Mini player
            <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <audio
                ref={audioRef}
                src={audioUrl || (file ? URL.createObjectURL(file) : undefined)}
                onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                onEnded={() => setPlaying(false)}
              />
              <div className="flex items-center gap-3 bg-muted rounded-xl px-3 py-2">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color, width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
                <FileAudio className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            </motion.div>
          ) : tab === "record" ? (
            // Record tab
            <motion.div key="record" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col items-center gap-3 py-3">
              <div className="relative">
                {isRecording && (
                  <>
                    <motion.div className="absolute inset-0 rounded-full border-2" style={{ borderColor: `${color}50` }} animate={{ scale: [1, 1.7], opacity: [0.5, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />
                    <motion.div className="absolute inset-0 rounded-full border-2" style={{ borderColor: `${color}30` }} animate={{ scale: [1, 2.2], opacity: [0.3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }} />
                  </>
                )}
                <motion.button
                  onClick={isOtherRecording ? undefined : isRecording ? pauseRecording : isPaused ? resumeRecording : startRecording}
                  whileHover={{ scale: isOtherRecording ? 1 : 1.05 }}
                  whileTap={{ scale: isOtherRecording ? 1 : 0.95 }}
                  disabled={isOtherRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ backgroundColor: isRecording ? "#c0291b" : isPaused ? "#605246" : color }}
                >
                  {isRecording ? <Pause className="w-6 h-6" /> : isPaused ? <Play className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>
              </div>
              {/* Timer */}
              {(isRecording || isPaused) && (
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-sm font-bold font-space"
                    style={{ backgroundColor: meetsMinimum ? "#10b981" : color }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {formatRec(recSeconds)}
                  </div>
                  {!meetsMinimum && (
                    <p className="text-[10px] text-muted-foreground">
                      Mínimo {MIN_SECONDS - recSeconds}s restantes
                    </p>
                  )}
                  {meetsMinimum && (
                    <p className="text-[10px] font-medium" style={{ color: "#10b981" }}>
                      ✓ Duración válida
                    </p>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {isOtherRecording ? "Otro audio está grabando..." : isRecording ? "Grabando... toca para pausar" : isPaused ? "En pausa" : "Toca para grabar • Mín. 10s"}
              </p>
              {(isRecording || isPaused) && (
                <button
                  onClick={stopRecording}
                  disabled={!meetsMinimum}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
                  style={{ color, borderColor: `${color}40` }}
                >
                  <Square className="w-3 h-3" /> Finalizar grabación
                </button>
              )}
            </motion.div>
          ) : (
            // Upload tab
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center gap-2 py-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:bg-muted/50"
              style={{ borderColor: `${color}40` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                <Upload className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-xs font-medium text-foreground">Arrastra o toca para subir</p>
              <p className="text-[10px] text-muted-foreground">MP3, WAV, OGG, M4A…</p>
              <input ref={fileInputRef} type="file" accept="audio/*,video/*" className="hidden" onChange={handleFileSelect} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}