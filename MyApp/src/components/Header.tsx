import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Colors, Typography, Spacing, Layout } from '../constants';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  notificationCount?: number;
  cartCount?: number;
  onNotificationPress?: () => void;
  onCartPress?: () => void;
  onBackPress?: () => void;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = false,
  notificationCount = 0,
  cartCount = 0,
  onNotificationPress,
  onCartPress,
  onBackPress,
  showBack = false,
  rightComponent,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity onPress={onBackPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.backButton}>‹</Text>
            </TouchableOpacity>
          )}
          {showLogo && (
            <Text style={styles.logo}>DRAPE</Text>
          )}
          {title && !showLogo && (
            <Text style={styles.title}>{title}</Text>
          )}
        </View>

        {rightComponent ? (
          rightComponent
        ) : (
          <View style={styles.rightSection}>
            {notificationCount > 0 && (
              <TouchableOpacity onPress={onNotificationPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.icon}>🔔</Text>
              </TouchableOpacity>
            )}
            {cartCount !== undefined && (
              <TouchableOpacity onPress={onCartPress} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <View>
                  <Text style={styles.icon}>🛍️</Text>
                  {cartCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.softBorder,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.horizontalPadding,
    paddingVertical: Spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  backButton: {
    fontSize: 28,
    color: Colors.darkText,
    marginRight: Spacing.md,
  },
  logo: {
    ...Typography.h2,
    color: Colors.darkText,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  title: {
    ...Typography.h3,
    color: Colors.darkText,
    fontFamily: 'PlayfairDisplay_400Regular',
  },
  icon: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default Header;
