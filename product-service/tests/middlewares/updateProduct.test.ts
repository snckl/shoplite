import request from "supertest";
import express from "express";
import { validateUpdateProduct as updateProductValidation } from "./../../src/middlewares/routeValidators/updateProductValidation"; // Adjust the path as needed

const app = express();
app.use(express.json());
app.put("/api/products/:id", updateProductValidation, (req, res) => {
  res.status(200).send({ message: "Product updated successfully" });
});
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(400).json({ message: err.message });
  }
);

describe("updateProductValidation Middleware", () => {
  it("should return 400 if product price is invalid", async () => {
    const response = await request(app).put("/api/products/1").send({
      price: -100,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 if product price is not a number", async () => {
    const response = await request(app).put("/api/products/1").send({
      price: "not-a-number",
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 if product stock is invalid", async () => {
    const response = await request(app).put("/api/products/1").send({
      stock: -10,
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 if product stock is not a number", async () => {
    const response = await request(app).put("/api/products/1").send({
      stock: "not-a-number",
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 if categoryId is not a string", async () => {
    const response = await request(app).put("/api/products/1").send({
      categoryId: 123,
    });

    expect(response.status).toBe(400);
  });

  it("should return 200 if all fields are valid", async () => {
    const response = await request(app).put("/api/products/1").send({
      price: 100,
      stock: 10,
      categoryId: "valid-category-id",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product updated successfully");
  });

  it("should return 200 if only price is provided and valid", async () => {
    const response = await request(app).put("/api/products/1").send({
      price: 100,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product updated successfully");
  });

  it("should return 200 if only stock is provided and valid", async () => {
    const response = await request(app).put("/api/products/1").send({
      stock: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product updated successfully");
  });

  it("should return 200 if only categoryId is provided and valid", async () => {
    const response = await request(app).put("/api/products/1").send({
      categoryId: "valid-category-id",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product updated successfully");
  });
});
