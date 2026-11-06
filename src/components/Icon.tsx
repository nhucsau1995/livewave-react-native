import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { colors } from '../theme/tokens';

// One icon style: rounded outline. Feather (Lucide style) for UI, Ionicons outline glyphs for
// the flat gift icons and the broadcast mark that Feather lacks.
export type IconName = ComponentProps<typeof Feather>['name'];
export type IonName = ComponentProps<typeof Ionicons>['name'];

export function Icon({ name, size = 24, color = colors.text }: { name: IconName; size?: number; color?: string }) {
  return <Feather name={name} size={size} color={color} />;
}

export function Ion({ name, size = 24, color = colors.text }: { name: IonName; size?: number; color?: string }) {
  return <Ionicons name={name} size={size} color={color} />;
}
