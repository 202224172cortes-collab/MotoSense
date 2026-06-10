import { useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileAudio, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileUploader({ file, onFileSelect, onClear }) {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("audio/")) {
      onFileSelect(dropped);
    }
  };

  const handleSelect = (e) => {
    if (e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileAudio className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        "glass rounded-xl p-8 cursor-pointer transition-all duration-300",
        "hover:bg-white/[0.04] hover:border-primary/30",
        "flex flex-col items-center justify-center gap-3"
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Upload className="w-5 h-5 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Subir archivo de audio</p>
        <p className="text-xs text-muted-foreground mt-1">
          Arrastra aquí o haz clic para seleccionar
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleSelect}
      />
    </motion.div>
  );
}