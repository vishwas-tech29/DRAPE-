import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants';

const SnapScreen = ({ navigation }: any) => {
  const [permission, setPermission] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'Detect' | 'Try On' | 'Style Me'>('Detect');
  const cameraRef = React.useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      // Camera permission is handled by Expo
      setPermission(true);
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.8,
        });
        // Navigate to scanning screen with the photo
        navigation.navigate('AIScanning', { photo });
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const handleGallery = () => {
    // Open image picker
    navigation.navigate('AIScanning', { fromGallery: true });
  };

  if (permission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (permission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        {/* Mode Tabs */}
        <View style={styles.modeTabsContainer}>
          {(['Detect', 'Try On', 'Style Me'] as const).map((modeOption) => (
            <TouchableOpacity
              key={modeOption}
              style={[
                styles.modeTab,
                mode === modeOption && styles.activeModeTab,
              ]}
              onPress={() => setMode(modeOption)}
            >
              <Text
                style={[
                  styles.modeTabText,
                  mode === modeOption && styles.activeModeTabText,
                ]}
              >
                {modeOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        {/* Flash Toggle */}
        <TouchableOpacity style={styles.flashButton}>
          <Text style={styles.flashIcon}>⚡</Text>
        </TouchableOpacity>

        {/* Frame Overlay */}
        <View style={styles.frameContainer}>
          <View style={styles.frameCorner} />
          <Text style={styles.frameText}>Point at any outfit</Text>
        </View>

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={handleGallery}
          >
            <Text style={styles.galleryIcon}>🖼️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shutterButton}
            onPress={handleCapture}
          >
            <View style={styles.shutterInner} />
          </TouchableOpacity>

          <View style={styles.spacer} />
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkText,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  text: {
    textAlign: 'center',
    color: Colors.white,
  },
  modeTabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modeTab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeModeTab: {
    backgroundColor: Colors.white,
  },
  modeTabText: {
    ...Typography.label,
    color: Colors.white,
  },
  activeModeTabText: {
    color: Colors.darkText,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: Colors.darkText,
  },
  flashButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  flashIcon: {
    fontSize: 20,
  },
  frameContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -75,
    marginTop: -75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameCorner: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: Colors.warmGold,
    borderRadius: 12,
  },
  frameText: {
    ...Typography.labelSmall,
    color: Colors.white,
    marginTop: Spacing.md,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryIcon: {
    fontSize: 24,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white,
    borderWidth: 3,
    borderColor: Colors.warmGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.white,
  },
  spacer: {
    width: 48,
  },
});

export default SnapScreen;
