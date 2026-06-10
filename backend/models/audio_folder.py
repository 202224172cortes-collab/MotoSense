from database.db import db
from datetime import datetime

class AudioFolder(db.Model):

    __tablename__ = "audio_folders"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.String(255)
    )

    color = db.Column(
        db.String(20)
    )

    audio_count = db.Column(
        db.Integer,
        default=0
    )

    created_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )