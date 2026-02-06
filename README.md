HRMS Lite
🛠 Project Overview

HRMS Lite is a complete Employee & Attendance Management System built with:

Frontend: React (Vite) + Tailwind CSS

Backend: Flask (Python)

Database: MongoDB Atlas

Deployment: Vercel (Frontend) + Render (Backend)

It allows admin users to:
✅ Add / list / delete employees
✅ Mark attendance per employee
✅ View attendance history and summary
✅ Filter attendance by date
✅ Dashboard with live analytics

🚀 Live Links

🔗 Frontend (Live App)
👉 https://hrms-project-eight.vercel.app/

🔗 Backend APIs (Live)
👉 https://hrms-project-e557.onrender.com/

🔗 GitHub Repository
👉 https://github.com/dhruv-809/hrms-project

📌 Features
Employee Management

✔ Add Employees
✔ Delete Employees
✔ View Employees List

Attendance Tracking

✔ Mark Present / Absent
✔ Filter by Date
✔ Attendance Summary (Total Present / Absent)

Dashboard

✔ Live total counts
✔ Pie chart visualization
✔ Recent employees table

Responsive UI

✔ Works on desktop and mobile screens

🧠 Tech Stack :

Frontend - React + Vite + Tailwind CSS
Backend - Flask (Python)
Database - MongoDB Atlas
Dev Tools - Axios, Recharts
Deployment - Vercel, Render

🗺 API Endpoints :

Employees :
Method   |   Endpoint      |     Description
GET -     /api/employees/     (List all employees)
POST -    /api/employees/     (Add a new employee)
DELETE -  /api/employees/:id  (Delete employee)

Attendance :
Method              Endpoint                            Description
POST    /api/attendance/                             Mark attendance
GET     /api/attendance/:employeeId                  Get attendance
GET     /api/attendance/:id/filter?date=YYYY-MM-DD   Filter attendance
GET     /api/attendance/:id/summary                  Attendance summary

Dashboard :

Method                Endpoint                Description
GET           /api/dashboard/summary         Dashboard metrics

🧩 How to Run Locally
Backend Setup:

Go to backend folder

Create virtual environment and install:

python -m venv venv
venv\Scripts\activate # Windows
pip install -r requirements.txt

Create .env file:

MONGO_URI=<Your MongoDB Atlas URI>

Run:

python app.py

Frontend Setup

Go to frontend folder

Install dependencies and start:

npm install
npm run dev

Then open:

http://localhost:5173/

🙌 Thank You

If you like this project or have suggestions, feel free to open an issue or PR on GitHub!
