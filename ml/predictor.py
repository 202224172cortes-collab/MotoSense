import os
import tempfile
import subprocess
import librosa
import numpy as np
import joblib

# ==========================
# CONFIG
# ==========================
FFMPEG_PATH = r"C:\Users\HP VICTUS\Downloads\ffmpeg-2026-06-08-git-6028720d70-full_build\bin\ffmpeg.exe"

ROOT_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        ".."
    )
)

MODEL_PATH = os.path.join(
    ROOT_PATH,
    "ml",
    "motosense_model.pkl"
)

# ==========================
# CARGAR MODELO
# ==========================
model = joblib.load(
    MODEL_PATH
)

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

    chroma = librosa.feature.chroma_stft(
        y=y_audio,
        sr=sr
    )

    chroma_mean = np.mean(
        chroma,
        axis=1
    )

    contrast = librosa.feature.spectral_contrast(
        y=y_audio,
        sr=sr
    )

    contrast_mean = np.mean(
        contrast,
        axis=1
    )

    zcr = librosa.feature.zero_crossing_rate(
        y_audio
    )

    rms = librosa.feature.rms(
        y=y_audio
    )

    spectral_centroid = librosa.feature.spectral_centroid(
        y=y_audio,
        sr=sr
    )

    spectral_rolloff = librosa.feature.spectral_rolloff(
        y=y_audio,
        sr=sr
    )

    spectral_bandwidth = librosa.feature.spectral_bandwidth(
        y=y_audio,
        sr=sr
    )

    features = np.hstack(
        [
            mfcc_mean,
            mfcc_std,
            chroma_mean,
            contrast_mean,
            [np.mean(zcr)],
            [np.mean(rms)],
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
# PREDICCIÓN
# ==========================
def predict_audio(audio_path):

    features = extract_features(
        audio_path
    )

    prediction = model.predict(
        [features]
    )[0]

    return int(prediction)

# ==========================
# TRADUCCIÓN
# ==========================
def get_diagnosis(audio_path):

    prediction = predict_audio(
        audio_path
    )

    if prediction == 1:

        return {
            "class": 1,
            "name": "Motor sano"
        }

    elif prediction == 2:

        return {
            "class": 2,
            "name": "Posible desgaste de punterías"
        }

    return {
        "class": 0,
        "name": "Desconocido"
    }