from flask import Blueprint, jsonify, request
from database.db import db
import re
from datetime import datetime

employee_bp = Blueprint("employee", __name__)

employees_collection = db["employees"]

# Email validation regex
EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

@employee_bp.route("/", methods=["POST"])
def add_employee():
    data = request.json

    employeeId = data.get("employeeId")
    fullName = data.get("fullName")
    email = data.get("email")
    department = data.get("department")

    if not employeeId or not fullName or not email or not department:
        return jsonify({"error": "All fields are required"}), 400
    
    employeeId = employeeId.strip().upper()
    department = department.strip().upper()
    fullName = fullName.strip()
    email = email.strip().lower()
    
    if not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Invalid email format"}), 400
    
    existing = employees_collection.find_one({
        "$or": [{"employeeId": employeeId}, {"email": email}]
    })

    if existing:
        return jsonify({"error": "Employee ID or Email already exists"}), 409
    
    employee_data = {
        "employeeId": employeeId,
        "fullName": fullName,
        "email": email,
        "department": department,
        "createdAt": datetime.utcnow()
    }

    employees_collection.insert_one(employee_data)

    return jsonify({"message": "Employee added successfully"}), 201

@employee_bp.route("/", methods=["GET"])
def get_employees():
    # employees = list(employees_collection.find({}, {"_id": 0}))
    employees = list(employees_collection.find({}, {"_id": 0}).sort("createdAt", -1))
    return jsonify(employees), 200

@employee_bp.route("/<employeeId>", methods=["DELETE"])
def delete_employee(employeeId):
    result = employees_collection.delete_one({"employeeId": employeeId})

    if result.deleted_count == 0:
        return jsonify({"error": "Employee not found"}), 404

    return jsonify({"message": "Employee deleted successfully"}), 200