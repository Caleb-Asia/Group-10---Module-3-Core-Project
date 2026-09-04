# FoodBoxx API Documentation

Base URL: `http://localhost:3000/api`

All protected routes require a JWT token in the `Authorization` header:
```http
Authorization: Bearer <token>
```

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
   - [POST /api/orders/subscription](#post-apiorderssubscription)
   - [GET /api/orders/:userId](#get-apiordersuserid)
   - [GET /api/orders/:id](#get-apiordersid)
4. [Subscription Routes](#4-subscription-routes)
   - [GET /api/subscriptions/user/:userId](#get-apisubscriptionsuseruserid)
   - [PATCH /api/subscriptions/:id/pause](#patch-apisubscriptionsidpause)
   - [PATCH /api/subscriptions/:id/resume](#patch-apisubscriptionsidresume)
   - [PATCH /api/subscriptions/:id/skip](#patch-apisubscriptionsidskip)
   - [PATCH /api/subscriptions/:id/cancel](#patch-apisubscriptionsidcancel)
5. [Product Routes](#5-product-routes-contract--upcoming)
   - [GET /api/products](#get-apiproducts)
   - [GET /api/products/builder-items](#get-apiproductsbuilder-items)
6. [General Error Format](#6-general-error-format)

---

## 1. Auth Routes

### POST /api/auth/register
- **Description:** Registers a new user account with default or specified dietary preferences.
- **Method & Path:** `POST /api/auth/register`
- **Authentication:** None (Public)
- **Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "dietary_preferences": "vegan"
}
```
> *Note:* `dietary_preferences` is optional and defaults to `"standard"`. Supported values: `"standard"`, `"vegan"`, `"halal"`, `"keto"`, `"nut-free"`, `"gluten-free"`.

- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing required fields):
    ```json
    {
      "success": false,
      "error": {
        "message": "Name, email, and password are required",
        "details": null
      }
    }
    ```
  - **409 Conflict** (Email already in use):
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
- **Description:** Authenticates user credentials and returns a JWT access token along with profile summary.
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
    "dietary_preferences": "vegan"
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
  - **401 Unauthorized** (Invalid credentials):
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
    "dietary_preferences": "vegan"
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
  - **404 Not Found** (User no longer exists):
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
- **Description:** Updates the profile information of the currently authenticated user.
- **Method & Path:** `PATCH /api/auth/me`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "janesmith@example.com",
  "dietary_preferences": "gluten-free"
}
```
> *Note:* All fields are optional. Send only the fields to be modified.

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "dietary_preferences": "gluten-free"
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
  - **409 Conflict** (Email already taken by another account):
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
  - Cards ending in `0002` trigger a simulated decline (`402 Payment Required`).
  - All other card numbers result in an approved transaction.
- **Method & Path:** `POST /api/payments`
- **Authentication:** None (Internal / Public gateway endpoint)
- **Request Body:**
```json
{
  "cardNumber": "4532 1234 5678 0001",
  "amount": 250.00
}
```

- **Success Response (200 OK - Card Approved):**
```json
{
  "success": true,
  "message": "Payment approved successfully",
  "txnRef": "FBX-1756800000-xyz12345",
  "amount": 250.00
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing card number or amount):
    ```json
    {
      "success": false,
      "error": {
        "message": "Card number and amount are required",
        "details": null
      }
    }
    ```
  - **402 Payment Required** (Card ending in `0002`):
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

### POST /api/orders
- **Description:** Creates a one-off or custom order (without a recurring subscription). Processes payment and generates a pickup QR token within an atomic database transaction.
- **Method & Path:** `POST /api/orders`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "items": [
    {
      "productId": 10,
      "quantity": 2,
      "unitPrice": 45.00
    },
    {
      "productId": 14,
      "quantity": 1,
      "unitPrice": 30.00
    }
  ],
  "totalAmount": 120.00,
  "cardNumber": "4532 1234 5678 1234",
  "pickupPod": "Pod #4 - Cape Town Waterfront"
}
```

- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "orderId": 101,
  "qrToken": "a1b2c3d4e5f6...",
  "txnRef": "FBX-1756800000-xyz12345"
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing required fields):
    ```json
    {
      "success": false,
      "error": {
        "message": "Missing required fields: items, totalAmount, cardNumber, pickupPod",
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

### POST /api/orders/subscription
- **Description:** Creates an initial order linked to a subscription. Automatically creates a new subscription record (next charge in 7 days) if none exists, links the order, and increments the subscription's `boxes_completed` counter.
- **Method & Path:** `POST /api/orders/subscription`
- **Authentication:** Required (`Bearer <token>`)
- **Request Body:**
```json
{
  "productId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "unitPrice": 220.00
    }
  ],
  "totalAmount": 220.00,
  "cardNumber": "4532 1234 5678 1234",
  "pickupPod": "Pod #2 - Johannesburg Sandton"
}
```

- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Subscription order created successfully",
  "orderId": 102,
  "subscriptionId": 5,
  "qrToken": "9f8e7d6c5b4a...",
  "txnRef": "FBX-1756800000-abc98765"
}
```

- **Error Responses:**
  - **400 Bad Request** (Missing fields):
    ```json
    {
      "success": false,
      "error": {
        "message": "Missing required fields: productId, items, totalAmount, cardNumber, pickupPod",
        "details": null
      }
    }
    ```
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

---

### GET /api/orders/:userId
- **Description:** Retrieves all orders placed by a specific user, sorted newest first, including line items for each order.
- **Method & Path:** `GET /api/orders/:userId`
- **Authentication:** Required (`Bearer <token>`)
- **Path Parameters:**
  - `userId` (number, required) — ID of the user.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "orders": [
    {
      "id": 102,
      "user_id": 1,
      "subscription_id": 5,
      "order_type": "subscription",
      "total_amount": "220.00",
      "payment_status": "paid",
      "payment_txn_ref": "FBX-1756800000-abc98765",
      "qr_token": "9f8e7d6c5b4a...",
      "pickup_pod": "Pod #2 - Johannesburg Sandton",
      "status": "confirmed",
      "created_at": "2026-09-04T12:00:00.000Z",
      "items": [
        {
          "id": 204,
          "order_id": 102,
          "product_id": 1,
          "quantity": 1,
          "unit_price": "220.00"
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

---

### GET /api/orders/:id
- **Description:** Retrieves full details for a single order by ID, including its associated line items (useful for confirmation and receipt screens).
- **Method & Path:** `GET /api/orders/:id`
- **Authentication:** Required (`Bearer <token>`)
- **Path Parameters:**
  - `id` (number, required) — ID of the order.
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
    "total_amount": "120.00",
    "payment_status": "paid",
    "payment_txn_ref": "FBX-1756800000-xyz12345",
    "qr_token": "a1b2c3d4e5f6...",
    "pickup_pod": "Pod #4 - Cape Town Waterfront",
    "status": "confirmed",
    "created_at": "2026-09-04T11:45:00.000Z",
    "items": [
      {
        "id": 201,
        "order_id": 101,
        "product_id": 10,
        "quantity": 2,
        "unit_price": "45.00"
      },
      {
        "id": 202,
        "order_id": 101,
        "product_id": 14,
        "quantity": 1,
        "unit_price": "30.00"
      }
    ]
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

### GET /api/subscriptions/user/:userId
- **Description:** Retrieves the most recent subscription record for a specific user.
- **Method & Path:** `GET /api/subscriptions/user/:userId`
- **Authentication:** Required (`Bearer <token>`)
- **Path Parameters:**
  - `userId` (number, required) — ID of the user.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "subscription": {
    "id": 5,
    "user_id": 1,
    "product_id": 1,
    "status": "active",
    "next_charge_date": "2026-09-11",
    "boxes_completed": 1,
    "pickup_pod": "Pod #2 - Johannesburg Sandton",
    "created_at": "2026-09-04T12:00:00.000Z"
  }
}
```

- **Error Responses:**
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
- **Description:** Pauses an active subscription, setting its status to `'paused'`.
- **Method & Path:** `PATCH /api/subscriptions/:id/pause`
- **Authentication:** Required (`Bearer <token>`)
- **Path Parameters:**
  - `id` (number, required) — ID of the subscription.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription paused"
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

---

### PATCH /api/subscriptions/:id/resume
- **Description:** Resumes a paused subscription, setting its status back to `'active'`.
- **Method & Path:** `PATCH /api/subscriptions/:id/resume`
- **Authentication:** Required (`Bearer <token>`)
- **Path Parameters:**
  - `id` (number, required) — ID of the subscription.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription resumed"
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

---

### PATCH /api/subscriptions/:id/skip
- **Description:** Skips the current week for a subscription by pushing `next_charge_date` forward by 7 days.
- **Method & Path:** `PATCH /api/subscriptions/:id/skip`
- **Authentication:** Required (`Bearer <token>`)
- **Path Parameters:**
  - `id` (number, required) — ID of the subscription.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription skipped for this week"
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

---

### PATCH /api/subscriptions/:id/cancel
- **Description:** Cancels an active subscription, setting its status to `'cancelled'`.
- **Method & Path:** `PATCH /api/subscriptions/:id/cancel`
- **Authentication:** Required (`Bearer <token>`)
- **Path Parameters:**
  - `id` (number, required) — ID of the subscription.
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription cancelled"
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

---

## 5. Product Routes (Contract / Upcoming)

> *Notice:* These endpoints represent the contract for the catalog and custom box-builder APIs.

### GET /api/products
- **Description:** Retrieves the list of available catalog products (boxes, meals, snacks) with optional filtering by dietary tag and text search.
- **Method & Path:** `GET /api/products`
- **Authentication:** None (Public)
- **Query Parameters:**
  - `diet` (string, optional) — Filter products by dietary requirement (e.g. `vegan`, `keto`, `halal`, `nut-free`, `gluten-free`).
  - `search` (string, optional) — Search keyword against product name and description.
- **Example Request:**
  `GET /api/products?diet=vegan&search=curry`
- **Request Body:** None

- **Success Response (200 OK):**
```json
{
  "success": true,
  "products": [
    {
      "id": 3,
      "name": "Vegan Chickpea & Spinach Curry",
      "description": "Slow-cooked chickpeas, fresh baby spinach, coconut cream, and aromatic basmati rice.",
      "price": "68.00",
      "category": "meal",
      "dietary_tags": ["vegan", "gluten-free"],
      "image_url": "/assets/images/products/chickpea-curry.jpg",
      "is_active": true
    },
    {
      "id": 7,
      "name": "Green Vitality Harvest Box",
      "description": "Curated weekly plant-based box with 5 chef-crafted meals.",
      "price": "299.00",
      "category": "box",
      "dietary_tags": ["vegan"],
      "image_url": "/assets/images/products/vitality-box.jpg",
      "is_active": true
    }
  ]
}
```

- **Error Responses:**
  - **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Failed to fetch products",
        "details": null
      }
    }
    ```

---

### GET /api/products/builder-items
- **Description:** Fetches all individual meal and snack items eligible for inclusion in the custom Box Builder, grouped or taggable for custom selection.
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
      "description": "Tender chicken breast, quinoa, and roasted seasonal vegetables.",
      "price": "55.00",
      "category": "meal",
      "dietary_tags": ["gluten-free", "keto"],
      "image_url": "/assets/images/products/lemon-chicken.jpg",
      "is_active": true
    },
    {
      "id": 14,
      "name": "Roasted Almond Energy Bites",
      "description": "Raw honey, cacao, chia seeds, and roasted almonds.",
      "price": "25.00",
      "category": "snack",
      "dietary_tags": ["standard", "gluten-free"],
      "image_url": "/assets/images/products/energy-bites.jpg",
      "is_active": true
    }
  ]
}
```

- **Error Responses:**
  - **500 Internal Server Error**:
    ```json
    {
      "success": false,
      "error": {
        "message": "Failed to fetch builder items",
        "details": null
      }
    }
    ```

---

## 6. General Error Format

All API errors adhere to a standard JSON envelope managed by the global error middleware (`server/middleware/error.middleware.js`).

### Format
```json
{
  "success": false,
  "error": {
    "message": "Human-readable error explanation",
    "details": null
  }
}
```

### Standard HTTP Status Codes

| HTTP Status | Name | Typical Cause |
|---|---|---|
| **200** | OK | Successful fetch, update, or general request. |
| **201** | Created | Resource successfully created (registration, order). |
| **400** | Bad Request | Missing required parameters or malformed input payload. |
| **401** | Unauthorized | Missing JWT token, invalid signature, or expired session. |
| **402** | Payment Required | Payment card declined by payment gateway (e.g. card ending in `0002`). |
| **404** | Not Found | Requested entity (user, order, subscription) does not exist. |
| **409** | Conflict | Duplicate resource conflict (e.g. email already in use). |
| **500** | Internal Server Error | Unhandled server exception or database transaction failure. |