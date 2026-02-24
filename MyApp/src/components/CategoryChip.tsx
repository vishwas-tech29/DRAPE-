import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants';

interface CategoryChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ label, active = false, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        active && styles.activeChip,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          active && styles.activeText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface CategoryChipsProps {
  categories: string[];
  activeCategory?: string;
  onCategoryPress?: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  activeCategory,
  onCategoryPress,
}) => {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <CategoryChip
          key={category}
          label={category}
          active={activeCategory === category}
          onPress={() => onCategoryPress?.(category)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    backgroundColor: Colors.white,
  },
  activeChip: {
    backgroundColor: Colors.darkText,
    borderColor: Colors.darkText,
  },
  text: {
    ...Typography.label,
    color: Colors.darkText,
  },
  activeText: {
    color: Colors.warmCream,
  },
});

export default CategoryChip;
