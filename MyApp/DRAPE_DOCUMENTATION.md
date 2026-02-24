# DRAPE - AI-Powered Fashion Discovery and Shopping App

## Overview

DRAPE is a complete React Native mobile application built with Expo that enables fashion discovery and shopping in India. The app has two main modes: a buyer-facing mobile app for discovering and shopping for fashion items, and seller-facing capabilities for boutiques to manage their inventory.

## Project Structure

```
MyApp/
├── src/
│   ├── screens/
│   │   ├── buyer/
│   │   │   ├── Splash.tsx                 # Splash screen with logo animation
│   │   │   ├── ModeSelection.tsx         # Shopping vs Selling mode selection
│   │   │   ├── Onboarding.tsx            # 3-slide onboarding carousel
│   │   │   ├── StyleQuiz.tsx             # Style preference quiz
│   │   │   ├── SignUp.tsx                # Phone + OTP authentication
│   │   │   ├── Home.tsx                  # Main feed with masonry grid
│   │   │   ├── Search.tsx                # Search interface
│   │   │   ├── SearchResults.tsx         # Search results with filters
│   │   │   ├── Snap.tsx                  # Camera interface for outfit detection
│   │   │   ├── AIScanning.tsx            # AI scanning with animations
│   │   │   ├── Results.tsx               # Snap results & product matches
│   │   │   ├── PlaceholderScreens.tsx    # ProductDetail, VirtualTryOn, Cart, Checkout, etc.
│   │   └── seller/                       # Seller mode screens (future)
│   ├── components/
│   │   ├── Button.tsx                    # Reusable button component
│   │   ├── ProductCard.tsx               # Product card for masonry grid
│   │   ├── Header.tsx                    # Header with logo and actions
│   │   ├── CategoryChip.tsx              # Category filter chip
│   │   ├── SelectionComponents.tsx       # ColorSwatch & SizeButton
│   │   └── index.ts
│   ├── store/
│   │   ├── userStore.ts                  # Zustand store for user, cart, saved items
│   │   └── index.ts
│   ├── navigation/
│   │   ├── RootNavigator.tsx            # Root navigation with mode routing
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts                       # API service with Axios
│   │   ├── mockData.ts                  # Mock product and user data
│   │   └── index.ts
│   ├── constants/
│   │   ├── colors.ts                    # Design system colors
│   │   ├── typography.ts                # Typography styles
│   │   ├── layout.ts                    # Spacing and layout constants
│   │   ├── animations.ts                # Animation durations
│   │   └── index.ts
│   └── hooks/                           # Custom React hooks (future)
├── App.tsx                              # Main app entry point
├── app.json                             # Expo configuration
├── tsconfig.json                        # TypeScript configuration
└── package.json                         # Dependencies
```

## Design System

### Colors
- **Warm Cream Background**: #F5F0E8
- **Pure White Cards**: #FFFFFF
- **Primary Text (Near-Black)**: #1A1814
- **Secondary Text (Warm Grey)**: #6B6560
- **Accent (Warm Gold)**: #B8864A
- **Action (Dark)**: #1A1814
- **Danger/Sale (Terracotta)**: #C85C3A
- **Success (Sage Green)**: #6B8C72
- **Borders (10% opacity)**: rgba(26, 24, 20, 0.1)

### Typography
- **Display Font**: Playfair Display (serif, elegant)
- **Body Font**: DM Sans (clean, modern, readable)
- **Headings**: Playfair Display regular and italic variants
- **Body Text**: DM Sans regular, medium, bold

### Spacing & Border Radius
- **Horizontal Padding**: 20px
- **Card Border Radius**: 16px
- **Button Border Radius**: 14px
- **Section Spacing**: 24px
- **Spacing Scale**: 4, 8, 12, 16, 20, 24, 32, 48 (xs to huge)

### Animations
- **Standard Duration**: 200-300ms
- **Slow Duration**: 500ms
- All transitions use easing for smooth feel

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (bottom tabs + stack)
- **State Management**: Zustand
- **Local Storage**: React Native MMKV
- **HTTP Client**: Axios
- **Camera**: Expo Camera
- **Image Picker**: React Native Image Picker
- **Animations**: React Native Reanimated
- **Loading Animations**: Lottie React Native
- **Gesture Handling**: React Native Gesture Handler

