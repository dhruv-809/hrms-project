import { useEffect, useState } from "react";
import api from "../api/axios";
import { formatDate } from "../utils/formatDate";
import Loader from "../components/Loader";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);

  const [form, setForm] = useState({
    date: "",
    status: "Present",
  });

  const [filterDate, setFilterDate] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");

  // Load employees
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees/");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Load attendance records
  const fetchAttendance = async (employeeId) => {
    if (!employeeId) return;

    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/attendance/${employeeId}`);
      setAttendance(res.data);

      const summaryRes = await api.get(`/attendance/${employeeId}/summary`);
      setSummary(summaryRes.data);
    } catch (err) {
      setError("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance(selectedEmployee);
  }, [selectedEmployee]);

  // Mark attendance
  const markAttendance = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setError("");

    try {
      await api.post("/attendance/", {
        employeeId: selectedEmployee,
        date: form.date,
        status: form.status,
      });

      setForm({ date: "", status: "Present" });
      fetchAttendance(selectedEmployee);
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setBtnLoading(false);
    }
  };

  // Filter attendance by date
  const filterAttendance = async () => {
  if (!selectedEmployee || !filterDate) return;

  try {
    setFilterLoading(true);
    setError("");

    const res = await api.get(
      `/attendance/${selectedEmployee}/filter?date=${filterDate}`
    );
    setAttendance(res.data);
  } catch (err) {
    setError("Failed to filter attendance.");
  } finally {
    setFilterLoading(false);
  }
};


  // Reset filter
  const resetFilter = () => {
    setFilterDate("");
    fetchAttendance(selectedEmployee);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Attendance</h2>

      {/* Employee Dropdown */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Employee</h3>

        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        >
          <option value="">-- Select Employee --</option>
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.fullName} ({emp.employeeId})
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee && (
        <>
          {/* Summary */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Total Records</p>
                <h3 className="text-2xl font-bold">{summary.totalRecords}</h3>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Total Present</p>
                <h3 className="text-2xl font-bold">{summary.totalPresent}</h3>
              </div>

              <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Total Absent</p>
                <h3 className="text-2xl font-bold">{summary.totalAbsent}</h3>
              </div>
            </div>
          )}

          {/* Mark Attendance Form */}
          <div className="bg-white p-5 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Mark Attendance</h3>

            {error && (
              <p className="bg-red-100 text-red-700 p-2 rounded mb-3">
                {error}
              </p>
            )}

            <form
              onSubmit={markAttendance}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border p-2 rounded"
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border p-2 rounded"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>

              <button
                disabled={btnLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {btnLoading ? "Marking..." : "Mark Attendance"}
              </button>
            </form>
          </div>

          {/* Filter */}
          <div className="bg-white p-5 rounded shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Filter Attendance by Date
            </h3>

            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border p-2 rounded"
              />

              {/* <button
                onClick={filterAttendance}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Filter
              </button> */}
              <button
                onClick={filterAttendance}
                disabled={filterLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
                {filterLoading ? "Filtering..." : "Filter"}
            </button>


              <button
                onClick={resetFilter}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>

            {loading && <Loader />}

            {!loading && attendance.length === 0 && (
              <p className="text-gray-500">No attendance records found.</p>
            )}

            {!loading && attendance.length > 0 && (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-2">Date</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{formatDate(record.date)}</td>
                      <td
                        className={`p-2 font-semibold ${
                          record.status === "Present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {record.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
