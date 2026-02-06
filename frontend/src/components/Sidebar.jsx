import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md p-5">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">HRMS Lite</h1>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`
          }
        >
            📊 Dashboard
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`
          }
        >
          👨‍💼 Employees
        </NavLink>

        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            `p-2 rounded ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`
          }
        >
         📅 Attendance
        </NavLink>
      </nav>
    </div>
  );
}
