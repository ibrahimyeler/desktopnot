# Google Sign-In Setup Guide for iOS

**Problem:** Google Sign-In button crashes the app on iOS

**Root Cause:** Missing iOS configuration for Google Sign-In

---

## Required Setup Steps

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Add iOS app:
   - Bundle ID: `com.example.aicoachApp` (check in Xcode or `Info.plist`)
   - App name: `Gofocus`
   - App Store ID: (optional)

4. Download `GoogleService-Info.plist`
5. Place it in: `aicoach_app/ios/Runner/GoogleService-Info.plist`

### 2. iOS Configuration

After adding `GoogleService-Info.plist`, extract the `REVERSED_CLIENT_ID`:

```xml
<plist>
  <dict>
    <key>REVERSED_CLIENT_ID</key>
    <string>com.googleusercontent.apps.YOUR-REVERSED-CLIENT-ID</string>
    ...
  </dict>
</plist>
```

Update `aicoach_app/ios/Runner/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>YOUR-REVERSED-CLIENT-ID</string>
        </array>
    </dict>
</array>
```

### 3. Xcode Configuration

1. Open project in Xcode:
   ```bash
   cd aicoach_app/ios
   open Runner.xcworkspace
   ```

2. In Xcode:
   - Select `Runner` project
   - Go to `Signing & Capabilities`
   - Make sure your team is set
   - Ensure correct Bundle ID

3. Build and Run in Xcode to verify setup

### 4. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable "Google Sign-In API"
4. Create OAuth 2.0 credentials:
   - Application type: iOS
   - Bundle ID: `com.example.aicoachApp`
5. Save the Client ID

### 5. Update CocoaPods

After adding `GoogleService-Info.plist`:

```bash
cd aicoach_app/ios
pod deintegrate
pod install
```

### 6. Rebuild App

```bash
cd aicoach_app
flutter clean
flutter pub get
flutter run
```

---

## Quick Fix (Development Only)

If you need a quick solution for development without Firebase:

### Option 1: Mock Google Sign-In

Temporarily disable Google Sign-In in the UI:

```dart
// In login_screen.dart or register_screen.dart
if (Platform.isIOS) {
  // Disable Google button on iOS until configured
  return Container();
}
```

### Option 2: Use Email Auth Only

Comment out Google Sign-In buttons in the UI temporarily

### Option 3: Test on Android

Android requires less configuration:
1. Add SHA-1 fingerprint to Firebase
2. Download `google-services.json`
3. Place in `android/app/`

---

## Verification Checklist

- [ ] Firebase project created
- [ ] iOS app added to Firebase
- [ ] `GoogleService-Info.plist` downloaded
- [ ] `GoogleService-Info.plist` placed in `ios/Runner/`
- [ ] `Info.plist` updated with `REVERSED_CLIENT_ID`
- [ ] Google Sign-In API enabled
- [ ] OAuth credentials created
- [ ] CocoaPods reinstalled
- [ ] App cleaned and rebuilt
- [ ] Test successful

---

## Common Errors

### Error: "sign_in_with_google plugin not found"
**Solution:** Run `flutter pub get` and rebuild

### Error: "Missing GoogleService-Info.plist"
**Solution:** Download and add to `ios/Runner/`

### Error: "Invalid reversed client ID"
**Solution:** Check `REVERSED_CLIENT_ID` in both files match

### Error: "App crashes when tapping Google button"
**Solution:** 
1. Check console logs for detailed error
2. Verify URL scheme in `Info.plist`
3. Ensure Google Sign-In is enabled in Firebase
4. Check network connectivity

### Error: "Delegate method not responding"
**Solution:** AppDelegate already updated - check if URL handling works

---

## Alternative: Use OAuth2 Flow

If Google Sign-In plugin issues persist, implement custom OAuth2:

```dart
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

// Custom Google OAuth flow
Future<String?> authenticateWithGoogle() async {
  final authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?...';
  // Implement OAuth flow
}
```

---

## Current AppDelegate (Already Updated)

```swift
import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // Handle Google Sign-In URL callback
  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    return super.application(app, open: url, options: options)
  }
}
```

---

## Next Steps

1. **Immediate:** Set up Firebase and download `GoogleService-Info.plist`
2. **Short-term:** Complete iOS configuration
3. **Long-term:** Add proper error handling and user feedback

---

**Note:** Google Sign-In requires proper Firebase setup on iOS. Without `GoogleService-Info.plist`, the plugin will fail.

For more information: https://pub.dev/packages/google_sign_in

