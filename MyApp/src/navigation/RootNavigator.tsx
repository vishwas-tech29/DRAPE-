import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants';

// Import screens
import SplashScreen from '../screens/buyer/Splash';
import ModeSelectionScreen from '../screens/buyer/ModeSelection';
import OnboardingScreen from '../screens/buyer/Onboarding';
import StyleQuizScreen from '../screens/buyer/StyleQuiz';
import SignUpScreen from '../screens/buyer/SignUp';
import HomeScreen from '../screens/buyer/Home';
import SearchScreen from '../screens/buyer/Search';
import SearchResultsScreen from '../screens/buyer/SearchResults';
import SnapScreen from '../screens/buyer/Snap';
import AIScanningScreen from '../screens/buyer/AIScanning';
import ResultsScreen from '../screens/buyer/Results';
import {
  ProductDetailScreen,
  VirtualTryOnScreen,
  CartScreen,
  CheckoutScreen,
  OrderSuccessScreen,
  SavedBoardsScreen,
  ProfileScreen,
} from '../screens/buyer/PlaceholderScreens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
  animationEnabled: true,
  animationTypeForReplace: 'pop' as const,
};

// Auth Stack (Before user is logged in / before mode selection)
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="StyleQuiz" component={StyleQuizScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

// Home Tab Stack
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="VirtualTryOn" component={VirtualTryOnScreen} />
    </Stack.Navigator>
  );
};

// Search Tab Stack
const SearchStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="VirtualTryOn" component={VirtualTryOnScreen} />
    </Stack.Navigator>
  );
};

// Snap Tab Stack
const SnapStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SnapMain" component={SnapScreen} />
      <Stack.Screen name="AIScanning" component={AIScanningScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="VirtualTryOn" component={VirtualTryOnScreen} />
    </Stack.Navigator>
  );
};

// Saved Tab Stack
const SavedStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SavedMain" component={SavedBoardsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="VirtualTryOn" component={VirtualTryOnScreen} />
    </Stack.Navigator>
  );
};

// Profile Tab Stack
const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
};

// Buyer Bottom Tab Navigator
const BuyerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.softBorder,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 56,
        },
        tabBarActiveTintColor: Colors.darkText,
        tabBarInactiveTintColor: Colors.warmGrey,
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: -2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStack}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Snap"
        component={SnapStack}
        options={{
          tabBarLabel: 'Snap',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📷</Text>,
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedStack}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>❤️</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
export const RootNavigator = ({ isLoggedIn, hasCompletedOnboarding }: { isLoggedIn: boolean; hasCompletedOnboarding: boolean }) => {
  return (
    <NavigationContainer>
      {isLoggedIn && hasCompletedOnboarding ? (
        <BuyerNavigator />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
