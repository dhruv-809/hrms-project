from flask import Blueprint, jsonify
from database.db import db
from datetime import datetime

dashboard_bp = Blueprint("dashboard", __name__)

employees_collection = db["employees"]
attendance_collection = db["attendance"]


@dashboard_bp.route("/summary", methods=["GET"])
def dashboard_summary():
    today_date = datetime.now().strftime("%Y-%m-%d")

    total_employees = employees_collection.count_documents({})
    total_attendance = attendance_collection.count_documents({})

    today_present = attendance_collection.count_documents({
        "date": today_date,
        "status": "Present"
    })

    today_absent = attendance_collection.count_documents({
        "date": today_date,
        "status": "Absent"
    })

    return jsonify({
        "totalEmployees": total_employees,
        "totalAttendanceRecords": total_attendance,
        "todayDate": today_date,
        "todayPresent": today_present,
        "todayAbsent": today_absent
    }), 200
