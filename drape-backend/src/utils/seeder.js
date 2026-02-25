require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const Order = require('../models/Order');
const SearchLog = require('../models/SearchLog');
const logger = require('../config/logger');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  logger.info('MongoDB connected for seeding');
};

const seedUsers = async () => {
  const users = [];
  const cities = ['Hyderabad', 'Bangalore'];
  const categories = ['ethnic', 'western', 'fusion', 'accessories'];
  const vibes = ['minimal', 'bold', 'casual', 'traditional'];

  for (let i = 1; i <= 50; i++) {
    users.push({
      fullName: `Buyer ${i}`,
      phoneNumber: `98765${String(i).padStart(5, '0')}`,
      city: cities[i % 2],
      stylePreferences: {
        preferredCategories: [categories[i % 4], categories[(i + 1) % 4]],
        styleVibe: vibes[i % 4],
        genderPreference: i % 2 === 0 ? 'female' : 'male',
        bodyType: ['slim', 'athletic', 'curvy'][i % 3],
      },
      onboardingCompleted: true,
    });
  }

  await User.insertMany(users);
  logger.info(`${users.length} users created`);
  return await User.find();
};

const seedSellers = async (users) => {
  const sellers = [];
  const cities = ['Hyderabad', 'Bangalore'];
  const shopTypes = ['physical-store', 'home-seller', 'online-only', 'independent-designer'];
  const categories = ['ethnic', 'western', 'fusion', 'accessories', 'footwear', 'jewelry'];

  const shopNames = [
    'Ethnic Elegance', 'Fashion Hub', 'Style Studio', 'Trendy Threads',
    'Chic Boutique', 'Designer Den', 'Fashion Forward', 'Urban Wardrobe',
    'Classic Collections', 'Modern Attire', 'Glamour Gallery', 'Style Sanctuary',
    'Fashion Fiesta', 'Elegant Ensembles', 'Trendsetter Store',
  ];

  for (let i = 0; i < 15; i++) {
    sellers.push({
      userId: users[i]._id,
      shopName: shopNames[i],
      ownerName: users[i].fullName,
      whatsappNumber: users[i].phoneNumber,
      city: cities[i % 2],
      area: i % 2 === 0 ? 'Banjara Hills' : 'Koramangala',
      shopType: shopTypes[i % 4],
      categories: [categories[i % 6], categories[(i + 1) % 6]],
      isVerified: true,
      isActive: true,
      deliveryAreas: ['All areas'],
      estimatedDeliveryDays: 5 + (i % 3),
      foundingSeller: i < 5,
      totalSalesAmount: i < 5 ? 60000 : 20000,
    });
  }

  await Seller.insertMany(sellers);
  logger.info(`${sellers.length} sellers created`);
  return await Seller.find();
};

const seedProducts = async (sellers) => {
  const products = [];
  const categories = ['ethnic', 'western', 'fusion', 'accessories', 'footwear', 'jewelry'];
  
  const productNames = {
    ethnic: ['Silk Saree', 'Cotton Kurta', 'Anarkali Suit', 'Lehenga Choli', 'Palazzo Set'],
    western: ['Denim Jeans', 'Casual Shirt', 'Summer Dress', 'Blazer', 'T-Shirt'],
    fusion: ['Indo-Western Gown', 'Fusion Kurta', 'Contemporary Saree', 'Jacket Dress'],
    accessories: ['Handbag', 'Sunglasses', 'Watch', 'Belt', 'Scarf'],
    footwear: ['Sneakers', 'Sandals', 'Heels', 'Boots', 'Flats'],
    jewelry: ['Necklace', 'Earrings', 'Bracelet', 'Ring', 'Anklet'],
  };

  for (const seller of sellers) {
    const sellerCategories = seller.categories;
    
    for (let i = 0; i < 7; i++) {
      const category = sellerCategories[i % sellerCategories.length];
      const names = productNames[category];
      
      products.push({
        sellerId: seller._id,
        productName: `${names[i % names.length]} ${i + 1}`,
        description: `Beautiful ${category} item perfect for any occasion. High quality material and craftsmanship.`,
        category,
        price: 500 + (i * 200) + Math.floor(Math.random() * 1000),
        compareAtPrice: 800 + (i * 200) + Math.floor(Math.random() * 1000),
        photos: [{
          originalUrl: 'https://via.placeholder.com/800',
          optimizedUrl: 'https://via.placeholder.com/800',
          thumbnailUrl: 'https://via.placeholder.com/200',
          mediumUrl: 'https://via.placeholder.com/600',
          largeUrl: 'https://via.placeholder.com/1200',
          displayOrder: 0,
        }],
        sizesAvailable: ['S', 'M', 'L', 'XL'],
        stockQuantity: 10 + (i * 5),
        isInStock: true,
        tags: [category, 'trending', 'new arrival', 'bestseller'],
        isLive: true,
        viewCount: Math.floor(Math.random() * 500),
        cartAddCount: Math.floor(Math.random() * 100),
        purchaseCount: Math.floor(Math.random() * 50),
      });
    }
  }

  await Product.insertMany(products);
  logger.info(`${products.length} products created`);
  return await Product.find();
};

