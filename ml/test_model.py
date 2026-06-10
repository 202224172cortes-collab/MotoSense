import joblib
from predictor import extract_features

# Cargar modelo entrenado
model = joblib.load(
    r"C:\Users\HP VICTUS\Desktop\MotoSense\ml\motosense_model.pkl"
)

# Audio a analizar
audio = r"E:\Audios_Buenos\AUDIO-2026-05-14-18-52-08.m4a.mp4"

# Extraer características
features = extract_features(audio)

# Predecir
pred = model.predict([features])[0]

# Mostrar resultado
print("\n====================")
print("RESULTADO")
print("====================")
print("Clase detectada:", pred)

if pred == 1:
    print("Diagnóstico: Clase 1")
elif pred == 2:
    print("Diagnóstico: Clase 2")
else:
    print("Diagnóstico desconocido")