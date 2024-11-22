import "reflect-metadata";
import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import cartRoutes from "./routes/cartRoutes";
import authMiddleware from "./middlewares/authMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
app.use(express.json());
app.use(loggerMiddleware);

// Define Swagger options
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cart Service for ShopLite - Octopus Signage Case Study",
      version: "1.0.0",
      description: "API documentation for the Cart Service",
    },
    servers: [
      {
        url: "http://localhost",
        description: "Development Server of Cart Service",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/types/*.ts"],
};

// Initialize Swagger JSDoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use("/cart-api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/cart", authMiddleware("CUSTOMER"), cartRoutes);

// Error handler middleware
app.use(errorHandler);

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    url: req.originalUrl,
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });
});

export default app;
