# Food101 — Swift & SwiftUI Native App

A native SwiftUI implementation of the **Food101** culinary delivery app, built according to the design specification:
- Exact corner radius system (`28px` map & modals, `24px` banners, `22px` food cards, `rounded-full` pills/badges).
- Custom Vector Map with courier route, destination, and live distance badge (`👤 1km 304m`).
- Electric neon-green status bar (`-4min` · `Currently at Challenge..`).
- Desserts, Entrees & Beverages carousel (`Iya Wale Swallows`, `Treat's Right`).
- Popular Orders with circular dish avatars and `3500` floating price badges.
- Elevated floating 4-tab bottom navigation bar (`Home`, `Store`, `Ai⁺`, `Account`).
- Interactive sheets for dish customization, basket, single-page checkout, and live tracking.

---

## How to Run

### Option 1: Open in Xcode
Double-click `Package.swift` or run:
```bash
open Package.swift
```
Xcode will open the package. Select your target device (iPhone simulator, iPad, or Mac) and hit **Run** (`⌘R`).

### Option 2: Drag & Drop into an Existing Xcode Project or Playgrounds
Simply drag `Food101App.swift` into your SwiftUI Xcode project or Swift Playgrounds. It is completely self-contained with models, state, vector maps, views, and entry point.

### Option 3: Run from Terminal (macOS native app)
```bash
swift run
```

