# Apple Sign-In Setup - Quick Test

Apple Sign-In **CAN** work in the iOS Simulator without Apple Developer setup!

---

## Simulator Setup (No Developer Account Needed)

### Step 1: Open Xcode

```bash
cd /Users/macbookpro/Documents/aicoach/aicoach_app/ios
open Runner.xcworkspace
```

### Step 2: Configure Signing

1. In Xcode, select "Runner" project
2. Select "Runner" target
3. Go to "Signing & Capabilities" tab
4. Select your Team (or use "Personal Team")
5. Ensure Bundle ID is `com.example.aicoachApp`

### Step 3: Add Sign in with Apple Capability

**Important:** This works even without a paid Developer account!

1. Still in "Signing & Capabilities"
2. Click "+ Capability"
3. Search for "Sign in with Apple"
4. Double-click to add
5. It should automatically configure

### Step 4: Build and Run

```bash
cd /Users/macbookpro/Documents/aicoach/aicoach_app
flutter run
```

### Step 5: Test in Simulator

1. Launch app in iOS Simulator
2. Go to Login or Register screen
3. Tap "Apple ile Giriş Yap" or "Apple ile Kayıt Ol"
4. Apple Sign-In dialog should appear!
5. Sign in with simulator

**Note:** Simulator has its own Apple ID flow for testing.

---

## What to Expect

### In Simulator

```
1. User taps "Apple ile Kayıt Ol"
2. Apple sign-in sheet appears
3. User can:
   - Sign in with existing Apple ID
   - Use iCloud Keychain
   - Use Face ID/Touch ID (if simulator supports)
4. Returns:
   - User ID
   - Email (if user allows)
   - Name (if user allows)
   - Identity token
```

### Backend Call

App automatically calls:
```
POST http://localhost:8001/auth/apple
{
  "id_token": "...",
  "authorization_code": "...",
  "email": "...",
  "full_name": "..."
}
```

---

## Common Issues

### Issue: "Sign in with Apple not available"

**Solution:** 
- Make sure you added the capability in Xcode
- Rebuild the app
- Try on iOS 13+ simulator

### Issue: "No valid Apple ID"

**Solution:**
- You can test without Apple ID in simulator
- The dialog still appears
- Backend will receive the test credential

### Issue: Capability can't be added

**Possible reasons:**
- Bundle ID not unique
- Xcode signing issues
- Workspace not opened

**Solution:**
```bash
# Clean and reinstall
cd aicoach_app/ios
pod deintegrate
pod install
cd ..
flutter clean
flutter pub get
```

---

## Test Without Backend

The Apple Sign-In **will work** even if backend is down because:

1. Apple authentication happens first
2. Credential is returned to app
3. App then tries to send to backend
4. If backend fails, app still has credential

Check logs to see what happens.

---

## Production Setup

For real devices and App Store:

1. **Apple Developer Account** ($99/year)
2. Enable Sign in with Apple for your App ID
3. Add capability in Xcode
4. Configure in Apple Developer Portal
5. Test on real device

---

## Quick Test Steps

```bash
# 1. Open in Xcode
cd aicoach_app/ios && open Runner.xcworkspace

# 2. Add Sign in with Apple capability in Xcode
# 3. Select Team in Signing
# 4. Build and run

# 5. Launch app
cd /Users/macbookpro/Documents/aicoach/aicoach_app
flutter run

# 6. Tap "Apple ile Giriş" button
# 7. See Apple dialog!
```

---

**Try Apple Sign-In in the simulator - it should work! 🍎**

