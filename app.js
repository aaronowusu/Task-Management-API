require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/task");
const authRoutes = require("./routes/auth");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

// Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "A simple task manager API",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

// Connect to MongoDB
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Init Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Define Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/task", taskRoutes);
app.use("/auth", authRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message });
});

// 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

// Export the app
module.exports = app;
