import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('ModeSelection');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DRAPE</Text>
      <Text style={styles.tagline}>Snap. Style. Shop.</Text>
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
  logo: {
    fontSize: 56,
    fontWeight: '600',
    color: Colors.darkText,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: Colors.warmGrey,
    letterSpacing: 2,
  },
});

export default SplashScreen;