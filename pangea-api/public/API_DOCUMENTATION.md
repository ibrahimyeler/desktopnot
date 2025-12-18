# API Documentation - Frontend Integration

Bu dokümantasyon, frontend geliştiriciler için Pangea API'sinin register endpoint'ini açıklamaktadır.

## 🚀 Base URL

```
http://localhost:8080
```

## 📋 Register Endpoint

### POST /register

Kullanıcı kaydı için kullanılır.

#### Request

**URL:** `POST http://localhost:8080/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstname": "string",
  "lastname": "string", 
  "email": "string",
  "password": "string",
  "confirm_password": "string"
}
```

#### Field Validations

| Field | Type | Required | Min Length | Max Length | Validation Rules |
|-------|------|----------|------------|------------|------------------|
| `firstname` | string | ✅ | 1 | - | Required |
| `lastname` | string | ✅ | 1 | - | Required |
| `email` | string | ✅ | - | - | Required, Valid email format |
| `password` | string | ✅ | 6 | - | Required, Minimum 6 characters |
| `confirm_password` | string | ✅ | - | - | Required, Must match password |

#### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "User registered successfully",
  "user_id": "user_email@example.com"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`

**1. Missing Required Fields:**
```json
{
  "success": false,
  "message": "Invalid request data: Key: 'RegisterRequest.LastName' Error:Field validation for 'LastName' failed on the 'required' tag"
}
```

**2. Invalid Email Format:**
```json
{
  "success": false,
  "message": "Invalid request data: Key: 'RegisterRequest.Email' Error:Field validation for 'Email' failed on the 'email' tag"
}
```

**3. Password Too Short:**
```json
{
  "success": false,
  "message": "Invalid request data: Key: 'RegisterRequest.Password' Error:Field validation for 'Password' failed on the 'min' tag"
}
```

**4. Password Confirmation Mismatch:**
```json
{
  "success": false,
  "message": "Password and confirm password do not match"
}
```

**5. Invalid JSON:**
```json
{
  "success": false,
  "message": "Invalid request data: invalid character 'a' looking for beginning of value"
}
```

## 🔧 Frontend Integration Examples

### JavaScript (Fetch API)

```javascript
async function registerUser(userData) {
  try {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Registration successful:', data.message);
      console.log('User ID:', data.user_id);
      return { success: true, data };
    } else {
      console.error('Registration failed:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: 'Network error occurred' };
  }
}

// Usage
const userData = {
  firstname: "John",
  lastname: "Doe",
  email: "john.doe@example.com",
  password: "password123",
  confirm_password: "password123"
};

registerUser(userData).then(result => {
  if (result.success) {
    // Handle success
    showSuccessMessage(result.data.message);
    redirectToLogin();
  } else {
    // Handle error
    showErrorMessage(result.error);
  }
});
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:8080';

async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_BASE}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = response.data;
    
    if (data.success) {
      console.log('Registration successful:', data.message);
      return { success: true, data };
    } else {
      console.error('Registration failed:', data.message);
      return { success: false, error: data.message };
    }
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('Server error:', error.response.data);
      return { success: false, error: error.response.data.message };
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
      return { success: false, error: 'Network error occurred' };
    } else {
      // Other error
      console.error('Error:', error.message);
      return { success: false, error: 'An error occurred' };
    }
  }
}
```

### React Hook Example

```javascript
import { useState } from 'react';

function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        return { success: true, data };
      } else {
        setError(data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      const errorMessage = 'Network error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, success };
}

// Usage in React component
function RegisterForm() {
  const { register, loading, error, success } = useRegister();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await register(formData);
    
    if (result.success) {
      // Handle success
      console.log('Registration successful!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Registration successful!</div>}
    </form>
  );
}
```

### Vue.js Example

```javascript
// Vue 3 Composition API
import { ref } from 'vue';

export function useRegister() {
  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (data.success) {
        success.value = true;
        return { success: true, data };
      } else {
        error.value = data.message;
        return { success: false, error: data.message };
      }
    } catch (err) {
      const errorMessage = 'Network error occurred';
      error.value = errorMessage;
      return { success: false, error: errorMessage };
    } finally {
      loading.value = false;
    }
  };

  return { register, loading, error, success };
}
```

### Angular Example

```typescript
// register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, userData);
  }
}