## Key Features Implemented

### Authentication Flow
1. **Splash Screen** - Animated logo with 2-second delay
2. **Mode Selection** - Choose between Shopping or Selling mode
3. **Onboarding** - 3-slide carousel with swipe navigation
4. **Style Quiz** - Multi-question quiz with progress tracking
5. **Phone Authentication** - Phone number + OTP verification
6. **Guest Mode** - Browse without signing in

### Buyer App Screens

#### Home Feed
- Masonry grid with varying card heights (Pinterest-style)
- Search bar with animated placeholder cycling
- Category chip filters (All, Trending, Ethnic, etc.)
- Infinite scroll with lazy loading
- Product cards with:
  - AI-recommended indicators (gold dot)
  - Local seller badges (Hyderabad/Bangalore)
  - Heart/wishlist buttons
  - Price and shop information

#### Search
- Search interface with category browsing
- Shop by category grid
- Shop by occasion buttons
- Trending items list
- Recent searches

#### Search Results
- AI summary line ("Showing 284 products for...")
- Filter chips (Price, City, Size, Color, Delivery, Sort)
- Product masonry grid
- Smart keyword matching for occasions

#### Snap (Camera)
- Full-screen camera with corner frame overlay
- Three mode tabs: Detect, Try On, Style Me
- Flash toggle and gallery picker
- Large shutter button with gold ring
- Real-time camera feed

#### AI Scanning
- Photo display with animated scan line
- Floating tag detection labels
- Progress checklist with 4 steps:
  - Detecting clothing items
  - Identifying colors and style
  - Searching 2.4 million products
  - Finding local sellers
- Auto-navigate to results when complete

#### Snap Results
- Detected item summary card with confidence %
- Horizontal scrollable sections:
  - Exact Matches (with local sellers first)
  - Style It With (accessories suggestions)
  - Similar Vibes (inspiration grid)
- Virtual Try-On button with gradient

#### Product Detail
- Full-width product image with 3-4 thumbnails
- Thumbnail gallery with smooth crossfade
- Product name, price, and rating
- Color swatch selection
- Size button selection (XS-XL)
- Product description
- Seller info with shop link and message button
- Fixed "Add to Cart" button at bottom
- Heart/wishlist button

#### Virtual Try-On
- Large avatar/try-on stage card
- Color and size selection
- Price and cashback display
- "Buy Now" and "See Similar" buttons
- "Try With Your Photo" feature
- Estimated fit badge

#### Cart
- List of cart items with quantities
- Order summary (subtotal, delivery, total)
- Promo code input
- Proceed to checkout button
- Remove items functionality

#### Checkout
- Delivery address selection
- Payment method options (UPI, Card, COD)
- Order summary
- Place order button

#### Order Success
- Animated checkmark icon
- Order number display
- Estimated delivery time
- Track order and continue shopping buttons

#### Saved Boards
- 2-column grid of boards
- 2x2 preview of items in each board
- Board creation button
- Item count display

#### Profile
- User avatar and name
- City and edit button
- Statistics (Orders, Saved, Cashback)
- Menu items:
  - My Orders
  - My Wishlist
  - Refer and Earn
  - Style Preferences
  - Notifications
  - Help
  - Switch to Seller Mode
  - Sign Out

## State Management

### Zustand Store (userStore.ts)

**User State:**
- User profile (ID, phone, name, city, preferences)
- Authentication status
- Saved items list
- Order history
- Cashback earned

**App Mode State:**
- Current mode (shopping/selling)
- Onboarding completion status

**Cart State:**
- Cart items with product ID, quantity, size, color, price
- Add/remove/update cart functions
- Cart total calculation

**Persistence:**
- MMKV for fast local storage
- Auto-save on state changes
- Load from storage on app start

## Navigation Structure

```
RootNavigator
├── AuthStack (for new users)
│   ├── Splash
│   ├── ModeSelection
│   ├── Onboarding
│   ├── StyleQuiz
│   └── SignUp
└── BuyerNavigator (bottom tabs)
    ├── Home Tab
    │   ├── HomeMain
    │   ├── ProductDetail
    │   └── VirtualTryOn
    ├── Search Tab
    │   ├── SearchMain
    │   ├── SearchResults
    │   ├── ProductDetail
    │   └── VirtualTryOn
    ├── Snap Tab
    │   ├── SnapMain
    │   ├── AIScanning
    │   ├── Results
    │   ├── ProductDetail
    │   └── VirtualTryOn
    ├── Saved Tab
    │   ├── SavedMain
    │   ├── ProductDetail
    │   └── VirtualTryOn
    └── Profile Tab
        ├── ProfileMain
        ├── Cart
        ├── Checkout
        └── OrderSuccess
```

