const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const PORT = process.env.PORT || 3000;
const connectDB = require("./config/db");
const verifyToken = require("./middleware/userAuth.middleware");

dotenv.config(); // Load config

async function main() {
  // Connect to database
  await connectDB();

  // MIDDLEWARES
  // parse json body in request (for POST, PUT, PATCH requests)
  app.use(express.json());
  app.use(express.static("public"));

  // allow CORS for local development (for production, you should configure it properly)
  app.use(cors());

  // Routes
  const authRoutes = require("./routes/auth.routes");
  const taskRoutes = require("./routes/task.routes");

  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", verifyToken, taskRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

main();
