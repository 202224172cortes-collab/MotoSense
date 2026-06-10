from flask import Blueprint, jsonify

membership_bp = Blueprint(
    "membership",
    __name__
)

@membership_bp.route(
    "/",
    methods=["GET"]
)
def get_membership():

    return jsonify({
        "plan": "free",
        "status": "active",
        "analyses_used": 0,
        "analyses_limit": 3
    })