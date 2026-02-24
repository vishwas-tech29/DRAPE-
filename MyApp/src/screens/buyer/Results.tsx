import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { productService, mockProducts } from '../../services';
import { Product } from '../../services';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants';
import { Header, ProductCard, Button } from '../../components';

const { width } = Dimensions.get('window');

const ResultsScreen = ({ route, navigation }: any) => {
  const { detectedItems } = route.params || {};
  const [exactMatches, setExactMatches] = useState<Product[]>([]);
  const [styleItWith, setStyleItWith] = useState<Product[]>([]);
  const [similarVibes, setSimilarVibes] = useState<Product[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    // Load mock results
    const matches = mockProducts.slice(0, 3);
    const accessories = mockProducts.slice(3, 6);
    const similar = mockProducts.slice(1, 4);

    setExactMatches(matches);
    setStyleItWith(accessories);
    setSimilarVibes(similar);
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const handleVirtualTryOn = () => {
    navigation.navigate('VirtualTryOn', { product: exactMatches[0] });
  };

  const renderHorizontalProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => handleProductPress(item)}
      style={styles.horizontalCard}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.horizontalImage}
        resizeMode="cover"
      />
      <Text style={styles.horizontalProductName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.horizontalPrice}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  const renderSimilarVibes = ({ item, index }: { item: Product; index: number }) => {
    const isRightColumn = index % 2 === 1;
    return (
      <View style={{ flex: isRightColumn ? 0.52 : 0.48, marginRight: isRightColumn ? 0 : Spacing.sm }}>
        <TouchableOpacity
          onPress={() => handleProductPress(item)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.vibeImage}
            resizeMode="cover"
          />
          <View style={styles.vibeInfo}>
            <Text style={styles.vibeProductName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.vibePrice}>₹{item.price}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const firstMatch = exactMatches[0];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Detected Item Summary */}
        {firstMatch && (
          <View style={styles.detectedCard}>
            <Image
              source={{ uri: firstMatch.image }}
              style={styles.detectedThumbnail}
              resizeMode="cover"
            />
            <View style={styles.detectedInfo}>
              <Text style={styles.detectedName}>{firstMatch.name}</Text>
              <View style={styles.tagsRow}>
                {firstMatch.styleTags.slice(0, 2).map((tag, index) => (
                  <View key={index} style={styles.styleTag}>
                    <Text style={styles.styleTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.confidenceBar}>
                <View style={[styles.confidenceFill, { width: '96%' }]} />
              </View>
              <Text style={styles.confidenceText}>96% match</Text>
            </View>
          </View>
        )}

        {/* Virtual Try-On Button */}
        <Button
          title="Virtual Try-On"
          variant="secondary"
          size="large"
          onPress={handleVirtualTryOn}
          style={styles.tryOnButton}
        />

        {/* Exact Matches Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exact Matches</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={exactMatches}
            renderItem={renderHorizontalProduct}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={styles.horizontalScroll}
          />
        </View>

        {/* Style It With Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Style It With</Text>
          </View>
          <FlatList
            horizontal
            data={styleItWith}
            renderItem={renderHorizontalProduct}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={styles.horizontalScroll}
          />
        </View>

        {/* Similar Vibes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Similar Vibes</Text>
          <View style={styles.vibesGrid}>
            {similarVibes.map((item, index) => (
              <View key={item.id} style={styles.vibeWrapper}>
                {renderSimilarVibes({ item, index })}
              </View>
            ))}
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
  detectedCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginVertical: Spacing.xl,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.softBorder,
    alignItems: 'center',
    gap: Spacing.lg,
  },
  detectedThumbnail: {
    width: 80,
    height: 120,
    borderRadius: BorderRadius.card,
  },
  detectedInfo: {
    flex: 1,
  },
  detectedName: {
    ...Typography.label,
    color: Colors.darkText,
    marginBottom: Spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  styleTag: {
    backgroundColor: Colors.warmCream,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.button,
  },
  styleTagText: {
    ...Typography.labelSmall,
    color: Colors.darkText,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: Colors.softBorder,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.warmGold,
  },
  confidenceText: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
  },
  tryOnButton: {
    marginBottom: Spacing.xl,
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
  horizontalScroll: {
    gap: Spacing.lg,
  },
  horizontalCard: {
    width: 140,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  horizontalImage: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.warmCream,
  },
  horizontalProductName: {
    ...Typography.labelSmall,
    color: Colors.darkText,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  horizontalPrice: {
    ...Typography.labelSmall,
    color: Colors.darkText,
    fontWeight: '600',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  vibeWrapper: {
    width: '48.5%',
  },
  vibeImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.card,
    backgroundColor: Colors.warmCream,
  },
  vibeInfo: {
    paddingVertical: Spacing.sm,
  },
  vibeProductName: {
    ...Typography.labelSmall,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
  },
  vibePrice: {
    ...Typography.labelSmall,
    color: Colors.darkText,
    fontWeight: '600',
  },
});

export default ResultsScreen;
