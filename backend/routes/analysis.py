from flask import Blueprint, jsonify, request
from models.audio_analysis import AudioAnalysis
from database.db import db

analysis_bp = Blueprint(
    "analysis",
    __name__
)

@analysis_bp.route(
    "/",
    methods=["GET"]
)
def get_analysis():

    user_id = request.args.get("user_id")

    query = AudioAnalysis.query

    if user_id:
        query = query.filter_by(
            user_id=user_id
        )

    analyses = query.all()

    return jsonify([
        {
            "id": a.id,
            "user_id": a.user_id,
            "file_name": a.file_name,
            "file_url": a.file_url,
            "result": a.result,
            "analysis_details": a.analysis_details,
            "duration_seconds": a.duration_seconds,
            "status": a.status,
            "created_date": (
                a.created_date.isoformat()
                if a.created_date
                else None
            )
        }
        for a in analyses
    ])

@analysis_bp.route(
    "/",
    methods=["POST"]
)
def create_analysis():

    data = request.get_json()

    analysis = AudioAnalysis(
        user_id=data.get("user_id"),
        file_name=data.get("file_name"),
        file_url=data.get("file_url"),
        result=data.get("result"),
        analysis_details=data.get("analysis_details"),
        duration_seconds=data.get(
            "duration_seconds"
        ),
        status=data.get("status")
    )

    db.session.add(analysis)
    db.session.commit()

    return jsonify({
        "message": "Análisis creado"
    }), 201