# DRAPE App - Testing & Development Guide

## 🧪 Testing Procedures

### Pre-Launch Checklist

#### ✅ Installation Verification
- [ ] Node.js 16+ installed and verified (`node --version`)
- [ ] npm 8+ installed and verified (`npm --version`)
- [ ] Expo CLI available (`npm start` works)
- [ ] All 16 dependencies installed (`npm install` completes)
- [ ] No TypeScript errors (`npm run type-check` if available)
- [ ] Expo server starts successfully on port 8082

#### ✅ Navigation Testing
- [ ] Splash screen loads with animation
- [ ] Mode selection buttons work
- [ ] Onboarding carousel swipes smoothly (3 slides)
- [ ] Style quiz advances on button click
- [ ] Sign up accepts phone number input
- [ ] OTP input accepts 4+ digits
- [ ] Auth flow completes and navigates to Home
- [ ] Bottom tabs appear and are clickable
- [ ] Back buttons work on all screens

#### ✅ Home Feed Testing
- [ ] Masonry grid displays products (2 columns)
- [ ] Products have proper spacing and sizing
- [ ] Images load correctly
- [ ] Search bar displays placeholder text (cycles every 4s)
- [ ] Category chips scroll horizontally
- [ ] Product cards have heart buttons
- [ ] Tapping product navigates to ProductDetail
- [ ] Infinite scroll loads more products on bottom scroll

#### ✅ Search Testing
- [ ] Search screen displays category grid
- [ ] Category chips are tappable
- [ ] Recent searches display (persisted)
- [ ] Occasion section shows 6 options
- [ ] Trending section shows items with rankings
- [ ] Tapping any item navigates to SearchResults
- [ ] Search bar in header navigates back to search

#### ✅ Search Results Testing
- [ ] Search bar shows typed query
- [ ] AI summary line displays: "Showing X products for 'query'"
- [ ] Filter chips appear (Price, City, Size, Color, Delivery, Sort)
- [ ] Masonry grid displays results
- [ ] Empty state appears when no results
- [ ] Tapping product navigates to ProductDetail
- [ ] Heart button toggles save state
- [ ] Edit button allows new search

#### ✅ Snap (Camera) Testing
- [ ] Camera permission prompt appears (mobile)
- [ ] Camera view displays full-screen
- [ ] Mode tabs at top switch between Detect/Try On/Style Me
- [ ] Flash toggle button works (iOS)
- [ ] Gallery picker button opens photo library
- [ ] Corner frame overlay renders with gold color
- [ ] "Point at any outfit" text displays
- [ ] Shutter button is prominently displayed
- [ ] Tapping shutter navigates to AIScanning with selected photo

#### ✅ AI Scanning Testing
- [ ] Selected photo displays at top
- [ ] Scan line animates from top to bottom
- [ ] Detection tags appear with fade animation:
  - [ ] "Floral Print" appears at ~1s
  - [ ] "Midi Length" appears at ~1.5s
  - [ ] "Chiffon" appears at ~2s
  - [ ] "V-Neck" appears at ~2.5s
- [ ] Progress checklist shows 4 steps:
  - [ ] "Detecting clothing items" completes first
  - [ ] "Identifying colors and style" completes second
  - [ ] "Searching 2.4 million products" completes third
  - [ ] "Finding local sellers" completes fourth
- [ ] Each step takes ~500ms to complete
- [ ] "Match found!" message displays
- [ ] Auto-navigates to Results screen after completion

#### ✅ Results Testing
- [ ] Detected item card displays with:
  - [ ] Thumbnail image
  - [ ] Product name
  - [ ] Style tags (e.g., "Festive", "Silk")
  - [ ] Confidence bar at 96%
  - [ ] "96% match" text
- [ ] "Virtual Try-On" button has gradient (dark gold → terracotta)
- [ ] "Exact Matches" section scrolls horizontally with products
- [ ] "Style It With" section shows accessories
- [ ] "Similar Vibes" grid shows 3 columns of inspiration
- [ ] All product cards are tappable

