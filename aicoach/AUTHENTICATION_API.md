# Gofocus Authentication API - Complete Endpoint Documentation

**Last Updated:** January 2025  
**Version:** 1.0

---

## Overview

Gofocus authentication system provides comprehensive user authentication, OAuth integration, password management, and admin access control.

**Base URL:** `http://localhost:8001` (Development)  
**Production URL:** `https://api.gofocus.com`

---

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "username": "username"
}
```

**Validation:**
- Email: Valid email format required
- Password: Minimum 6 characters
- Username: Required

**Response (201 Created):**
```json
{
  "token": "eyJhbGc...",
  "refresh_token": "abc123def456...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "username",
    "auth_provider": "email",
    "provider_id": null,
    "is_active": true,
    "is_admin": false,
    "created_at": "2025-01-02T10:00:00Z"
  }
}
```

**Errors:**
- `400`: Invalid input or user already exists
- `500`: Server error

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGc...",
  "refresh_token": "abc123def456...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "username",
    "auth_provider": "email",
    "is_active": true,
    "is_admin": false,
    "created_at": "2025-01-02T10:00:00Z"
  }
}
```

**Token Expiration:** 7 days  
**Refresh Token Expiration:** 30 days

**Errors:**
- `400`: Invalid input
- `401`: Invalid credentials

---

### 3. Google OAuth Authentication

**Endpoint:** `POST /auth/google`

**Description:** Authenticate or register user via Google Sign-In

**Request Body:**
```json
{
  "id_token": "eyJhbGc...",
  "access_token": "ya29.a0AfH6SM..."
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGc...",
  "refresh_token": "abc123def456...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@gmail.com",
    "username": "user@gmail.com",
    "auth_provider": "google",
    "provider_id": "user@gmail.com",
    "is_active": true,
    "is_admin": false,
    "created_at": "2025-01-02T10:00:00Z"
  }
}
```

**Note:** ⚠️ ID token verification with Google's public keys must be implemented for production!

**Errors:**
- `400`: Invalid Google ID token
- `500`: Server error

---

### 4. Apple OAuth Authentication

**Endpoint:** `POST /auth/apple`

**Description:** Authenticate or register user via Apple Sign-In

**Request Body:**
```json
{
  "id_token": "eyJhbGc...",
  "authorization_code": "c1234567890abcdef...",
  "email": "user@icloud.com",
  "full_name": "John Doe"
}
```

**Response (200 OK):**
Same as Google OAuth

**Note:** ⚠️ ID token verification with Apple's public keys must be implemented!

**Errors:**
- `400`: Email required or invalid token
- `500`: Server error

---

### 5. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Description:** Request password reset verification code

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Verification code sent",
  "ttl_seconds": 600
}
```

**Code Expiration:** 10 minutes  
**SMS Integration:** ⚠️ Requires Twilio or Verimor configuration

**Note:** Returns success message even if email doesn't exist (security best practice)

**Errors:**
- `400`: Invalid email
- `500`: Failed to send code

---

### 6. Verify Code

**Endpoint:** `POST /auth/verify-code`

**Description:** Validate password reset verification code

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "valid": true
}
```

**Errors:**
- `400`: Invalid or expired code

---

### 7. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Description:** Reset password using verification code

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "new_password": "newsecurepassword123"
}
```

**Validation:**
- Password: Minimum 8 characters

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**Errors:**
- `400`: Invalid code, expired code, or weak password
- `500`: Failed to reset password

---

### 8. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refresh_token": "abc123def456..."
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGc..."
}
```

**Token Expiration:** 7 days

**Errors:**
- `400`: Invalid refresh token
- `401`: Expired refresh token

---

### 9. Validate Token

**Endpoint:** `GET /auth/validate`

