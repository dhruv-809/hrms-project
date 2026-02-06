from flask import Blueprint

leave_bp = Blueprint("leave", __name__)

@leave_bp.route("/test")
def test_leave():
    return {"message": "Leave route working"}
