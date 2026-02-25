import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { productService } from '../../services';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants';

const { width, height } = Dimensions.get('window');

const AIScanningScreen = ({ route, navigation }: any) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [scanning, setScanning] = useState(true);
  const scanLineAnim = new Animated.Value(0);
  const tagOpacities = [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ];

  const steps = [
    'Detecting clothing items',
    'Identifying colors and style',
    'Searching 2.4 million products',
    'Finding local sellers near you',
  ];

  useEffect(() => {
    // Animate scan line
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Simulate scanning with step completion
    let step = 0;
    const interval = setInterval(() => {
      if (step < steps.length) {
        setScanProgress(step + 1);

        // Animate tag appearance
        if (step < tagOpacities.length) {
          Animated.timing(tagOpacities[step], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }

        step++;
      } else {
        clearInterval(interval);
        setScanning(false);
        // Navigate to results after scanning completes
        setTimeout(() => {
          navigation.replace('Results', {
            detectedItems: [
              'Floral Print Saree',
              'Midi Length',
              'Chiffon Fabric',
            ],
          });
        }, 1000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [navigation]);

  const scanLineHeight = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const tags = [
    { text: 'Floral Print', x: '20%', y: '30%' },
    { text: 'Midi Length', x: '70%', y: '50%' },
    { text: 'Chiffon', x: '15%', y: '70%' },
    { text: 'V-Neck', x: '75%', y: '35%' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Photo */}
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1594049298812-4bd3a3a6ca13?w=400&h=600&fit=crop' }}
          style={styles.photo}
          resizeMode="cover"
        />

        {/* Scan Line */}
        <Animated.View
          style={[
            styles.scanLine,
            {
              top: scanLineHeight,
            },
          ]}
        />

        {/* Detection Tags */}
        {tags.map((tag, index) => (
          <Animated.View
            key={index}
            style={[
              styles.tag,
              {
                left: Number(tag.x),
                top: Number(tag.y),
                opacity: tagOpacities[index],
                transform: [
                  {
                    scale: tagOpacities[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              } as any,
            ]}
          >
            <Text style={styles.tagText}>{tag.text}</Text>
          </Animated.View>
        ))}
      </View>

      {/* Progress Checklist */}
      <View style={styles.checklistContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.checklistItem}>
            <View
              style={[
                styles.checklistIndicator,
                index < scanProgress && styles.completedIndicator,
              ]}
            >
              {index < scanProgress && (
                <Text style={styles.checkmarkIcon}>✓</Text>
              )}
            </View>
            <Text
              style={[
                styles.checklistText,
                index < scanProgress && styles.completedText,
              ]}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>

      {/* Success Message */}
      {!scanning && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Match found!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmCream,
    justifyContent: 'space-between',
  },
  photoContainer: {
    position: 'relative',
    height: height * 0.45,
    marginHorizontal: Layout.screenPadding,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.warmGold,
    opacity: 0.8,
    boxShadow: '0 0 10 0 rgba(184, 134, 74, 0.8)',
    elevation: 5,
  },
  tag: {
    position: 'absolute',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.softBorder,
  },
  tagText: {
    ...Typography.labelSmall,
    color: Colors.darkText,
  },
  checklistContainer: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.card,
    borderTopRightRadius: BorderRadius.card,
    flex: 1,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  checklistIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.softBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  completedIndicator: {
    backgroundColor: Colors.success,
  },
  checkmarkIcon: {
    ...Typography.label,
    color: Colors.white,
    fontSize: 16,
  },
  checklistText: {
    ...Typography.body,
    color: Colors.warmGrey,
    flex: 1,
  },
  completedText: {
    color: Colors.darkText,
  },
  successMessage: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Layout.screenPadding,
    alignItems: 'center',
  },
  successText: {
    ...Typography.h3,
    color: Colors.success,
  },
});

export default AIScanningScreen;
