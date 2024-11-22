import { Router } from "express";
import { login, register } from "../controller/authController";
import loginValidator from "./../middlewares/routeValidators/loginValidator";
import registerValidator from "./../middlewares/routeValidators/registerValidator";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate user and generate JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Authorization:
 *             description: JWT token to be used in subsequent requests
 *             schema:
 *               type: string
 *               example: "Bearer JWT_TOKEN"
 *       401:
 *         description: Invalid credentials
 *       422:
 *         description: Validation error
 */
router.post("/login", loginValidator, login);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Email already exists
 *       422:
 *         description: Validation error
 */
router.post("/register", registerValidator, register);

export default router;