#### ✅ Product Detail Testing
- [ ] Back arrow returns to previous screen
- [ ] Main product image displays large (45% screen height)
- [ ] Thumbnail strip shows 3-4 images
- [ ] Selected thumbnail has gold ring border
- [ ] Tapping thumbnails updates main image
- [ ] Product name displays in Playfair italic
- [ ] Price displays in DM Sans bold
- [ ] Color swatches are tappable
- [ ] Selected color has gold ring
- [ ] Size buttons (XS-XL) are tappable
- [ ] Selected size fills with dark color
- [ ] Product description displays (2-3 lines)
- [ ] Seller section shows:
  - [ ] Shop name and icon
  - [ ] Shop city
  - [ ] Star rating
  - [ ] View Shop link (tappable)
- [ ] "Message Seller" button appears (placeholder)
- [ ] Heart button toggles save state
- [ ] Bottom "Add to Cart" button fixed at bottom
- [ ] Tapping "Add to Cart" adds item and shows confirmation

#### ✅ Virtual Try-On Testing
- [ ] Back arrow returns to previous screen
- [ ] Title "Virtual Try-On" displays centered
- [ ] Avatar/stage card shows neutral figure (55% screen)
- [ ] Selected product appears on avatar
- [ ] Color swatches are tappable and update avatar
- [ ] Size buttons update fit on avatar
- [ ] "AI Fitted" green badge displays
- [ ] Price card shows:
  - [ ] Product price
  - [ ] "You earn ₹X cashback" in gold
- [ ] "Buy Now" button (primary style)
- [ ] "See Similar" button (secondary style)
- [ ] "Try With Your Photo" button (outline style)
- [ ] Tapping "Buy Now" adds to cart and navigates

#### ✅ Cart Testing
- [ ] Cart displays all added items
- [ ] Each item shows:
  - [ ] Thumbnail image
  - [ ] Product name
  - [ ] Size and color selection
  - [ ] Price
  - [ ] Remove button (X icon)
- [ ] Order summary shows:
  - [ ] Subtotal calculation
  - [ ] Delivery charge ($0 or actual amount)
  - [ ] Total calculation
- [ ] Promo code input field present
- [ ] "Proceed to Checkout" button present
- [ ] Empty state when no items
- [ ] Removing items updates totals

#### ✅ Checkout Testing
- [ ] Delivery Address section displays
- [ ] Address card shows pre-filled data
- [ ] "Change" button present (placeholder)
- [ ] Payment Method section shows options:
  - [ ] UPI (radio button)
  - [ ] Debit/Credit Card (radio button)
  - [ ] Cash on Delivery (radio button)
- [ ] One payment method is selected by default
- [ ] Order Summary displays items
- [ ] Total matches Cart total
- [ ] "Place Order" button present and tappable

#### ✅ Order Success Testing
- [ ] Large checkmark icon displays (success color)
- [ ] "Order Confirmed!" title
- [ ] Order number displays (e.g., "ORD-1708...1234")
- [ ] Estimated delivery message: "Estimated delivery in 5-7 days"
- [ ] "Track Order" button present
- [ ] "Continue Shopping" button present
- [ ] Tapping "Continue Shopping" returns to Home

#### ✅ Saved Boards Testing
- [ ] "My Boards" heading displays
- [ ] "+" button in top-right for new board (placeholder)
- [ ] 2-column grid of board cards
- [ ] Each board card shows:
  - [ ] 2x2 preview grid of items inside
  - [ ] Board name
  - [ ] Item count
- [ ] Tapping board navigates to full board view

#### ✅ Profile Testing
- [ ] Profile header displays:
  - [ ] Avatar placeholder (cream circle with initial)
  - [ ] User name
  - [ ] City
  - [ ] Edit button
- [ ] Statistics section shows:
  - [ ] Orders count (0 initially)
  - [ ] Saved count (updates with hearts)
  - [ ] Cashback earned (₹0 initially)
- [ ] Menu items present and tappable:
  - [ ] My Orders
  - [ ] My Wishlist
  - [ ] Refer and Earn
  - [ ] Style Preferences
  - [ ] Notifications
  - [ ] Help
  - [ ] Switch to Seller Mode
  - [ ] Sign Out
- [ ] Each menu has icon and chevron
- [ ] "Sign Out" logs out and returns to ModeSelection

