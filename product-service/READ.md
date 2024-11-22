# ShopLite Product Service 📦

Welcome to the **ShopLite Product Service**! This service is responsible for managing products and categories in the ShopLite application.

## Table of Contents

- [Overview](#overview)
- [Prisma Models](#prisma-models)
- [API Endpoints](#api-endpoints)
  - [Category Routes](#category-routes)
  - [Product Routes](#product-routes)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Error Handling](#error-handling)
- [Unit Tests](#unit-tests)
- [License](#license)

## Overview

The ShopLite Product Service is built using TypeScript and Prisma ORM. It provides a set of RESTful API endpoints to manage product and category data.

### Dependencies

The following dependencies are required for the ShopLite Product Service:

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

The following dev dependencies are required for the ShopLite Product Service:

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

### Category

| Field       | Type     |
| ----------- | -------- |
| id          | String   |
| name        | String   |
| description | String   |
| imageUri    | String   |
| products    | Product  |
| createdAt   | DateTime |
| updatedAt   | DateTime |
| isDeleted   | Boolean  |

### Product

| Field       | Type     |
| ----------- | -------- |
| id          | String   |
| name        | String   |
| description | String   |
| imageUri    | String   |
| price       | Decimal  |
| categoryId  | String   |
| category    | Category |
| stock       | Int      |
| createdAt   | DateTime |
| updatedAt   | DateTime |
| isDeleted   | Boolean  |

## API Endpoints

### Category Routes

- **GET /category**: Retrieve all categories

  - **Expected Output**: An array of category objects.
  - **Example**:
    ```json
    {
      "status": "success",
      "data": {
        "categories": [
          {
            "id": "string",
            "name": "string",
            "description": "string",
            "imageUri": "string",
            "createdAt": "DateTime"
          }
        ]
      }
    }
    ```

- **POST /category/create**: Create a new category

  - **Expected Input**: A JSON object containing the category details.
  - **Example**:
    ```json
    {
      "name": "string",
      "description": "string",
      "imageUri": "string"
    }
    ```
  - **Expected Output**: A confirmation message indicating the category has been created.
  - **Example**:
    ```json
    {
      "status": "success",
      "message": "category created successfully"
    }
    ```

- **PUT /category/:id/update**: Update an existing category

  - **Expected Input**: A JSON object containing the updated category details.
  - **Example**:
    ```json
    {
      "name": "string",
      "description": "string",
      "imageUri": "string"
    }
    ```
  - **Expected Output**: No content.
  - **Example**:
    ```json
    {
      "status": 204
    }
    ```

- **DELETE /category/:id/delete**: Delete a category
  - **Expected Output**: No content.
  - **Example**:
    ```json
    {
      "status": 204
    }
    ```

### Product Routes

- **GET /product**: Retrieve all products

  - **Expected Output**: An array of product objects.
  - **Example**:
    ```json
    {
      "status": "success",
      "data": {
        "page": 1,
        "count": 10,
        "products": [
          {
            "id": "string",
            "name": "string",
            "description": "string",
            "imageUri": "string",
            "price": "Decimal",
            "categoryId": "string",
            "stock": "int",
            "createdAt": "DateTime",
            "updatedAt": "DateTime"
          }
        ]
      }
    }
    ```

- **GET /product/:id**: Retrieve a single product by ID

  - **Expected Output**: A product object.
  - **Example**:
    ```json
    {
      "status": "success",
      "data": {
        "product": {
          "id": "string",
          "name": "string",
          "description": "string",
          "imageUri": "string",
          "price": "Decimal",
          "categoryId": "string",
          "stock": "int",
          "createdAt": "DateTime",
          "updatedAt": "DateTime"
        }
      }
    }
    ```

- **GET /product/:name/category**: Retrieve products by category name

  - **Expected Output**: An array of product objects.
  - **Example**:
    ```json
    {
      "status": "success",
      "data": {
        "page": 1,
        "count": 10,
        "products": [
          {
            "id": "string",
            "name": "string",
            "description": "string",
            "imageUri": "string",
            "price": "Decimal",
            "categoryId": "string",
            "stock": "int",
            "createdAt": "DateTime",
            "updatedAt": "DateTime"
          }
        ]
      }
    }
    ```

- **POST /product/create**: Create a new product

  - **Expected Input**: A JSON object containing the product details.
  - **Example**:
    ```json
    {
      "name": "string",
      "description": "string",
      "imageUri": "string",
      "price": "Decimal",
      "categoryId": "string",
      "stock": "int"
    }
    ```
  - **Expected Output**: A confirmation message indicating the product has been created.
  - **Example**:
    ```json
    {
      "status": "success",
      "message": "Product created successfully"
    }
    ```

- **PUT /product/:id/update**: Update an existing product

  - **Expected Input**: A JSON object containing the updated product details.
  - **Example**:
    ```json
    {
      "name": "string",
      "description": "string",
      "imageUri": "string",
      "price": "Decimal",
      "categoryId": "string",
      "stock": "int"
    }
    ```
  - **Expected Output**: No content.
  - **Example**:
    ```json
    {
      "status": 204
    }
    ```

- **DELETE /product/:id/delete**: Delete a product
  - **Expected Output**: No content.
  - **Example**:
    ```json
    {
      "status": 204
    }
    ```

## Environment Variables

To configure the ShopLite Product Service, set the following environment variables:

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

To get started with the ShopLite Product Service, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/snckl/shoplite.git
   ```
2. Install dependencies:
   ```sh
   cd product-service
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
  "url": "/api/products",
  "timestamp": "2023-10-05T14:48:00.000Z",
  "stack": "Error stack trace",
  "headers": { ... }
}
```

In development mode, the response includes the error stack trace and request headers.

#### Example Response

```json
{
   "name": "ValidationError",
   "message": "Field 'name' is required",
   "status": 400,
   "method": "POST",
   "url": "/api/products",
   "timestamp": "2023-10-05T14:48:00.000Z",
   "stack": "Error stack trace",
   "headers": { ... }
}
```

### Usage

To run the tests, use a test runner such as Jest or Mocha. For example, to run the tests with Jest, execute the following command:

```sh
npx jest
```

### Dependencies

- **Jest**: A delightful JavaScript testing framework. Install it using `npm install jest`.
- **Supertest**: A library for testing Node.js HTTP servers. Install it using `npm install supertest`.

## Emitted Events

The ShopLite Product Service emits the following events:

### Product Events

- **product.created**: Emitted when a new product is created.

  - **Payload**:

    ```json
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "categoryId": "string",
      "stock": "int",
      "price": "Decimal",
      "createdAt": "DateTime",
      "updatedAt": "DateTime"
    }
    ```

- **product.updated**: Emitted when an existing product is updated.

  - **Payload**:
    ```json
    {
      "id": "string",
      "name": "string",
      "price": "Decimal",
      "stock": "int",
      "updatedAt": "DateTime"
    }
    ```

- **product.deleted**: Emitted when a product is deleted.
  - **Payload**:
    ```json
    {
      "id": "string",
      "deletedAt": "DateTime"
    }
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Happy coding! 🚀
