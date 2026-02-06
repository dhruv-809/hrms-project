import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600">HRMS Lite</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-600 focus:outline-none"
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "block" : "hidden"} md:block`}>
        <Sidebar closeMobile={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}