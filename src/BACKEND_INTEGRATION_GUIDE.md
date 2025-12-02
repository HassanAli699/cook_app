# 🔧 Backend Integration Guide - Kitchen Nova

## Overview
This guide provides a complete reference for all backend integration points in the Kitchen Nova **mobile application**. Each section includes TODO comments locations, API endpoint specifications, and implementation examples.

**⚠️ IMPORTANT: This is a MOBILE APPLICATION (Flutter target), not a web app.**

All backend implementation must consider:
- 📱 Mobile network conditions (3G/4G/5G, intermittent connectivity)
- 💾 Data usage optimization (users on limited plans)
- ⚡ Battery efficiency (minimize background processes)
- 🔄 Offline support (cache critical data, queue actions)
- 📦 Response compression (gzip, minimize payload sizes)

**📌 For a complete checklist of ALL features needing backend integration, see [`/COMPLETE_BACKEND_TODO_CHECKLIST.md`](/COMPLETE_BACKEND_TODO_CHECKLIST.md)**

**📌 For Spoonacular & Nutritionix recipe API integration, see [`/RECIPE_API_INTEGRATION_GUIDE.md`](/RECIPE_API_INTEGRATION_GUIDE.md)**

**📌 For mobile app optimization & deployment guide, see [`/MOBILE_APP_BACKEND_INTEGRATION_SUMMARY.md`](/MOBILE_APP_BACKEND_INTEGRATION_SUMMARY.md)**

---

## 📋 Table of Contents

