from database.db import db
from datetime import datetime

class BaseAudio(db.Model):

    __tablename__ = "base_audios"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    folder_id = db.Column(
        db.Integer,
        db.ForeignKey("audio_folders.id"),
        nullable=False
    )

    file_name = db.Column(
        db.String(255)
    )

    file_url = db.Column(
        db.String(500)
    )

    created_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )