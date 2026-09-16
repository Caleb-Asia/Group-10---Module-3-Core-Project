# FoodBoxx API Documentation

Base URL: `http://localhost:3000/api`

Protected endpoints require a bearer token:

```http
Authorization: Bearer <token>
```

## Approved pickup pods

Orders and subscriptions must use one of these pickup locations:

- `UCT Library`
- `Res Hall A`
- `Stellenbosch Neelsie`
- `CPUT Woodstock`
- `Workshop17 Woodstock`
- `Virgin Active Woodstock`

## Error format

All errors use this structure:

```json
{
  "success": false,
  "error": {
    "message": "Human-readable error description",
    "details": null
  }
}
```

## 1. Auth routes

### POST /api/auth/register

Registers a user.

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "dietary_preferences": "vegan,gluten-free"
}
```

Returns `201 Created` with `{ "success": true, "message": "User registered successfully", "userId": 1 }`.

### POST /api/auth/login

Authenticates a user and returns a JWT.

```json
{
  "email": "jane@example.com",
  "password": "SecurePassword123!"
}
```

Returns `{ success, token, user }`.

### GET /api/auth/me

Returns the authenticated user's profile.

### PATCH /api/auth/me

Updates the authenticated user's profile.

```json
{
  "name": "Jane Smith",
  "email": "janesmith@example.com",
  "dietary_preferences": "keto,gluten-free"
}
```

## 2. Payment route

### POST /api/payments

**Sandbox/test-only endpoint.** It simulates a payment gateway and does not create an order. Normal order and subscription creation process payment internally.

```json
{
  "cardNumber": "4532 1234 5678 1234",
  "amount": 74.00
}
```

Cards ending in `0002` return `402 Payment Required`; other cards return:

```json
{
  "success": true,
  "message": "Payment approved successfully",
  "txnRef": "FBX-1756800000-a1b2c3d4",
  "amount": 74
}
```

### POST /api/payments/payfast/initiate

Protected by JWT. Validates and prices the order, then returns a signed Payfast redirect URL.

Request body:

```json
{
  "items": [{ "productId": 2, "quantity": 1 }],
  "pickupPod": "UCT Library",
  "orderType": "one-off"
}
```

Returns: `{ success, redirectUrl, ref, totalAmount }`

### POST /api/payments/payfast/confirm

Public. Called by the frontend when the browser returns from Payfast. Synchronously verifies the payment with Payfast's validate API, then creates the order.

Request body:

```json
{
  "ref": "<pending-ref>",
  "payfastData": { "payment_status": "COMPLETE", "pf_payment_id": "..." }
}
```

Returns: `{ success, orderId, totalAmount }`

### POST /api/payments/payfast/notify

Public. ITN webhook (dormant on localhost).

## 3. Order routes

All order routes require authentication. Prices are always calculated from the `products` table; client-supplied prices and totals are ignored.

### POST /api/orders

Creates a one-off order.

```json
{
  "items": [
    { "productId": 1, "quantity": 1 }
  ],
  "cardNumber": "4532 1234 5678 1234",
  "pickupPod": "Workshop17 Woodstock"
}
```

### POST /api/orders/custom

Creates a custom box order.

```json
{
  "items": [
    { "productId": 10, "quantity": 2 },
    { "productId": 14, "quantity": 2 }
  ],
  "cardNumber": "4532 1234 5678 1234",
  "pickupPod": "UCT Library"
}
```

Both one-off and custom order endpoints return `201 Created`:

```json
{
  "success": true,
  "message": "Order created successfully",
  "orderId": 101,
  "totalAmount": 79,
  "txnRef": "FBX-1756800000-a1b2c3d4"
}
```

### POST /api/orders/subscription

This is the **canonical subscription creation endpoint**. It derives the single subscription box line item and its price from `productId`; clients do not send items, quantities, or prices.

```json
{
  "productId": 2,
  "cardNumber": "4532 1234 5678 1234",
  "pickupPod": "CPUT Woodstock"
}
```

Returns `201 Created` with `{ success, message, orderId, subscriptionId, totalAmount, txnRef }`.

### GET /api/orders/user/:userId

Returns the authenticated user's order history, newest first. Every order item includes the product display fields required by the frontend.

```json
{
  "success": true,
  "orders": [
    {
      "id": 102,
      "order_type": "custom",
      "total_amount": "74.00",
      "status": "confirmed",
      "items": [
        {
          "id": 201,
          "product_id": 10,
          "quantity": 2,
          "unit_price": "25.00",
          "product_name": "Grilled Lemon Herb Chicken Bowl",
          "image_url": "/assets/images/lemon-chicken.jpg",
          "category": "meal"
        }
      ]
    }
  ]
}
```

### GET /api/orders/:id

Returns one owned order. Its `items` entries include `product_name`, `image_url`, and `category`, as in the order-history response.

## 4. Subscription routes

All subscription routes require authentication and enforce ownership.

### POST /api/subscriptions

This brief-compatible endpoint creates a subscription and its first order. `POST /api/orders/subscription` remains the canonical endpoint. The server derives the box price, processes payment, and creates the subscription and first order in one transaction.

```json
{
  "productId": 2,
  "pickupPod": "CPUT Woodstock",
  "cardNumber": "4532 1234 5678 1234"
}
```

Returns `201 Created`:

```json
{
  "success": true,
  "subscriptionId": 5,
  "orderId": 103,
  "txnRef": "FBX-1756800000-e9f0a1b2",
  "totalAmount": 89
}
```

### GET /api/subscriptions/user/:userId

Returns the authenticated user's latest subscription.

### PATCH /api/subscriptions/:id

Updates the selected box and/or pickup pod for an owned active or paused subscription. Authentication is required. Provide at least one of `productId` or `pickupPod`:

```json
{
  "productId": 2,
  "pickupPod": "CPUT Woodstock"
}
```

`productId` must be a positive integer that references an active product with category `box`. `pickupPod` must be one of the approved pickup pods.

Returns:

```json
{
  "success": true,
  "subscription": {}
}
```

### PATCH /api/subscriptions/:id/pause

Pauses an active subscription.

### PATCH /api/subscriptions/:id/resume

Resumes a paused subscription.

### PATCH /api/subscriptions/:id/skip

Advances the next charge date by seven days for an active subscription.

### PATCH /api/subscriptions/:id/cancel

Cancels an active or paused subscription. Cancelled subscriptions cannot be resumed.

## 5. Product routes

### GET /api/products

Returns active catalog products. Optional query parameters are `diet` and `search`.

```json
{
  "success": true,
  "count": 1,
  "data": [
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

### GET /api/products/:id

Returns `{ success, data }` for one product.

### GET /api/products/builder-items

Returns meal and snack products available to the custom box builder.

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 10,
      "name": "Grilled Lemon Herb Chicken Bowl",
      "price": "25.00",
      "category": "meal",
      "image_url": "/assets/images/lemon-chicken.jpg"
    },
    {
      "id": 14,
      "name": "Roasted Almond Energy Bites",
      "price": "12.00",
      "category": "snack",
      "image_url": "/assets/images/energy-bites.jpg"
    }
  ]
}
```

## Status codes

| Status | Meaning |
| --- | --- |
| `200` | Successful retrieval, update, or sandbox payment. |
| `201` | Resource created. |
| `400` | Invalid request or invalid state transition. |
| `401` | Missing or invalid JWT. |
| `402` | Simulated card decline. |
| `403` | Resource belongs to another user. |
| `404` | Resource or API endpoint was not found. |
| `409` | Unique-constraint conflict. |
| `500` | Unexpected server error. |
