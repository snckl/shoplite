# ShopLite Auth Service 🔐

Welcome to the **ShopLite Auth Service**! This service is responsible for user authentication, authorization, and identity management in the ShopLite application.

## Table of Contents

- [Overview](#overview)
- [Dependencies](#dependencies)
  - [Main Dependencies](#main-dependencies)
  - [Development Dependencies](#development-dependencies)
- [Prisma Models](#prisma-models)
  - [User](#user)
  - [Role Enum](#role-enum)
- [API Endpoints](#api-endpoints)
  - [Auth Routes](#auth-routes)
  - [User Routes](#user-routes)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)
  - [Error Types](#error-types)
- [Emitted Events](#emitted-events)
  - [User Events](#user-events)
- [License](#license)

## Overview

The ShopLite Auth Service is built using TypeScript and Prisma ORM. It provides a set of RESTful API endpoints to manage user authentication and authorization.

## Dependencies

### Main Dependencies

| Package                   | Description           |
| ------------------------- | --------------------- |
| @prisma/client            | Prisma ORM client     |
| amqplib                   | AMQP protocol library |
| bcryptjs                  | Password hashing      |
| dotenv                    | Environment variables |
| express                   | Web framework         |
| express-async-errors      | Async error handling  |
| joi                       | Data validation       |
| jsonwebtoken              | JWT authentication    |
| reflect-metadata          | Metadata reflection   |
| uuid                      | UUID generation       |
| winston                   | Logging framework     |
| winston-daily-rotate-file | Log rotation          |

### Development Dependencies

| Package             | Description                    |
| ------------------- | ------------------------------ |
| @types/amqplib      | TypeScript types for AMQP      |
| @types/bcryptjs     | TypeScript types for bcrypt    |
| @types/express      | TypeScript types for Express   |
| @types/jest         | TypeScript types for Jest      |
| @types/jsonwebtoken | TypeScript types for JWT       |
| @types/node         | TypeScript types for Node.js   |
| @types/supertest    | TypeScript types for Supertest |
| jest                | Testing framework              |
| prisma              | Database ORM                   |
| supertest           | HTTP testing                   |
| ts-jest             | Jest TypeScript support        |
| ts-node             | TypeScript execution           |
| typescript          | TypeScript compiler            |

To install all dependencies, run:

```bash
npm install @prisma/client amqplib bcryptjs dotenv express express-async-errors joi jsonwebtoken reflect-metadata uuid winston winston-daily-rotate-file

npm install --save-dev @types/amqplib @types/bcryptjs @types/express @types/jest @types/jsonwebtoken @types/node @types/supertest jest prisma supertest ts-jest ts-node typescript
```

## Prisma Models

The following models are defined in the `.prisma` file:

### User

| Field            | Type     | Description                             |
| ---------------- | -------- | --------------------------------------- |
| id               | String   | Unique identifier (UUID)                |
| email            | String   | User's email address (unique)           |
| password         | String   | Hashed password                         |
| firstName        | String   | User's first name                       |
| lastName         | String   | User's last name                        |
| role             | Role     | User role (ADMIN or CUSTOMER)           |
| createdAt        | DateTime | Timestamp of creation                   |
| updatedAt        | DateTime | Timestamp of last update                |
| isActive         | Boolean  | User account status                     |
| concurrencyStamp | String   | UUID for optimistic concurrency control |

### Role Enum

| Value    | Description        |
| -------- | ------------------ |
| ADMIN    | Administrator role |
| CUSTOMER | Customer role      |

Note: The User model includes an index on the email field for optimized queries.

## API Endpoints

### Auth Routes

- **POST /auth/login**: User login

  - Body:
    ```typescript
    {
      email: string,
      password: string
    }
    ```
  - Response:
    - Status: 200
    - Headers: `Authorization: Bearer <token>`
    - Body:
      ```json
      {
        "status": "success",
        "message": "Login successful"
      }
      ```

- **POST /auth/register**: User registration

  - Body:
    ```typescript
    {
      email: string,
      password: string,
      firstName: string,
      lastName: string
    }
    ```
  - Response:
    - Status: 201
    - Body:
      ```json
      {
        "status": "success",
        "message": "Registration successful"
      }
      ```

- **POST /auth/reset-password**: Will be added soon

### User Routes

- **GET /users**: Get paginated list of users
  - Query params: `page` (optional, default: 1)
  - Response: List of users with pagination info
- **GET /users/:id**: Get specific user details

  - Param: `id` (user ID)
  - Response: User details

- **PUT /users/:id**: Update user profile

  - Auth required
  - Body: Updated user data
  - Response: No content (204)

- **DELETE /users/:id**: Delete user account
  - Auth required
  - Response: No content (204)

Note: All routes require authentication except as noted. Admin role is required for listing and accessing other users' data.

## Environment Variables

| Variable     | Description                  | Example Value     |
| ------------ | ---------------------------- | ----------------- |
| PORT         | Server port number           | 0000              |
| NODE_ENV     | Environment mode             | development       |
| DATABASE_URL | PostgreSQL connection string | DATABASE_URL_HERE |
| JWT_SECRET   | Secret key for JWT tokens    | JWT_SECRET_HERE   |
| JWT_EXPIRE   | JWT token expiration time    | JWT_EXPIRE_HERE   |
| REDIS_URL    | Redis connection string      | REDIS_URL_HERE    |
| RABBITMQ_URL | RabbitMQ connection string   | RABBIT_URL_HERE   |
| LOG_LEVEL    | Application logging level    | info              |

## Error Handling

The Auth Service implements a centralized error handling mechanism using Express middleware. Here's how different types of errors are handled:

### Error Types

| Error Type                  | Status Code | Description                           |
| --------------------------- | ----------- | ------------------------------------- |
| ValidationError             | 400         | Invalid request data or parameters    |
| InvalidCredentialsException | 401         | Wrong email/password combination      |
| NotAuthorizedException      | 403         | User lacks required permissions       |
| NotFoundException           | 404         | Requested resource not found          |
| AlreadyExistException       | 409         | Resource already exists (e.g., email) |
| InternalServerError         | 500         | Unexpected server error               |

### Error Response Format

```json
{
  "name": "ErrorType",
  "message": "Human-readable error message",
  "status": 400,
  "method": "POST",
  "url": "/api/endpoint",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

Note: In development mode, the response includes additional debug information like stack trace and request headers.

### Validation Errors

Validation errors are handled using Joi validation. The error message is formatted to remove quotes and combine multiple validation failures.

[Unit Tests section remains the same]

## Emitted Events

The ShopLite Auth Service emits the following events:

### User Events

- **user.created**: Emitted when a new user registers.

  - **Payload**:
    ```json
    {
      "id": "string",
      "email": "string",
      "role": "string"
    }
    ```

- **user.updated**: Emitted when a user updated.

  - **Payload**:
    ```json
    {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string"
    }
    ```

## License

For detailed license information, please refer to the [LICENSE](./LICENSE) file in the repository.

Happy coding! 🚀
