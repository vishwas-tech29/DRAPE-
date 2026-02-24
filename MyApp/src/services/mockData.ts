export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  shopName: string;
  shopCity: 'Hyderabad' | 'Bangalore';
  rating: number;
  colors: { name: string; hex: string; image?: string }[];
  sizes: string[];
  description: string;
  isLocal: boolean;
  aiRecommended: boolean;
  styleTags: string[];
  category: string;
  isFestive?: boolean;
}

// Mock product data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Floral Chiffon Saree',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1594049298812-4bd3a3a6ca13?w=400&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594049298812-4bd3a3a6ca13?w=400&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562777286-32b3a6c32e8e?w=400&h=600&fit=crop',
    ],
    shopName: 'Textile Wonders HYD',
    shopCity: 'Hyderabad',
    rating: 4.8,
    colors: [
      { name: 'Peach', hex: '#FDBCB4' },
      { name: 'Navy', hex: '#001f3f' },
      { name: 'Emerald', hex: '#50C878' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Elegant chiffon saree with hand-printed floral motifs. Perfect for weddings and festivals.',
    isLocal: true,
    aiRecommended: true,
    styleTags: ['Floral Print', 'Midi Length', 'Chiffon'],
    category: 'Ethnic',
  },
  {
    id: '2',
    name: 'Minimalist White Shirt',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop',
    ],
    shopName: 'Modern Edit BLR',
    shopCity: 'Bangalore',
    rating: 4.6,
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Sage', hex: '#9CAF88' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Clean lines and premium cotton. A wardrobe essential.',
    isLocal: true,
    aiRecommended: false,
    styleTags: ['Minimal', 'Cotton', 'Crisp'],
    category: 'Western',
  },
  {
    id: '3',
    name: 'Fusion Kurta with Print',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1584788411531-3015fb5d1f63?w=400&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1584788411531-3015fb5d1f63?w=400&h=600&fit=crop',
    ],
    shopName: 'Fusion House HYD',
    shopCity: 'Hyderabad',
    rating: 4.7,
    colors: [
      { name: 'Indigo Print', hex: '#4B0082' },
      { name: 'Rust', hex: '#B7410E' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Contemporary kurta blending traditional prints with modern silhouette.',
    isLocal: true,
    aiRecommended: true,
    styleTags: ['Fusion', 'Print', 'Comfortable'],
    category: 'Fusion',
  },
  {
    id: '4',
    name: 'Gold Statement Earrings',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=600&fit=crop',
    ],
    shopName: 'Jewelry Box BLR',
    shopCity: 'Bangalore',
    rating: 4.9,
    colors: [
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Rose Gold', hex: '#B76E79' },
    ],
    sizes: ['One Size'],
    description: 'Elegant gold-plated statement earrings for special occasions.',
    isLocal: true,
    aiRecommended: false,
    styleTags: ['Jewelry', 'Gold', 'Statement'],
    category: 'Accessories',
  },
  {
    id: '5',
    name: 'Black Leather Heels',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=600&fit=crop',
    ],
    shopName: 'Step Style HYD',
    shopCity: 'Hyderabad',
    rating: 4.5,
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Nude', hex: '#E1C4A6' },
    ],
    sizes: ['5', '6', '7', '8', '9', '10'],
    description: 'Classic black leather heels, versatile for any occasion.',
    isLocal: true,
    aiRecommended: false,
    styleTags: ['Heels', 'Leather', 'Classic'],
    category: 'Shoes',
  },
  {
    id: '6',
    name: 'Festive Lehenga',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1610397777338-eaf40b76e92f?w=400&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610397777338-eaf40b76e92f?w=400&h=600&fit=crop',
    ],
    shopName: 'Festival Wear BLR',
    shopCity: 'Bangalore',
    rating: 4.8,
    colors: [
      { name: 'Maroon', hex: '#800000' },
      { name: 'Gold', hex: '#FFD700' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Beautifully embroidered lehenga for weddings and festivities.',
    isLocal: true,
    aiRecommended: true,
    styleTags: ['Festive', 'Embroidered', 'Traditional'],
    category: 'Festive',
    isFestive: true,
  },
];

// Mock data generator for pagination
export const generateMockProducts = (startId: number, count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => {
    const baseIndex = (startId + i) % mockProducts.length;
    const baseProduct = mockProducts[baseIndex];
    return {
      ...baseProduct,
      id: String(startId + i),
      name: `${baseProduct.name} ${startId + i}`,
    };
  });
};