const seedOrders = async (users, sellers, products) => {
  const orders = [];
  const statuses = ['placed', 'confirmed', 'shipped', 'delivered'];
  const paymentMethods = ['upi', 'card', 'cod'];

  for (let i = 0; i < 200; i++) {
    const buyer = users[15 + (i % 35)];
    const seller = sellers[i % sellers.length];
    const product = products[i % products.length];
    
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 90));

    orders.push({
      buyerId: buyer._id,
      sellerId: seller._id,
      items: [{
        productId: product._id,
        productNameSnapshot: product.productName,
        selectedSize: 'M',
        quantity: 1 + (i % 3),
        unitPrice: product.price,
        productPhotoSnapshot: product.photos[0].optimizedUrl,
      }],
      orderTotal: product.price * (1 + (i % 3)),
      paymentMethod: paymentMethods[i % 3],
      paymentStatus: 'paid',
      deliveryAddress: {
        fullName: buyer.fullName,
        phone: buyer.phoneNumber,
        addressLine1: '123 Main Street',
        city: buyer.city,
        pincode: '500001',
      },
      deliveryStatus: statuses[i % 4],
      createdAt: orderDate,
      updatedAt: orderDate,
    });
  }

  await Order.insertMany(orders);
  logger.info(`${orders.length} orders created`);
};

const seedSearchLogs = async (users, products) => {
  const searchQueries = [
    'ethnic wear', 'party dress', 'casual shirt', 'wedding saree',
    'summer collection', 'designer kurta', 'formal wear', 'festive collection',
    'denim jeans', 'silk saree', 'cotton kurta', 'fusion wear',
    'accessories', 'footwear', 'jewelry', 'handbags',
  ];

  const logs = [];

  for (let i = 0; i < 500; i++) {
    const user = users[15 + (i % 35)];
    const query = searchQueries[i % searchQueries.length];
    
    logs.push({
      userId: user._id,
      searchQuery: query,
      searchType: i % 3 === 0 ? 'photo' : 'text',
      city: user.city,
      resultsCount: 10 + Math.floor(Math.random() * 40),
      productsClicked: [products[i % products.length]._id],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    });
  }

  await SearchLog.insertMany(logs);
  logger.info(`${logs.length} search logs created`);
};

const seedDatabase = async () => {
  try {
    await connectDB();

    logger.info('Clearing existing data...');
    await User.deleteMany({});
    await Seller.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await SearchLog.deleteMany({});

    logger.info('Seeding users...');
    const users = await seedUsers();

    logger.info('Seeding sellers...');
    const sellers = await seedSellers(users);

    logger.info('Seeding products...');
    const products = await seedProducts(sellers);

    logger.info('Seeding orders...');
    await seedOrders(users, sellers, products);

    logger.info('Seeding search logs...');
    await seedSearchLogs(users, products);

    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
