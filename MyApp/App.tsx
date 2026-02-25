import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [loadingState, setLoadingState] = useState('initializing');
  const [RootNavigator, setRootNavigator] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApp = async () => {
      try {
        setLoadingState('loading-navigation');
        const navModule = await import('./src/navigation');
        setRootNavigator(() => navModule.RootNavigator);
        
        setLoadingState('loading-store');
        const storeModule = await import('./src/store');
        const { useUserStore } = storeModule;
        const store = useUserStore.getState();
        store.loadFromStorage();
        
        setLoadingState('ready');
      } catch (err) {
        console.error('Error loading app:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoadingState('error');
      }
    };

    loadApp();
  }, []);

  if (loadingState === 'error') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Error: {error}
        </Text>
      </View>
    );
  }

  if (!RootNavigator || loadingState !== 'ready') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F0E8' }}>
        <Text>DRAPE App Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator isLoggedIn={false} hasCompletedOnboarding={false} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
