# FoodBoxx API Documentation

Base URL: `http://localhost:3000/api`

All protected routes require a JWT token in the Authorization header:
`Authorization: Bearer <token>`

---

## 1. Auth Routes

### POST /api/auth/register
**Description:** Register a new user.

**Request Body:**
```json
{
  "name": "Demo User",
  "email": "demo@foodboxx.co.za",
  "password": "Demo123!",
  "dietary_preferences": "standard"
}