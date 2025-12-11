# Auto Parts API Documentation

Base URL: `http://localhost:5000/v1`

## Table of Contents
- [Authentication](#authentication)
- [Products](#products)
- [Orders](#orders)
- [Inventory](#inventory)
- [Shipping](#shipping)
- [Users](#users)
- [Error Responses](#error-responses)

---

## Authentication

### Register User
Create a new user account (Admin creates all users).

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "ADMIN" | "WAREHOUSE_WORKER" | "RECEIVING_DESK"
}
```

**Success Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "createdAt": "2025-12-03T00:00:00.000Z"
  }
}
```

**Error Response (409):**
```json
{
  "error": "Email already registered"
}
```

---

### Login
Authenticate and receive a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Logout
Invalidate the current JWT token.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Current User
Retrieve the authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN",
    "createdAt": "2025-12-03T00:00:00.000Z"
  }
}
```

---

## Products

### List Products
Get all products (public endpoint).

**Endpoint:** `GET /products`

**Success Response (200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "name": "Part 1",
      "description": "High-quality automotive part",
      "price": 29.99,
      "weight": 2.5,
      "pictureURL": "https://example.com/image.jpg",
      "quantity": 50,
      "createdAt": "2025-12-03T00:00:00.000Z",
      "updatedAt": "2025-12-03T00:00:00.000Z"
    }
  ]
}
```

---

### Get Product
Get a single product by ID (public endpoint).

**Endpoint:** `GET /products/:id`

**Success Response (200):**
```json
{
  "product": {
    "id": "uuid",
    "name": "Part 1",
    "description": "High-quality automotive part",
    "price": 29.99,
    "weight": 2.5,
    "pictureURL": "https://example.com/image.jpg",
    "quantity": 50,
    "createdAt": "2025-12-03T00:00:00.000Z",
    "updatedAt": "2025-12-03T00:00:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "error": "Product not found"
}
```

---

### Create Product
Create a new product (Admin only).

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Request Body:**
```json
{
  "name": "Part 150",
  "description": "Premium automotive component",
  "price": 49.99,
  "weight": 3.2,
  "pictureURL": "https://example.com/image.jpg",
  "quantity": 25
}
```

**Success Response (201):**
```json
{
  "product": {
    "id": "uuid",
    "name": "Part 150",
    "description": "Premium automotive component",
    "price": 49.99,
    "weight": 3.2,
    "pictureURL": "https://example.com/image.jpg",
    "quantity": 25,
    "createdAt": "2025-12-03T00:00:00.000Z",
    "updatedAt": "2025-12-03T00:00:00.000Z"
  }
}
```

---

### Update Product
Update an existing product (Admin only).

**Endpoint:** `PUT /products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Request Body:**
```json
{
  "name": "Part 150 Updated",
  "description": "Updated description",
  "price": 54.99,
  "weight": 3.5,
  "pictureURL": "https://example.com/new-image.jpg"
}
```

**Success Response (200):**
```json
{
  "product": {
    "id": "uuid",
    "name": "Part 150 Updated",
    "description": "Updated description",
    "price": 54.99,
    "weight": 3.5,
    "pictureURL": "https://example.com/new-image.jpg",
    "quantity": 25,
    "createdAt": "2025-12-03T00:00:00.000Z",
    "updatedAt": "2025-12-03T00:00:00.000Z"
  }
}
```

---

### Delete Product
Delete a product (Admin only).

**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Success Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## Orders

### Create Order
Create a new order (public endpoint).

**Endpoint:** `POST /orders`

**Request Body:**
```json
{
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "shippingAddress": "123 Main St",
  "shippingCity": "Chicago",
  "shippingState": "IL",
  "shippingZip": "60601",
  "shippingCountry": "USA",
  "creditCard": "4532015112830366",
  "creditCardName": "Jane Smith",
  "creditCardExpiry": "12/2025",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    },
    {
      "productId": "uuid",
      "quantity": 1
    }
  ]
}
```

**Success Response (201):**
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-123456",
    "status": "ORDERED",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "shippingAddress": "123 Main St",
    "shippingCity": "Chicago",
    "shippingState": "IL",
    "shippingZip": "60601",
    "shippingCountry": "USA",
    "cardLast4": "0366",
    "ccAuthNumber": "AUTH123",
    "ccTransactionId": "ORDER-uuid-1234567890",
    "subtotal": 89.97,
    "shippingCost": 12.50,
    "totalWeight": 8.5,
    "totalAmount": 102.47,
    "orderedAt": "2025-12-03T00:00:00.000Z",
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "productName": "Part 1",
        "quantity": 2,
        "priceAtTime": 29.99,
        "weightAtTime": 2.5,
        "product": { ... }
      }
    ]
  }
}
```

**Error Responses:**

Insufficient Inventory (400):
```json
{
  "error": "Insufficient inventory",
  "insufficientProducts": [
    {
      "productId": "uuid",
      "requested": 10,
      "available": 5
    }
  ]
}
```

Payment Failed (400):
```json
{
  "error": "Credit card declined"
}
```

---

### List Orders
Get all orders with optional filtering (Admin only).

**Endpoint:** `GET /orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `status` (optional): ORDERED | PACKING | SHIPPED | CANCELLED
- `minPrice` (optional): number
- `maxPrice` (optional): number
- `orderId` (optional): string
- `customerEmail` (optional): string
- `customerName` (optional): string

**Example:** `GET /orders?status=ORDERED&startDate=2025-01-01`

**Success Response (200):**
```json
{
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "ORD-123456",
      "status": "ORDERED",
      "customerName": "Jane Smith",
      "customerEmail": "jane@example.com",
      "subtotal": 89.97,
      "shippingCost": 12.50,
      "totalAmount": 102.47,
      "orderedAt": "2025-12-03T00:00:00.000Z",
      "items": [ ... ]
    }
  ]
}
```

---

### Get Packing List
Retrieve order details for packing (Warehouse Worker or Admin).

**Endpoint:** `GET /orders/packing-list/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** WAREHOUSE_WORKER, ADMIN

