# FoodBoxx

FoodBoxx is a meal prep and snack-box e-commerce application for students and young professionals. It supports product browsing, custom-box building, orders, subscriptions, and payments.

## Single-server architecture

FoodBoxx runs on one Express server at `http://localhost:3000`. The server exposes all backend endpoints under `/api` and, after the frontend is built, serves the Vue application from `frontend/dist`. Client-side routes are returned from `frontend/dist/index.html`; unknown `/api/*` routes always receive a JSON 404 response.

## Requirements

- Node.js and npm
- MySQL or MariaDB

## Environment configuration

Copy `.env.example` to `.env` and set the database credentials for your local MySQL/MariaDB instance.

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=foodboxx
DB_PORT=3306
JWT_SECRET=replace-with-a-strong-secret
CORS_ORIGIN=http://localhost:3000
```

`DB_HOST`, `DB_USER`, and `DB_NAME` are required. The server verifies its MySQL connection before it begins listening.

## Demo boot sequence

From the repository root, run these three commands in order:

```bash
npm run setup
npm run db:schema && npm run db:seed
npm start
```

`npm run setup` installs root dependencies and builds the Vue frontend. The server is then available at `http://localhost:3000`.

For backend development with Node's watch mode, run:

```bash
npm run dev
```

## Demo credentials

```text
Email: demo@foodboxx.co.za
Password: Demo123!
```

## Project structure

```text
FoodBoxx/
├── database/
│   ├── schema.sql
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
└── package.json
```

## API overview

The API is available under `/api`.

- `/api/auth` — authentication
- `/api/products` — products and builder items
- `/api/orders` — orders
- `/api/payments` — payment sandbox
- `/api/subscriptions` — subscriptions
- `/api/payments/payfast` — Payfast sandbox integration (initiate, confirm, notify)

Detailed endpoint documentation is in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## Technologies

- Node.js and Express
- MySQL/MariaDB with mysql2
- Vue.js and Bootstrap 5
- bcryptjs, JSON Web Tokens, dotenv, and cors
