# ShopLite Cart Service 🛒

Welcome to the **ShopLite Cart Service**! This service is responsible for managing cart and cartItem in the ShopLite application.

## Table of Contents

- [Overview](#overview)
- [Prisma Models](#prisma-models)
- [API Endpoints](#api-endpoints)
  - [Cart Routes](#category-routes)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Error Handling](#error-handling)
- [License](#license)

## Overview

The ShopLite Cart Service is built using TypeScript and Prisma ORM. It provides a set of RESTful API endpoints to manage cart and cartItem data.

### Dependencies

The following dependencies are required for the ShopLite Cart Service:

| Package                     | Version    | Installation Command                    |
| --------------------------- | ---------- | --------------------------------------- |
| `@prisma/client`            | `^5.22.0`  | `npm install @prisma/client`            |
| `amqplib`                   | `^0.10.4`  | `npm install amqplib`                   |
| `bcryptjs`                  | `^2.4.3`   | `npm install bcryptjs`                  |
| `dotenv`                    | `^16.4.5`  | `npm install dotenv`                    |
| `express`                   | `^4.21.1`  | `npm install express`                   |
| `express-async-errors`      | `^3.1.1`   | `npm install express-async-errors`      |
| `joi`                       | `^17.13.3` | `npm install joi`                       |
| `jsonwebtoken`              | `^9.0.2`   | `npm install jsonwebtoken`              |
| `reflect-metadata`          | `^0.2.2`   | `npm install reflect-metadata`          |
| `uuid`                      | `^11.0.3`  | `npm install uuid`                      |
| `winston`                   | `^3.17.0`  | `npm install winston`                   |
| `winston-daily-rotate-file` | `^5.0.0`   | `npm install winston-daily-rotate-file` |

### Dev Dependencies

The following dev dependencies are required for the ShopLite Cart Service:

| Package               | Version    | Installation Command                   |
| --------------------- | ---------- | -------------------------------------- |
| `@types/amqplib`      | `^0.10.5`  | `npm i --save-dev @types/amqplib`      |
| `@types/bcryptjs`     | `^2.4.6`   | `npm i --save-dev @types/bcryptjs`     |
| `@types/express`      | `^5.0.0`   | `npm i --save-dev @types/express`      |
| `@types/jest`         | `^29.5.14` | `npm i --save-dev @types/jest`         |
| `@types/joi`          | `^17.2.2`  | `npm i --save-dev @types/joi`          |
| `@types/jsonwebtoken` | `^9.0.7`   | `npm i --save-dev @types/jsonwebtoken` |
| `@types/node`         | `^22.9.0`  | `npm i --save-dev @types/node`         |
| `@types/supertest`    | `^6.0.2`   | `npm i --save-dev @types/supertest`    |
| `@types/uuid`         | `^10.0.0`  | `npm i --save-dev @types/uuid`         |
| `@types/winston`      | `^2.4.4`   | `npm i --save-dev @types/winston`      |
| `jest`                | `^29.7.0`  | `npm i --save-dev jest`                |
| `prisma`              | `^5.22.0`  | `npm i --save-dev prisma`              |
| `supertest`           | `^7.0.0`   | `npm i --save-dev supertest`           |
| `ts-jest`             | `^29.2.5`  | `npm i --save-dev ts-jest`             |
| `ts-node`             | `^10.9.2`  | `npm i --save-dev ts-node`             |
| `tsc`                 | `^2.0.4`   | `npm i --save-dev tsc`                 |
| `typescript`          | `^5.6.3`   | `npm i --save-dev typescript`          |

## Prisma Models

The following models are defined in the `.prisma` file:

### Cart

| Field     | Type     |
| --------- | -------- |
| id        | String   |
| userId    | String   |
| items     | CartItem |
| total     | Float    |
| createdAt | DateTime |
| updatedAt | DateTime |

### CartItem

| Field       | Type    |
| ----------- | ------- |
| id          | String  |
| productId   | String  |
| name        | String  |
| description | String  |
| imageUri    | String? |
| price       | Decimal |
| quantity    | Int     |
| cartId      | String  |
| cart        | Cart    |

## API Endpoints

### Cart Routes

- **POST /items**: Add an item to the cart

  - **Expected Input**: A JSON object containing the product ID and quantity.
  - **Example**:
    ```json
    {
      "productId": "string",
      "quantity": 1
    }
    ```
  - **Expected Output**: The added cart item.
  - **Example**:
    ```json
    {
      "status": "success",
      "data": {
        "id": "string",
        "cartId": "string",
        "productId": "string",
        "quantity": 1
      }
    }
    ```

- **DELETE /items/:cartItemId**: Remove an item from the cart

  - **Expected Output**: No content.
  - **Example**:
    ```json
    {
      "status": 204
    }
    ```

- **GET /items**: Retrieve all items in the cart

  - **Expected Output**: An array of cart item objects.
  - **Example**:
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "string",
          "cartId": "string",
          "productId": "string",
          "quantity": 1
        }
      ]
    }
    ```

- **DELETE /items**: Clear all items from the cart

  - **Expected Output**: No content.
  - **Example**:
    ```json
    {
      "status": 204
    }
    ```

## Environment Variables

To configure the ShopLite Cart Service, set the following environment variables:

| Variable       | Description             | Example Value         |
| -------------- | ----------------------- | --------------------- |
| `PORT`         | Server port number      | `0000`                |
| `NODE_ENV`     | Node environment        | `development`         |
| `DATABASE_URL` | Database connection URL | `"DATABASE_URL_HERE"` |
| `JWT_SECRET`   | JWT secret key          | `JWT_SECRET_HERE`     |
| `JWT_EXPIRE`   | JWT expiration time     | `JWT_EXPIRE_HERE`     |
| `REDIS_URL`    | Redis connection URL    | `REDIS_URL_HERE`      |
| `RABBITMQ_URL` | RabbitMQ connection URL | `RABBIT_URL_HERE`     |
| `LOG_LEVEL`    | Logging level           | `info`                |

## Getting Started

To get started with the ShopLite Cart Service, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/snckl/shoplite.git
   ```
2. Install dependencies:
   ```sh
   cd cart-service
   npm install
   ```
3. Set up the database:
   ```sh
   npx prisma migrate dev --name init
   ```
4. Start the service:

   ```sh
   npm start
   ```

   ## Error Handling

   This middleware captures various types of errors, including validation errors, not found errors, and authorization errors, and formats them into a consistent JSON response.

   #### Parameters

   - **err**: The error object that was thrown.
   - **req**: The Express request object.
   - **res**: The Express response object.
   - **next**: The next middleware function in the stack.

   #### Returns

   - **void**

### Error Types Handled

The error handler middleware captures and processes the following types of errors:

- **ValidationError**: Occurs when request data fails validation checks.
- **NotFoundException**: Thrown when a requested resource is not found.
- **NotAuthorizedException**: Thrown when a user is not authorized to perform an action.
- **General Errors**: Any other errors that do not fall into the above categories.

In development mode, the response includes the error stack trace and request headers.

#### Example Response

```json
{
  "name": "ValidationError",
  "message": "Field 'name' is required",
  "status": 400,
  "method": "POST",
  "url": "/api/cart",
  "timestamp": "2023-10-05T14:48:00.000Z",
  "stack": "Error stack trace",
  "headers": { ... }
}
```

In development mode, the response includes the error stack trace and request headers.

### Usage

To run the tests, use a test runner such as Jest or Mocha. For example, to run the tests with Jest, execute the following command:

```sh
npx jest
```

### Dependencies

- **Jest**: A delightful JavaScript testing framework. Install it using `npm install jest`.
- **Supertest**: A library for testing Node.js HTTP servers. Install it using `npm install supertest`.

## Emitted Events

The ShopLite Cart Service emits no events for now if I implement Analytics Service later it can be added.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Happy coding! 🚀