**Notes:**
- Automatically sets order status to PACKING if status is ORDERED
- Assigns the current user as the packer

**Success Response (200):**
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-123456",
    "status": "PACKING",
    "customerName": "Jane Smith",
    "shippingAddress": "123 Main St",
    "shippingCity": "Chicago",
    "shippingState": "IL",
    "shippingZip": "60601",
    "items": [
      {
        "productName": "Part 1",
        "quantity": 2,
        "product": {
          "pictureURL": "https://example.com/image.jpg"
        }
      }
    ]
  }
}
```

---

### Mark Order as Shipped
Update order status to shipped (Warehouse Worker or Admin).

**Endpoint:** `POST /orders/:id/ship`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** WAREHOUSE_WORKER, ADMIN

**Notes:**
- Sends shipping confirmation email to customer

**Success Response (200):**
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-123456",
    "status": "SHIPPED",
    "shippedAt": "2025-12-03T00:00:00.000Z"
  }
}
```

---

### Cancel Order
Cancel an order (Admin or Warehouse Worker).

**Endpoint:** `POST /orders/:id/cancel`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN, WAREHOUSE_WORKER

**Notes:**
- Restores inventory
- Refunds credit card
- Sends cancellation email
- Cannot cancel shipped or already cancelled orders

**Success Response (200):**
```json
{
  "message": "Order cancelled successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Order cannot be cancelled"
}
```

---

## Inventory

### Add Inventory
Add stock to a product (Receiving Desk or Admin).

