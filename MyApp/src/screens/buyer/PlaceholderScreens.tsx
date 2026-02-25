import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useUserStore } from '../../store';
import { Product } from '../../services';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants';
import { Button, Header, ColorSwatch, SizeButton } from '../../components';
export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product } = route.params as { product: Product };
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, isSaved, addToSavedItems, removeFromSavedItems } = useUserStore();

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
      size: selectedSize,
      color: selectedColor.name,
      price: product.price,
    });
    alert('Added to cart!');
  };

  const handleTryOn = () => {
    navigation.navigate('VirtualTryOn', { product });
  };

  const handleWishlist = () => {
    if (isSaved(product.id)) {
      removeFromSavedItems(product.id);
    } else {
      addToSavedItems(product.id);
    }
  };

  const handleShare = () => {
    alert('Share functionality coming soon');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        rightComponent={
          <TouchableOpacity onPress={handleShare}>
            <Text style={styles.shareIcon}>↗</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Image and Thumbnails */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: product.images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          <FlatList
            horizontal
            data={product.images}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.selectedThumbnail,
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image source={{ uri: item }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            )}
            keyExtractor={(_, i) => i.toString()}
            scrollEnabled={product.images.length > 3}
            contentContainerStyle={styles.thumbnailsContainer}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>
          </View>

          {/* Color Selection */}
          <View style={styles.selectorSection}>
            <Text style={styles.selectorLabel}>Color</Text>
            <FlatList
              horizontal
              data={product.colors}
              renderItem={({ item }) => (
                <ColorSwatch
                  name={item.name}
                  hex={item.hex}
                  selected={selectedColor.hex === item.hex}
                  onPress={() => setSelectedColor(item)}
                />
              )}
              keyExtractor={(item) => item.hex}
              scrollEnabled={false}
              contentContainerStyle={styles.colorRow}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Size Selection */}
          <View style={styles.selectorSection}>
            <Text style={styles.selectorLabel}>Size</Text>
            <FlatList
              horizontal
              data={product.sizes}
              renderItem={({ item }) => (
                <SizeButton
                  size={item}
                  selected={selectedSize === item}
                  onPress={() => setSelectedSize(item)}
                />
              )}
              keyExtractor={(item) => item}
              scrollEnabled={false}
              contentContainerStyle={styles.sizeRow}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>

          {/* Seller Info */}
          <View style={styles.sellerSection}>
            <View>
              <Text style={styles.sellerName}>{product.shopName}</Text>
              <Text style={styles.sellerCity}>{product.shopCity}</Text>
            </View>
            <Text style={styles.rating}>⭐ {product.rating}</Text>
          </View>

          <TouchableOpacity style={styles.viewShopButton}>
            <Text style={styles.viewShopText}>View Shop</Text>
          </TouchableOpacity>

          <Button
            title="Message Seller"
            variant="outline"
            size="large"
            onPress={() => alert('WhatsApp message coming soon')}
            style={styles.messageButton}
          />

          {/* Try On Button */}
          <Button
            title="Virtual Try-On"
            variant="secondary"
            size="large"
            onPress={handleTryOn}
            style={styles.tryOnButton}
          />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlist}
        >
          <Text style={styles.wishlistIcon}>
            {isSaved(product.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
        <Button
          title="Add to Cart"
          variant="primary"
          size="large"
          onPress={handleAddToCart}
          style={styles.addToCartButton}
        />
      </View>
    </SafeAreaView>
  );
};

