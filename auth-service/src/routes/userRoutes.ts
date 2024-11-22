import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  listUsers,
} from "../controller/userController";
import authMiddleware from "./../middlewares/authMiddleware";

const router = express.Router();
/**
 * @swagger
 * /api/v1/user/all:
 *   get:
 *     summary: Returns a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get("/all", authMiddleware, listUsers);
/**
 * @swagger
 * /api/v1/user/update:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 */
router.put("/update", authMiddleware, updateUser);
/**
 * @swagger
 * /api/v1/user/deleteAccount:
 *   delete:
 *     summary: Delete user account
 *     description: Deletes the authenticated user's account from the system
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User account successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User account deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteAccount", authMiddleware, deleteUser);
/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     description: Get user information by their unique identifier
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getUser);

export default router;
