import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Folder,
  FolderOpen,
  Plus,
  Trash2,
  Play,
  Pause,
  X,
  ChevronRight,
  ChevronDown,
  Loader2,
  ShieldAlert
} from "lucide-react";

import { apiClient } from "@/api/apiClient";
import AnimatedBlobs from "@/components/motosense/AnimatedBlobs";

const FOLDER_COLORS = [
  "#CC1100",
  "#2D2D2D",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#a855f7",
  "#f97316",
  "#06b6d4"
];

/* ───────────────────────────── */
/* MINI PLAYER */
/* ───────────────────────────── */

function MiniPlayer({ url }) {

  const ref = useRef(null);

  const [playing, setPlaying] = useState(false);

  const [progress, setProgress] = useState(0);

  const toggle = async () => {

    if (!ref.current) return;

    try {

      if (playing) {

        ref.current.pause();

      } else {

        await ref.current.play();
      }

      setPlaying(!playing);

    } catch (err) {

      console.error("ERROR AUDIO:", err);
    }
  };

  return (

    <div className="flex items-center gap-2">

      <audio
        ref={ref}
        src={url}
        onTimeUpdate={() => {

          if (!ref.current) return;

          setProgress(
            ref.current.currentTime /
            (ref.current.duration || 1)
          );
        }}
        onEnded={() => setPlaying(false)}
      />

      <button
        type="button"
        onClick={toggle}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
        style={{ backgroundColor: "#CC1100" }}
      >

        {playing
          ? <Pause className="w-3 h-3" />
          : <Play className="w-3 h-3 ml-0.5" />
        }

      </button>

      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">

        <div
          className="h-full rounded-full transition-all"
          style={{
            backgroundColor: "#CC1100",
            width: `${progress * 100}%`
          }}
        />

      </div>

    </div>
  );
}

/* ───────────────────────────── */
/* MODAL NUEVA CARPETA */
/* ───────────────────────────── */

