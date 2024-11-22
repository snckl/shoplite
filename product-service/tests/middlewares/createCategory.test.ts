import request from "supertest";
import express from "express";
import { validateCreateCategory as createCategoryValidation } from "../../src/middlewares/routeValidators/createCategoryValidation";

const app = express();
app.use(express.json());
app.post("/category", createCategoryValidation, (req, res) => {
  res.status(200).send("Category created");
});

describe("createCategory validation middleware", () => {
  it("should pass validation with valid data", async () => {
    const response = await request(app).post("/category").send({
      name: "Electronics",
      description: "Category for electronic items",
    });

    expect(response.status).toBe(200);
    expect(response.text).toBe("Category created");
  });

  it("should fail validation with missing name", async () => {
    const response = await request(app).post("/category").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  it("should fail validation with empty name", async () => {
    const response = await request(app).post("/category").send({ name: "" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  it("should fail validation with name that is too short", async () => {
    const response = await request(app).post("/category").send({ name: "El" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  it("should fail validation with name that is too long", async () => {
    const response = await request(app)
      .post("/category")
      .send({ name: "E".repeat(101) });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});
