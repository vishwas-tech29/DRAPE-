# DRAPE Backend - Complete Installation & Testing Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Docker** and Docker Compose (for local MongoDB and Redis)
- **Git**

## Step-by-Step Installation

### 1. Navigate to Project Directory

```bash
cd drape-backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js, Mongoose, Redis, Bull
- JWT, Bcrypt, Joi
- AWS SDK, Cloudinary, Razorpay, Twilio
- OpenAI, Firebase Admin
- Winston, Helmet, and more

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

The `.env` file is already created with development defaults. For production, update these values:

**Required for Basic Functionality:**
- `MONGODB_URI` - Already set to local MongoDB
- `REDIS_URL` - Already set to local Redis
- `JWT_SECRET` - Already set (change in production)
- `JWT_REFRESH_SECRET` - Already set (change in production)

**Optional (for full features):**
- AWS S3 credentials (for image uploads)
- Cloudinary credentials (for image optimization)
- Razorpay keys (for payments)
- Twilio credentials (for SMS OTP)
- OpenAI API key (for AI features)
- Stability AI key (for design generation)
- Firebase credentials (for push notifications)

### 4. Start Local Services

Start MongoDB and Redis using Docker Compose:

```bash
docker-compose up -d
```

This starts:
- MongoDB on port 27017
- Redis on port 6379

Verify services are running:
```bash
docker-compose ps
```

### 5. Seed the Database (Optional but Recommended)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- 50 buyer users
- 15 seller accounts
- 100+ products
- 200 orders
- 500 search logs

### 6. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

You should see:
```
MongoDB Connected: localhost
Redis connected successfully
Server running on port 5000 in development mode
API Documentation: http://localhost:5000/api/docs
```

## Testing the API

### Method 1: Swagger UI (Recommended)

1. Open your browser and navigate to:
   ```
   http://localhost:5000/api/docs
   ```

2. You'll see interactive API documentation with all endpoints

3. Try the authentication flow:
   - Click on "Authentication" section
   - Try "POST /api/auth/send-otp"
   - Click "Try it out"
   - Enter a phone number: `9876543210`
   - Click "Execute"

### Method 2: Postman

1. Import the Postman collection:
   - Open Postman
   - Click "Import"
   - Select `POSTMAN_COLLECTION.json`

2. Set the base URL variable:
   - Click on the collection
   - Go to "Variables"
   - Set `baseUrl` to `http://localhost:5000`

3. Test endpoints in order:
   - Send OTP
   - Verify OTP (use the OTP from server logs)
   - Get user profile
   - Browse products

### Method 3: cURL

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Test authentication:
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210"}'

# Check server logs for the OTP, then verify
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber":"9876543210",
    "otp":"123456",
    "fullName":"Test User",
    "city":"Hyderabad"
  }'
```

## Testing Workflow

### 1. Authentication Flow

```bash
# Step 1: Send OTP
POST /api/auth/send-otp
Body: { "phoneNumber": "9876543210" }

# Step 2: Check server console for OTP (in development, it's logged)

# Step 3: Verify OTP
POST /api/auth/verify-otp
Body: {
  "phoneNumber": "9876543210",
  "otp": "YOUR_OTP_FROM_LOGS",
  "fullName": "John Doe",
  "city": "Hyderabad"
}

# Response includes accessToken and refreshToken
```

### 2. Browse Products (No Auth Required)

```bash
GET /api/products?category=ethnic&page=1&limit=20
```

### 3. Get Personalized Feed (Auth Required)

```bash
GET /api/feed
Headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
```

### 4. Search Products

```bash
# Text search
POST /api/search/text
Headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
Body: { "query": "ethnic wear", "city": "Hyderabad" }
```

### 5. Add to Cart

```bash
POST /api/cart/items
Headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
Body: {
  "productId": "PRODUCT_ID_FROM_SEARCH",
  "size": "M",
  "color": "Blue",
  "quantity": 1
}
```

### 6. Create Order

```bash
POST /api/orders
Headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
Body: {
  "paymentMethod": "cod",
  "deliveryAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "addressLine1": "123 Main St",
    "city": "Hyderabad",
    "pincode": "500001"
  }
}
```

## Seller Workflow

### 1. Register as Seller

```bash
POST /api/seller/register
Headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
Body: {
  "shopName": "My Fashion Store",
  "ownerName": "John Doe",
  "whatsappNumber": "9876543210",
  "city": "Hyderabad",
  "area": "Banjara Hills",
  "shopType": "online-only",
  "categories": ["ethnic", "western"]
}
```

### 2. Create Product

```bash
POST /api/seller/products
Headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
Body: (multipart/form-data)
- photos: [image files]
- productName: "Silk Saree"
- description: "Beautiful silk saree"
- category: "ethnic"
- price: 2500
- sizesAvailable: ["Free Size"]
- stockQuantity: 10
```

### 3. View Orders

```bash
GET /api/seller/orders?status=new
Headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
```

### 4. View Analytics

```bash
GET /api/seller/analytics/overview?from=2024-01-01&to=2024-12-31
Headers: { "Authorization": "Bearer YOUR_ACCESS_TOKEN" }
```

## Monitoring Logs

### View Application Logs

```bash
# Combined logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log
```

### View Docker Logs

```bash
# MongoDB logs
docker-compose logs -f mongodb

