import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import { useUserStore } from '../../store';
import { Colors, Typography } from '../../constants';

const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = new Animated.Value(0);
  const { appMode } = useUserStore();

  useEffect(() => {
    // Animate in
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate based on app state
      if (appMode?.mode) {
        navigation.replace('HomeMain');
      } else {
        navigation.replace('ModeSelection');
      }
    });
  }, [navigation, appMode?.mode]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.logo}>
          DRAPE
        </Text>
        <Text style={styles.tagline}>Snap. Style. Shop.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmCream,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    ...Typography.h1,
    fontSize: 56,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: Colors.darkText,
    marginBottom: 16,
  },
  tagline: {
    ...Typography.smallCaps,
    color: Colors.warmGrey,
    letterSpacing: 2,
  },
});

export default SplashScreen;
