# FoodBoxx API Documentation

Base URL: `http://localhost:3000/api`

All protected routes require a JSON Web Token (JWT) supplied in the `Authorization` header:
```http
Authorization: Bearer <token>
```

---

## Approved Cape Town Pickup Pod Locations
All order and subscription requests must specify one of the following approved pickup pods:
* `UCT Library`
* `Res Hall A`
* `Stellenbosch Neelsie`
* `CPUT Woodstock`
* `Workshop17 Woodstock`
* `Virgin Active Woodstock`

---

## Table of Contents
1. [Auth Routes](#1-auth-routes)
   - [POST /api/auth/register](#post-apiauthregister)
   - [POST /api/auth/login](#post-apiauthlogin)
   - [GET /api/auth/me](#get-apiauthme)
   - [PATCH /api/auth/me](#patch-apiauthme)
2. [Payment Routes](#2-payment-routes)
   - [POST /api/payments](#post-apipayments)
3. [Order Routes](#3-order-routes)
   - [POST /api/orders](#post-apiorders)
   - [POST /api/orders/custom](#post-apiorderscustom)
   - [POST /api/orders/subscription](#post-apiorderssubscription)
   - [GET /api/orders/user/:userId](#get-apiordersuseruserid)
   - [GET /api/orders/:id](#get-apiordersid)
4. [Subscription Routes](#4-subscription-routes)
   - [GET /api/subscriptions/user/:userId](#get-apisubscriptionsuseruserid)
   - [PATCH /api/subscriptions/:id/pause](#patch-apisubscriptionsidpause)
   - [PATCH /api/subscriptions/:id/resume](#patch-apisubscriptionsidresume)
   - [PATCH /api/subscriptions/:id/skip](#patch-apisubscriptionsidskip)
   - [PATCH /api/subscriptions/:id/cancel](#patch-apisubscriptionsidcancel)
5. [Product Routes (Contract / Upcoming)](#5-product-routes-contract--upcoming)
   - [GET /api/products](#get-apiproducts)
   - [GET /api/products/builder-items](#get-apiproductsbuilder-items)
6. [General Error Format & Status Codes](#6-general-error-format--status-codes)

---

## 1. Auth Routes

### POST /api/auth/register
- **Description:** Registers a new user account with dietary preferences.
- **Method & Path:** `POST /api/auth/register`
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "dietary_preferences": "vegan,gluten-free"
}
```
> *Note:* `dietary_preferences` is stored as a MySQL `SET` and can be comma-delimited (supported values: `"standard"`, `"vegan"`, `"halal"`, `"keto"`, `"nut-free"`, `"gluten-free"`). Defaults to `"standard"`.

- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing fields):
    ```json
    {
      "success": false,
      "error": {
        "message": "Name, email, and password are required",
        "details": null
      }
    }
    ```
  - **409 Conflict** (Email already exists):
    ```json
    {
      "success": false,
      "error": {
        "message": "User already exists with this email",
        "details": null
      }
    }
    ```

---

### POST /api/auth/login
- **Description:** Authenticates user credentials and returns a JWT access token valid for 2 hours.
- **Method & Path:** `POST /api/auth/login`
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```

- **Success Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "dietary_preferences": "vegan,gluten-free"
  }
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing fields):
    ```json
    {
      "success": false,
      "error": {
        "message": "Email and password are required",
        "details": null
      }
    }
    ```
  - **401 Unauthorized** (Invalid email or password):
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid email or password",
        "details": null
      }
    }
    ```

---

### GET /api/auth/me
- **Description:** Retrieves the authenticated user's profile details.
- **Method & Path:** `GET /api/auth/me`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "dietary_preferences": "vegan,gluten-free"
  }
}
```

- **Error Responses:**
  - **401 Unauthorized** (Missing or invalid token):
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid or expired token",
        "details": null
      }
    }
    ```
  - **404 Not Found** (User does not exist):
    ```json
    {
      "success": false,
      "error": {
        "message": "User not found",
        "details": null
      }
    }
    ```

---

### PATCH /api/auth/me
- **Description:** Updates the profile information of the authenticated user.
- **Method & Path:** `PATCH /api/auth/me`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "janesmith@example.com",
  "dietary_preferences": "keto,gluten-free"
}
```

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "dietary_preferences": "keto,gluten-free"
  }
}
```

- **Error Responses:**
  - **401 Unauthorized**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid or expired token",
        "details": null
      }
    }
    ```
  - **409 Conflict** (Email already taken):
    ```json
    {
      "success": false,
      "error": {
        "message": "Email already in use by another account",
        "details": null
      }
    }
    ```

---

## 2. Payment Routes

### POST /api/payments
- **Description:** Simulates an external payment gateway transaction with a 1500ms processing delay.
  - Cards ending in `0002` simulate a decline (`402 Payment Required`).
  - All other cards approve and return a unique reference string (`FBX-timestamp-randomHex`).
- **Method & Path:** `POST /api/payments`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "cardNumber": "4532 1234 5678 1234",
  "amount": 74.00
}
```

- **Success Response (200 OK - Card Approved):**
```json
{
  "success": true,
  "message": "Payment approved successfully",
  "txnRef": "FBX-1756800000-a1b2c3d4",
  "amount": 74.00
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing card number or invalid amount):
    ```json
    {
      "success": false,
      "error": {
        "message": "Card number and amount are required",
        "details": null
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "success": false,
      "error": {
        "message": "No token provided",
        "details": null
      }
    }
    ```
  - **402 Payment Required** (Card declined - ends in 0002):
    ```json
    {
      "success": false,
      "error": {
        "message": "Card declined. Please try a different payment method.",
        "details": null
      }
    }
    ```

---

## 3. Order Routes

> **Server-Side Pricing Security Notice:**
> The server queries the authoritative `products` table in MySQL during the atomic transaction to calculate prices. Client-supplied unit prices or totals are completely ignored to ensure financial integrity.
> If the payment is declined, the database transaction is immediately **rolled back**, resulting in **zero** created records.

### POST /api/orders
- **Description:** Creates a standard one-off order (`order_type = 'one-off'`). Generates an atomic transaction with payment processing and a cryptographically secure QR token.
- **Method & Path:** `POST /api/orders`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 1
    }
  ],
  "cardNumber": "4532 1234 5678 1234",
  "pickupPod": "Workshop17 Woodstock"
}
```
*(Example uses pre-set box ID 1 at R79.00)*

- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "orderId": 101,
  "totalAmount": 79.00,
  "qrToken": "5f8a7e3d1b9c24e6a8d0f1a3b5c7e9f05f8a7e3d1b9c24e6a8d0f1a3b5c7e9f0",
  "txnRef": "FBX-1756800000-a1b2c3d4"
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing fields, inactive product, or invalid quantity):
    ```json
    {
      "success": false,
      "error": {
        "message": "Missing required fields: items, cardNumber, pickupPod",
        "details": null
      }
    }
    ```
  - **401 Unauthorized**:
    ```json
    {
      "success": false,
      "error": {
        "message": "No token provided",
        "details": null
      }
    }
    ```
  - **402 Payment Required** (Simulated decline for card ending in 0002; transaction rolled back):
    ```json
    {
      "success": false,
      "error": {
        "message": "Card declined. Please try a different payment method.",
        "details": null
      }
    }
    ```
  - **404 Not Found** (Product ID does not exist):
    ```json
    {
      "success": false,
      "error": {
        "message": "Product with ID 99 not found",
        "details": null
      }
    }
    ```

---

### POST /api/orders/custom
- **Description:** Creates a custom Box Builder order (`order_type = 'custom'`) with individual meals (R25) and snacks (R12).
- **Method & Path:** `POST /api/orders/custom`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "items": [
    {
      "productId": 10,
      "quantity": 2
    },
    {
      "productId": 14,
      "quantity": 2
    }
  ],
  "cardNumber": "4532 1234 5678 1234",
  "pickupPod": "UCT Library"
}
```
*(Example: 2 x R25 meals + 2 x R12 snacks = R74.00 server-calculated total)*

- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Custom box order created successfully",
  "orderId": 102,
  "totalAmount": 74.00,
  "qrToken": "b4e2a1c9f0d7e6a5b8c3d2e1f4a7b9c0d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7",
  "txnRef": "FBX-1756800000-c5d6e7f8"
}
```

- **Error Responses:**
  - **400 Bad Request**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Missing required fields: items, cardNumber, pickupPod",
        "details": null
      }
    }
    ```
  - **402 Payment Required** (Card declined; transaction rolled back):
    ```json
    {
      "success": false,
      "error": {
        "message": "Card declined. Please try a different payment method.",
        "details": null
      }
    }
    ```

---

### POST /api/orders/subscription
- **Description:** Creates a recurring subscription order (`order_type = 'subscription'`). If the user does not have an active subscription (or if their previous subscription was cancelled), a new subscription is created (next charge date set to +7 days) and loyalty progress (`boxes_completed`) is incremented.
- **Method & Path:** `POST /api/orders/subscription`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "productId": 2,
  "items": [
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "cardNumber": "4532 1234 5678 1234",
  "pickupPod": "CPUT Woodstock"
}
```
*(Example uses box ID 2 at R89.00)*

- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Subscription order created successfully",
  "orderId": 103,
  "subscriptionId": 5,
  "totalAmount": 89.00,
  "qrToken": "7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e",
  "txnRef": "FBX-1756800000-e9f0a1b2"
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing fields or inactive box):
    ```json
    {
      "success": false,
      "error": {
        "message": "Missing required fields: productId, items, cardNumber, pickupPod",
        "details": null
      }
    }
    ```
  - **402 Payment Required**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Card declined. Please try a different payment method.",
        "details": null
      }
    }
    ```
  - **404 Not Found** (Box product does not exist):
    ```json
    {
      "success": false,
      "error": {
        "message": "Subscription box product not found",
        "details": null
      }
    }
    ```

---

### GET /api/orders/user/:userId
- **Description:** Retrieves all orders placed by the user, newest first, including line items.
- **Method & Path:** `GET /api/orders/user/:userId`
- **Authentication:** Required (`Bearer <token>`)
- **Ownership Verification:** The requested `userId` must match the authenticated `req.userId`.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "orders": [
    {
      "id": 102,
      "user_id": 1,
      "subscription_id": null,
      "order_type": "custom",
      "total_amount": "74.00",
      "payment_status": "paid",
      "payment_txn_ref": "FBX-1756800000-c5d6e7f8",
      "qr_token": "b4e2a1c9f0d7e6a5b8c3d2e1f4a7b9c0d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7",
      "pickup_pod": "UCT Library",
      "status": "confirmed",
      "created_at": "2026-09-04T13:30:00.000Z",
      "items": [
        {
          "id": 201,
          "order_id": 102,
          "product_id": 10,
          "quantity": 2,
          "unit_price": "25.00"
        },
        {
          "id": 202,
          "order_id": 102,
          "product_id": 14,
          "quantity": 2,
          "unit_price": "12.00"
        }
      ]
    }
  ]
}
```

- **Error Responses:**
  - **401 Unauthorized**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Invalid or expired token",
        "details": null
      }
    }
    ```
  - **403 Forbidden** (Attempting to view orders of another user):
    ```json
    {
      "success": false,
      "error": {
        "message": "Forbidden: You cannot access order history for another user",
        "details": null
      }
    }
    ```

---

### GET /api/orders/:id
- **Description:** Retrieves details for a specific order and its line items.
- **Method & Path:** `GET /api/orders/:id`
- **Authentication:** Required (`Bearer <token>`)
- **Ownership Verification:** The order must belong to `req.userId`.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "order": {
    "id": 101,
    "user_id": 1,
    "subscription_id": null,
    "order_type": "one-off",
    "total_amount": "79.00",
    "payment_status": "paid",
    "payment_txn_ref": "FBX-1756800000-a1b2c3d4",
    "qr_token": "5f8a7e3d1b9c24e6a8d0f1a3b5c7e9f05f8a7e3d1b9c24e6a8d0f1a3b5c7e9f0",
    "pickup_pod": "Workshop17 Woodstock",
    "status": "confirmed",
    "created_at": "2026-09-04T12:00:00.000Z",
    "items": [
      {
        "id": 200,
        "order_id": 101,
        "product_id": 1,
        "quantity": 1,
        "unit_price": "79.00"
      }
    ]
  }
}
```

- **Error Responses:**
  - **403 Forbidden** (Attempting to view an order belonging to someone else):
    ```json
    {
      "success": false,
      "error": {
        "message": "Forbidden: You do not have access to this order",
        "details": null
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Order not found",
        "details": null
      }
    }
    ```

---

## 4. Subscription Routes

All subscription endpoints verify that the target subscription belongs to the authenticated user.

### GET /api/subscriptions/user/:userId
- **Description:** Retrieves the active or latest subscription for the user.
- **Method & Path:** `GET /api/subscriptions/user/:userId`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "subscription": {
    "id": 5,
    "user_id": 1,
    "product_id": 2,
    "status": "active",
    "next_charge_date": "2026-09-11",
    "boxes_completed": 1,
    "pickup_pod": "CPUT Woodstock",
    "created_at": "2026-09-04T12:00:00.000Z"
  }
}
```

- **Error Responses:**
  - **403 Forbidden**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Forbidden: You cannot access subscriptions for another user",
        "details": null
      }
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "success": false,
      "error": {
        "message": "No subscription found for this user",
        "details": null
      }
    }
    ```

---

### PATCH /api/subscriptions/:id/pause
- **Description:** Pauses an active subscription (`status = 'paused'`).
- **Method & Path:** `PATCH /api/subscriptions/:id/pause`
- **Authentication:** Required (`Bearer <token>`)
- **State Constraint:** Can only pause an `active` subscription. Cannot pause if already `paused` or `cancelled`.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription paused"
}
```

- **Error Responses:**
  - **400 Bad Request** (Invalid state transition):
    ```json
    {
      "success": false,
      "error": {
        "message": "Subscription is already paused",
        "details": null
      }
    }
    ```
  - **403 Forbidden**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Forbidden: You do not have access to this subscription",
        "details": null
      }
    }
    ```

---

### PATCH /api/subscriptions/:id/resume
- **Description:** Resumes a paused subscription (`status = 'active'`).
- **Method & Path:** `PATCH /api/subscriptions/:id/resume`
- **Authentication:** Required (`Bearer <token>`)
- **State Constraint:** Can only resume a `paused` subscription. A `cancelled` subscription cannot be resumed.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription resumed"
}
```

- **Error Responses:**
  - **400 Bad Request**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Cannot resume a cancelled subscription",
        "details": null
      }
    }
    ```

---

### PATCH /api/subscriptions/:id/skip
- **Description:** Skips the next scheduled delivery by advancing `next_charge_date` by +7 days.
- **Method & Path:** `PATCH /api/subscriptions/:id/skip`
- **Authentication:** Required (`Bearer <token>`)
- **State Constraint:** Allowed only when status is `active`.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription skipped for this week"
}
```

- **Error Responses:**
  - **400 Bad Request**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Cannot skip subscription when status is paused. Must be active.",
        "details": null
      }
    }
    ```

---

### PATCH /api/subscriptions/:id/cancel
- **Description:** Cancels an active or paused subscription (`status = 'cancelled'`). Once cancelled, it can never be transitioned out of this state.
- **Method & Path:** `PATCH /api/subscriptions/:id/cancel`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription cancelled"
}
```

