# Google & Apple Sign-In Development Guide

**Status:** Backend APIs ready, need Firebase/Google Cloud setup

---

## Current Status

### ✅ Backend APIs Ready
- `/auth/google` - Google OAuth endpoint
- `/auth/apple` - Apple OAuth endpoint
- Both endpoints fully implemented in Go
- Ready to receive ID tokens and create users

### ✅ Mobile App Code Ready
- Google Sign-In integration complete in `AuthService`
- Apple Sign-In integration complete in `AuthService`
- UI buttons and flows ready
- Error handling implemented

### ⚠️ What's Missing
- **Google:** Firebase project setup + GoogleService-Info.plist
- **Apple:** Needs Apple Developer account setup (but might work in simulator)

---

## Option 1: Full Setup (Production)

### Google Sign-In Setup

#### Step 1: Firebase Console
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: "Gofocus"
4. Enable Google Analytics (optional)
5. Create project

#### Step 2: Add iOS App
1. Click iOS icon in Firebase dashboard
2. **Bundle ID:** `com.example.aicoachApp`
3. **App nickname:** `Gofocus iOS`
4. **App Store ID:** (leave blank for now)
5. Click "Register app"
6. Download `GoogleService-Info.plist`
7. Place in: `aicoach_app/ios/Runner/GoogleService-Info.plist`

#### Step 3: Extract REVERSED_CLIENT_ID
Open `GoogleService-Info.plist` and find:
```xml
<key>REVERSED_CLIENT_ID</key>
<string>com.googleusercontent.apps.YOUR-ID-HERE</string>
```

#### Step 4: Update Info.plist
Add to `aicoach_app/ios/Runner/Info.plist`:
```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.YOUR-ID-HERE</string>
        </array>
    </dict>
</array>
```

#### Step 5: Rebuild
```bash
cd aicoach_app/ios
pod install
cd ..
flutter clean
flutter pub get
flutter run
```

---

### Apple Sign-In Setup

#### Step 1: Apple Developer Account
1. Log into https://developer.apple.com
2. Go to Certificates, Identifiers & Profiles
3. Click "Identifiers"
4. Find your app: `com.example.aicoachApp`

#### Step 2: Enable Sign in with Apple
1. Click on your App ID
2. Check "Sign in with Apple" capability
3. Save

#### Step 3: Xcode Configuration
1. Open `aicoach_app/ios/Runner.xcworkspace`
2. Select Runner target
3. Go to "Signing & Capabilities"
4. Click "+ Capability"
5. Add "Sign in with Apple"
6. Build and run

**Note:** Apple Sign-In works in iOS Simulator for testing!

---

## Option 2: Quick Development Test

For immediate testing without Firebase setup:

### Mock OAuth Flow (Testing Only)

Create a test endpoint that bypasses OAuth:

```dart
// In auth_service.dart - TEMPORARY
Future<Map<String, dynamic>?> signInWithGoogle() async {
  // For development: return mock data
  return {
    'token': 'test_google_token',
    'user': {
      'id': 'test_google_id',
      'email': 'test@google.com',
      'displayName': 'Google Test User',
    }
  };
}
```

### Or Use Email Auth
- Email/Password registration works ✅
- Can add users manually to test

---

## Option 3: Test with Actual OAuth (Recommended)

### Prerequisites
1. Apple Developer account ($99/year)
2. Google Cloud account (free)
3. Firebase project (free)

### Quick Start Checklist

#### Google
- [ ] Create Firebase project
- [ ] Add iOS app to Firebase
- [ ] Download GoogleService-Info.plist
- [ ] Add to Runner/
- [ ] Update Info.plist with REVERSED_CLIENT_ID
- [ ] Run `pod install`
- [ ] Test

#### Apple
- [ ] Enable Sign in with Apple in App ID
- [ ] Add capability in Xcode
- [ ] Test in simulator
- [ ] Test on real device

---

## Testing Backend Endpoints

### Test Google Endpoint (Mock Data)

Since frontend crashes without Firebase, test directly:

```bash
curl -X POST http://localhost:8001/auth/google \
  -H "Content-Type: application/json" \
  -d '{
    "id_token": "mock_google_id_token",
    "access_token": "mock_access_token"
  }'
```

**Note:** Backend endpoint expects proper JWT tokens, so this will fail validation. But you can see the endpoint is working.

### Test Apple Endpoint (Mock Data)

```bash
curl -X POST http://localhost:8001/auth/apple \
  -H "Content-Type: application/json" \
  -d '{
    "id_token": "mock_apple_id_token",
    "authorization_code": "mock_auth_code",
    "email": "test@apple.com",
    "full_name": "Apple Test User"
  }'
```

---

## Current Testing Strategy

### What Works Now ✅
1. **Email Registration:** Fully working
2. **Email Login:** Fully working
3. **Forgot Password:** Fully working
4. **Backend OAuth Endpoints:** Ready and waiting

### What Needs Setup ⚠️
1. **Google Sign-In:** Needs Firebase
2. **Apple Sign-In:** Needs Apple Developer setup

### Recommendation

For **immediate testing:**
1. Use Email/Password auth (already working)
2. Set up Apple Sign-In first (easier, works in simulator)
3. Set up Google Sign-In for full testing

For **production deployment:**
1. Set up both OAuth providers
2. Test thoroughly on real devices
3. Verify ID token validation

---

## Code Ready - Just Need Configuration

All the **hard work is done**:
- ✅ Backend OAuth endpoints implemented
- ✅ Mobile app OAuth integration complete
- ✅ UI flows ready
- ✅ Error handling in place

You just need to:
1. Configure Google (Firebase)
2. Configure Apple (Developer Portal)
3. Test!

---

## Quick Reference

### Bundle ID
`com.example.aicoachApp`

### Backend URL
`http://localhost:8001` (dev)
Future: `https://api.gofocus.com` (prod)

### iOS Deployment Target
iOS 13.0+

### Useful Commands

```bash
# Rebuild iOS
cd aicoach_app
flutter clean
flutter pub get
cd ios && pod install && cd ..
flutter run

# Test backend
curl http://localhost:8001/health

# View logs
cd backend && docker-compose logs -f auth-service
```

---

## Helpful Links

- Firebase Console: https://console.firebase.google.com/
- Apple Developer: https://developer.apple.com
- Google Cloud Console: https://console.cloud.google.com/
- Google Sign-In Docs: https://pub.dev/packages/google_sign_in
- Apple Sign-In Docs: https://pub.dev/packages/sign_in_with_apple

---

**The code is ready. Just add the configuration! 🚀**

