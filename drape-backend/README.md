# DRAPE Backend API

Complete production-ready backend for DRAPE - AI-powered fashion discovery and shopping platform operating in Hyderabad and Bangalore, India.

## Tech Stack

- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Queue**: Bull with Redis
- **Authentication**: JWT with refresh tokens
- **Payments**: Razorpay (UPI, Cards, COD)
- **SMS**: Twilio
- **Storage**: AWS S3 + Cloudinary CDN
- **AI**: OpenAI GPT-4 Vision, Stability AI
- **Push Notifications**: Firebase Cloud Messaging
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize

## Project Structure

```
drape-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic & integrations
│   ├── jobs/            # Bull queue workers
│   ├── utils/           # Helper functions
│   └── validators/      # Joi validation schemas
├── logs/                # Application logs
├── app.js               # Express app setup
├── server.js            # Server entry point
├── docker-compose.yml   # Local development setup
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Redis
- AWS account (S3)
- Cloudinary account
- Razorpay account
- Twilio account
- OpenAI API key
- Stability AI API key
- Firebase project

### Installation

1. **Clone and install dependencies**:
```bash
cd drape-backend
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and fill in all required values:
- MongoDB connection string
- Redis URL
- JWT secrets
- AWS S3 credentials
- Cloudinary credentials
- Razorpay keys
- Twilio credentials
- OpenAI API key
- Stability AI API key
- Firebase service account details

3. **Start local services** (MongoDB + Redis):
```bash
docker-compose up -d
```

4. **Seed the database** (optional):
```bash
npm run seed
```

5. **Start the development server**:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Documentation

When running in development mode, Swagger documentation is available at:
```
http://localhost:5000/api/docs
```

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /send-otp` - Send OTP to phone number
- `POST /verify-otp` - Verify OTP and login/register
- `POST /refresh-token` - Refresh access token
- `POST /logout` - Logout user

### User (`/api/users`)
- `GET /me` - Get current user profile
- `PUT /me` - Update user profile
- `PUT /me/style-preferences` - Update style preferences
- `PUT /me/device-token` - Register FCM device token
- `GET /me/cashback` - Get cashback balance

### Feed (`/api/feed`)
- `GET /` - Get personalized home feed
- `GET /trending` - Get trending products
- `GET /for-you` - Get personalized recommendations

### Search (`/api/search`)
- `POST /text` - Text-based search
- `POST /photo` - Photo-based AI search
- `GET /scan-result/:jobId` - Get AI scan results
- `GET /suggestions` - Get search autocomplete

### Products (`/api/products`)
- `GET /` - Get products with filters
- `GET /:productId` - Get product details
- `POST /:productId/view` - Track product view
- `GET /seller/:sellerId` - Get seller's products

### Cart (`/api/cart`)
- `GET /` - Get user's cart
- `POST /items` - Add item to cart
- `PUT /items/:itemId` - Update cart item
- `DELETE /items/:itemId` - Remove cart item
- `DELETE /` - Clear cart

### Orders (`/api/orders`)
- `POST /` - Create order from cart
- `POST /payment-verify` - Verify Razorpay payment
- `GET /` - Get order history
- `GET /:orderId` - Get order details
- `POST /:orderId/cancel` - Cancel order

### Saved Boards (`/api/boards`)
- `GET /` - Get all boards
- `POST /` - Create board
- `GET /:boardId` - Get board details
- `POST /:boardId/products` - Save product to board
- `DELETE /:boardId/products/:productId` - Remove product

### Notifications (`/api/notifications`)
- `GET /` - Get notifications
- `PUT /:notificationId/read` - Mark as read
- `PUT /read-all` - Mark all as read

### Seller (`/api/seller`)
- `POST /register` - Register as seller
- `GET /me` - Get seller profile
- `PUT /me` - Update seller profile
- `PUT /me/holiday` - Toggle holiday mode

### Seller Products (`/api/seller/products`)
- `POST /` - Create product
- `GET /` - Get seller's products
- `GET /:productId` - Get product details
- `PUT /:productId` - Update product
- `DELETE /:productId` - Delete product
- `POST /:productId/generate-designs` - Generate AI design cards
- `PUT /:productId/select-design` - Select active design
- `PUT /:productId/stock` - Update stock

### Seller Orders (`/api/seller/orders`)
- `GET /` - Get seller's orders
- `GET /:orderId` - Get order details
- `PUT /:orderId/confirm` - Confirm order
- `PUT /:orderId/ship` - Mark as shipped
- `PUT /:orderId/deliver` - Mark as delivered

### Seller Analytics (`/api/seller/analytics`)
- `GET /overview` - Get analytics overview
- `GET /search-terms` - Get top search terms
- `GET /products-performance` - Get product performance
- `GET /traffic-sources` - Get traffic breakdown
- `GET /customer-insights` - Get customer insights

## Background Jobs

The system uses Bull queues for async processing:

1. **Outfit Detection Worker** - Processes AI photo scans
2. **Product Tagging Worker** - Auto-tags products with AI
3. **Design Card Generation Worker** - Generates styled product cards
4. **Virtual Try-On Worker** - Generates try-on images
5. **Payout Calculation Worker** - Calculates seller payouts
6. **Notification Worker** - Sends push notifications
7. **Search Analytics Worker** - Aggregates search data
8. **Weekly Payout Worker** - Processes weekly payouts (cron)

## Commission Structure

- **Founding Sellers**: 5% commission (registered before cutoff date)
- **New Sellers**: 0% commission until ₹50,000 in sales
- **Established Sellers**: 8% commission after crossing threshold

## Security Features

- JWT authentication with refresh token rotation
- Rate limiting (100 req/15min global, 10 req/15min auth)
- Request validation with Joi
- NoSQL injection prevention
- CORS with whitelist
- Helmet security headers
- HTTPS only in production

## Caching Strategy

Redis caching for:
- Home feed (5 min TTL)
- Trending products (10 min TTL)
- Search results (2 min TTL)
- Product details (15 min TTL)
- Seller analytics (5 min TTL)

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

The backend is designed to deploy on AWS EC2 with:
- PM2 for process management
- MongoDB Atlas for database
- Redis Cloud for caching
- GitHub Actions for CI/CD

## Environment Variables

See `.env.example` for all required environment variables.

## Support

For issues or questions, contact the DRAPE development team.

## License

Proprietary - DRAPE Platform