// Virtual Try-On Screen
export const VirtualTryOnScreen = ({ route, navigation }: any) => {
  const { product } = route.params as { product: Product };
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const handleBuyNow = () => {
    alert('Proceeding to checkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Virtual Try-On"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Try-On Stage */}
        <View style={styles.tryOnStage}>
          <Image
            source={{ uri: product.image }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          <View style={styles.fittedBadge}>
            <Text style={styles.fittedBadgeText}>AI Fitted</Text>
          </View>
        </View>

        {/* Color Selection */}
        <View style={styles.selectorSection}>
          <Text style={styles.selectorLabel}>Color</Text>
          <FlatList
            horizontal
            data={product.colors}
            renderItem={({ item }) => (
              <ColorSwatch
                name={item.name}
                hex={item.hex}
                selected={selectedColor.hex === item.hex}
                onPress={() => setSelectedColor(item)}
              />
            )}
            keyExtractor={(item) => item.hex}
            scrollEnabled={false}
            contentContainerStyle={styles.colorRow}
          />
        </View>

        {/* Size Selection */}
        <View style={styles.selectorSection}>
          <Text style={styles.selectorLabel}>Size</Text>
          <FlatList
            horizontal
            data={product.sizes}
            renderItem={({ item }) => (
              <SizeButton
                size={item}
                selected={selectedSize === item}
                onPress={() => setSelectedSize(item)}
              />
            )}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            contentContainerStyle={styles.sizeRow}
          />
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>₹{product.price.toLocaleString()}</Text>
          </View>
          <View style={styles.cashbackSection}>
            <Text style={styles.cashbackText}>ℹ️ You earn ₹{Math.round(product.price * 0.1)} cashback</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Buy Now"
            variant="primary"
            size="large"
            onPress={handleBuyNow}
            style={{ flex: 1 }}
          />
          <Button
            title="See Similar"
            variant="outline"
            size="large"
            onPress={() => navigation.goBack()}
            style={{ flex: 1, marginLeft: Spacing.md }}
          />
        </View>

        <Button
          title="Try With Your Photo"
          variant="ghost"
          size="large"
          onPress={() => alert('Photo upload coming soon')}
          style={styles.tryPhotoButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Cart Screen
export const CartScreen = ({ navigation }: any) => {
  const { cart, removeFromCart, getCartTotal } = useUserStore();

  return (
    <SafeAreaView style={styles.container}>
      <Header showBack onBackPress={() => navigation.goBack()} title="Cart" />
      <View style={styles.content}>
        {cart.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <Text style={styles.itemName}>Product {item.productId}</Text>
                  <Text style={styles.itemSize}>{item.size} • {item.color}</Text>
                  <View style={styles.itemFooter}>
                    <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.productId)}>
                      <Text style={styles.removeIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.productId}
            />

            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{getCartTotal().toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>Charged by seller</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{getCartTotal().toLocaleString()}</Text>
              </View>
            </View>

            <Button
              title="Proceed to Checkout"
              variant="primary"
              size="large"
              onPress={() => navigation.navigate('Checkout')}
              style={styles.checkoutButton}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

// Checkout Screen
export const CheckoutScreen = ({ navigation }: any) => {
  const { getCartTotal } = useUserStore();

  const handlePlaceOrder = () => {
    navigation.replace('OrderSuccess');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showBack onBackPress={() => navigation.goBack()} title="Checkout" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity><Text style={styles.changeLink}>Change</Text></TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>123 Fashion Street, Hyderabad, 500001</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentLabel}>🔘 UPI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentLabel}>⭕ Debit/Credit Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentLabel}>⭕ Cash on Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{getCartTotal().toLocaleString()}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{getCartTotal().toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <Button
          title="Place Order"
          variant="primary"
          size="large"
          onPress={handlePlaceOrder}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

// Order Success Screen
export const OrderSuccessScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.orderNumber}>ORD123456789</Text>
          <Text style={styles.deliveryText}>Estimated delivery in 5-7 days</Text>

          <View style={styles.successButtonGroup}>
            <Button
              title="Track Order"
              variant="primary"
              size="large"
              onPress={() => alert('Tracking coming soon')}
              style={styles.successButton}
            />
            <Button
              title="Continue Shopping"
              variant="outline"
              size="large"
              onPress={() => navigation.replace('Home')}
              style={styles.successButton}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Saved Boards Screen
export const SavedBoardsScreen = ({ navigation }: any) => {
  const boards = [
    { id: '1', name: 'Wedding Wear', items: 12 },
    { id: '2', name: 'Casual Vibes', items: 8 },
    { id: '3', name: 'Festive Looks', items: 15 },
    { id: '4', name: 'Office Outfits', items: 6 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header showLogo cartCount={0} />
      <View style={styles.content}>
        <View style={styles.boardsHeader}>
          <Text style={styles.boardsTitle}>My Boards</Text>
          <TouchableOpacity style={styles.addBoardButton}>
            <Text style={styles.addBoardIcon}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={boards}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.boardCard}>
              <View style={styles.boardPreview}>
                {Array(4).fill(0).map((_, i) => (
                  <View key={i} style={styles.boardItem} />
                ))}
              </View>
              <Text style={styles.boardName}>{item.name}</Text>
              <Text style={styles.boardCount}>{item.items} items</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          columnWrapperStyle={styles.boardsGrid}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
        />
      </View>
    </SafeAreaView>
  );
};

// Profile Screen
export const ProfileScreen = ({ navigation }: any) => {
  const { user, logout, setAppMode } = useUserStore();

  const handleSwitchMode = () => {
    logout();
    setAppMode(user?.id ? 'selling' : 'shopping');
    navigation.replace('ModeSelection');
  };

  const menuItems = [
    { icon: '📦', label: 'My Orders', onPress: () => {} },
    { icon: '❤️', label: 'My Wishlist', onPress: () => {} },
    { icon: '🎁', label: 'Refer and Earn', onPress: () => {} },
    { icon: '⚙️', label: 'Style Preferences', onPress: () => {} },
    { icon: '🔔', label: 'Notifications', onPress: () => {} },
    { icon: '❓', label: 'Help', onPress: () => {} },
    { icon: '🏪', label: 'Switch to Seller Mode', onPress: handleSwitchMode },
    { icon: '🚪', label: 'Sign Out', onPress: logout },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header showLogo cartCount={0} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarInitial}>S</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.profileCity}>{user?.city || 'City'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹0</Text>
            <Text style={styles.statLabel}>Cashback</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, index === menuItems.length - 1 && styles.lastMenuItem]}
              onPress={item.onPress}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SearchScreen = ({ navigation }: any) => <PlaceholderScreen title="Search" />;
const SearchResultsScreen = ({ navigation }: any) => <PlaceholderScreen title="Search Results" />;
const SnapScreen = ({ navigation }: any) => <PlaceholderScreen title="Snap" />;
const AIScanningScreen = ({ navigation }: any) => <PlaceholderScreen title="AI Scanning" />;
const ResultsScreen = ({ navigation }: any) => <PlaceholderScreen title="Results" />;

const PlaceholderScreen = ({ title }: { title: string }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Screen content coming soon...</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmCream,
  },
  content: {
    flex: 1,
    paddingHorizontal: Layout.screenPadding,
  },
  title: {
    ...Typography.h2,
    color: Colors.darkText,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.warmGrey,
  },
  // Product Detail Styles
  imageSection: {
    marginBottom: Spacing.xl,
  },
  mainImage: {
    width: '100%',
    height: 400,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    marginBottom: Spacing.md,
  },
  thumbnailsContainer: {
    gap: Spacing.sm,
    paddingHorizontal: Layout.screenPadding,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: Colors.warmGold,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    paddingHorizontal: Layout.screenPadding,
  },
  productName: {
    ...Typography.h3Italic,
    color: Colors.darkText,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  price: {
    ...Typography.bodyBold,
    fontSize: 20,
    color: Colors.darkText,
  },
  selectorSection: {
    marginBottom: Spacing.xl,
  },
  selectorLabel: {
    ...Typography.label,
    color: Colors.darkText,
    marginBottom: Spacing.md,
  },
  colorRow: {
    gap: Spacing.lg,
  },
  sizeRow: {
    gap: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.warmGrey,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  sellerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.softBorder,
    marginBottom: Spacing.xl,
  },
  sellerName: {
    ...Typography.label,
    color: Colors.darkText,
  },
  sellerCity: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
  },
  rating: {
    ...Typography.label,
    color: Colors.darkText,
  },
  viewShopButton: {
    marginBottom: Spacing.lg,
  },
  viewShopText: {
    ...Typography.label,
    color: Colors.warmGold,
    textDecorationLine: 'underline',
  },
  messageButton: {
    marginBottom: Spacing.lg,
  },
  tryOnButton: {
    marginBottom: Spacing.xl,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
    gap: Spacing.lg,
    alignItems: 'center',
  },
  wishlistButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  wishlistIcon: {
    fontSize: 24,
  },
  addToCartButton: {
    flex: 1,
  },
  // Try-On Styles
  tryOnStage: {
    height: 400,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    marginVertical: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.card,
  },
  fittedBadge: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: Colors.success,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.button,
  },
  fittedBadgeText: {
    ...Typography.labelSmall,
    color: Colors.white,
  },
  pricingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginVertical: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
    marginBottom: Spacing.xs,
  },
  priceValue: {
    ...Typography.h3,
    color: Colors.darkText,
  },
  cashbackSection: {
    alignItems: 'flex-end',
  },
  cashbackText: {
    ...Typography.label,
    color: Colors.warmGold,
  },
  actionButtons: {
    flexDirection: 'row',
    marginVertical: Spacing.xl,
    gap: Spacing.md,
  },
  tryPhotoButton: {
    marginBottom: Spacing.xl,
  },
  // Cart Styles
  cartItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  itemName: {
    ...Typography.label,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
  },
  itemSize: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
    marginBottom: Spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    ...Typography.bodyBold,
    color: Colors.darkText,
  },
  removeIcon: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.warmGrey,
  },
  orderSummary: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginVertical: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    ...Typography.label,
    color: Colors.warmGrey,
  },
  summaryValue: {
    ...Typography.label,
    color: Colors.darkText,
  },
  shareIcon: {
    fontSize: 20,
    color: Colors.darkText,
  },
  totalRow: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.softBorder,
  },
  totalLabel: {
    ...Typography.bodyBold,
    color: Colors.darkText,
  },
  totalValue: {
    ...Typography.bodyBold,
    color: Colors.darkText,
  },
  checkoutButton: {
    marginBottom: Spacing.xl,
  },
  // Checkout Styles
  section: {
    marginVertical: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.darkText,
  },
  changeLink: {
    ...Typography.label,
    color: Colors.warmGold,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  addressText: {
    ...Typography.body,
    color: Colors.darkText,
  },
  paymentOption: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  paymentLabel: {
    ...Typography.label,
    color: Colors.darkText,
  },
  // Order Success Styles
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  successIcon: {
    fontSize: 80,
    color: Colors.success,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    ...Typography.h2,
    color: Colors.darkText,
    marginBottom: Spacing.md,
  },
  orderNumber: {
    ...Typography.label,
    color: Colors.warmGrey,
    marginBottom: Spacing.sm,
  },
  deliveryText: {
    ...Typography.body,
    color: Colors.warmGrey,
    marginBottom: Spacing.xxl,
  },
  successButtonGroup: {
    width: '100%',
    gap: Spacing.lg,
  },
  successButton: {
    marginBottom: Spacing.lg,
  },
  // Saved Boards Styles
  boardsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  boardsTitle: {
    ...Typography.h2,
    color: Colors.darkText,
  },
  addBoardButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.darkText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBoardIcon: {
    fontSize: 24,
    color: Colors.white,
  },
  boardsGrid: {
    justifyContent: 'space-between',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  boardCard: {
    flex: 0.48,
  },
  boardPreview: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    padding: Spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  boardItem: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: Colors.softBorder,
    borderRadius: BorderRadius.button,
  },
  boardName: {
    ...Typography.label,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
  },
  boardCount: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
  },
  // Profile Styles
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginVertical: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.warmGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  avatarInitial: {
    ...Typography.h2,
    color: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.label,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
  },
  profileCity: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.warmCream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 16,
    color: Colors.darkText,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    marginVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    overflow: 'hidden',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statNumber: {
    ...Typography.h3,
    color: Colors.darkText,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.softBorder,
  },
  menuContainer: {
    marginVertical: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softBorder,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Spacing.lg,
  },
  menuLabel: {
    ...Typography.label,
    color: Colors.darkText,
    flex: 1,
  },
  menuChevron: {
    ...Typography.body,
    color: Colors.warmGrey,
    fontSize: 20,
  },
});
