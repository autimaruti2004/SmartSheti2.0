# Auth Setup

Create a `.env` file in this directory with:

PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=smartsheti
JWT_SECRET=replace_with_secure_random_string

Endpoints:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me` (requires `Authorization: Bearer <token>`)
