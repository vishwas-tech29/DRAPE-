import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

interface ColorSwatchProps {
  name: string;
  hex: string;
  selected?: boolean;
  onPress?: () => void;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  name,
  hex,
  selected = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.swatch,
          { backgroundColor: hex },
          selected && styles.selectedSwatch,
        ]}
      />
      <Text style={styles.label}>{name}</Text>
    </TouchableOpacity>
  );
};

interface SizeButtonProps {
  size: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export const SizeButton: React.FC<SizeButtonProps> = ({
  size,
  selected = false,
  disabled = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.sizeButton,
        selected && styles.sizeButtonSelected,
        disabled && styles.sizeButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.sizeText,
          selected && styles.sizeTextSelected,
        ]}
      >
        {size}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  selectedContainer: {
    opacity: 1,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSwatch: {
    borderColor: Colors.warmGold,
  },
  label: {
    ...Typography.labelSmall,
    color: Colors.darkText,
  },
  sizeButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    borderRadius: BorderRadius.button,
    marginRight: Spacing.md,
    minWidth: 50,
    alignItems: 'center',
  },
  sizeButtonSelected: {
    backgroundColor: Colors.darkText,
    borderColor: Colors.darkText,
  },
  sizeButtonDisabled: {
    opacity: 0.4,
  },
  sizeText: {
    ...Typography.label,
    color: Colors.darkText,
  },
  sizeTextSelected: {
    color: Colors.white,
  },
});

export default { ColorSwatch, SizeButton };
