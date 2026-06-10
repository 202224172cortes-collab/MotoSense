from database.db import db
from datetime import datetime

class Membership(db.Model):

    __tablename__ = "membership"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        nullable=False
    )

    plan = db.Column(
        db.String(50),
        default="free"
    )

    status = db.Column(
        db.String(50),
        default="active"
    )

    analyses_used = db.Column(
        db.Integer,
        default=0
    )

    analyses_limit = db.Column(
        db.Integer,
        default=3
    )

    expires_at = db.Column(
        db.DateTime
    )