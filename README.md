# FoodBoxx

FoodBoxx is a meal prep and snack box e-commerce application designed for students and young professionals. Users can browse products, search and filter products, create orders, manage subscriptions, and access their account through the application.

## Project Structure

```text
FoodBoxx/
├── database/
│   └── seed.sql
├── docs/
├── frontend/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── server.js
├── package.json
└── README.md
```

## Requirements

Before running the project, make sure you have:

* Node.js
* npm
* MySQL/MariaDB
* Thunder Client (recommended for API testing)

## Installation

Clone the repository and open the project folder:

```bash
cd Group-10---Module-3-Core-Project
```

Install the required Node.js dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root.

Add the database configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Kaylam.933
DB_NAME=foodboxx
DB_PORT=3307
PORT=3000
```

Replace `your_database_password` with the password for your local MySQL/MariaDB user.

**Do not commit the `.env` file to GitHub**, as it contains database credentials.

> The example above uses port `3307`. If your local MySQL/MariaDB server uses a different port, update `DB_PORT` accordingly.

## Database Setup

Create the `foodboxx` database using MySQL/MariaDB.

The project uses the following main tables:

* `users`
* `products`
* `subscriptions`
* `orders`
* `order_items`

The seed file is located at:

```text
database/seed.sql
```

The seed file resets the existing development data and creates the standard demo data.

It currently creates:

* 1 demo user
* 10 products

The seed file can be rerun during development to reset the database to the standard demo dataset.

**Note:** The seed file deletes existing development data, so it should only be used when resetting the development/test database.

## Running the Backend

Start the server normally:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

## Product API Endpoints

### Get All Products

```http
GET /products
```

Optional query parameters can be used to filter or search products:

```text
/products?diet=vegan
/products?search=box
```

### Get a Product by ID

```http
GET /products/:id
```

Example:

```text
GET /products/1
```

### Get Builder Items

```http
GET /products/builder-items
```

This returns the meal and snack products available for the custom box builder.

## API Testing

Thunder Client can be used to test the API endpoints.

Example:

```text
GET http://localhost:3000/products
```

A successful response returns a JSON object containing:

* `success`
* `count`
* `data`

## Validation

The backend includes validation for:

* Email addresses
* Passwords
* Prices
* Quantities
* Product information

Invalid requests return an HTTP `400` response with an appropriate error message.

## Technologies Used

The backend uses:

* Node.js
* Express
* MySQL/MariaDB
* mysql2
* Nodemon
* bcryptjs
* dotenv

The backend follows a structure that separates routes, controllers, models, middleware, services, configuration, and utility functions.