## API Service Layer

### Mock Services (for development)

**Product Service:**
- `getHomeFeed(page, limit)` - Get paginated home feed products
- `searchProducts(query, filters)` - Search with filters
- `getProduct(productId)` - Get product details
- `getByCategory(category)` - Filter by category
- `getTrending()` - Get trending products
- `getAIRecommendations(preferences)` - AI-based recommendations
- `recognizeOutfit(image)` - AI outfit detection
- `getVirtualTryOn(productId, photo)` - Virtual try-on generation

**User Service:**
- `sendOTP(phoneNumber)` - Send OTP to phone
- `verifyOTP(phoneNumber, otp)` - Verify OTP
- `getUserProfile(userId)` - Get user profile

**Order Service:**
- `createOrder(items, address, paymentMethod)` - Create order
- `getOrder(orderId)` - Get order details

## Running the App

### Development

```bash
npm install
npm start
```

Then:
- Press `a` for Android with Expo Go
- Press `w` for Web
- Press `i` for iOS (macOS only)
- Or scan QR code with Expo Go app

### Web Preview

```bash
npm run web
```

Navigate to `http://localhost:8082`

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

(Requires macOS and Xcode)

## Mock Data

The app comes with comprehensive mock data including:
- 6 sample products covering different categories
- Mock product images from Unsplash
- Mock user data (orders, reviews, ratings)
- Mock API responses with realistic delays

All API calls return promises that resolve after 200-1000ms delays to simulate real network latency.

## Customization

### Add Real Fonts

1. Install Playfair Display and DM Sans from `expo-font`
2. Load fonts in app initialization
3. Update font family names in `typography.ts`

### Connect Real API

1. Update `API_BASE_URL` in `src/services/api.ts`
2. Replace mock functions with real Axios calls
3. Add authentication token handling
4. Add error handling and retry logic

### Add Camera Functionality

The camera is already integrated with Expo Camera. To enable:
1. Request camera permissions
2. Implement photo upload to backend
3. Connect to real AI/ML API for outfit detection

### Add Payment Gateway

1. Integrate with UPI provider (Google Pay, PhonePe)
2. Add Stripe or Razorpay for card payments
3. Implement COD order flow

## Performance Optimizations

- Masonry grid with FlatList for efficient rendering
- Image optimization with Expo Image
- Lazy loading of products on scroll
- MMKV for fast local storage
- Memoization of expensive components
- Debounced search input

## Future Enhancements

- [ ] Real AI/ML for outfit detection
- [ ] Seller dashboard with inventory management
- [ ] Real payment gateway integration
- [ ] Push notifications
- [ ] Live chat with sellers
- [ ] Community/social features
- [ ] AR try-on with device camera
- [ ] Wishlist sharing
- [ ] Multi-language support
- [ ] Dark mode support

## Testing

The app is fully functional with mock data. To test:
1. Click "I am Shopping" on mode selection
2. Go through onboarding and style quiz
3. Enter any 10-digit phone number and 4+ digit OTP
4. Explore all screens and features
5. Add items to cart and go through checkout flow

## Browser Compatibility

- **Web**: Chrome, Firefox, Safari, Edge (via Expo Web)
- **Android**: Android 6.0+ (via Expo Go or standalone build)
- **iOS**: iOS 13+ (via Expo Go or TestFlight)

## Notes

- All animations use 200-300ms durations for smooth feel
- Bottom navigation is always visible (sticky)
- All screens have 20px horizontal padding
- Cards have 1px soft border with 10% opacity
- Color consistency across all screens
- Touch targets minimum 44x44 pixels
- Status bar style automatically adjusted

## Support

For issues or feature requests, please refer to the feature requirements document or create an issue in the project repository.

---

**Version**: 1.0.0  
**Last Updated**: February 25, 2026  
**Built with**: React Native, Expo, TypeScript
