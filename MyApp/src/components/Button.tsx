import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../constants';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: BorderRadius.button,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row' as const,
    };

    const sizeStyles = {
      small: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
      medium: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg },
      large: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl },
    };

    const variantStyles = {
      primary: {
        backgroundColor: Colors.action,
      },
      secondary: {
        backgroundColor: Colors.warmGold,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.softBorder,
      },
      danger: {
        backgroundColor: Colors.danger,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: isDisabled ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const variantTextColors = {
      primary: Colors.actionText,
      secondary: Colors.darkText,
      outline: Colors.darkText,
      danger: Colors.white,
      ghost: Colors.darkText,
    };

    return {
      ...Typography.label,
      color: variantTextColors[variant],
      marginLeft: icon ? Spacing.sm : 0,
    };
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
    >
      {loading && <ActivityIndicator color={Colors.white} size="small" />}
      {icon && !loading && icon}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
