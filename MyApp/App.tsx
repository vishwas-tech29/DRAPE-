import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation';
import { useUserStore } from './src/store';

export default function App() {
  const { user, appMode, loadFromStorage } = useUserStore();

  useEffect(() => {
    // Load user data from storage on app start
    loadFromStorage();
  }, []);

  const isLoggedIn = !!user?.isLoggedIn;
  const hasCompletedOnboarding = appMode?.hasCompletedOnboarding ?? false;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <RootNavigator
          isLoggedIn={isLoggedIn}
          hasCompletedOnboarding={hasCompletedOnboarding}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
