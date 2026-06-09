# DieFraktur iPad App Wrapper

This folder contains a native iPad app wrapper that loads the local website from `Website/index.html`.

## How to open

1. Open `iPadApp.xcodeproj` in Xcode.
2. Select the `DieFraktur` target.
3. Choose an iPad simulator or a connected iPad.
4. Build and run.

## Notes

- The app loads the website from `iPadApp/Website/index.html`.
- Status bar hiding is enabled in `Info.plist` for all supported iPad screens.
- A placeholder app icon asset catalog was added at `iPadApp/Assets.xcassets`.
- The app is configured for landscape orientation only.

## If Xcode asks for signing

1. Open the target settings.
2. Set a valid Team under Signing & Capabilities.
3. Use a unique Bundle Identifier if necessary.
