import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, ViewToken, SafeAreaView, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, Layout } from '../../constants';
import { Button } from '../../components';

interface Slide {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const { width } = Dimensions.get('window');

const slides: Slide[] = [
  {
    id: '1',
    icon: '📷',
    title: 'Snap Any Outfit',
    description: 'Point your camera at any outfit and DRAPE finds it instantly from local sellers near you.',
  },
  {
    id: '2',
    icon: '🏪',
    title: 'Shop Local First',
    description: 'Discover boutiques and sellers in Hyderabad and Bangalore before searching global brands.',
  },
  {
    id: '3',
    icon: '✨',
    title: 'Try Before You Buy',
    description: 'See how any outfit looks on your body type before adding it to your cart.',
  },
];

const OnboardingScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('StyleQuiz');
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
        />

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="large"
          />
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
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.xl,
  },
  slide: {
    width: width - Layout.screenPadding * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  icon: {
    fontSize: 96,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.darkText,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.warmGrey,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginVertical: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.softBorder,
  },
  activeDot: {
    backgroundColor: Colors.darkText,
    width: 24,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
  },
});

export default OnboardingScreen;
