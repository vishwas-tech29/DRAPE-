import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation';
import { useUserStore } from './src/store';

export default function App() {
  const { user, isLoggedIn, hasCompletedOnboarding, loadFromStorage } = useUserStore();

  useEffect(() => {
    // Load user data from storage on app start
    loadFromStorage();
  }, []);

  const loggedIn = !!isLoggedIn;
  const onboardingDone = hasCompletedOnboarding ?? false;

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
