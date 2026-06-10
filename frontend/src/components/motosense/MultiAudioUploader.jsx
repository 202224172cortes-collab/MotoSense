import { useState } from "react";
import AudioSlot from "@/components/motosense/AudioSlot";

const SLOT_LABELS = [
  "Grabación 1 — Motor encendido (normal)",
  "Grabación 2 — Motor encendido (normal)",
  "Grabación 3 — Motor encendido (normal)",
];

export default function MultiAudioUploader({ files, onFileAdd, onFileRemove }) {
  const ready = files.filter(Boolean).length;
  const [recordingIndex, setRecordingIndex] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Grabaciones del motor</h2>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-black/[0.08]" style={{ color: "#CC1100" }}>
          {ready}/3 listos
        </span>
      </div>

      {SLOT_LABELS.map((label, i) => (
        <AudioSlot
          key={i}
          index={i}
          label={label}
          file={files[i]}
          onFile={onFileAdd}
          onRemove={onFileRemove}
          isOtherRecording={recordingIndex !== null && recordingIndex !== i}
          onRecordingChange={(active) => setRecordingIndex(active ? i : null)}
        />
      ))}

      {/* Progress bar */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-500"
            style={{ backgroundColor: files[i] ? "#CC1100" : "#E0E0E0" }}
          />
        ))}
      </div>
    </div>
  );
}