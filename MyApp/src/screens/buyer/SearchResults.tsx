import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import { productService } from '../../services';
import { Product } from '../../services';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants';
import { Header, ProductCard, CategoryChips } from '../../components';
import { useUserStore } from '../../store';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - Layout.horizontalPadding * 2 - Spacing.sm) / COLUMN_COUNT;

const filterCategories = ['Price', 'City', 'Size', 'Color', 'Delivery', 'Sort'];

const SearchResultsScreen = ({ route, navigation }: any) => {
  const { query } = route.params || {};
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const { isSaved, addToSavedItems, removeFromSavedItems } = useUserStore();

  React.useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery]);

  const performSearch = async () => {
    setLoading(true);
    const results = await productService.searchProducts(searchQuery, {});
    setProducts(results);
    setLoading(false);
  };

  const handleSearch = () => {
    performSearch();
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

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
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

  const productCount = products.length;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor={Colors.warmGrey}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Summary */}
      {searchQuery && (
        <Text style={styles.aiSummary}>
          Showing {productCount} products for "{searchQuery}"
        </Text>
      )}

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {filterCategories.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilters.includes(filter) && styles.activeFilterChip,
            ]}
            onPress={() => toggleFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilters.includes(filter) && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try a different search</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmCream,
  },
  searchHeader: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.warmCream,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.lg,
    height: 44,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.darkText,
  },
  searchIcon: {
    fontSize: 18,
  },
  aiSummary: {
    ...Typography.label,
    fontStyle: 'italic',
    color: Colors.warmGrey,
    marginHorizontal: Layout.screenPadding,
    marginVertical: Spacing.md,
    fontSize: 13,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    borderRadius: BorderRadius.button,
    backgroundColor: Colors.white,
  },
  activeFilterChip: {
    backgroundColor: Colors.darkText,
    borderColor: Colors.darkText,
  },
  filterText: {
    ...Typography.labelSmall,
    color: Colors.darkText,
  },
  activeFilterText: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: Layout.horizontalPadding - Spacing.sm / 2,
    paddingBottom: Spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.darkText,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.warmGrey,
  },
});

export default SearchResultsScreen;
