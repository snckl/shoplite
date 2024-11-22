import request from "supertest";
import express from "express";
import { validateCreateProduct } from "./../../src/middlewares/routeValidators/createProductValidation";

const app = express();
app.use(express.json());
app.post("/products", validateCreateProduct, (req, res) => {
  res.status(201).send("Product created");
});
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(400).json({ error: err.message });
  }
);

describe("validateCreateProduct Middleware", () => {
  it("should pass validation with valid data", async () => {
    const validProduct = {
      name: "Product Name",
      description: "Product description",
      price: 100,
      stock: 10,
      categoryId: "Category-id",
      imageUri: "http://example.com/image.jpg",
    };

    const response = await request(app).post("/products").send(validProduct);
    expect(response.status).toBe(201);
    expect(response.text).toBe("Product created");
  });

  it("should fail validation with missing required fields", async () => {
    const invalidProduct = {
      name: "Pr",
      description: "Desc",
      price: -10,
      stock: 10,
      categoryId: "",
      imageUri: "",
    };

    const response = await request(app).post("/products").send(invalidProduct);

    expect(response.status).toBe(400);
  });

  it("should fail validation with invalid URI", async () => {
    const invalidProduct = {
      name: "Product Name",
      description: "Product description",
      price: 100,
      stock: 10,
      categoryId: "Category-id",
      imageUri: "invalid-uri",
    };

    const response = await request(app).post("/products").send(invalidProduct);

    expect(response.status).toBe(400);
  });

  it("should pass validation without optional imageUri", async () => {
    const validProduct = {
      name: "Product Name",
      description: "Product description",
      price: 100,
      stock: 10,
      categoryId: "Category-id",
    };

    const response = await request(app).post("/products").send(validProduct);

    expect(response.status).toBe(201);
    expect(response.text).toBe("Product created");
  });
});