- **Error Responses:**
  - **400 Bad Request**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Subscription is already cancelled",
        "details": null
      }
    }
    ```

---

## 5. Product Routes (Contract / Upcoming)

> *Notice:* Product routes will be mounted under `/api/products` upon completion by Michaela.

### GET /api/products
- **Description:** Retrieves all catalog products with optional query filtering.
- **Method & Path:** `GET /api/products`
- **Authentication:** None (Public)
- **Query Parameters:**
  - `diet` (string, optional) — Filter products by dietary tag (e.g., `vegan`, `keto`, `halal`).
  - `search` (string, optional) — Search term matching product name or description.
- **Example:** `GET /api/products?diet=vegan&search=harvest`
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Green Vitality Box",
      "description": "5 plant-based meals prepared fresh for the week",
      "price": "79.00",
      "category": "box",
      "dietary_tags": ["vegan"],
      "image_url": "/assets/images/vitality-box.jpg",
      "is_active": true
    }
  ]
}
```

---

### GET /api/products/builder-items
- **Description:** Fetches all individual meal and snack items eligible for inclusion in the custom Box Builder.
- **Method & Path:** `GET /api/products/builder-items`
- **Authentication:** None (Public)
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "items": [
    {
      "id": 10,
      "name": "Grilled Lemon Herb Chicken Bowl",
      "description": "Tender chicken breast with seasonal vegetables",
      "price": "25.00",
      "category": "meal",
      "dietary_tags": ["gluten-free", "keto"],
      "image_url": "/assets/images/lemon-chicken.jpg",
      "is_active": true
    },
    {
      "id": 14,
      "name": "Roasted Almond Energy Bites",
      "description": "Raw honey, cacao, chia seeds, and almonds",
      "price": "12.00",
      "category": "snack",
      "dietary_tags": ["standard", "gluten-free"],
      "image_url": "/assets/images/energy-bites.jpg",
      "is_active": true
    }
  ]
}
```

---

## 6. General Error Format & Status Codes

All API errors return a standard JSON structure managed by `error.middleware.js`:
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "details": null
  }
}
```

### Standard Status Codes

| HTTP Status | Meaning | Typical Trigger |
|---|---|---|
| **200** | OK | Successful fetch, update, or payment approval. |
| **201** | Created | User registered or order placed successfully. |
| **400** | Bad Request | Missing required payload fields, invalid quantities, or invalid subscription state transitions. |
| **401** | Unauthorized | Missing JWT token, invalid signature, or expired session. |
| **402** | Payment Required | Simulated gateway payment decline (e.g., card ending in `0002`). |
| **403** | Forbidden | User attempting to view or alter another user's orders or subscriptions. |
| **404** | Not Found | Target user, product, order, subscription, or API route does not exist. |
| **409** | Conflict | Unique constraint violation (e.g. email already registered). |
| **500** | Internal Server Error | Unhandled server error (internal SQL or stack traces are shielded). |