1. [Authentication](#authentication)
   - [Google OAuth](#google-oauth)
   - [Email/Password Login](#emailpassword-login)
   - [Password Reset Flow](#password-reset-flow)
   - [Change Password](#change-password)
2. [User Profile Management](#user-profile-management)
   - [Fetch Profile Data](#fetch-profile-data)
   - [Update Profile](#update-profile)
   - [Update Profile Photo](#update-profile-photo)
   - [Dietary Preferences](#dietary-preferences)
3. [Notification Preferences](#notification-preferences)
   - [Fetch Notification Settings](#fetch-notification-settings)
   - [Update Master Notification Toggle](#update-master-notification-toggle)
   - [Update Individual Notification](#update-individual-notification)
   - [Enable/Disable All Notifications](#enabledisable-all-notifications)

---

## 🔐 Authentication

### Google OAuth

**File:** `/screens/auth/GoogleAuthScreen.tsx`  
**Function:** `handleCredentialResponse`  
**Line:** ~74

**API Endpoint:**
```
POST /api/auth/google
```

**Request Body:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6...",
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "emailVerified": true,
    "googleId": "1234567890"
  },
  "token": "jwt_token_here",
  "isNewUser": false
}
```

**Backend Requirements:**
1. Verify Google ID token with Google's token verification API
2. Check if user exists in database by `googleId` or `email`
3. If new user, create account with Google data
4. Generate JWT token for session
5. Return user data + token

**Security:**
- Verify token signature with Google public keys
- Check token expiration and audience
- Rate limit authentication attempts
- Use HTTPS only

---

### Email/Password Login

**File:** `/screens/auth/LoginScreen.tsx`  
**Function:** `handleLogin`  
**Line:** ~77

**API Endpoint:**
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "MyPassword123!"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": "user_123",
    "email": "john@example.com",
    "name": "John Doe",
    "picture": null,
    "emailVerified": true
  },
  "token": "jwt_token_here"
}
```

**Response (User Not Found - 404):**
```json
{
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

**Response (Wrong Password - 401):**
```json
{
  "error": "Incorrect password",
  "code": "INVALID_CREDENTIALS"
}
```

**Frontend Behavior:**
- If 404 (user not found): Show error for 1.5s, then redirect to signup with email pre-filled
- If 401 (wrong password): Show "Incorrect password" error
- If 200 (success): Store token and navigate to home

**Backend Requirements:**
1. Look up user by email
2. If not found, return 404
3. Compare password hash (bcrypt)
4. If mismatch, return 401
5. Generate JWT token
6. Return user data + token

---

### Password Reset Flow

#### Send Reset Email

**File:** `/screens/auth/ForgotPasswordScreen.tsx`  
**Function:** `handleSendLink`  
**Line:** ~15

**API Endpoint:**
```
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Backend Requirements:**
1. Check if user exists with this email
2. Generate secure reset token (JWT with 15-30 min expiration)
3. Store token hash in database with user ID and expiration
4. Send email with reset link containing token
5. Return success response

**Email Template:**
```
Subject: Reset Your Kitchen Nova Password

Hi [Name],

You requested to reset your password. Click the link below to create a new password:

[Reset Link: https://kitchennova.com/reset-password?token=SECURE_TOKEN]

This link expires in 30 minutes.

If you didn't request this, please ignore this email.

Thanks,
Kitchen Nova Team
```

---

#### Resend Reset Email

**File:** `/screens/auth/ResetLinkSentScreen.tsx`  
**Function:** `handleResendLink`  
**Line:** ~44

**API Endpoint:**
```
POST /api/auth/resend-reset-link
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link resent"
}
```

**Backend Requirements:**
1. Same as "Send Reset Email" but with rate limiting
2. Allow resend only after cooldown period (60 seconds)
3. Invalidate previous tokens for this user
4. Generate new token and send email

---

#### Reset Password

**File:** `/screens/auth/NewPasswordScreen.tsx`  
**Function:** `handleReset`  
**Line:** ~86

**API Endpoint:**
```
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "MyNewPassword123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Response (Invalid/Expired Token - 400):**
```json
{
  "error": "Reset link has expired or is invalid",
  "code": "INVALID_TOKEN"
}
```

**Backend Requirements:**
1. Verify JWT token signature and expiration
2. Look up token in database
3. Check if token is already used
4. Validate new password meets requirements
5. Hash new password (bcrypt with salt rounds 10-12)
6. Update user password in database
7. Mark token as used/delete from database
8. Return success response

---

### Change Password

**File:** `/screens/ChangePasswordScreen.tsx`  
**Function:** `handleSubmit`  
**Line:** ~85

**API Endpoint:**
```
POST /api/auth/change-password
Authorization: Bearer {token}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "MyOldPassword123!",
  "newPassword": "MyNewPassword123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (Wrong Current Password - 401):**
```json
{
  "error": "Current password is incorrect",
  "code": "INVALID_CURRENT_PASSWORD"
}
```

**Response (Weak New Password - 400):**
```json
{
  "error": "Password does not meet requirements",
  "code": "WEAK_PASSWORD",
  "requirements": {
    "minLength": 8,
    "uppercase": true,
    "lowercase": true,
    "number": true,
    "specialChar": true
  }
}
```

**Backend Requirements:**
1. Verify JWT token and extract user ID
2. Look up user in database
3. Compare current password hash
4. If mismatch, return 401
5. Validate new password strength
6. Ensure new password is different from current
7. Hash new password
8. Update user password in database
9. Return success response

**Password Requirements:**
- At least 8 characters
- One uppercase letter (A-Z)
- One lowercase letter (a-z)
- One number (0-9)
- One special character (!@#$%^&*)

---

## 👤 User Profile Management

### Fetch Profile Data

**File:** `/screens/SettingsScreen.tsx`  
**Function:** `useEffect` (on mount)  
**Line:** ~140

**API Endpoint:**
```
GET /api/user/profile
Authorization: Bearer {token}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "profilePhoto": "https://storage.example.com/photos/user_123.jpg",
  "emailVerified": true,
  "isPremium": false,
  "dietaryPreferences": ["vegetarian", "gluten-free"],
  "allergies": ["peanuts", "shellfish"],
  "createdAt": "2024-01-15T10:30:00Z",
  "authMethod": "google"
}
```

**Backend Requirements:**
1. Verify JWT token
2. Extract user ID from token
3. Look up user in database
4. Return all profile fields
5. Include dietary preferences and allergies

---

### Update Profile

**File:** `/screens/SettingsScreen.tsx`  
**Function:** `handleSaveProfile`  
**Line:** ~105

**API Endpoint:**
```
PUT /api/user/profile
Authorization: Bearer {token}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+1 (555) 123-4567",
  "profilePhoto": "https://storage.example.com/photos/user_123.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "profilePhoto": "https://storage.example.com/photos/user_123.jpg"
  }
}
```

**Backend Requirements:**
1. Verify JWT token
2. Validate input fields
3. Update user record in database
4. Return updated user data

**Validation:**
- Name: 2-50 characters
- Phone: Optional, valid format if provided
- Email: Cannot be changed (display only)

---

### Update Profile Photo

**File:** `/screens/SettingsScreen.tsx`  
**Function:** `handlePhotoSelect`  
**Line:** ~72

**API Endpoint:**
```
POST /api/user/profile-photo
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request (Multipart Form Data):**
```
photo: [File] (image/jpeg, image/png, max 5MB)
```

**Response:**
```json
{
  "success": true,
  "profilePhoto": "https://storage.example.com/photos/user_123.jpg",
  "thumbnailUrl": "https://storage.example.com/photos/user_123_thumb.jpg"
}
```

**Backend Requirements:**
1. Verify JWT token
2. Validate file type (JPEG, PNG, WebP)
3. Validate file size (max 5MB)
4. Generate unique filename
5. Upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
6. Create thumbnail (optional)
7. Update user profile with new photo URL
8. Delete old photo from storage (if exists)
9. Return new photo URLs

**Image Processing:**
- Resize to max 800x800px
- Compress to optimize file size
- Generate 200x200px thumbnail
- Convert to WebP for better compression (optional)

---

### Dietary Preferences

**File:** `/screens/SettingsScreen.tsx`  
**Function:** `handleSaveDietaryPreferences`  
**Line:** ~145

**API Endpoint:**
```
PUT /api/user/dietary-preferences
Authorization: Bearer {token}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "dietaryPreferences": ["vegetarian", "gluten-free", "low-carb"],
  "allergies": ["peanuts", "shellfish", "eggs"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Dietary preferences saved",
  "dietaryPreferences": ["vegetarian", "gluten-free", "low-carb"],
  "allergies": ["peanuts", "shellfish", "eggs"]
}
```

**Backend Requirements:**
1. Verify JWT token
2. Validate dietary preferences (must be from allowed list)
3. Validate allergies (alphanumeric strings)
4. Update user preferences in database
5. Return updated preferences

**Valid Dietary Preferences:**
- `vegetarian`
- `vegan`
- `keto`
- `paleo`
- `gluten-free`
- `dairy-free`
- `low-carb`
- `halal`
- `kosher`
- `pescatarian`

---

## 🔔 Notification Preferences

### Fetch Notification Settings

**File:** `/contexts/NotificationContext.tsx`  
**Function:** `useState` (initial load)  
**Line:** ~28

**API Endpoint:**
```
GET /api/user/notifications
Authorization: Bearer {token}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "masterEnabled": true,
  "notifications": [
    {
      "id": "cooking-reminders",
      "enabled": true,
      "category": "cooking"
    },
    {
      "id": "timer-alerts",
      "enabled": true,
      "category": "cooking"
    },
    {
      "id": "meal-planning",
      "enabled": true,
      "category": "general"
    },
    {
      "id": "grocery-reminders",
      "enabled": false,
      "category": "general"
    },
    {
      "id": "inventory-expiry",
      "enabled": true,
      "category": "general"
    },
    {
      "id": "recipe-recommendations",
      "enabled": true,
      "category": "general",
      "isPremium": true
    },
    {
      "id": "community-activity",
      "enabled": false,
      "category": "social",
      "isPremium": true
    }
  ]
}
```

**Backend Requirements:**
1. Verify JWT token
2. Fetch user's notification preferences from database
3. Return master toggle state and individual notification settings
4. Include isPremium flag for premium-only notifications

**Notification Types:**

| ID | Title | Description | Category | Premium |
|----|-------|-------------|----------|---------|
| `cooking-reminders` | Cooking Reminders | Time to start cooking planned meals | cooking | No |
| `timer-alerts` | Timer Alerts | Cooking timer completion alerts | cooking | No |
| `meal-planning` | Meal Planning | Weekly meal plan reminders | general | No |
| `grocery-reminders` | Grocery Reminders | Check grocery list before shopping | general | No |
| `inventory-expiry` | Inventory Expiry | Ingredients about to expire | general | No |
| `recipe-recommendations` | Recipe Recommendations | Personalized recipe suggestions | general | Yes |
| `community-activity` | Community Activity | Likes, comments, follows | social | Yes |

---

### Update Master Notification Toggle

**File:** `/contexts/NotificationContext.tsx`  
**Function:** `toggleMaster`  
**Line:** ~87

**API Endpoint:**
```
PUT /api/user/notifications/master
Authorization: Bearer {token}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "masterEnabled": true,
  "message": "Master notifications enabled"
}
```

**Backend Requirements:**
1. Verify JWT token
2. Update user's master notification preference
3. If disabling (enabled: false), also disable all individual notifications
4. Return updated state

**Frontend Behavior:**
- When master is OFF, all individual toggles are disabled and grayed out
- When master is turned OFF, all individual notifications are automatically disabled
- Success toast shows: "Notifications enabled" or "Notifications disabled"

---

### Update Individual Notification

**File:** `/contexts/NotificationContext.tsx`  
**Function:** `toggleNotification`  
**Line:** ~110

**API Endpoint:**
```
PUT /api/user/notifications/{notificationId}
Authorization: Bearer {token}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "id": "cooking-reminders",
    "enabled": true
  },
  "message": "Notification preference updated"
}
```

**Backend Requirements:**
1. Verify JWT token
2. Validate notification ID exists
3. Check if notification requires premium (block if user is not premium)
4. Update notification preference in database
5. Return updated notification state

**Validation:**
- Notification ID must be valid
- Premium notifications require premium subscription
- Master notifications must be enabled

---

### Enable/Disable All Notifications

**File:** `/contexts/NotificationContext.tsx`  
**Functions:** `enableAllNotifications`, `disableAllNotifications`  
**Lines:** ~129, ~144

**API Endpoint (Enable All):**
```
PUT /api/user/notifications/enable-all
Authorization: Bearer {token}
```

**API Endpoint (Disable All):**
```
PUT /api/user/notifications/disable-all
Authorization: Bearer {token}
```

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "enabledCount": 7,
  "message": "All notifications enabled"
}
```

**Backend Requirements:**
1. Verify JWT token
2. Update all notification preferences for user
3. For premium notifications, only enable if user is premium
4. Return count of enabled notifications

**Use Cases:**
- Quick enable/disable all preferences
- Reset to defaults
- Batch operations

---

## 🔒 Security Best Practices

### JWT Tokens

**Structure:**
```javascript
{
  header: {
    "alg": "HS256",
    "typ": "JWT"
  },
  payload: {
    "sub": "user_123",
    "email": "john@example.com",
    "iat": 1640000000,
    "exp": 1640086400 // 24 hours later
  },
  signature: "..."
}
```

**Token Expiration:**
- Access token: 24 hours
- Refresh token: 30 days (optional)
- Reset token: 15-30 minutes

**Storage:**
- Frontend: `localStorage.setItem('authToken', token)`
- Backend: Store refresh tokens in database (optional)

**Validation:**
```javascript
// Verify token on every authenticated request
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const userId = decoded.sub;
```

---

### Password Hashing

**Use bcrypt:**
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 12;

// Hash password
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

**Requirements:**
- Salt rounds: 12 (balanced security/performance)
- Never store plain text passwords
- Use timing-safe comparison

---

### Rate Limiting

**Recommended Limits:**

| Endpoint | Rate Limit | Window |
|----------|-----------|--------|
| `/auth/login` | 5 attempts | 15 minutes |
| `/auth/forgot-password` | 3 attempts | 1 hour |
| `/auth/resend-reset-link` | 3 attempts | 1 hour |
| `/auth/google` | 10 attempts | 1 hour |
| `/user/profile` (GET) | 100 requests | 15 minutes |
| `/user/profile` (PUT) | 20 requests | 15 minutes |

**Implementation:**
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/auth/login', loginLimiter, loginHandler);
```

---

### CORS Configuration

**Example:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://kitchennova.com', 'https://app.kitchennova.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for Google OAuth users
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_photo TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  google_id VARCHAR(255) UNIQUE,
  auth_method ENUM('email', 'google') NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_google_id (google_id)
);
```

### Dietary Preferences Table

```sql
CREATE TABLE dietary_preferences (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  preference VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_preference (user_id, preference)
);
```

### Allergies Table

```sql
CREATE TABLE allergies (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  allergy VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_allergy (user_id, allergy)
);
```

### Password Reset Tokens Table

```sql
CREATE TABLE password_reset_tokens (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token_hash (token_hash),
  INDEX idx_expires_at (expires_at)
);
```

### Notification Preferences Table

```sql
CREATE TABLE notification_preferences (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  master_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_notifications (user_id)
);

CREATE TABLE notification_settings (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  notification_id VARCHAR(50) NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_notification (user_id, notification_id),
  INDEX idx_user_id (user_id)
);
```

**Notification IDs:**
- `cooking-reminders`
- `timer-alerts`
- `meal-planning`
- `grocery-reminders`
- `inventory-expiry`
- `recipe-recommendations` (Premium)
- `community-activity` (Premium)

---

## 🌐 Environment Variables

**Required Environment Variables:**

```env
# Server
NODE_ENV=production
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kitchennova
DB_USER=dbuser
DB_PASSWORD=secure_password

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRY=24h

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service (SendGrid, AWS SES, etc.)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=noreply@kitchennova.com

# Password Reset
RESET_TOKEN_EXPIRY=1800 # 30 minutes in seconds
RESET_LINK_URL=https://kitchennova.com/reset-password

# File Storage (AWS S3, Google Cloud Storage, etc.)
STORAGE_BUCKET=kitchennova-photos
STORAGE_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Rate Limiting
RATE_LIMIT_WINDOW=900000 # 15 minutes in ms
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for CORS)
FRONTEND_URL=https://kitchennova.com
```

---

## 🚀 Quick Start Checklist

### Prerequisites
- [ ] Node.js 16+ installed
- [ ] PostgreSQL or MySQL database setup
- [ ] Email service account (SendGrid, AWS SES, etc.)
- [ ] Cloud storage account (AWS S3, Google Cloud Storage, etc.)
- [ ] Google OAuth credentials

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install express cors bcrypt jsonwebtoken express-rate-limit
   npm install pg # or mysql2
   npm install nodemailer
   npm install aws-sdk # or @google-cloud/storage
   ```

2. **Create Database Tables**
   ```bash
   # Run the SQL schema from Database Schema section
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. **Implement API Endpoints**
   - Copy TODO comment examples from this guide
   - Test each endpoint with Postman or curl

5. **Test Authentication Flow**
   - [ ] Google OAuth sign-in
   - [ ] Email/password login
   - [ ] Password reset flow
   - [ ] Change password

6. **Test Profile Management**
   - [ ] Fetch profile data
   - [ ] Update profile
   - [ ] Upload profile photo
   - [ ] Save dietary preferences

7. **Deploy to Production**
   - [ ] Set up HTTPS
   - [ ] Configure firewall
   - [ ] Enable rate limiting
   - [ ] Set up monitoring
   - [ ] Configure backups

---

## 📚 API Reference Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/google` | POST | No | Google OAuth login |
| `/api/auth/login` | POST | No | Email/password login |
| `/api/auth/forgot-password` | POST | No | Send password reset email |
| `/api/auth/resend-reset-link` | POST | No | Resend reset email |
| `/api/auth/reset-password` | POST | No | Reset password with token |
| `/api/auth/change-password` | POST | Yes | Change password |
| `/api/user/profile` | GET | Yes | Fetch user profile |
| `/api/user/profile` | PUT | Yes | Update user profile |
| `/api/user/profile-photo` | POST | Yes | Upload profile photo |
| `/api/user/dietary-preferences` | PUT | Yes | Update dietary preferences |
| `/api/user/notifications` | GET | Yes | Fetch notification settings |
| `/api/user/notifications/master` | PUT | Yes | Update master notification toggle |
| `/api/user/notifications/{id}` | PUT | Yes | Update individual notification |
| `/api/user/notifications/enable-all` | PUT | Yes | Enable all notifications |
| `/api/user/notifications/disable-all` | PUT | Yes | Disable all notifications |

---

## 🐛 Troubleshooting

### Common Issues

**1. "User not found" on login**
- Check if user exists in database
- Verify email format
- Check case sensitivity

**2. "Invalid token" on authenticated requests**
- Verify JWT secret matches
- Check token expiration
- Ensure proper Authorization header format: `Bearer {token}`

**3. "Password reset link expired"**
- Check token expiration time (default 30 min)
- Verify server time is synchronized
- Check if token was already used

**4. Google OAuth fails**
- Verify Google Client ID is correct
- Check redirect URIs in Google Console
- Ensure `use_fedcm_for_prompt: true` is set

**5. Profile photo upload fails**
- Check file size limit (5MB)
- Verify storage credentials
- Check bucket permissions
- Validate file type (JPEG, PNG)

---

## 📝 Notes

- All TODO comments in the codebase are marked with `// TODO:` for easy searching
- Each TODO comment includes implementation examples
- Frontend uses `localStorage` for temporary data until backend is connected
- All sensitive operations require JWT authentication
- Rate limiting is essential for production deployment
- Use HTTPS in production for all API endpoints
- Regular security audits recommended

---

## ✅ Implementation Status

### Ready for Backend Integration
- ✅ Google OAuth flow
- ✅ Email/password login
- ✅ Password reset (forgot/reset)
- ✅ Change password
- ✅ Profile management
- ✅ Profile photo upload
- ✅ Dietary preferences
- ✅ Notification preferences

### Frontend Features
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Success messages
- ✅ Redirect logic (user not found → signup)
- ✅ Email app integration
- ✅ Resend cooldown (60 seconds)
- ✅ Functional notification toggles
- ✅ Master notification control
- ✅ Premium notification gating
- ✅ Toast notifications
- ✅ localStorage persistence

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Status:** Ready for Production Integration 🚀