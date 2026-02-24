import axios from 'axios';
import { Product, mockProducts, generateMockProducts } from './mockData';

const API_BASE_URL = 'https://api.drape.local'; // Placeholder

export const productService = {
  // Get featured/home feed products
  getHomeFeed: async (page: number = 1, limit: number = 20): Promise<Product[]> => {
    // In production, this would be: GET /api/products/feed?page=page&limit=limit
    return new Promise((resolve) => {
      setTimeout(() => {
        const startId = (page - 1) * limit;
        resolve(generateMockProducts(startId, limit));
      }, 300);
    });
  },

  // Search products
  searchProducts: async (query: string, filters?: any): Promise<Product[]> => {
    // In production: POST /api/products/search with query and filters
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock search - filters by category or name
        const results = mockProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()) ||
            p.styleTags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(results.length > 0 ? results : generateMockProducts(0, 10));
      }, 300);
    });
  },

  // Get product detail
  getProduct: async (productId: string): Promise<Product> => {
    // In production: GET /api/products/:productId
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts[0];
        resolve({ ...product, id: productId });
      }, 200);
    });
  },

  // Get by category
  getByCategory: async (category: string, page: number = 1): Promise<Product[]> => {
    // In production: GET /api/products/category/:category
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockProducts.filter((p) => p.category === category);
        resolve(filtered.length > 0 ? filtered : generateMockProducts((page - 1) * 20, 20));
      }, 300);
    });
  },

  // Get trending products
  getTrending: async (page: number = 1): Promise<Product[]> => {
    // In production: GET /api/products/trending
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockProducts((page - 1) * 20, 20));
      }, 300);
    });
  },

  // Get AI recommendations
  getAIRecommendations: async (userPreferences: any): Promise<Product[]> => {
    // In production: POST /api/products/recommendations with user style preferences
    return new Promise((resolve) => {
      setTimeout(() => {
        const recommended = mockProducts.filter((p) => p.aiRecommended);
        resolve(recommended.length > 0 ? recommended : mockProducts);
      }, 300);
    });
  },

  // Snap/Image recognition
  recognizeOutfit: async (imageBase64: string): Promise<any> => {
    // In production: POST /api/ai/recognize-outfit with image data
    // This would use a computer vision API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          items: [
            { name: 'Floral Print Saree', confidence: 96, tags: ['Floral Print', 'Midi Length', 'Chiffon'] },
          ],
          productMatches: mockProducts.slice(0, 5),
        });
      }, 2000);
    });
  },

  // Virtual try-on
  getVirtualTryOn: async (productId: string, userPhoto?: string): Promise<any> => {
    // In production: POST /api/ai/virtual-tryon with product and optionally user photo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          tryOnImage: 'https://images.unsplash.com/photo-1508762969727-fef4d82eafca?w=400&h=600&fit=crop',
        });
      }, 1000);
    });
  },
};

export const userService = {
  // Send OTP
  sendOTP: async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
    // In production: POST /api/auth/send-otp
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'OTP sent successfully' });
      }, 500);
    });
  },

  // Verify OTP
  verifyOTP: async (phoneNumber: string, otp: string): Promise<{ success: boolean; token?: string }> => {
    // In production: POST /api/auth/verify-otp
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock: accept any OTP for demo
        if (otp.length >= 4) {
          resolve({ success: true, token: 'mock_jwt_token_' + Date.now() });
        } else {
          resolve({ success: false });
        }
      }, 500);
    });
  },

  // Get user profile
  getUserProfile: async (userId: string): Promise<any> => {
    // In production: GET /api/users/:userId
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          name: 'Sarah Johnson',
          phoneNumber: '9876543210',
          city: 'Hyderabad',
          orders: 5,
          savedItems: 12,
          cashbackEarned: 450,
          rating: 4.6,
        });
      }, 300);
    });
  },
};

export const orderService = {
  // Create order
  createOrder: async (items: any[], address: any, paymentMethod: string): Promise<{ success: boolean; orderId?: string }> => {
    // In production: POST /api/orders
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderId = 'ORD' + Date.now();
        resolve({ success: true, orderId });
      }, 500);
    });
  },

  // Get order details
  getOrder: async (orderId: string): Promise<any> => {
    // In production: GET /api/orders/:orderId
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: orderId,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        });
      }, 300);
    });
  },
};

export default {
  productService,
  userService,
  orderService,
};
