from flask import Blueprint

attendance_bp = Blueprint("attendance", __name__)

@attendance_bp.route("/test")
def test_attendance():
    return {"message": "Attendance route working"}
