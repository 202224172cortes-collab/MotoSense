ALLOWED_EXTENSIONS = {
    ".wav",
    ".mp3",
    ".m4a",
    ".aac",
    ".ogg",
    ".flac",
    ".wma",
    ".opus",
    ".mp4",
    ".mpeg",
    ".mpga",
    ".webm",
    ".3gp"
}

import sys
import os

ROOT_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".."
    )
)

sys.path.append(ROOT_PATH)

from ml.predictor import predict_audio

from flask import Blueprint, request, jsonify
from models.audio_folder import AudioFolder
from database.db import db
from models.base_audio import BaseAudio
import uuid
from ml.predictor import predict_audio

admin_bp = Blueprint("admin", __name__)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Crear carpeta
@admin_bp.route("/folders", methods=["POST"])
def create_folder():

    data = request.get_json()

    folder = AudioFolder(
        name=data.get("name"),
        description=data.get("description"),
        color=data.get("color")
    )

    db.session.add(folder)
    db.session.commit()

    return jsonify({
        "id": folder.id,
        "name": folder.name,
        "description": folder.description,
        "color": folder.color,
        "audio_count": folder.audio_count
    })

# Obtener carpetas
@admin_bp.route("/folders", methods=["GET"])
def get_folders():

    folders = AudioFolder.query.all()

    result = []

    for f in folders:

        count = BaseAudio.query.filter_by(
            folder_id=f.id
        ).count()

        result.append({
            "id": f.id,
            "name": f.name,
            "description": f.description,
            "color": f.color,
            "audio_count": count
        })

    return jsonify(result)

@admin_bp.route(
    "/upload-audio",
    methods=["POST"]
)
def upload_audio():
    
    
    file = request.files.get("file")
    folder_id = request.form.get("folder_id")

    if not file:

        return jsonify({
            "message": "No se recibió archivo"
        }), 400

    extension = os.path.splitext(
    file.filename
     )[1].lower()

    filename = (
    str(uuid.uuid4()) +
    extension
)

    save_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    file.save(save_path)

    prediction = predict_audio(save_path)

    print("Predicción:", prediction)

    audio = BaseAudio(
    folder_id=1,
    file_name=filename,
    file_url=save_path
    )

    db.session.add(audio)


    db.session.commit()

    return jsonify({
    "message": "Audio subido correctamente",
    "audio_id": audio.id,
    "file_name": audio.file_name,
    "prediction": prediction
    })



@admin_bp.route(
    "/folder/<int:folder_id>/audios",
    methods=["GET"]
)
def get_folder_audios(folder_id):

    audios = BaseAudio.query.filter_by(
        folder_id=folder_id
    ).all()

    return jsonify([
        {
            "id": a.id,
            "file_name": a.file_name,
            "file_url": a.file_url
        }
        for a in audios
    ])

#ELIMINA CARPETA BOTON
@admin_bp.route(
    "/folders/<int:folder_id>",
    methods=["DELETE"]
)
def delete_folder(folder_id):

    folder = AudioFolder.query.get(folder_id)

    if not folder:

        return jsonify({
            "message": "Carpeta no encontrada"
        }), 404

    audios = BaseAudio.query.filter_by(
        folder_id=folder_id
    ).all()

    for audio in audios:

        if (
            audio.file_url and
            os.path.exists(audio.file_url)
        ):
            os.remove(audio.file_url)

        db.session.delete(audio)

    db.session.delete(folder)

    db.session.commit()

    return jsonify({
        "message": "Carpeta eliminada"
    })


@admin_bp.route(
    "/audio/<int:audio_id>",
    methods=["DELETE"]
)
def delete_audio(audio_id):

    audio = BaseAudio.query.get(audio_id)

    if not audio:

        return jsonify({
            "message": "Audio no encontrado"
        }), 404

    if (
        audio.file_url and
        os.path.exists(audio.file_url)
    ):
        os.remove(audio.file_url)

    db.session.delete(audio)

    db.session.commit()

    return jsonify({
        "message": "Audio eliminado"
    })