import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants';
import { Header } from '../../components';

const categories = ['Ethnic', 'Western', 'Kurtas', 'Dresses', 'Festive', 'Accessories', 'Shoes'];
const occasions = ['Wedding', 'Casual', 'Office', 'Party', 'Festive', 'Vacation'];

const SearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Diwali party dress',
    'Minimalist white shirt',
    'Office wear',
  ]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add to recent searches
      setRecentSearches((prev) => [
        searchQuery,
        ...prev.filter((s) => s !== searchQuery),
      ].slice(0, 5));
      
      // Navigate to results
      navigation.navigate('SearchResults', { query: searchQuery });
      setSearchQuery('');
    }
  };

  const handleCategoryPress = (category: string) => {
    navigation.navigate('SearchResults', { query: category });
  };

  const handleOccasionPress = (occasion: string) => {
    navigation.navigate('SearchResults', { query: `${occasion} outfit` });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showLogo />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by item, occasion, style..."
              placeholderTextColor={Colors.warmGrey}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <View style={styles.recentSearches}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => {
                    setSearchQuery(search);
                    navigation.navigate('SearchResults', { query: search });
                  }}
                >
                  <Text style={styles.recentSearchText}>🕐 {search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryEmoji}>
                  <Text style={styles.categoryEmojiText}>👗</Text>
                </View>
                <Text style={styles.categoryName}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Occasions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Occasion</Text>
          <View style={styles.occasionsGrid}>
            {occasions.map((occasion) => (
              <TouchableOpacity
                key={occasion}
                style={styles.occasionButton}
                onPress={() => handleOccasionPress(occasion)}
                activeOpacity={0.7}
              >
                <Text style={styles.occasionText}>{occasion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.trendingList}>
            {['Saree Trends', 'Minimalist Fashion', 'Sustainable Fashion', 'Bold Colors'].map(
              (trend, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.trendingItem}
                  onPress={() => {
                    navigation.navigate('SearchResults', { query: trend });
                  }}
                >
                  <Text style={styles.trendingNumber}>{index + 1}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trendingName}>{trend}</Text>
                    <Text style={styles.trendingCount}>2.4k searching</Text>
                  </View>
                  <Text style={styles.trendingArrow}>›</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmCream,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
  },
  searchSection: {
    paddingVertical: Spacing.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  searchIcon: {
    fontSize: 20,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.darkText,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.darkText,
  },
  seeAllLink: {
    ...Typography.label,
    color: Colors.warmGold,
  },
  recentSearches: {
    gap: Spacing.sm,
  },
  recentSearchItem: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  recentSearchText: {
    ...Typography.body,
    color: Colors.darkText,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  categoryEmoji: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.warmCream,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryEmojiText: {
    fontSize: 28,
  },
  categoryName: {
    ...Typography.labelSmall,
    color: Colors.darkText,
    textAlign: 'center',
  },
  occasionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  occasionButton: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  occasionText: {
    ...Typography.label,
    color: Colors.darkText,
  },
  trendingList: {
    gap: Spacing.md,
  },
  trendingItem: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: BorderRadius.card,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  trendingNumber: {
    ...Typography.h3,
    color: Colors.warmGold,
    marginRight: Spacing.lg,
    minWidth: 40,
    textAlign: 'center',
  },
  trendingName: {
    ...Typography.label,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
  },
  trendingCount: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
  },
  trendingArrow: {
    ...Typography.body,
    color: Colors.warmGrey,
    fontSize: 20,
  },
});

export default SearchScreen;
