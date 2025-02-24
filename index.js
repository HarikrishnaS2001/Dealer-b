const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

const connectDB = require("./config/db");

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses JSON request body

// Basic Route
app.get("/", (req, res) => {
  res.send("Hello, Node.js Server is running! 🚀");
});

const userRouter = require("./routes/user");
app.use(
  "/user",
  (req, res, next) => {
    console.log("Inside main route middleware");
    next();
  },
  userRouter
);

const otpRoutes = require("./routes/otpRoutes");
// app.use("/otp", otpRoutes);
app.use(
  "/otp",
  (req, res, next) => {
    console.log("Inside main route middleware");
    next();
  },
  otpRoutes
);

// Start Server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(notFound);
app.use(errorHandler);
