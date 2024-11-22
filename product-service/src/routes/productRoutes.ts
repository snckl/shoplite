import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsByCategoryName,
  getProductById,
  updateProduct,
} from "./../controller/ProductController";
import authMiddleware from "./../middlewares/authMiddleware";
import { validateCreateProduct } from "./../middlewares/routeValidators/createProductValidation";
import { validateUpdateProduct } from "./../middlewares/routeValidators/updateProductValidation";

const router = express.Router();
/**
 * @swagger
 * /api/v1/product/create:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/create",
  authMiddleware("ADMIN"),
  validateCreateProduct,
  createProduct
);
/**
 * @swagger
 * /api/v1/product/{id}/update:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put(
  "/:id/update",
  authMiddleware("ADMIN"),
  validateUpdateProduct,
  updateProduct
);
/**
 * @swagger
 * /api/v1/product/{id}/delete:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete("/:id/delete", authMiddleware("ADMIN"), deleteProduct);
/**
 * @swagger
 * /api/v1/product/{name}/category:
 *   get:
 *     summary: Get products by category name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The category name
 *     responses:
 *       200:
 *         description: List of products
 *       404:
 *         description: Category not found
 */
router.get("/:name/category", getProductsByCategoryName);
/**
 * @swagger
 * /api/v1/product/:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

export default router;