// register.component.ts
import { Component } from '@angular/core';
import { RegisterService, RegisterRequest } from './register.service';

@Component({
  selector: 'app-register',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="formData.firstname" name="firstname" placeholder="First Name" required>
      <input [(ngModel)]="formData.lastname" name="lastname" placeholder="Last Name" required>
      <input [(ngModel)]="formData.email" name="email" type="email" placeholder="Email" required>
      <input [(ngModel)]="formData.password" name="password" type="password" placeholder="Password" required>
      <input [(ngModel)]="formData.confirm_password" name="confirm_password" type="password" placeholder="Confirm Password" required>
      
      <button type="submit" [disabled]="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
      
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="success" class="success">Registration successful!</div>
    </form>
  `
})
export class RegisterComponent {
  formData: RegisterRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirm_password: ''
  };

  loading = false;
  error: string | null = null;
  success = false;

  constructor(private registerService: RegisterService) {}

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.success = false;

    this.registerService.register(this.formData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.success = true;
          console.log('Registration successful:', response.message);
        } else {
          this.error = response.message;
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Network error occurred';
        console.error('Registration error:', error);
      }
    });
  }
}
```

## 🧪 Testing Examples

### cURL Examples

**Successful Registration:**
```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

**Missing Required Field:**
```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "email": "john.doe@example.com",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

**Invalid Email:**
```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "invalid-email",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

**Password Too Short:**
```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "password": "123",
    "confirm_password": "123"
  }'
```

**Password Mismatch:**
```bash
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "confirm_password": "differentpassword"
  }'
```

## 🔍 Error Handling Best Practices

### 1. Client-Side Validation

```javascript
function validateForm(userData) {
  const errors = [];

  // Required fields
  if (!userData.firstname?.trim()) errors.push('First name is required');
  if (!userData.lastname?.trim()) errors.push('Last name is required');
  if (!userData.email?.trim()) errors.push('Email is required');
  if (!userData.password) errors.push('Password is required');
  if (!userData.confirm_password) errors.push('Confirm password is required');

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (userData.email && !emailRegex.test(userData.email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (userData.password && userData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Password confirmation
  if (userData.password && userData.confirm_password && 
      userData.password !== userData.confirm_password) {
    errors.push('Passwords do not match');
  }

  return errors;
}
```

### 2. User-Friendly Error Messages

```javascript
function getErrorMessage(serverError) {
  const errorMap = {
    'required': 'This field is required',
    'email': 'Please enter a valid email address',
    'min': 'Password must be at least 6 characters long',
    'Password and confirm password do not match': 'Passwords do not match'
  };

  // Extract field name from server error
  const fieldMatch = serverError.match(/Key: 'RegisterRequest\.(\w+)'/);
  const field = fieldMatch ? fieldMatch[1].toLowerCase() : '';
  
  // Extract validation type
  const validationMatch = serverError.match(/failed on the '(\w+)' tag/);
  const validation = validationMatch ? validationMatch[1] : '';

  if (field && validation) {
    const key = `${field}_${validation}`;
    return errorMap[key] || serverError;
  }

  return errorMap[serverError] || serverError;
}
```

### 3. Loading States

```javascript
function RegisterButton({ loading, disabled, children }) {
  return (
    <button 
      type="submit" 
      disabled={loading || disabled}
      className={loading ? 'loading' : ''}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          Registering...
        </>
      ) : (
        children
      )}
    </button>
  );
}
```

## 🚨 CORS Configuration

API zaten CORS desteği ile gelir. Eğer CORS hatası alırsanız, API'nin çalıştığından emin olun:

```bash
curl http://localhost:8080/health
```

## 📞 Support

Herhangi bir sorun yaşarsanız:

1. API'nin çalıştığını kontrol edin: `curl http://localhost:8080/health`
2. Network sekmesinde istekleri kontrol edin
3. Console'da hata mesajlarını kontrol edin
4. Request/Response formatlarını kontrol edin 