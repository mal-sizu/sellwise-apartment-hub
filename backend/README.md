# Real Estate API

A Node.js backend project using Express and MongoDB (with Mongoose) for real estate property management.

## Overview

This API provides endpoints for managing properties, sellers, customers, and user authentication. It includes:

- User authentication with JWT
- Role-based access control (admin, seller, customer)
- CRUD operations for properties, sellers, and customers
- Property search and filtering
- Chat functionality for communication

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **Testing**: Jest and Supertest
- **Development Tools**: ESLint, Prettier, Nodemon

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB instance (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/real-estate-api.git
   cd real-estate-api
   ```

2. Copy the environment file and configure:
   ```bash
   cp .env.sample .env
   ```
   Edit the `.env` file and provide proper values for each environment variable.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Or build and start the production server:
   ```bash
   npm run build
   npm start
   ```

5. Run tests:
   ```bash
   npm test
   ```

## API Endpoints

### Authentication

| Method | Endpoint            | Description          | Access      |
|--------|---------------------|----------------------|-------------|
| POST   | `/api/users/login`  | Login and get token  | Public      |
| GET    | `/api/users/me`     | Get current user     | Private     |
| PUT    | `/api/users/:id/password` | Update password | Private/Admin |
| POST   | `/api/users`        | Create admin user    | Admin       |
| DELETE | `/api/users/:id`    | Delete user          | Admin       |

### Sellers

| Method | Endpoint                  | Description         | Access          |
|--------|---------------------------|---------------------|-----------------|
| POST   | `/api/sellers`            | Register seller     | Public          |
| GET    | `/api/sellers`            | Get all sellers     | Admin           |
| GET    | `/api/sellers/:id`        | Get seller by ID    | Private/Admin   |
| PUT    | `/api/sellers/:id`        | Update seller       | Private/Admin   |
| DELETE | `/api/sellers/:id`        | Delete seller       | Admin           |
| PATCH  | `/api/sellers/:id/status` | Update seller status| Admin           |

### Customers

| Method | Endpoint                | Description          | Access          |
|--------|-------------------------|---------------------|-----------------|
| POST   | `/api/customers`        | Register customer   | Public          |
| GET    | `/api/customers`        | Get all customers   | Admin           |
| GET    | `/api/customers/:id`    | Get customer by ID  | Private/Admin   |
| PUT    | `/api/customers/:id`    | Update customer     | Private/Admin   |
| DELETE | `/api/customers/:id`    | Delete customer     | Admin           |

### Properties

| Method | Endpoint                         | Description             | Access          |
|--------|----------------------------------|-------------------------|-----------------|
| POST   | `/api/properties`                | Create property         | Seller/Admin    |
| GET    | `/api/properties`                | Get all properties      | Public          |
| GET    | `/api/properties/:id`            | Get property by ID      | Public          |
| PUT    | `/api/properties/:id`            | Update property         | Private/Admin   |
| DELETE | `/api/properties/:id`            | Delete property         | Private/Admin   |
| PATCH  | `/api/properties/:id/availability`| Update availability    | Private/Admin   |

### Chats

| Method | Endpoint                    | Description            | Access     |
|--------|----------------------------|------------------------|------------|
| POST   | `/api/chats`               | Create chat session    | Private    |
| GET    | `/api/chats/:sessionId`    | Get chat by session ID | Private    |
| PATCH  | `/api/chats/:sessionId`    | Add message to chat    | Private    |
| GET    | `/api/chats/user/:userId`  | Get user's chats       | Private    |
| DELETE | `/api/chats/:sessionId`    | Delete chat session    | Private    |

## Environment Variables

| Variable           | Description                               | Default Value             |
|--------------------|-------------------------------------------|--------------------|
| PORT               | Server port                               | 4000                |
| MONGO_URI          | MongoDB connection string                 | mongodb://localhost:27017/myapp |
| JWT_SECRET         | Secret key for JWT token generation       | -                    |
| JWT_EXPIRES_IN     | JWT token expiration time                 | 1d                   |
| BCRYPT_SALT_ROUNDS | Number of salt rounds for password hashing| 10                   |

## Project Structure

```
src/
├── app.ts                    # Express app setup
├── server.ts                 # Listen on PORT
├── config/
│   └── db.ts                # Mongoose connection
├── models/
│   ├── Seller.ts
│   ├── Customer.ts
│   ├── User.ts
│   ├── Property.ts
│   └── Chat.ts
├── controllers/
│   ├── seller.controller.ts
│   ├── customer.controller.ts
│   ├── user.controller.ts
│   ├── property.controller.ts
│   └── chat.controller.ts
├── routes/
│   ├── index.ts             # Aggregates all routers
│   ├── seller.routes.ts
│   ├── customer.routes.ts
│   ├── user.routes.ts
│   ├── property.routes.ts
│   └── chat.routes.ts
├── middlewares/
│   ├── auth.middleware.ts   # JWT verification
│   ├── role.middleware.ts   # Role-based guard
│   └── error.middleware.ts  # Central error handler
├── utils/
│   ├── validators.ts        # express-validator schemas
│   └── response.ts         # Standard API response helpers
└── tests/
    ├── seller.test.ts
    ├── customer.test.ts
    ├── user.test.ts
    ├── property.test.ts
    └── chat.test.ts
```

## Data Relationships

- When a new Seller or Customer is registered, a corresponding User entity is created with the same ID
- Properties are linked to Sellers via the `sellerId` field
- Chat sessions are linked to Users via the `userId` field

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request
