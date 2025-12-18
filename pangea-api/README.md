# Pangea API

A simple Go API with user registration and OAuth2 authentication (Google & GitHub) built using Gin framework.

## Features

- User registration endpoint with validation
- Google OAuth2 authentication
- GitHub OAuth2 authentication
- CORS support
- Health check endpoint
- Input validation for all fields
- Beautiful frontend interface

## Requirements

- Go 1.24.6 or higher

## Installation

1. Clone the repository
2. Install dependencies:
```bash
go mod tidy
```

## OAuth2 Setup

### Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application Type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:8080/auth/google/callback`
7. Copy Client ID and Client Secret

### GitHub OAuth2 Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: "Pangea API"
   - Homepage URL: `http://localhost:8080`
   - Authorization callback URL: `http://localhost:8080/auth/github/callback`
4. Copy Client ID and Client Secret

### Environment Variables

Create a `.env` file or set environment variables:

```bash
# Google OAuth2
export GOOGLE_CLIENT_ID="your-google-client-id"
export GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth2
export GITHUB_CLIENT_ID="your-github-client-id"
export GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Running the API

```bash
go run main.go
```

The server will start on `http://localhost:8080`

## API Endpoints

### POST /register

Register a new user with the following fields:

**Request Body:**
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "confirm_password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user_id": "user_john.doe@example.com"
}
```

### GET /auth/google

Initiate Google OAuth flow.

**Response:**
```json
{
  "success": true,
  "auth_url": "https://accounts.google.com/oauth/authorize?..."
}
```

### GET /auth/google/callback

Handle Google OAuth callback.

**Response:**
```json
{
  "success": true,
  "message": "Google authentication successful",
  "user": {
    "id": "123456789",
    "email": "john.doe@gmail.com",
    "first_name": "John",
    "last_name": "Doe",
    "picture": "https://...",
    "provider": "google"
  }
}
```

### GET /auth/github

Initiate GitHub OAuth flow.

**Response:**
```json
{
  "success": true,
  "auth_url": "https://github.com/login/oauth/authorize?..."
}
```

### GET /auth/github/callback

Handle GitHub OAuth callback.

**Response:**
```json
{
  "success": true,
  "message": "GitHub authentication successful",
  "user": {
    "id": "12345678",
    "email": "john.doe@gmail.com",
    "first_name": "John",
    "last_name": "Doe",
    "picture": "https://...",
    "provider": "github"
  }
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

## Frontend

A beautiful frontend interface is included in `public/index.html` that demonstrates:

- Google and GitHub OAuth buttons
- Registration form
- Error and success message handling
- Responsive design

To use the frontend:
1. Open `public/index.html` in your browser
2. Or serve it with a simple HTTP server:
```bash
cd public && python3 -m http.server 3000
```

## Validation Rules

- `firstname`: Required
- `lastname`: Required
- `email`: Required, must be valid email format
- `password`: Required, minimum 6 characters
- `confirm_password`: Required, must match password

## Testing the API

You can test the API using curl:

```bash
# Test registration
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "confirm_password": "password123"
  }'

# Test Google OAuth initiation
curl http://localhost:8080/auth/google

# Test GitHub OAuth initiation
curl http://localhost:8080/auth/github

# Test health check
curl http://localhost:8080/health
```

## Error Responses

The API returns appropriate error messages for:
- Missing required fields
- Invalid email format
- Password too short
- Password confirmation mismatch
- Invalid JSON format
- OAuth configuration issues
- OAuth authentication failures

## Next Steps

This is a basic implementation. In a production environment, you would want to add:

1. Database integration (PostgreSQL, MySQL, etc.)
2. Password hashing (bcrypt)
3. JWT token authentication
4. Email verification
5. Rate limiting
6. Logging
7. Environment configuration
8. Unit tests
9. Session management
10. User profile management 