**Endpoint:** `POST /inventory/add`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** RECEIVING_DESK, ADMIN

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 50
}
```

**Success Response (200):**
```json
{
  "message": "Inventory added successfully"
}
```

---

### Get Inventory History
View inventory change history for a product (Admin only).

**Endpoint:** `GET /inventory/history/:productId`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Success Response (200):**
```json
{
  "logs": [
    {
      "id": "uuid",
      "productId": "uuid",
      "userId": "uuid",
      "quantityChange": 50,
      "quantityAfter": 100,
      "reason": "Inventory added",
      "orderId": null,
      "createdAt": "2025-12-03T00:00:00.000Z",
      "user": {
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

## Shipping

### List Shipping Brackets
Get all shipping cost brackets (public endpoint).

**Endpoint:** `GET /shipping`

**Success Response (200):**
```json
{
  "brackets": [
    {
      "id": "uuid",
      "minWeight": 0,
      "maxWeight": 5,
      "cost": 5.99,
      "createdAt": "2025-12-03T00:00:00.000Z",
      "updatedAt": "2025-12-03T00:00:00.000Z"
    },
    {
      "id": "uuid",
      "minWeight": 5.01,
      "maxWeight": 10,
      "cost": 9.99,
      "createdAt": "2025-12-03T00:00:00.000Z",
      "updatedAt": "2025-12-03T00:00:00.000Z"
    }
  ]
}
```

---

### Create Shipping Bracket
Create a new shipping cost bracket (Admin only).

**Endpoint:** `POST /shipping`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Request Body:**
```json
{
  "minWeight": 10.01,
  "maxWeight": 20,
  "cost": 14.99
}
```

**Success Response (201):**
```json
{
  "bracket": {
    "id": "uuid",
    "minWeight": 10.01,
    "maxWeight": 20,
    "cost": 14.99,
    "createdAt": "2025-12-03T00:00:00.000Z",
    "updatedAt": "2025-12-03T00:00:00.000Z"
  }
}
```

---

### Update Shipping Bracket
Update an existing shipping bracket (Admin only).

**Endpoint:** `PUT /shipping/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Request Body:**
```json
{
  "minWeight": 10.01,
  "maxWeight": 20,
  "cost": 12.99
}
```

**Success Response (200):**
```json
{
  "bracket": {
    "id": "uuid",
    "minWeight": 10.01,
    "maxWeight": 20,
    "cost": 12.99,
    "createdAt": "2025-12-03T00:00:00.000Z",
    "updatedAt": "2025-12-03T00:00:00.000Z"
  }
}
```

---

### Delete Shipping Bracket
Delete a shipping bracket (Admin only).

**Endpoint:** `DELETE /shipping/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Success Response (200):**
```json
{
  "message": "Shipping bracket deleted successfully"
}
```

---

## Users

### List Users
Get all users (Admin only).

**Endpoint:** `GET /users`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Success Response (200):**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "WAREHOUSE_WORKER",
      "createdAt": "2025-12-03T00:00:00.000Z"
    }
  ]
}
```

---

### Delete User
Delete a user account (Admin only).

**Endpoint:** `DELETE /users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Permissions:** ADMIN

**Notes:**
- Cannot delete your own account

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Response (400):**
```json
{
  "error": "Cannot delete your own account"
}
```

---

## Error Responses

### Common HTTP Status Codes

**400 Bad Request**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized**
```json
{
  "error": "No token provided"
}
```
or
```json
{
  "error": "Invalid or expired token"
}
```

**403 Forbidden**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**409 Conflict**
```json
{
  "error": "Resource already exists"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

## User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **ADMIN** | Full system access | All operations |
| **WAREHOUSE_WORKER** | Packs and ships orders | View packing lists, mark orders as shipped, cancel orders |
| **RECEIVING_DESK** | Manages incoming inventory | Add inventory |

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens are obtained via the `/auth/login` endpoint and remain valid for 24 hours (configurable via `JWT_EXPIRES_IN` environment variable).

---

## Health Check

**Endpoint:** `GET /health`

**Success Response (200):**
```json
{
  "status": "ok"
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- All prices are in USD
- All weights are in pounds (lbs)
- Email notifications are sent for:
  - Order confirmation
  - Order shipped
  - Order cancelled
- Credit card processing uses an external API
- Inventory is automatically managed during order creation and cancellation
