# FoodBoxx

FoodBoxx is a meal prep and snack box e-commerce application designed for students and young professionals.

Users can browse products, search and filter products by dietary preference, build custom boxes, create orders, manage subscriptions, and access their account through the application.

---

## Project Structure

```text
FoodBoxx/
│
├── database/
│   └── seed.sql
│
├── docs/
│
├── frontend/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── server.js
├── package.json
└── README.md
```

---

## Requirements

Before running the project, make sure you have:

* Node.js
* npm
* MySQL/MariaDB
* Thunder Client or Postman for API testing

---

## Installation

Clone the repository and open the project folder:

```bash
cd Group-10---Module-3-Core-Project
```

Install the required Node.js dependencies:

```bash
npm install
```

---

## Environment Configuration

Create a `.env` file in the project root.

Add your local database configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=foodboxx
DB_PORT=3307
PORT=3000
```

Replace `your_database_password` with your local MySQL/MariaDB password.

> **Important:** Never commit the `.env` file to GitHub because it contains database credentials.

The example above uses port `3307`. If your local MySQL/MariaDB server uses a different port, update `DB_PORT` accordingly.

---

## Database Setup

The project uses a MySQL/MariaDB database named `foodboxx`.

The database contains five main tables:

* `users`
* `products`
* `subscriptions`
* `orders`
* `order_items`

The database schema is managed separately from the seed data.

The seed file is located at:

```text
database/seed.sql
```

The seed file is used to populate the development database with FoodBoxx product data.

It currently includes:

* FoodBoxx box products
* Vegan products
* Halal products
* Keto products
* Nut-free products
* Gluten-free products
* Builder meal and snack items

> **Note:** The seed file deletes existing development data before inserting the seed data. Only use it when resetting the development/test database.

---

## Running the Backend

Start the server normally:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

---

# Product API

The product routes are available under:

```text
/api/products
```

## Get All Products

```http
GET /api/products
```

Returns the active FoodBoxx products.

### Search Products

```http
GET /api/products?search=box
```

### Filter by Dietary Preference

```http
GET /api/products?diet=vegan
```

Other supported dietary filters include:

```text
vegan
halal
keto
nut-free
gluten-free
```

### Search and Filter Together

```http
GET /api/products?diet=vegan&search=box
```

---

## Get a Product by ID

```http
GET /api/products/:id
```

Example:

```http
GET /api/products/1
```

Returns the requested product.

If the product does not exist, the API returns a `404` response.

---

## Get Builder Items

```http
GET /api/products/builder-items
```

Returns the meal and snack products available for the custom box builder.

---

# API Testing

Thunder Client or Postman can be used to test the backend endpoints.

Example:

```http
GET http://localhost:3000/api/products
```

A successful product response includes:

```json
{
  "success": true,
  "count": 12,
  "data": []
}
```

The exact number of products may change as the seed data is updated.

---

# Validation

The backend includes validation for:

* Email addresses
* Passwords
* Prices
* Quantities
* Product information
* Product query parameters

Invalid requests return an HTTP `400` response with an appropriate error message.

The backend also sanitises relevant user input before it is processed.

---

# Error Handling

The backend uses error-handling middleware to handle errors consistently.

Common responses include:

* `200` — successful request
* `201` — resource successfully created
* `400` — invalid request or validation error
* `401` — authentication required/failed
* `404` — requested resource not found
* `500` — server error

---

# Security

The backend includes several security measures:

* Passwords are hashed using `bcryptjs`
* JWT is used for authentication
* Protected routes require authentication
* Database queries use parameterised queries
* Input validation is applied to incoming data
* Sensitive configuration is stored in `.env`

---

# Technologies Used

### Backend

* Node.js
* Express
* MySQL/MariaDB
* mysql2
* bcryptjs
* dotenv
* Nodemon
* JSON Web Tokens (JWT)

### Frontend

* Vue.js
* Bootstrap 5

---

# Backend Structure

The backend follows a modular structure that separates different responsibilities:

* **Routes** — define API endpoints
* **Controllers** — handle incoming requests and responses
* **Models** — communicate with the database
* **Middleware** — validation and request processing
* **Services** — handle reusable business logic
* **Config** — database and application configuration
* **Utils** — reusable helper and validation functions

This structure keeps the backend organised and makes it easier for the team to maintain and extend.

---

# Development Notes

The FoodBoxx backend is being developed as part of the Group 10 Module 3 Core Project.

The API is currently designed to support:

* User authentication
* Product browsing
* Dietary filtering
* Product searching
* Custom box building
* Orders
* Payments
* Subscriptions
* QR-based order confirmation
* User order history

Additional API documentation and testing information can be found in the `docs/` folder.
