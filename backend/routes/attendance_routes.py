from flask import Blueprint, request, jsonify
from database.db import db
from datetime import datetime

attendance_bp = Blueprint("attendance", __name__)

attendance_collection = db["attendance"]
employees_collection = db["employees"]

@attendance_bp.route("/", methods=["POST"])
def mark_attendance():
    data = request.json
    employeeId = data.get("employeeId")
    date = data.get("date")  # format: YYYY-MM-DD
    status = data.get("status")

    if not employeeId or not date or not status:
        return jsonify({"error": "employeeId, date and status are required"}), 400

    if status not in ["Present", "Absent"]:
        return jsonify({"error": "Status must be Present or Absent"}), 400
    
    employee = employees_collection.find_one({"employeeId": employeeId})
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    existing = attendance_collection.find_one({"employeeId": employeeId, "date": date})
    if existing:
        return jsonify({"error": "Attendance already marked for this date"}), 409
    
    attendance_data = {
        "employeeId": employeeId,
        "date": date,
        "status": status,
        "createdAt": datetime.utcnow()
    }

    attendance_collection.insert_one(attendance_data)

    return jsonify({"message": "Attendance marked successfully"}), 201

@attendance_bp.route("/<employeeId>", methods=["GET"])
def get_attendance(employeeId):
    # check employee exists
    employee = employees_collection.find_one({"employeeId": employeeId})
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    records = list(attendance_collection.find(
        {"employeeId": employeeId},
        {"_id": 0}
    ))

    return jsonify(records), 200

# FILTER ATTENDANCE BY DATE (Bonus)
@attendance_bp.route("/<employeeId>/filter", methods=["GET"])
def filter_attendance_by_date(employeeId):
    date = request.args.get("date")  # YYYY-MM-DD

    if not date:
        return jsonify({"error": "date query param is required"}), 400

    employee = employees_collection.find_one({"employeeId": employeeId})
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    records = list(attendance_collection.find(
        {"employeeId": employeeId, "date": date},
        {"_id": 0}
    ))

    return jsonify(records), 200


@attendance_bp.route("/<employeeId>/summary", methods=["GET"])
def attendance_summary(employeeId):
    employee = employees_collection.find_one({"employeeId": employeeId})
    if not employee:
        return jsonify({"error": "Employee not found"}), 404

    total_present = attendance_collection.count_documents({
        "employeeId": employeeId,
        "status": "Present"
    })

    total_absent = attendance_collection.count_documents({
        "employeeId": employeeId,
        "status": "Absent"
    })

    total_records = attendance_collection.count_documents({
        "employeeId": employeeId
    })

    return jsonify({
        "employeeId": employeeId,
        "totalRecords": total_records,
        "totalPresent": total_present,
        "totalAbsent": total_absent
    }), 200
