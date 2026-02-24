export const Typography = {
  // Playfair Display - Display & Headings
  // Note: In production, install @react-native-fonts/playfair-display
  playfairDisplay: {
    regular: { fontFamily: 'PlayfairDisplay_400Regular' },
    italic: { fontFamily: 'PlayfairDisplay_400Regular_Italic' },
    bold: { fontFamily: 'PlayfairDisplay_700Bold' },
    boldItalic: { fontFamily: 'PlayfairDisplay_700Bold_Italic' },
  },

  // DM Sans - Body & UI
  // Note: In production, install @react-native-fonts/dm-sans
  dmSans: {
    regular: { fontFamily: 'DMSans_400Regular' },
    medium: { fontFamily: 'DMSans_500Medium' },
    bold: { fontFamily: 'DMSans_700Bold' },
  },

  // Heading Styles
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontWeight: '400' as const,
  },
  h1Italic: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontWeight: '400' as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontWeight: '400' as const,
  },
  h3: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'PlayfairDisplay_400Regular',
    fontWeight: '400' as const,
  },
  h3Italic: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontWeight: '400' as const,
  },

  // Body Text
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'DMSans_400Regular',
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'DMSans_400Regular',
  },
  bodyBold: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'DMSans_700Bold',
    fontWeight: '700' as const,
  },

  // UI Labels
  label: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'DMSans_500Medium',
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'DMSans_500Medium',
    fontWeight: '500' as const,
  },

  // Special
  caption: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'DMSans_400Regular',
  },
  smallCaps: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'DMSans_500Medium',
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
};

export default Typography;
