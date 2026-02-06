import { NavLink } from "react-router-dom";

export default function Sidebar({ closeMobile }) {
  const linkClass = ({ isActive }) =>
    `p-3 rounded transition-colors flex items-center gap-3 ${
      isActive ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="fixed inset-0 z-40 md:relative md:z-0 w-64 bg-white shadow-xl h-full p-5 flex flex-col">
      <h1 className="hidden md:block text-2xl font-bold text-blue-600 mb-8">HRMS Lite</h1>

      <nav className="flex flex-col gap-3">
        <NavLink to="/" onClick={closeMobile} className={linkClass}>
          <span>📊</span> Dashboard
        </NavLink>
        <NavLink to="/employees" onClick={closeMobile} className={linkClass}>
          <span>👨‍💼</span> Employees
        </NavLink>
        <NavLink to="/attendance" onClick={closeMobile} className={linkClass}>
          <span>📅</span> Attendance
        </NavLink>
      </nav>
      
      {/* Mobile Overlay Background */}
      <div 
        className="md:hidden fixed inset-0 bg-black opacity-20 -z-10" 
        onClick={closeMobile}
      ></div>
    </div>
  );
}