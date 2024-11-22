import { UserRegisterDto } from "../types/UserRegisterDto";
import { v4 as uuid } from "uuid";
import { UserLoginDto } from "../types/UserLoginDto";
import { InvalidCredentialsException } from "../exceptions/InvalidCredentialsException";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import prisma from "../config/database";
import { AlreadyExistException } from "../exceptions/AlreadyExistException";
import { publishUserCreatedEvent } from "../rabbitmq/publisher";
import { generateToken } from "./../utils/jwtUtils";

/**
 * May be reCaptcha, MFA, Rate limiting(planning) added to prevent brute force attacks
 * TODO: PLANNING TO ADD EMAIL VERIFICATION (11/17/2024) - bad for testing
 */
class AuthService {
  async register(userData: UserRegisterDto) {
    const userFromDb = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (userFromDb) {
      throw new AlreadyExistException("User with this email already exist");
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = await prisma.user.create({
      data: {
        id: uuid(),
        email: userData.email,
        firstName: userData.name,
        lastName: userData.surname,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    await publishUserCreatedEvent({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return user;
  }
  async login(userData: UserLoginDto) {
    // PROGRESSIVE DELAY TO PREVENT TIMING ATTACKS!
    await new Promise((resolve) => setTimeout(resolve, 200));

    const user = await prisma.user.findUnique({
      where: {
        email: userData.email,
        isActive: true,
      },
    });

    if (!user) {
      throw new InvalidCredentialsException(
        "Invalid credentials.Check your email or password"
      );
    }

    const isPasswordValid = await comparePassword(
      userData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException(
        "Invalid credentials.Check your email or password"
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return token;
  }
}

export default new AuthService();
