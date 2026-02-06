import axios from "axios";

const api = axios.create({
  baseURL: "https://hrms-project-e557.onrender.com/api",
});

export default api;
