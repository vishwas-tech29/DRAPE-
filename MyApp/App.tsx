import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation';
import { useUserStore } from './src/store';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  // Subscribe to store changes
  const user = useUserStore((state) => state.user);
  const appMode = useUserStore((state) => state.appMode);
  const loadFromStorage = useUserStore((state) => state.loadFromStorage);

  useEffect(() => {
    // Load user data from storage on app start
    try {
      loadFromStorage();
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
    // Mark as ready - navigation will handle the actual routing
    setIsReady(true);
  }, [loadFromStorage]);

  if (!isReady) {
    return null;
  }

  // Use Zustand store state directly
  const loggedIn = user?.isLoggedIn ?? false;
  const onboardingDone = appMode?.hasCompletedOnboarding ?? false;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator
          isLoggedIn={loggedIn}
          hasCompletedOnboarding={onboardingDone}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
