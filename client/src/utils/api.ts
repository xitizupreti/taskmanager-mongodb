import axios from "axios"

// Use environment variable if available, otherwise use environment-based URL
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production" ? "https://taskmanager-backend-1u05.onrender.com" : "http://localhost:5000")

console.log("Using API URL:", API_URL)

// Create and export axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

export default api