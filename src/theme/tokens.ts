// Tokens from design/DESIGN.md (palette P41, Livewave).
export const colors = {
  bg: '#F8F4FC',
  surface: '#FFFFFF',
  surfaceAlt: '#F2EBF8',
  accent: '#8E4BC7',
  accentFill: '#8A43C5',
  accentPressed: '#7D42AF',
  accentTint: '#EEE4F7',
  support: '#A8D672',
  supportStrong: '#6EA22E',
  text: '#160C1F',
  text2: '#54465F',
  text3: '#756B80',
  border: '#E6DCEF',
  borderStrong: '#AE87B7',
  white: '#FFFFFF',
  live: '#DC2626',
  success: '#0E7C3A',
  successTint: '#E3F4E9',
  warning: '#A75906',
  warningTint: '#FAEFE1',
  danger: '#CE2020',
  dangerTint: '#FBE5E5',
  overlay: 'rgba(22,12,31,0.55)',
  overlayStrong: 'rgba(22,12,31,0.72)',
  gradient: ['#8A43C5', '#7D42AF'] as const,
};

export const font = {
  regular: 'Sora_400Regular',
  medium: 'Sora_500Medium',
  semibold: 'Sora_600SemiBold',
  bold: 'Sora_700Bold',
  display: 'Syne_700Bold',
};

// Only the 5 type sizes from the design system (12 is the tab-label minimum).
export const size = { display: 32, title: 20, body: 16, label: 14, caption: 13, tab: 12 };

export const radius = { card: 20, control: 14, input: 12, sheet: 24, pill: 999 };

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, edge: 20 };

export const shadow = {
  shadowColor: '#160C1F',
  shadowOpacity: 0.06,
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
};
