import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation';
import { useUserStore } from './src/store';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    // Load persisted state from storage
    try {
      const store = useUserStore.getState();
      store.loadFromStorage();
      
      // Update local state with store values
      setLoggedIn(store.user?.isLoggedIn ?? false);
      setOnboardingDone(store.appMode?.hasCompletedOnboarding ?? false);
    } catch (error) {
      console.warn('Failed to load from storage:', error);
    }
  }, []);

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
