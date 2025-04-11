// server/server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();
const app = express();

// Middleware order matters - CORS should be before routes
// Configure CORS with appropriate options
const allowedOrigins = [
  "http://localhost:3000",
  "https://taskmanager-mongodb.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// Add OPTIONS handling for preflight requests
app.options("*", cors());

// Parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Connect to database
connectDB();

// Routes
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
