# 🔐 Google OAuth Setup Guide

## Overview
This guide will help you set up Google OAuth authentication for Kitchen Nova, allowing users to sign in with their real Google accounts from their devices.

---

## 📋 Prerequisites

1. A Google account
2. Access to [Google Cloud Console](https://console.cloud.google.com/)

---

## 🚀 Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** at the top
3. Click **"New Project"**
4. Enter project name: **"Kitchen Nova"**
5. Click **"Create"**

---

### 2. Enable Google Identity Services API

1. In the Google Cloud Console, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google Identity"**
3. Click on **"Google Identity Toolkit API"**
4. Click **"Enable"**

---

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (for testing with any Google account)
3. Click **"Create"**

**Fill in the required information:**

| Field | Value |
|-------|-------|
| App name | Kitchen Nova |
| User support email | your-email@gmail.com |
| Developer contact email | your-email@gmail.com |
| App logo | (Optional) Upload Kitchen Nova logo |

4. Click **"Save and Continue"**

**Scopes:**
- No need to add scopes for basic sign-in
- Click **"Save and Continue"**

**Test users (if in testing mode):**
- Add your email addresses that will test the app
- Click **"Save and Continue"**

---

### 4. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. Select **"Web application"**

**Configure:**

| Field | Value |
|-------|-------|
| Name | Kitchen Nova Web Client |
| Authorized JavaScript origins | `http://localhost:3000`<br>`https://your-domain.com` |
| Authorized redirect URIs | `http://localhost:3000`<br>`https://your-domain.com` |

5. Click **"Create"**
6. **Copy your Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)

---

### 5. Update the Application Code

Open `/screens/auth/GoogleAuthScreen.tsx` and replace:

```typescript
client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
```

With your actual Client ID:

```typescript
client_id: '123456789-abc123.apps.googleusercontent.com',
```

---

## 🔒 How It Works

### Authentication Flow:

```
1. User clicks "Continue with Google"
   ↓
2. Google Sign-In screen opens
   ↓
3. Google shows accounts available on device
   ↓
4. User selects their account
   ↓
5. Google authenticates and returns JWT token
   ↓
6. App extracts user info (name, email, picture)
   ↓
7. User data saved to localStorage
   ↓
8. User redirected to home screen
```

---

## 📱 Features

### ✅ Fetches Real Device Accounts
- Google Identity Services automatically detects Google accounts signed in on the device
- Shows native account picker with real user accounts
- No mock data - all accounts are real

### ✅ One Tap Sign-In
- If user has one Google account, auto-selects it
- Reduces friction for single-account users

### ✅ Account Chooser
- Multiple accounts? Shows native Google account picker
- User can select any account signed in on their device
- Secure and managed by Google

### ✅ Mobile-Optimized
- No desktop-specific messaging (removed "Not your computer")
- Works seamlessly on mobile devices
- Native mobile experience

---

## 🎯 User Data Captured

When a user signs in, the following data is stored:

```javascript
{
  email: "user@gmail.com",
  name: "John Smith",
  picture: "https://lh3.googleusercontent.com/...",
  googleId: "1234567890",
  emailVerified: true
}
```

This data is saved to `localStorage` and can be accessed throughout the app.

---

## 🧪 Testing

### Local Testing:

1. Make sure you've added `http://localhost:3000` to authorized origins
2. Run your app locally
3. Click "Continue with Google"
4. Google will show your real device accounts
5. Select an account to test

### Production Testing:

1. Add your production domain to authorized origins
2. Deploy your app
3. Test with real users

---

## 🔐 Security Features

✅ **Secure Token Handling** - JWT tokens are validated by Google  
✅ **No Password Exposure** - We never access user passwords  
✅ **Revocable Access** - Users can disconnect from settings  
✅ **HTTPS Required** - Production must use HTTPS  
✅ **Auto-Logout** - Tokens expire automatically  

---

## 🐛 Troubleshooting

### Issue: "Unauthorized JavaScript origin"
**Solution:** Add your domain to "Authorized JavaScript origins" in Google Cloud Console

### Issue: "No accounts shown"
**Solution:** User needs to be signed into Google on their device first

### Issue: "Sign-in popup blocked"
**Solution:** Enable popups for your site in browser settings

### Issue: "Invalid Client ID"
**Solution:** Double-check you copied the entire Client ID correctly

### Issue: "Button width is invalid: 100%"
**Solution:** ✅ FIXED - Now using pixel value (350px) instead of percentage

### Issue: FedCM warnings
**Solution:** ✅ FIXED - Added FedCM support with permissions policy and `use_fedcm_for_prompt: true`

### Issue: "NotAllowedError: identity-credentials-get not enabled"
**Solution:** ✅ FIXED - Added Permissions-Policy meta tag automatically

---

## 📚 Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web/guides/overview)
- [OAuth 2.0 for Web Apps](https://developers.google.com/identity/protocols/oauth2)
- [Google Sign-In Button Customization](https://developers.google.com/identity/gsi/web/reference/js-reference)

---

## 🎨 Customization

You can customize the Google Sign-In button appearance in the code:

```typescript
window.google.accounts.id.renderButton(
  document.getElementById('googleSignInButton'),
  {
    theme: 'outline',        // 'outline' or 'filled_blue'
    size: 'large',           // 'large', 'medium', 'small'
    width: '100%',
    text: 'continue_with',   // 'signin_with', 'signup_with', 'continue_with'
    shape: 'rectangular',    // 'rectangular', 'pill', 'circle', 'square'
    logo_alignment: 'left'   // 'left', 'center'
  }
);
```

---

## ✅ Checklist

Before going to production:

- [ ] Created Google Cloud Project
- [ ] Enabled Google Identity Services API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Updated Client ID in code
- [ ] Added production domain to authorized origins
- [ ] Tested with real accounts
- [ ] Enabled HTTPS on production
- [ ] Added privacy policy link
- [ ] Added terms of service link

---

## 🚀 You're All Set!

Your Kitchen Nova app now has fully functional Google OAuth that:
- ✅ Fetches real device accounts
- ✅ Shows native Google account picker
- ✅ Securely authenticates users
- ✅ Works on mobile and desktop
- ✅ Stores user data in localStorage

Users can now sign in with their real Google accounts! 🎉