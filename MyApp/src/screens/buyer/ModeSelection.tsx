import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useUserStore } from '../store';
import { Colors, Typography, Spacing, Layout } from '../constants';
import { Button } from '../components';

const ModeSelectionScreen = ({ navigation }: any) => {
  const { setAppMode } = useUserStore();

  const handleModeSelect = (mode: 'shopping' | 'selling') => {
    setAppMode(mode);
    if (mode === 'shopping') {
      navigation.replace('Onboarding');
    } else {
      // Navigate to seller onboarding (not fully implemented yet)
      navigation.replace('HomeMain');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to DRAPE</Text>
        <Text style={styles.subtitle}>Choose how you'd like to use DRAPE</Text>

        <View style={styles.cardsContainer}>
          {/* Shopping Card */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('shopping')}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>🛍️</Text>
            <Text style={styles.cardTitle}>I am Shopping</Text>
            <Text style={styles.cardDescription}>
              Discover and shop from local sellers and boutiques
            </Text>
          </TouchableOpacity>

          {/* Selling Card */}
          <TouchableOpacity
            style={styles.modeCard}
            onPress={() => handleModeSelect('selling')}
            activeOpacity={0.8}
          >
            <Text style={styles.cardIcon}>🏪</Text>
            <Text style={styles.cardTitle}>I am a Seller</Text>
            <Text style={styles.cardDescription}>
              Manage your boutique and reach more customers
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: Layout.screenPadding,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.darkText,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.warmGrey,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
  },
  cardsContainer: {
    gap: Spacing.xl,
  },
  modeCard: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.darkText,
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    ...Typography.body,
    color: Colors.warmGrey,
    textAlign: 'center',
  },
});

export default ModeSelectionScreen;