function NewFolderModal({
  onClose,
  onCreated
}) {

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  const [color, setColor] = useState(FOLDER_COLORS[0]);

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {

    if (!name.trim()) return;

    setLoading(true);

    try {

      const folder = await apiClient.createFolder({
        name: name.trim(),
        description,
        color
      });

      onCreated(folder);

      onClose();

    } catch (err) {

      console.error(
        "ERROR CREANDO CARPETA:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4"
      >

        <div className="flex items-center justify-between">

          <h3 className="font-bold text-lg font-space">
            Nueva carpeta
          </h3>

          <button
            type="button"
            onClick={onClose}
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

        </div>

        <div>

          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
            Nombre
          </label>

          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Motor sano"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />

        </div>

        <div>

          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1">
            Descripción
          </label>

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción..."
            className="w-full border rounded-xl px-3 py-2 text-sm resize-none"
          />

        </div>

        <div>

          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Color
          </label>

          <div className="flex gap-2 flex-wrap">

            {FOLDER_COLORS.map((c) => (

              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full border-2"
                style={{
                  backgroundColor: c,
                  borderColor:
                    color === c
                      ? "#000"
                      : "transparent"
                }}
              />

            ))}

          </div>

        </div>

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-white font-semibold text-sm"
          style={{ backgroundColor: "#CC1100" }}
        >

          {loading
            ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            : "Crear carpeta"
          }

        </button>

      </motion.div>

    </div>
  );
}

function FolderRow({
  folder,
  onDelete
}) {

  const [open, setOpen] = useState(false);

  const [audios, setAudios] = useState([]);

  const loadAudios = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/api/admin/folder/${folder.id}/audios`
      );

      const data = await response.json();

      setAudios(data);

    } catch (err) {

      console.error(
        "ERROR CARGANDO AUDIOS:",
        err
      );
    }
  };

  useEffect(() => {

    if (open) {

      loadAudios();
    }

  }, [open]);

  const handleUpload = async (e) => {

  const files = Array.from(
    e.target.files
  );

  if (!files.length) return;

  try {

    for (const file of files) {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "folder_id",
        folder.id
      );

      const response =
        await fetch(
          "http://127.0.0.1:5000/api/admin/upload-audio",
          {
            method: "POST",
            body: formData
          }
        );

      const data =
        await response.json();

      console.log(
        "AUDIO SUBIDO:",
        data
      );
    }

    await loadAudios();

    alert(
      `${files.length} audios subidos correctamente`
    );

  } catch (err) {

    console.error(
      "ERROR SUBIENDO AUDIOS:",
      err
    );

    alert(
      "Error subiendo audios"
    );
  }
};

  return (

    <div
      className="bg-white rounded-2xl border shadow-sm overflow-hidden"
      style={{
        borderColor:
          open
            ? folder.color || "#CC1100"
            : "#E8E8E8"
      }}
    >

      <div className="w-full flex items-center gap-3 px-4 py-3.5">

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 flex-1 text-left"
        >

          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor:
                `${folder.color || "#CC1100"}18`
            }}
          >

            {open
              ? <FolderOpen className="w-5 h-5" />
              : <Folder className="w-5 h-5" />
            }

          </div>

          <div className="flex-1">

            <p className="font-bold">
              {folder.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {folder.audio_count} audios
            </p>

          </div>

        </button>

        <button
          onClick={() =>
            onDelete(folder.id)
          }
          className="text-red-500"
        >

          <Trash2 className="w-4 h-4" />

        </button>

      </div>

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t"
          >

            <div className="p-4 space-y-4">

              <label
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold cursor-pointer"
                style={{
                  backgroundColor: "#CC1100"
                }}
              >

                <Plus className="w-4 h-4" />

                Subir audio

                <input
                  type="file"
                  multiple
                  onChange={handleUpload}
                  hidden
                />

              </label>

              {audios.length > 0 && (

                <div className="space-y-2">

                  {audios.map((audio) => (

                    <div
                      key={audio.id}
                      className="flex items-center justify-between border rounded-xl px-3 py-2"
                    >

                      <span className="text-sm">

                        {audio.file_name}

                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}

/* ───────────────────────────── */
/* PAGINA PRINCIPAL */
/* ───────────────────────────── */

export default function AdminBase() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [folders, setFolders] = useState([]);

  const [showNewFolder, setShowNewFolder] =
    useState(false);

  useEffect(() => {

    const load = async () => {

      try {

        const userString =
          localStorage.getItem("user");

        if (!userString) {

          setLoading(false);

          return;
        }

        const savedUser =
          JSON.parse(userString);

        console.log(
          "ADMIN USER:",
          savedUser
        );

        setUser(savedUser);

        if (
          savedUser?.role === "admin"
        ) {

          const data =
            await apiClient.getFolders();

          setFolders(
            Array.isArray(data)
              ? data
              : []
          );
        }

      } catch (err) {

        console.error(
          "ERROR GENERAL:",
          err
        );

      } finally {

        setLoading(false);
      }
    };

    load();

  }, []);

  const handleFolderCreated = (
    folder
  ) => {

    setFolders((prev) => [
      folder,
      ...prev
    ]);
  };

  const handleDeleteFolder = async (
    folderId
  ) => {

    try {

      await apiClient.deleteFolder(
        folderId
      );

      setFolders((prev) =>
        prev.filter(
          (f) => f.id !== folderId
        )
      );

    } catch (err) {

      console.error(
        "ERROR ELIMINANDO:",
        err
      );
    }
  };

  if (loading) {

    return (

      <div className="fixed inset-0 flex items-center justify-center bg-background">

        <Loader2 className="w-8 h-8 animate-spin text-primary" />

      </div>
    );
  }

  if (user?.role !== "admin") {

    return (

      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4">

        <ShieldAlert
          className="w-14 h-14"
          style={{ color: "#CC1100" }}
        />

        <h2 className="text-xl font-bold font-space text-center">
          Acceso restringido
        </h2>

        <p className="text-sm text-muted-foreground text-center">
          Esta sección es solo para administradores.
        </p>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-background">

      <AnimatedBlobs />

      <AnimatePresence>

        {showNewFolder && (

          <NewFolderModal
            onClose={() =>
              setShowNewFolder(false)
            }
            onCreated={
              handleFolderCreated
            }
          />

        )}

      </AnimatePresence>

      <main className="relative z-10 pt-8 pb-8 px-4 max-w-2xl mx-auto space-y-5">

        <motion.div
          initial={{
            opacity: 0,
            y: -8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="flex items-center justify-between"
        >

          <div>

            <h1 className="text-2xl font-bold font-space">

              Base de{" "}

              <span
                style={{
                  color: "#CC1100"
                }}
              >
                Audios
              </span>

            </h1>

            <p className="text-sm text-muted-foreground mt-0.5">
              Administración de audios de entrenamiento
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setShowNewFolder(true)
            }
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{
              backgroundColor: "#CC1100"
            }}
          >

            <Plus className="w-4 h-4" />

            Nueva carpeta

          </button>

        </motion.div>

        <div className="bg-white rounded-xl border border-border px-5 py-3 shadow-sm">

          <p className="text-sm font-medium">

            Carpetas creadas:{" "}

            <span
              className="font-bold"
              style={{
                color: "#CC1100"
              }}
            >
              {folders.length}
            </span>

          </p>

        </div>

        {folders.length === 0 ? (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-3"
          >

            <Folder className="w-12 h-12 mx-auto text-muted-foreground/30" />

            <p className="text-muted-foreground text-sm">
              No hay carpetas todavía.
            </p>

          </motion.div>

        ) : (

          <div className="space-y-3">

            {folders.map((folder, i) => (

              <motion.div
                key={folder.id}
                initial={{
                  opacity: 0,
                  y: 12
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: i * 0.05
                }}
              >

                <FolderRow
                  folder={folder}
                  onDelete={
                    handleDeleteFolder
                  }
                />

              </motion.div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}