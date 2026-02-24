import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useUserStore } from '../store';
import { productService, mockProducts } from '../services';
import { Product } from '../services';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../constants';
import { Header, ProductCard, CategoryChips } from '../components';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - Layout.horizontalPadding * 2 - Spacing.sm) / COLUMN_COUNT;

const categories = ['All', 'Trending', 'Ethnic', 'Western', 'Kurtas', 'Dresses', 'Festive', 'Formal', 'Accessories', 'Shoes', 'Bags'];

const searchPlaceholders = [
  'Search by occasion or style...',
  'Try: outfit for Diwali night',
  'Try: casual office look',
];

const HomeScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { cart, addToSavedItems, removeFromSavedItems, isSaved, user } = useUserStore();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getHomeFeed(1, 20);
    setProducts(data);
    setLoading(false);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleHeartPress = (productId: string) => {
    if (isSaved(productId)) {
      removeFromSavedItems(productId);
    } else {
      addToSavedItems(productId);
    }
  };

  const handleSnapPress = () => {
    navigation.navigate('Snap');
  };

  const handleNotificationPress = () => {
    // Navigate to notifications (not implemented)
  };

  const handleCartPress = () => {
    navigation.navigate('Profile', { screen: 'Cart' });
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => {
    const isEven = index % 2 === 0;
    const height = isEven ? 380 : 340;
    return (
      <View
        style={{
          width: ITEM_WIDTH,
          paddingHorizontal: Spacing.sm / 2,
          marginBottom: Spacing.lg,
        }}
      >
        <ProductCard
          product={item}
          onPress={handleProductPress}
          onHeartPress={handleHeartPress}
          isSaved={isSaved(item.id)}
          height={height}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showLogo
        cartCount={cart.length}
        onCartPress={handleCartPress}
        onNotificationPress={handleNotificationPress}
      />

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <View>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholders[placeholderIndex]}
                placeholderTextColor={Colors.warmGrey}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => {
                  if (searchQuery.trim()) {
                    navigation.navigate('Search', { query: searchQuery });
                  }
                }}
              />
              <TouchableOpacity
                onPress={handleSnapPress}
                style={styles.cameraButton}
              >
                <Text style={styles.cameraIcon}>📷</Text>
              </TouchableOpacity>
            </View>

            {/* Category Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesScroll}
              contentContainerStyle={styles.categoriesContent}
            >
              <CategoryChips
                categories={categories}
                activeCategory={activeCategory}
                onCategoryPress={setActiveCategory}
              />
            </ScrollView>
          </View>
        }
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmCream,
  },
  listContent: {
    paddingHorizontal: Layout.horizontalPadding - Spacing.sm / 2,
    paddingBottom: Spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Layout.horizontalPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.warmCream,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.lg,
    ...Typography.body,
    color: Colors.darkText,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.input,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 20,
  },
  categoriesScroll: {
    backgroundColor: Colors.warmCream,
  },
  categoriesContent: {
    paddingHorizontal: Layout.horizontalPadding,
    paddingVertical: Spacing.sm,
  },
});

export default HomeScreen;
