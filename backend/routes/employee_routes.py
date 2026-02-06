from flask import Blueprint

employee_bp = Blueprint("employee", __name__)

@employee_bp.route("/test")
def test_employee():
    return {"message": "Employee route working"}
