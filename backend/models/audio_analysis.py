from database.db import db
from datetime import datetime

class AudioAnalysis(db.Model):

    __tablename__ = "audio_analysis"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        nullable=False
    )

    file_url = db.Column(
        db.String(500)
    )

    file_name = db.Column(
        db.String(255)
    )

    result = db.Column(
        db.Text
    )

    analysis_details = db.Column(
        db.JSON
    )

    duration_seconds = db.Column(
        db.Float
    )

    status = db.Column(
        db.String(50),
        default="pending"
    )

    created_date = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )