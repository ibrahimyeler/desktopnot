# 🔐 Login API Documentation

## Endpoint Overview

**POST** `/login` - User authentication endpoint

This endpoint allows users to authenticate with their email and password credentials.

## Request Format

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

### Field Validation

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `email` | string | ✅ | Must be a valid email format |
| `password` | string | ✅ | Must not be empty |

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl8xMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJleHAiOjE3MzU4NzY4MDB9.example_token",
  "user": {
    "id": "user_123",
    "firstname": "John",
    "lastname": "Doe",
    "email": "test@example.com"
  }
}
```

### Error Responses

#### Invalid Request Data (400 Bad Request)
```json
{
  "success": false,
  "message": "Invalid request data: [validation error details]"
}
```

#### Validation Failed (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed: [validation error details]"
}
```

#### Invalid Credentials (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

## Frontend Integration Examples

### JavaScript (Fetch API)

```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } else {
      // Show error message
      alert(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Network error occurred');
  }
}

// Usage
loginUser('test@example.com', 'password123');
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

async function loginUser(email, password) {
  try {
    const response = await axios.post('http://localhost:8080/login', {
      email: email,
      password: password
    });

    const { data } = response;
    
    if (data.success) {
      // Store token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect
      window.location.href = '/dashboard';
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error
      alert(error.response.data.message);
    } else {
      // Network error
      alert('Network error occurred');
    }
  }
}
```

### React Hook

```javascript
import { useState } from 'react';

function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      setError('Network error occurred');
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

// Usage in component
function LoginForm() {
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    
    if (result.success) {
      // Redirect or update state
      console.log('Login successful:', result.user);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
```

### Vue.js

```javascript
// Composition API
import { ref } from 'vue';

export function useLogin() {
  const loading = ref(false);
  const error = ref(null);

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        error.value = data.message;
        return { success: false, error: data.message };
      }
    } catch (err) {
      error.value = 'Network error occurred';
      return { success: false, error: 'Network error occurred' };
    } finally {
      loading.value = false;
    }
  };

  return { login, loading, error };
}

// Usage in component
<template>
  <form @submit.prevent="handleSubmit">
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      required
    />
    <input
      v-model="password"
      type="password"
      placeholder="Password"
      required
    />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useLogin } from './useLogin';

const { login, loading, error } = useLogin();
const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  const result = await login(email.value, password.value);
  
  if (result.success) {
    // Redirect or emit event
    console.log('Login successful:', result.user);
  }
};
</script>
```

### Angular

```typescript
// login.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }
}

// login.component.ts
import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
      <input
        [(ngModel)]="email"
        name="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        [(ngModel)]="password"
        name="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit" [disabled]="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p *ngIf="error" style="color: red">{{ error }}</p>
    </form>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.loginService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        if (response.success && response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/dashboard']);
        } else {
          this.error = response.message;
        }
      },
      error: (error) => {
        this.error = 'Network error occurred';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
```

## Test Credentials

For testing purposes, you can use these credentials:

- **Email:** `test@example.com`
- **Password:** `password123`

## Error Handling

### Common Error Scenarios

1. **Invalid Email Format**
   - Response: 400 Bad Request
   - Message: "Validation failed: Key: 'LoginRequest.Email' Error:Field validation for 'Email' failed on the 'email' tag"

2. **Missing Required Fields**
   - Response: 400 Bad Request
   - Message: "Invalid request data: [field validation errors]"

3. **Invalid Credentials**
   - Response: 401 Unauthorized
   - Message: "Invalid email or password"

4. **Network Errors**
   - Handle with try-catch blocks
   - Show user-friendly error messages

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **Token Storage**: Store tokens securely (httpOnly cookies for sensitive apps)
3. **Password Hashing**: Ensure passwords are hashed on the server
4. **Rate Limiting**: Implement rate limiting for login attempts
5. **Input Validation**: Always validate input on both client and server

## Testing

You can test the login endpoint using:

1. **Interactive Test Page**: `http://localhost:8080/public/test-login.html`
2. **cURL Command**:
   ```bash
   curl -X POST http://localhost:8080/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```
3. **Postman**: Import the request and test with different scenarios

## Next Steps

After successful login:

1. **Store the token** in localStorage or secure storage
2. **Include token** in subsequent API requests as Authorization header
3. **Implement token refresh** mechanism
4. **Add logout functionality** to clear stored tokens
5. **Implement protected routes** that require authentication 