#### ✅ Design System Validation
- [ ] All backgrounds are #F5F0E8 (warm cream)
- [ ] All text is #1A1814 (dark)
- [ ] Accent elements are #B8864A (warm gold)
- [ ] Card corners are 16px rounded
- [ ] Button corners are 14px rounded
- [ ] Horizontal padding is 20px
- [ ] Success indicators are #6B8C72 (sage)
- [ ] Danger/sale text is #C85C3A (terracotta)
- [ ] All animations are 200-300ms smooth

---

## 🛠️ Development Workflow

### Local Development Setup

```bash
# 1. Clone/navigate to project
cd D:\DRAPE-\MyApp

# 2. Install dependencies (one-time)
npm install

# 3. Start development server
npm start

# 4. Choose testing environment:
#    Press 'a' for Android emulator
#    Press 'w' for web browser
#    Press 'i' for iOS simulator (macOS only)
#    Or scan QR code with Expo Go

# 5. Edit files - changes hot-reload automatically
# 6. Press 'r' in terminal to reload app
# 7. Press 'd' for debug menu
```

### File Modification Workflow

#### Editing a Screen
1. Open screen file in `src/screens/buyer/[ScreenName].tsx`
2. Make changes
3. Save file
4. App automatically reloads (hot reload)
5. Test changes immediately on device/emulator

#### Adding New Products
1. Open `src/services/mockData.ts`
2. Add new product to `mockProducts` array:
```typescript
{
  id: '7',
  name: 'New Product Name',
  price: 9999,
  images: ['https://image-url.jpg'],
  shopName: 'Shop Name',
  shopCity: 'Hyderabad',
  colors: ['Color1', 'Color2'],
  sizes: ['M', 'L', 'XL'],
  description: 'Product description...',
  rating: 4.5,
  reviews: 100,
  tags: ['Tag1', 'Tag2'],
  isAIRecommended: false
}
```
3. Save file - app reloads
4. New product appears in Home feed

#### Changing Colors
1. Open `src/constants/colors.ts`
2. Edit color value (e.g., `warmCream: '#F5F0E8'`)
3. Save file
4. All screens using that color update automatically

#### Adjusting Spacing
1. Open `src/constants/layout.ts`
2. Edit spacing values (e.g., `xl: 20`)
3. Save file
4. All screens using that spacing update automatically

#### Modifying Navigation
1. Open `src/navigation/RootNavigator.tsx`
2. Edit stack order, screen names, or initial routes
3. Save file - app reloads
4. Test navigation flow

### Debugging Workflow

#### Enable React Native Debugger
1. Install React Native Debugger: https://github.com/jhen0409/react-native-debugger
2. In terminal: Press 'd' to open debug menu
3. Select "Open Debugger"
4. Debugger opens in separate window

#### Console Logging
```typescript
// Add console logs in any screen
console.log('Product:', product);
console.log('Cart Items:', cartItems);

// View logs in terminal or React Native Debugger
```

#### State Inspection
```typescript
// Use Zustand devtools (add to store)
import { devtools } from 'zustand/middleware';

// Or manually log store state
const state = useUserStore.getState();
console.log('User Store:', state);
```

#### Network Inspection
1. In React Native Debugger, go to "Network" tab
2. All Axios requests will appear there
3. Check request/response bodies
4. Simulate slow network in "Network" settings

### Performance Testing

#### Measure Frame Rate
1. Press 'd' in terminal (debug menu)
2. Enable "Show Performance Monitor"
3. FPS should stay at 60 in most cases
4. Check for dropped frames in complex screens

#### Monitor Memory Usage
1. React Native Debugger shows memory in real-time
2. Note baseline memory on app start
3. Scroll through screens, add items
4. Check if memory grows excessively
5. If memory >200MB, check for memory leaks

#### Test with Slow Network
1. React Native Debugger → Network tab
2. Set throttle to "Slow 3G"
3. Test API calls and loading states
4. Verify loading indicators appear
5. Check error handling

### Git Workflow (if applicable)

```bash
# Check status
git status

# Stage changes
git add src/screens/buyer/Home.tsx

# Commit
git commit -m "Update Home feed layout"

# Push
git push origin main
```

---

## 🚀 Building & Deployment

### Development Build (Current)
```bash
# Already running on http://localhost:8082
# Scan QR code or visit URL directly
```