# Redis logs
docker-compose logs -f redis
```

## Troubleshooting

### Issue: MongoDB Connection Failed

**Solution:**
```bash
# Check if MongoDB is running
docker-compose ps

# Restart MongoDB
docker-compose restart mongodb

# Check logs
docker-compose logs mongodb
```

### Issue: Redis Connection Failed

**Solution:**
```bash
# Check if Redis is running
docker-compose ps

# Restart Redis
docker-compose restart redis
```

### Issue: OTP Not Received

**Solution:**
- In development, OTP is logged to console
- Check server logs: `tail -f logs/combined.log`
- Look for: "OTP generated for [phone]: [code]"

### Issue: JWT Token Expired

**Solution:**
```bash
# Use the refresh token endpoint
POST /api/auth/refresh-token
Body: { "refreshToken": "YOUR_REFRESH_TOKEN" }
```

### Issue: Image Upload Fails

**Solution:**
- Ensure AWS S3 credentials are configured in `.env`
- Or use placeholder images for testing
- The app will log errors but continue working

### Issue: AI Features Not Working

**Solution:**
- AI features require API keys (OpenAI, Stability AI)
- Without keys, the app gracefully degrades
- Products will still be created, just without AI tagging
- Photo search will return empty results

## Testing Without External Services

The backend is designed to work without external service credentials:

✅ **Works without configuration:**
- Authentication (OTP logged to console)
- Product browsing
- Cart management
- Order creation (COD only)
- Seller registration
- Product management

❌ **Requires configuration:**
- SMS OTP delivery (Twilio)
- Online payments (Razorpay)
- Image uploads (AWS S3)
- AI features (OpenAI, Stability AI)
- Push notifications (Firebase)

## Production Deployment Checklist

Before deploying to production:

- [ ] Update all secrets in `.env`
- [ ] Change JWT secrets to strong random values
- [ ] Configure MongoDB Atlas connection
- [ ] Configure Redis Cloud
- [ ] Set up AWS S3 bucket
- [ ] Configure Cloudinary account
- [ ] Set up Razorpay account
- [ ] Configure Twilio account
- [ ] Get OpenAI API key
- [ ] Get Stability AI key
- [ ] Set up Firebase project
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS allowed origins
- [ ] Set up SSL/HTTPS
- [ ] Configure PM2 for process management
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy

## Useful Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Seed database
npm run seed

# Run tests
npm test

# Stop Docker services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View all running processes
docker-compose ps

# Restart a specific service
docker-compose restart mongodb
```

## Next Steps

1. ✅ Complete installation
2. ✅ Test basic endpoints
3. ✅ Seed database
4. ✅ Test authentication flow
5. ✅ Test buyer workflow
6. ✅ Test seller workflow
7. Configure external services
8. Deploy to staging
9. Deploy to production

## Support

For issues or questions:
- Check logs in `logs/` directory
- Review API documentation at `/api/docs`
- Check `README.md` for detailed information
- Review `PROJECT_SUMMARY.md` for architecture overview

## Success Indicators

You'll know everything is working when:
- ✅ Server starts without errors
- ✅ MongoDB connection successful
- ✅ Redis connection successful
- ✅ Swagger docs accessible
- ✅ Health check returns 200
- ✅ Authentication flow works
- ✅ Products can be browsed
- ✅ Orders can be created

Happy coding! 🚀
