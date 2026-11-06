import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../theme/tokens';

export function Card({ children, style, testID }: { children: ReactNode; style?: StyleProp<ViewStyle>; testID?: string }) {
  return <View testID={testID} style={[{ backgroundColor: colors.surface, borderRadius: radius.card, padding: 16, ...shadow }, style]}>{children}</View>;
}
