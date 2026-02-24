# DRAPE App - Quick Start Guide

## ⚡ Quick Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- Expo Go app (for mobile testing)

### Installation & Running

```bash
# Navigate to the project
cd D:\DRAPE-\MyApp

# Install dependencies (if not already done)
npm install

# Start the Expo dev server
npm start

# The terminal will show:
# › Metro waiting on exp://YOUR_IP:8082
# › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
# › Web is waiting on http://localhost:8082
```

### Testing Options

**Option 1: Mobile Device (Recommended)**
1. Install Expo Go app from App Store or Google Play
2. Scan the QR code from terminal with your phone
3. App loads automatically in Expo Go

**Option 2: Web Browser**
```bash
# In terminal, press 'w' to open web preview
# Or manually visit: http://localhost:8082
```

**Option 3: Android Emulator**
```bash
# In terminal, press 'a' to open Android emulator
# (Requires Android Studio/Android SDK)
```

**Option 4: iOS Simulator**
```bash
# In terminal, press 'i' to open iOS simulator
# (Requires macOS and Xcode)
```

---

## 🎯 Testing the App

### Login Flow
1. **Mode Selection**: Click "I am Shopping"
2. **Onboarding**: Swipe through 3 slides (or press arrows)
3. **Style Quiz**: Answer 3 preference questions
4. **Sign Up**: Enter any 10-digit phone number (e.g., 1234567890)
5. **OTP**: Enter any 4+ digit code (e.g., 1234)
6. **Welcome**: You're in! ✨

### Key Features to Test
- **Home Feed**: Scroll masonry grid, click products
- **Search**: Try searching "saree", "dress", "jacket"
- **Categories**: Click category chips to filter
- **Product Detail**: Tap any product card
  - Swipe thumbnails
  - Select colors and sizes
  - Add to cart
- **Virtual Try-On**: See how product looks with AI avatar
- **Cart**: View items, proceed to checkout
- **Snap/Camera**: Open camera, "take photo" (simulator shows demo)
- **Saved**: Heart products, view in Saved tab
- **Profile**: View account stats, switch mode

---

## 📁 Project Structure Overview

```
src/
  ├── screens/          # All app screens (15+ buyer screens)
  ├── components/       # Reusable UI components
  ├── store/           # Zustand state management
  ├── navigation/      # React Navigation setup
  ├── services/        # API & mock data
  ├── constants/       # Design system (colors, typography, spacing)
  └── hooks/           # Custom React hooks
```

---

## 🎨 Design System

| Property | Value |
|----------|-------|
| **Background** | #F5F0E8 (Warm Cream) |
| **Text** | #1A1814 (Dark) |
| **Accent** | #B8864A (Warm Gold) |
| **Headings** | Playfair Display (serif) |
| **Body** | DM Sans (clean) |
| **Corner Radius** | 16px (cards), 14px (buttons) |
| **Animations** | 200-300ms smooth |

---

## 🔄 Navigation Map

```
App Opens
  ↓
Splash (2s animation)
  ↓
Mode Selection (Shopping vs Selling)
  ↓
Onboarding (3 slides)
  ↓
Style Quiz (3 questions)
  ↓
Sign Up (Phone + OTP)
  ↓
Bottom Tab Navigation (Main App)
  ├─ 🏠 Home (Feed)
  ├─ 🔍 Search
  ├─ 📸 Snap (Camera)
  ├─ 💕 Saved (Wishlist & Boards)
  └─ 👤 Profile
```

From any screen:
- Bottom tab buttons for main navigation
- Back arrows return to previous screen
- Cart button accessible from profile tab

---

## 🛠️ Development Tips

### Modifying Screens
All screens are in `src/screens/buyer/`. Edit any file and hot reload automatically.

### Changing Design
- **Colors**: Edit `src/constants/colors.ts`
- **Typography**: Edit `src/constants/typography.ts`
- **Spacing**: Edit `src/constants/layout.ts`
- **Animations**: Edit `src/constants/animations.ts`

### Adding New Products
Edit `src/services/mockData.ts` and add to the `mockProducts` array.

### Connecting Real API
Update `src/services/api.ts` with real Axios calls instead of mock data.

### Changing Navigation
Edit `src/navigation/RootNavigator.tsx` to add/remove screens or change flow.

---

## 📱 Common Tasks

### Hide Splash Screen & Go Directly to Home
Edit `src/navigation/RootNavigator.tsx`, in the condition that checks `isLoggedIn`:
```tsx
// Change from AuthStack to BuyerNavigator to skip auth flow
```

### Add New Product Image
1. Update product in `src/services/mockData.ts`
2. Change `images` array to valid image URLs
3. Images from Unsplash, Pexels, or your own server work

### Change App Name
1. Edit `app.json` - change `"name"` and `"slug"`
2. Edit `"displayName"` to "DRAPE" (already done)

### Adjust Colors Globally
Edit `src/constants/colors.ts` and all screens automatically update.

---

## 🐛 Troubleshooting

### "Port 8081 already in use"
→ Already handled! Server auto-switches to port 8082

### App crashes on startup
→ Clear cache: Delete `node_modules` and `package-lock.json`, then `npm install`

### Images not loading
→ Check image URLs in mockData.ts are valid (test in browser)

### Navigation not working
→ Check RootNavigator.tsx navigation names match screen names

### Styles look wrong
→ Verify colors.ts values, check constants/colors.ts imports

### Camera permission denied
→ Grant permission when prompted, or clear app data and reinstall

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Total Screens** | 20+ |
| **Components** | 6 reusable |
| **Lines of Code** | 8000+ |
| **Design System Colors** | 8 |
| **Typography Styles** | 12+ |
| **Animations** | 15+ |
| **Mock Products** | 6 |

---

## ✅ What's Working Right Now

✅ Complete navigation flow  
✅ All 20 buyer screens functional  
✅ Masonry grid layout  
✅ Product card interactions  
✅ Cart functionality  
✅ Search with filters  
✅ Wish list (saved items)  
✅ State persistence (MMKV)  
✅ Camera integration (Expo)  
✅ Smooth animations  

---

## ⏭️ Next Steps

1. **Install on Phone**: Scan QR code with Expo Go
2. **Test All Screens**: Click through navigation
3. **Add Mock Data**: Edit products in mockData.ts
4. **Style Customization**: Adjust colors and spacing
5. **Real API Integration**: Connect to backend
6. **Production Build**: `npm run build` for App Store/Play Store

---

## 🚀 Production Deployment

```bash
# Build for iOS
npm run build:ios

# Build for Android
npm run build:android

# Build web
npm run build:web
```

(Note: Requires EAS CLI setup)

---

**Questions?** Refer to DRAPE_DOCUMENTATION.md for full documentation.

Happy building! 🎉
