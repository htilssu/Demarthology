# API Service Documentation

This documentation provides examples of how to use the implemented Axios API service with authentication.

## Overview

The API service provides:
- Axios instance with configuration
- Authentication using Authorization header
- Token management from localStorage/cookies
- HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Error handling and interceptors
- File upload support
- Pagination support

## Basic Usage

### Importing Services

```typescript
import { AuthService, UserService } from '../services';
import { apiService, AuthUtils } from '../utils';
```

### Using the Main API Service

```typescript
// Import the singleton instance
import { apiService } from '../utils';

// Basic requests
const users = await apiService.get('/users');
const newUser = await apiService.post('/users', { name: 'John', email: 'john@example.com' });
const updatedUser = await apiService.put('/users/1', { name: 'John Updated' });
await apiService.delete('/users/1');

// With pagination
const paginatedUsers = await apiService.getPaginated('/users', { 
  page: 1, 
  limit: 10, 
  sortBy: 'name' 
});

// File upload
const file = document.getElementById('fileInput').files[0];
const uploadResult = await apiService.uploadFile('/users/1/avatar', file, 'avatar');
```

### Authentication Examples

```typescript
import { authService } from '../services';
import { AuthUtils } from '../utils';

// Login
const loginResult = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Check authentication status
if (AuthUtils.isAuthenticated()) {
  const currentUser = await authService.getCurrentUser();
}

// Logout
await authService.logout();
```

### Configuration

```typescript
// Update API configuration
import { apiService } from '../utils';

apiService.updateConfig({
  baseURL: 'https://api.example.com/v1',
  timeout: 15000,
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

### Error Handling

```typescript
try {
  const data = await apiService.get('/protected-endpoint');
} catch (error) {
  if (error.statusCode === 401) {
    // Handle unauthorized access
    console.log('Please login again');
  } else if (error.statusCode === 404) {
    console.log('Resource not found');
  } else {
    console.log('Error:', error.message);
  }
}
```

### Authentication Token Management

```typescript
import { AuthUtils } from '../utils';

// Set tokens
AuthUtils.setAuthToken('your-jwt-token');
AuthUtils.setRefreshToken('your-refresh-token');

// Get tokens
const authToken = AuthUtils.getAuthToken();
const refreshToken = AuthUtils.getRefreshToken();

// Check authentication
const isLoggedIn = AuthUtils.isAuthenticated();

// Clear tokens (logout)
AuthUtils.clearTokens();

// Get authorization header
const authHeader = AuthUtils.getAuthorizationHeader(); // "Bearer your-jwt-token"
```

### Skip Authentication for Specific Requests

```typescript
// For public endpoints (login, register, etc.)
const publicData = await apiService.get('/public/data', {}, { skipAuth: true });
const loginResult = await apiService.post('/auth/login', credentials, { skipAuth: true });
```

### Using in React Components

```typescript
import React, { useState, useEffect } from 'react';
import { apiService, AuthUtils } from '../utils';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (AuthUtils.isAuthenticated()) {
          const userData = await apiService.get('/auth/me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};
```

## Environment Variables

Add these to your `.env` file:

```
REACT_APP_API_URL=http://localhost:3001/api
```

## Features

### Automatic Authentication
- Automatically adds Authorization header to requests
- Reads tokens from localStorage (priority) or cookies
- Supports token refresh

### Error Handling
- Standardized error format
- Network error detection
- HTTP status code handling

### Request/Response Interceptors
- Automatic token attachment
- Response data extraction
- Error transformation

### File Upload Support
- Multipart form data handling
- Progress tracking capability
- Additional metadata support

### Pagination
- Built-in pagination support
- Configurable page size and sorting
- Response metadata included

### TypeScript Support
- Full type safety
- Interface definitions
- Generic type support