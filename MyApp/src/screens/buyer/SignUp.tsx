import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useUserStore } from '../store';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../constants';
import { Button } from '../components';

const SignUpScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setOnboardingComplete } = useUserStore();

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 500);
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      alert('Please enter OTP');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUser({
        id: 'user_' + Date.now(),
        phoneNumber: '+91' + phoneNumber,
        isLoggedIn: true,
        city: 'Hyderabad',
        stylePreferences: {
          wearMost: 'All of These',
          stylePreference: 'Casual',
        },
        savedItems: [],
        orders: [],
        cashbackEarned: 0,
      });
      setLoading(false);
      navigation.replace('HomeMain');
    }, 500);
  };

  const handleGuestLogin = () => {
    setOnboardingComplete(true);
    navigation.replace('HomeMain');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoSection}>
            <Text style={styles.logo}>DRAPE</Text>
          </View>

          {otpSent ? (
            // OTP Input Section
            <View style={styles.section}>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>
                We sent a code to +91 {phoneNumber}
              </Text>

              <View style={styles.otpContainer}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <TextInput
                    key={index}
                    style={styles.otpInput}
                    maxLength={1}
                    keyboardType="numeric"
                    value={otp[index] || ''}
                    onChangeText={(text) => {
                      const newOtp = otp.split('');
                      newOtp[index] = text;
                      setOtp(newOtp.join(''));
                      // Auto-focus next input
                      if (text && index < 5) {
                        // Would need ref-based approach for production
                      }
                    }}
                  />
                ))}
              </View>

              <Button
                title="Verify OTP"
                onPress={handleVerifyOTP}
                variant="primary"
                size="large"
                loading={loading}
                style={styles.button}
              />

              <TouchableOpacity onPress={() => setOtpSent(false)}>
                <Text style={styles.resendLink}>Didn't receive code? Resend</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // Phone Input Section
            <View style={styles.section}>
              <Text style={styles.title}>Sign Up or Log In</Text>
              <Text style={styles.subtitle}>
                Enter your phone number to continue
              </Text>

              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter phone number"
                  placeholderTextColor={Colors.warmGrey}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>

              <Button
                title="Send OTP"
                onPress={handleSendOTP}
                variant="primary"
                size="large"
                loading={loading}
                style={styles.button}
              />

              <TouchableOpacity onPress={handleGuestLogin}>
                <Text style={styles.guestLink}>Continue as Guest</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmCream,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
    marginTop: Spacing.xxxl,
  },
  logo: {
    ...Typography.h1,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: Colors.darkText,
  },
  section: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h2,
    color: Colors.darkText,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.warmGrey,
    marginBottom: Spacing.xxl,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.softBorder,
    borderRadius: BorderRadius.input,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.white,
  },
  countryCode: {
    ...Typography.label,
    color: Colors.darkText,
    marginRight: Spacing.sm,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: Spacing.lg,
    ...Typography.body,
    color: Colors.darkText,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  otpInput: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    borderRadius: BorderRadius.input,
    backgroundColor: Colors.white,
    ...Typography.h3,
    textAlign: 'center',
    color: Colors.darkText,
  },
  button: {
    marginBottom: Spacing.lg,
  },
  guestLink: {
    ...Typography.label,
    color: Colors.warmGrey,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  resendLink: {
    ...Typography.label,
    color: Colors.warmGrey,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

export default SignUpScreen;
