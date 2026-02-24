import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Layout } from '../constants';
import { Product } from '../services';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onHeartPress?: (productId: string) => void;
  isSaved?: boolean;
  style?: ViewStyle;
  height?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onHeartPress,
  isSaved = false,
  style,
  height = 350,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { minHeight: height }, style]}
      onPress={() => onPress(product)}
      activeOpacity={0.8}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Local Badge */}
        {product.isLocal && (
          <View style={styles.localBadge}>
            <Text style={styles.localBadgeText}>
              Local · {product.shopCity.substring(0, 3).toUpperCase()}
            </Text>
          </View>
        )}

        {/* AI Recommended Indicator */}
        {product.aiRecommended && (
          <View style={styles.aiIndicator} />
        )}

        {/* Heart Button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => onHeartPress?.(product.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={{ fontSize: 20 }}>
            {isSaved ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.shopName} numberOfLines={1}>
          {product.shopName}
        </Text>
        <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  imageContainer: {
    position: 'relative',
    flex: 1,
    backgroundColor: Colors.warmCream,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  localBadge: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.small,
  },
  localBadgeText: {
    ...Typography.labelSmall,
    color: Colors.white,
  },
  aiIndicator: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warmGold,
  },
  heartButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 36,
    height: 36,
    backgroundColor: Colors.white,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  info: {
    padding: Spacing.md,
    flex: 0,
  },
  productName: {
    ...Typography.label,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 13,
  },
  shopName: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
    marginBottom: Spacing.xs,
  },
  price: {
    ...Typography.bodyBold,
    color: Colors.darkText,
    fontSize: 14,
  },
});

export default ProductCard;
