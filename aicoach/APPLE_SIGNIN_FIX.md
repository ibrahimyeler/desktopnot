# Apple Sign-In Error Fix 🍎

**Error:** `AuthorizationErrorCode.unknown, error 1000`

---

## Quick Fix

The error means **"Sign in with Apple" capability is not added to your Xcode project**.

### Solution 1: Add Capability in Xcode (Recommended)

**Steps:**

1. **Open Xcode:**
   ```bash
   cd /Users/macbookpro/Documents/aicoach/aicoach_app/ios
   open Runner.xcworkspace
   ```

2. **Add Capability:**
   - In Xcode, select **"Runner"** project (blue icon on left)
   - Select **"Runner"** target under TARGETS
   - Click **"Signing & Capabilities"** tab
   - Click **"+ Capability"** button (top left)
   - Search for **"Sign in with Apple"**
   - Double-click to add it

3. **Select Team:**
   - In same "Signing & Capabilities" section
   - Under "Signing", select your **Team**
   - If you see "Add Account...", click it and sign in with Apple ID
   - Free "Personal Team" works for testing!

4. **Rebuild:**
   ```bash
   cd /Users/macbookpro/Documents/aicoach/aicoach_app
   flutter clean
   flutter pub get
   flutter run
   ```

5. **Test:**
   - Launch app
   - Tap "Apple ile Giriş Yap" button
   - Should work now! ✅

---

## Solution 2: Disable Apple Button (Quick)

If you want to continue without Apple Sign-In for now:

### In `login_screen.dart`:

Find the Apple Sign-In button and wrap it:

```dart
// After line ~133
// Comment out or wrap Apple button:
if (false) { // Temporarily disabled
  _buildAppleSignInButton()
}
```

Or simply remove/hide the Apple button temporarily.

---

## What's Happening

**Current Status:**
- ✅ Apple Sign-In code is ready
- ✅ Backend endpoint is ready
- ❌ Xcode capability is missing

**The Error:**
```
AuthorizationErrorCode.unknown, error 1000
```
This means iOS doesn't know your app supports "Sign in with Apple" because the capability wasn't added.

---

## Troubleshooting

### Issue: Can't add capability

**Possible reasons:**
- No Team selected
- Bundle ID conflict
- Xcode workspace not opened properly

**Solution:**
```bash
cd aicoach_app/ios
pod deintegrate
pod install
cd ..
flutter clean
flutter pub get
```

Then try again in Xcode.

### Issue: "Personal Team" not working

**Solution:**
1. Make sure you're signed into Xcode with Apple ID
2. Xcode → Settings → Accounts
3. Add your Apple ID if not there
4. In project settings, select it as Team

### Issue: Still getting error after adding capability

**Solution:**
1. Quit Xcode completely
2. Clean build:
   ```bash
   flutter clean
   cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
   flutter pub get
   ```
3. Open Xcode again
4. Build and run

---

## Testing Checklist

After adding capability:

- [ ] Capability visible in Xcode
- [ ] Team selected
- [ ] Clean build done
- [ ] App launched
- [ ] Apple button tapped
- [ ] No errors ✅

---

## Next: Production

For App Store submission:

1. Join **Apple Developer Program** ($99/year)
2. Register App ID
3. Enable "Sign in with Apple" in developer portal
4. Configure properly
5. Submit to App Store

---

**Quick Action:** Open Xcode and add the capability now! It takes 2 minutes.

```bash
open /Users/macbookpro/Documents/aicoach/aicoach_app/ios/Runner.xcworkspace
```

