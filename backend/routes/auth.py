from flask import Blueprint, request, jsonify
from models.user import User
from database.db import db
import bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "message": "Datos incompletos"
        }), 400

    existing = User.query.filter_by(
        email=email
    ).first()

    if existing:
        return jsonify({
            "message": "El usuario ya existe"
        }), 400

    hashed = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    )

    user = User(
        email=email,
        password=hashed.decode()
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "Usuario creado"
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(
        email=email
    ).first()

    if not user:
        return jsonify({
            "message": "Credenciales inválidas"
        }), 401

    if not bcrypt.checkpw(
        password.encode(),
        user.password.encode()
    ):
        return jsonify({
            "message": "Credenciales inválidas"
        }), 401

    return jsonify({
        "id": user.id,
        "email": user.email,
        "role": user.role
    })