**Description:** Check if JWT token is valid

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response (200 OK):**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "valid": true
}
```

**Errors:**
- `401`: Invalid or missing token

---

## Admin Endpoints

### 10. Admin Login

**Endpoint:** `POST /admin/login`

**Description:** Admin-only login endpoint

**Request Body:**
```json
{
  "email": "admin@gofocus.com",
  "password": "adminpassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "admin@gofocus.com",
    "username": "admin",
    "auth_provider": "email",
    "is_active": true,
    "is_admin": true,
    "created_at": "2025-01-02T10:00:00Z"
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `403`: User is not an admin

---

## Health Check

**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "healthy"
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
    provider_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Verification Codes Table
```sql
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    code VARCHAR(6) NOT NULL,
    type VARCHAR(50) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Security Features

### Implemented
- ✅ bcrypt password hashing
- ✅ JWT token generation
- ✅ Refresh token rotation
- ✅ Verification code expiration
- ✅ CORS middleware
- ✅ Password minimum length validation
- ✅ Email uniqueness enforcement

### Pending (MUST IMPLEMENT)
- ⚠️ Google ID token verification with public keys
- ⚠️ Apple ID token verification with public keys
- ⚠️ SMS sending (Twilio/Verimor integration)
- ⚠️ Rate limiting
- ⚠️ CORS origin whitelist
- ⚠️ Password complexity requirements
- ⚠️ Token blacklist for logout

---

## Environment Variables

```bash
# Database
DATABASE_URL=postgres://postgres:postgres@auth-db:5432/authdb?sslmode=disable

# JWT
JWT_SECRET=your-random-secret-key-here

# Port
PORT=8001

# SMS Provider (TODO)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
# OR
VERIMOR_API_KEY=

# Google OAuth (for token verification)
GOOGLE_CLIENT_ID=

# Apple OAuth (for token verification)
APPLE_CLIENT_ID=
```

---

## Mobile App Integration

### Flutter Example

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  static const String baseUrl = 'http://localhost:8001';

  // Register
  Future<Map<String, dynamic>> register(String email, String password, String username) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
        'username': username,
      }),
    );
    
    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Registration failed');
    }
  }

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Login failed');
    }
  }

  // Forgot Password
  Future<void> forgotPassword(String email) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/forgot-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email}),
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to send code');
    }
  }

  // Verify Code
  Future<bool> verifyCode(String email, String code) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/verify-code'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'code': code,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['valid'] ?? false;
    }
    return false;
  }

  // Reset Password
  Future<void> resetPassword(String email, String code, String newPassword) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/reset-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'code': code,
        'new_password': newPassword,
      }),
    );
    
    if (response.statusCode != 200) {
      throw Exception('Failed to reset password');
    }
  }

  // Google OAuth
  Future<Map<String, dynamic>> googleAuth(String idToken, String accessToken) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/google'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'id_token': idToken,
        'access_token': accessToken,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Google authentication failed');
    }
  }

  // Apple OAuth
  Future<Map<String, dynamic>> appleAuth(String idToken, String authCode, String email, String fullName) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/apple'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'id_token': idToken,
        'authorization_code': authCode,
        'email': email,
        'full_name': fullName,
      }),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Apple authentication failed');
    }
  }

  // Refresh Token
  Future<String> refreshToken(String refreshToken) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/refresh'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refresh_token': refreshToken}),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['token'];
    } else {
      throw Exception('Token refresh failed');
    }
  }

  // Validate Token
  Future<bool> validateToken(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/auth/validate'),
      headers: {'Authorization': 'Bearer $token'},
    );
    
    return response.statusCode == 200;
  }
}
```

---

## Testing

### Manual Testing with cURL

```bash
# Health check
curl http://localhost:8001/health

# Register
curl -X POST http://localhost:8001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","username":"testuser"}'

# Login
curl -X POST http://localhost:8001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Forgot Password
curl -X POST http://localhost:8001/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify Code
curl -X POST http://localhost:8001/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'

# Reset Password
curl -X POST http://localhost:8001/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456","new_password":"newpass123"}'

# Validate Token
curl http://localhost:8001/auth/validate \
  -H "Authorization: Bearer YOUR_TOKEN"

# Admin Login
curl -X POST http://localhost:8001/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gofocus.com","password":"adminpass"}'
```

---

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or missing fields |
| 401 | Unauthorized | Invalid credentials or token |
| 403 | Forbidden | Access denied (not admin) |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

---

## Next Steps

### Critical (Before Production)
1. ✅ Implement Google ID token verification
2. ✅ Implement Apple ID token verification
3. ✅ Add SMS provider (Twilio or Verimor)
4. ✅ Enable rate limiting
5. ✅ Set CORS origin whitelist
6. ✅ Add password complexity rules
7. ✅ Change default JWT secret
8. ✅ Secure database passwords

### Important
9. Add token blacklist for logout
10. Implement refresh token rotation
11. Add account lockout after failed attempts
12. Enable email verification
13. Add 2FA support

### Optional
14. Add social login providers (Facebook, Twitter)
15. Implement biometric authentication
16. Add session management UI
17. Create audit logs

---

**For questions or issues, see HANDOVER_OVERVIEW.md**



