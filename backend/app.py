from flask import Flask
from flask_cors import CORS

from routes.auth_routes import auth_bp
from routes.employee_routes import employee_bp
from routes.attendance_routes import attendance_bp
from routes.leave_routes import leave_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(employee_bp, url_prefix="/api/employees")
app.register_blueprint(attendance_bp, url_prefix="/api/attendance")
app.register_blueprint(leave_bp, url_prefix="/api/leaves")

@app.route("/")
def home():
    return {"message": "HRMS Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)