### Web Build
```bash
npm run build:web
# Creates optimized web build
# Deploy to Vercel, Netlify, or your host
```

### Android Build
```bash
# Requires EAS CLI
npm install -g eas-cli
eas build --platform android

# Or local build (requires Android Studio)
npm run build:android
```

### iOS Build
```bash
# Requires macOS and Xcode
npm run build:ios

# Or via EAS
eas build --platform ios
```

### Standalone App
```bash
# Build both platforms
eas build

# Publish to App Store and Play Store
eas submit --platform ios
eas submit --platform android
```

---

## 📊 Metrics & Monitoring

### Performance Targets
- App start: <3 seconds
- Navigation: <200ms
- Image load: <500ms
- Scroll FPS: 60
- Memory: <150MB baseline

### Monitoring Checklist
- [ ] Bundle size <5MB
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All images loading
- [ ] Animations smooth at 60fps
- [ ] Memory stable during use

---

## 🔍 Common Issues & Solutions

### Issue: App Won't Start
**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

### Issue: Hot Reload Not Working
**Solution:**
- Press 'r' in terminal to manually reload
- Check that file was saved
- Restart development server (`npm start`)

### Issue: Images Not Loading
**Solution:**
- Check image URLs are valid (test in browser)
- Verify image URLs are HTTPS
- Add image source to mockData.ts

### Issue: Navigation Errors
**Solution:**
- Check screen names match in RootNavigator.tsx
- Verify navigation params are passed correctly
- Check stack navigator nesting is proper

### Issue: State Not Persisting
**Solution:**
- Verify MMKV is imported and initialized
- Check store actions are called correctly
- Clear app data and try again
- Check device storage isn't full

### Issue: Performance Issues (Slow Scroll)
**Solution:**
```typescript
// Optimize FlatList rendering
<FlatList
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  removeClippedSubviews={true}
  // ... other props
/>
```

### Issue: Camera Permission Denied
**Solution:**
- Grant permission when prompted
- On Android: Settings → Apps → DRAPE → Permissions → Camera
- On iOS: Settings → DRAPE → Camera → Allow
- Delete and reinstall app if needed

---

## 📝 Code Style Guide

### Naming Conventions
```typescript
// Screens
src/screens/buyer/ProductDetail.tsx

// Components
src/components/ProductCard.tsx

// Stores
src/store/userStore.ts

// Services
src/services/api.ts

// Constants
src/constants/colors.ts
```

### Component Structure
```typescript
import { ... } from 'react-native';
import { ... } from '@/constants';

interface Props { ... }

export function ComponentName(props: Props) {
  const [state, setState] = useState();
  const store = useStore();
  
  useEffect(() => { ... }, []);
  
  const handler = () => { ... };
  
  return <View>...</View>;
}
```

### Styling Pattern
```typescript
import { colors, layout } from '@/constants';

const styles = {
  container: {
    paddingHorizontal: layout.xl,
    backgroundColor: colors.warmCream,
  },
  text: {
    color: colors.darkText,
    fontSize: 16,
  },
};
```

### Imports
- Always import from `@/` for src folder
- Group imports: React, React Native, Third-party, Local
- Use named imports for components

---

## 📚 References & Resources

### Official Docs
- React Native: https://reactnative.dev
- Expo: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- Zustand: https://github.com/pmndrs/zustand

### Useful Tools
- React Native Debugger: https://github.com/jhen0409/react-native-debugger
- Expo Go App: https://expo.dev/client
- VS Code Extensions: ES7+ React, TypeScript

### Learning Resources
- React Native Tutorial: https://reactnative.dev/docs/getting-started
- Expo Guide: https://docs.expo.dev/workflow/android-studio-emulator
- React Hooks: https://react.dev/reference/react

---

## 🎯 Next Steps

1. **Run the app** → `npm start`
2. **Scan QR code** with Expo Go
3. **Test authentication** → Complete signup flow
4. **Explore all screens** → Click through each tab
5. **Add more products** → Edit mockData.ts
6. **Customize design** → Edit colors.ts, typography.ts
7. **Connect real API** → Replace mock calls with Axios
8. **Build APK/IPA** → Use EAS for deployment

---

**Happy developing!** 🚀

For more information, see DRAPE_DOCUMENTATION.md and CONFIG_AND_FEATURES.md
