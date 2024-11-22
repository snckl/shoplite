# ShopLite E-Commerce Microservices 🛒

ShopLite is a modern e-commerce application built using a microservices architecture. The application is designed to provide high availability and resilience using various techniques such as retries, circuit breakers, and load balancing.

- **NOTE**: Made For [Octopus Digital Signage](https://octopussignage.com/) Case Study - EVERY PROJECT HAS ITS OWN README
- **IMPORTANT**: Only for test purposes there is no detailed .gitignore | .env files are fully open | Kept single database for testing purposes (My PC howls like a wolf 🐺)

## Features ✨

- **Microservices-based architecture**: The app consists of multiple microservices handling authentication, product management, cart management, and order processing.
- **Traefik as an API Gateway**: Traefik is used as a reverse proxy to route traffic to different microservices.
- **Resilience Features**: The app is configured with resilience features like retries, circuit breakers, and timeouts to ensure high availability and fault tolerance. Scales automatically.

## Architecture Overview 🏗️

The architecture includes the following components:

1. **Traefik**: Acts as an API Gateway, handling incoming requests, routing them to appropriate microservices, and applying resilience strategies like retries and circuit breakers.
2. **Authentication Service**: Handles user authentication and user-related operations.
3. **Product Service**: Manages product data and categories.
4. **Cart Service**: Manages shopping cart operations.
5. **Order Service**: Handles order processing and transactions.
6. **Database**: A PostgreSQL database (For testing) stores the data for each service.
7. **RabbitMQ**: Used for inter-service communication via message queues.

## Resilience Configuration 🛡️

The following resilience mechanisms have been implemented in the application:

### 1. **Retries** 🔄

- Each microservice is configured with retry logic. If a service fails, Traefik will retry the request up to 3 times with a 2-second interval between retries.

### 2. **Circuit Breakers** ⚡

- Traefik uses circuit breakers to prevent cascading failures. If a service experiences network errors above 50% (as defined by the `NetworkErrorRatio`), the circuit breaker will open, rejecting requests to the service until it recovers.

### 3. **Timeouts** ⏱️

- Configured read and write timeouts (10 seconds) for each service to ensure Traefik does not hang indefinitely waiting for a response.

### 4. **Health Checks** 🩺

- Docker health checks are implemented for the database service to ensure that it is healthy and ready to accept connections.

## Requirements 📋

- Docker
- Docker Compose

## Technologies Used 🛠️

- **Backend**: Node.js with Typescript, Express, Prisma ORM, RabbitMQ, (Redis - NOT IMPLEMENTED YET!)
- **Database**: PostgreSQL
- **Payment Gateway**: Stripe

## Getting Started 🚀

To get started with ShopLite, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/snckl/shoplite.git
   ```
2. Start with docker:

   ```bash
   cd shoplite
   docker compose up -d
   ```

3. Or just download docker-compose.yaml and init.sql and run docker compose as above

4. Docs are as below:

- Go to [Auth Docs](http://localhost/auth-api-docs/)
- Go to [Product Docs](http://localhost/product-api-docs/)
- Go to [Cart Docs](http://localhost/cart-api-docs/)
- Go to [Order Docs](http://localhost/order-api-docs/)

## Contact 📧

For any questions or inquiries, please contact us at sinan.cakal@protonmail.com.

Thank you for your interest in ShopLite! 🎉
