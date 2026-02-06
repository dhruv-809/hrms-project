import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard/summary");
      const empRes = await api.get("/employees/");
      setData(res.data);
      setEmployees(empRes.data.slice(0, 5));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading dashboard...</p>;
  }

  if (!data) {
    return <p className="text-red-500">Failed to load dashboard data.</p>;
  }

  const barData = [
    { name: "Present", value: data.todayPresent },
    { name: "Absent", value: data.todayAbsent },
  ];

  const pieData = [
    { name: "Present", value: data.todayPresent },
    { name: "Absent", value: data.todayAbsent },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      <p className="text-gray-500 mb-6">
        Overview of employees and today’s attendance
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Employees</p>
          <h3 className="text-3xl font-bold text-blue-600">
            {data.totalEmployees}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Total Attendance Entries</p>
          <h3 className="text-3xl font-bold text-purple-600">
            {data.totalAttendanceRecords}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Today Present</p>
          <h3 className="text-3xl font-bold text-green-600">
            {data.todayPresent}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Today Absent</p>
          <h3 className="text-3xl font-bold text-red-600">
            {data.todayAbsent}
          </h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Today Attendance (Pie Chart)
          </h3>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Recent Employees */}
        <div className="bg-white p-6 rounded-xl shadow mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Employees</h3>

          {employees.length === 0 ? (
            <p className="text-gray-500">No employees found.</p>
          ) : (
            <table className="w-full table-fixed border-collapse">
  <thead>
    <tr className="bg-gray-100 text-left">
      <th className="p-3 w-2/3">Name</th>
      <th className="p-3 w-1/3">Department</th>
    </tr>
  </thead>

  <tbody>
    {employees.map((emp) => (
      <tr key={emp.employeeId} className="border-b hover:bg-gray-50">
        <td className="p-3 truncate">{emp.fullName}</td>
        <td className="p-3 font-semibold text-blue-600 truncate">
          {emp.department}
        </td>
      </tr>
    ))}
  </tbody>
</table>

          )}
        </div>
      </div>
    </div>
  );
}
