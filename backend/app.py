from flask import Flask
from flask_cors import CORS

from routes.employee_routes import employee_bp
from routes.attendance_routes import attendance_bp
from routes.dashboard_routes import dashboard_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(employee_bp, url_prefix="/api/employees")
app.register_blueprint(attendance_bp, url_prefix="/api/attendance")
app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")


@app.route("/")
def home():
    return {"message": "HRMS Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)
