from flask import Flask
from flask_cors import CORS
from database.db import db
from routes.auth import auth_bp
from routes.analysis import analysis_bp
from routes.membership import membership_bp
from routes.admin import admin_bp
from models.user import User
from models.audio_analysis import AudioAnalysis
from models.membership import Membership
from models.audio_folder import AudioFolder
from models.base_audio import BaseAudio


app = Flask(__name__)

CORS(app)

import os

BASE_DIR = os.path.abspath(
    os.path.dirname(__file__)
)

DB_PATH = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "..",
        "instance",
        "motosense.db"
    )
)



app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"sqlite:///{DB_PATH}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# ==========================
# AUTH
# ==========================
app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)


# ==========================
# ANALYSIS
# ==========================
app.register_blueprint(
    analysis_bp,
    url_prefix="/api/analysis"
)

# ==========================
# MEMBERSHIP
# ==========================
app.register_blueprint(
    membership_bp,
    url_prefix="/api/membership"
)
#ADMIN
app.register_blueprint(
    admin_bp,
    url_prefix="/api/admin"
)
# ==========================
# HOME
# ==========================
@app.route("/")
def home():

    return {
        "status": "ok",
        "message": "MotoSense API funcionando"
    }

# ==========================
# START APP
# ==========================
if __name__ == "__main__":

    with app.app_context():

        db.create_all()

        import os

    print(
    "DB PATH:",
    os.path.abspath("motosense.db")
    )

    app.run(
        debug=True,
        port=5000
    )