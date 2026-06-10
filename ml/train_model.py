import sys
import os
import traceback
import tempfile
import subprocess

# ==========================
# RUTAS
# ==========================
ROOT_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        ".."
    )
)

BACKEND_PATH = os.path.join(
    ROOT_PATH,
    "backend"
)

sys.path.append(BACKEND_PATH)

# ==========================
# IMPORTS
# ==========================
import librosa
import numpy as np
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix
)

from app import app
from models.base_audio import BaseAudio

# ==========================
# CONFIG
# ==========================
FFMPEG_PATH = r"C:\Users\HP VICTUS\Downloads\ffmpeg-2026-06-08-git-6028720d70-full_build\bin\ffmpeg.exe"

# ==========================
# DATASETS
# ==========================
X = []
y = []

# ==========================
# FEATURES
# ==========================
def extract_features(audio_path):

    with tempfile.NamedTemporaryFile(
        suffix=".wav",
        delete=False
    ) as temp_wav:

        wav_path = temp_wav.name

    subprocess.run(
        [
            FFMPEG_PATH,
            "-i",
            audio_path,
            "-ar",
            "22050",
            "-ac",
            "1",
            "-y",
            wav_path
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    y_audio, sr = librosa.load(
        wav_path,
        sr=22050
    )

    print(
        "Duracion:",
        round(
            len(y_audio) / sr,
            2
        ),
        "segundos"
    )

    # ==========================
    # MFCC
    # ==========================

    mfccs = librosa.feature.mfcc(
        y=y_audio,
        sr=sr,
        n_mfcc=40
    )

    mfcc_mean = np.mean(
        mfccs,
        axis=1
    )

    mfcc_std = np.std(
        mfccs,
        axis=1
    )

    # ==========================
    # CHROMA
    # ==========================

    chroma = librosa.feature.chroma_stft(
        y=y_audio,
        sr=sr
    )

    chroma_mean = np.mean(
        chroma,
        axis=1
    )

    # ==========================
    # SPECTRAL CONTRAST
    # ==========================

    contrast = librosa.feature.spectral_contrast(
        y=y_audio,
        sr=sr
    )

    contrast_mean = np.mean(
        contrast,
        axis=1
    )

    # ==========================
    # SPECTRAL CENTROID
    # ==========================

    spectral_centroid = librosa.feature.spectral_centroid(
        y=y_audio,
        sr=sr
    )

    # ==========================
    # SPECTRAL ROLLOFF
    # ==========================

    spectral_rolloff = librosa.feature.spectral_rolloff(
        y=y_audio,
        sr=sr
    )

    # ==========================
    # SPECTRAL BANDWIDTH
    # ==========================

    spectral_bandwidth = librosa.feature.spectral_bandwidth(
        y=y_audio,
        sr=sr
    )

    # ==========================
    # ZCR
    # ==========================

    zcr = librosa.feature.zero_crossing_rate(
        y_audio
    )

    zcr_mean = np.mean(
        zcr
    )

    # ==========================
    # RMS
    # ==========================

    rms = librosa.feature.rms(
        y=y_audio
    )

    rms_mean = np.mean(
        rms
    )

    # ==========================
    # FEATURE VECTOR
    # ==========================

    features = np.hstack(
        [
            mfcc_mean,
            mfcc_std,
            chroma_mean,
            contrast_mean,
            [zcr_mean],
            [rms_mean],
            [np.mean(spectral_centroid)],
            [np.mean(spectral_rolloff)],
            [np.mean(spectral_bandwidth)]
        ]
    )

    os.remove(
        wav_path
    )

    return features
# ==========================
# DEBUG
# ==========================
print("\nROOT:")
print(ROOT_PATH)

print("\nBACKEND:")
print(BACKEND_PATH)

print("\nCURRENT DIR:")
print(os.getcwd())


# ==========================
# CARGAR AUDIOS
# ==========================
with app.app_context():

    audios = BaseAudio.query.all()

    print(
        f"\nAudios encontrados: {len(audios)}"
    )

    for audio in audios:

        try:

            audio_path = os.path.join(
                ROOT_PATH,
                audio.file_url
            )

            print(
                f"\nProcesando: {audio.file_name}"
            )

            if not os.path.exists(audio_path):

                print(
                    "NO EXISTE"
                )

                continue

            features = extract_features(
                audio_path
            )

            X.append(
                features
            )

            y.append(
                audio.folder_id
            )

            print(
                "OK"
            )

        except Exception as e:

            print(
                f"\nERROR EN {audio.file_name}"
            )

            print(
                repr(e)
            )

            traceback.print_exc()


# ==========================
# VALIDAR DATOS
# ==========================
print(
    f"\nAudios procesados: {len(X)}"
)

if len(X) == 0:

    print(
        "\nNo se pudo procesar ningún audio."
    )

    exit()

X = np.array(X)
y = np.array(y)

print("\nPrimer vector:")
print(X[0])

print("\nSegundo vector:")
print(X[1])

print("\nTercer vector:")
print(X[2])

print("\nPrimeros 20 labels:")
print(y[:20])

print("\nClases encontradas:")
print(np.unique(y))

for clase in np.unique(y):

    print(
        f"Clase {clase}:",
        np.sum(y == clase)
    )

print(
    "Shape X:",
    X.shape
)

# ==================================
# PRUEBA SOBRE LOS MISMOS DATOS
# ==================================
print("\n==============================")
print("PRUEBA SOBRE LOS MISMOS DATOS")
print("==============================")

model_debug = RandomForestClassifier(
    n_estimators=500,
    random_state=42,
    n_jobs=-1
)

model_debug.fit(
    X,
    y
)

pred_debug = model_debug.predict(
    X
)

print(
    classification_report(
        y,
        pred_debug
    )
)

print(
    "Accuracy entrenamiento:",
    accuracy_score(
        y,
        pred_debug
    )
)

print("\n==============================\n")

# ==========================
# TRAIN / TEST
# ==========================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print(
    f"\nTrain: {len(X_train)}"
)

print(
    f"Test: {len(X_test)}"
)

# ==========================
# MODELO
# ==========================
model = RandomForestClassifier(
    n_estimators=1000,
    max_depth=20,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1
)

print(
    "\nEntrenando modelo..."
)

model.fit(
    X_train,
    y_train
)

# ==========================
# EVALUACIÓN
# ==========================
predicciones = model.predict(
    X_test
)

print("\nY TEST")
print(y_test)

print("\nPREDICCIONES")
print(predicciones)

print("\nMATRIZ")
print(
    confusion_matrix(
        y_test,
        predicciones
    )
)

print(
    "\nAccuracy:",
    accuracy_score(
        y_test,
        predicciones
    )
)

print(
    "\nClassification Report\n"
)

print(
    classification_report(
        y_test,
        predicciones
    )
)

# ==========================
# GUARDAR MODELO
# ==========================
MODEL_PATH = os.path.join(
    ROOT_PATH,
    "ml",
    "motosense_model.pkl"
)

joblib.dump(
    model,
    MODEL_PATH
)

print(
    f"\nModelo guardado en:\n{MODEL_PATH}"
)

print("\nClases encontradas:")
print(set(y))