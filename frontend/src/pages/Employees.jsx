import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";


export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/employees/");
      setEmployees(res.data);
    } catch (err) {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add Employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    setError("");

    try {
      await api.post("/employees/", form);
      setForm({ employeeId: "", fullName: "", email: "", department: "" });
      fetchEmployees();
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong.");
    } finally {
      setBtnLoading(false);
    }
  };

  // Delete Employee
  const deleteEmployee = async (employeeId) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employees/${employeeId}`);
      fetchEmployees();
    } catch (err) {
      alert("Failed to delete employee");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Employees</h2>

      {/* Add Employee Form */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Employee</h3>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            placeholder="Employee ID"
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Department"
            className="border p-2 rounded"
          />

          <button
            type="submit"
            disabled={btnLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-4"
          >
            {btnLoading ? "Adding..." : "Add Employee"}
          </button>
        </form>
      </div>

      {/* Employee Table */}
      <div className="bg-white p-5 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Employee List</h3>

        {loading && <Loader />}

        {!loading && employees.length === 0 && (
          <p className="text-gray-500">No employees found.</p>
        )}

        {!loading && employees.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Employee ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Department</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp.employeeId} className="border-b">
                  <td className="p-2">{emp.employeeId}</td>
                  <td className="p-2">{emp.fullName}</td>
                  <td className="p-2">{emp.email}</td>
                  <td className="p-2">{emp.department}</td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteEmployee(emp.employeeId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
