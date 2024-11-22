import { Router } from "express";
import {
  addItem,
  removeItem,
  getItems,
  clearCart,
  updateItem,
} from "./../controller/CartController";
import { validateAddItem } from "./../middlewares/validation/addItemValidation";
import { validateUpdateItem } from "./../middlewares/validation/updateItemValidation";
import authMiddleware from "./../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/v1/cart/items:
 *   get:
 *     summary: Retrieve all items in the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: A list of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   productId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/items", getItems);

/**
 * @swagger
 * /api/v1/cart/items:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               name:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/items", authMiddleware("CUSTOMER"), validateAddItem, addItem);

/**
 * @swagger
 * /api/v1/cart/items:
 *   delete:
 *     summary: Clear all items from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Cart cleared
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("/items", authMiddleware("CUSTOMER"), clearCart);

/**
 * @swagger
 * /api/v1/cart/items/{cartItemId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart item to remove
 *     responses:
 *       204:
 *         description: Item removed from the cart
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.delete("/items/:cartItemId", authMiddleware("CUSTOMER"), removeItem);

/**
 * @swagger
 * /api/v1/cart/items/{cartItemId}:
 *   put:
 *     summary: Update an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item updated in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 productId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/items/:cartItemId",
  authMiddleware("CUSTOMER"),
  validateUpdateItem,
  updateItem
);

export default router;
