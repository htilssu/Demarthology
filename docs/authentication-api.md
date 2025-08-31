# Authentication API Endpoints

This document describes the authentication API endpoints that the frontend expects to be implemented in the backend.

## Overview

The frontend authentication service now calls real API endpoints instead of using mock authentication. If the API endpoints are not available, it will gracefully fallback to development mode.

## Required Endpoints

### 1. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "userpassword",
  "rememberMe": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "user": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "accessToken": "jwt_token_here",
  "tokenType": "Bearer"
}
```

**Error Responses:**
- `401`: Invalid credentials
- `400`: Invalid request format

### 2. Register
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "newpassword",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "user": {
    "email": "newuser@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "accessToken": "jwt_token_here",
  "tokenType": "Bearer"
}
```

**Error Responses:**
- `409`: Email already exists
- `400`: Invalid request format

### 3. Get Current User
**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "avatar": "avatar_url",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Error Responses:**
- `401`: Invalid or expired token

### 4. Logout
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

### 5. Refresh Token
**POST** `/api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "accessToken": "new_jwt_token_here",
  "refreshToken": "new_refresh_token_here",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

**Error Responses:**
- `401`: Invalid refresh token

### 6. Change Password
**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Mật khẩu đã được thay đổi"
}
```

**Error Responses:**
- `400`: Current password incorrect
- `422`: New password invalid

## Authentication Flow

1. **Login/Register**: User provides credentials → Receives JWT token
2. **Token Storage**: Frontend stores token in localStorage
3. **API Requests**: Token is automatically added to Authorization header
4. **Token Refresh**: If token expires (401), automatically refresh using refresh token
5. **Logout**: Invalidate token on server and clear from localStorage

## Current Behavior

- ✅ **Real API Available**: Calls actual endpoints
- 🔄 **API Not Available**: Falls back to development mode (mock authentication)
- 🔒 **Automatic Token Refresh**: Handles expired tokens automatically
- 💾 **Session Persistence**: Maintains login state across browser refreshes

## Environment Configuration

Set the API URL in `.env.local`:
```
REACT_APP_API_URL=http://localhost:8080
```

## Implementation Status

- ✅ Frontend authentication service updated to call real API
- ✅ Automatic token refresh mechanism
- ✅ Graceful fallback to development mode
- ✅ Error handling and user feedback
- ⏳ Backend authentication endpoints need implementation

## Testing

The frontend will attempt to call real API endpoints and log the results in the browser console:
- `🔐 Attempting real API login...` - Trying real API
- `✅ Real API login successful` - Real API worked
- `🔄 API not available, using development authentication...` - Fallback mode