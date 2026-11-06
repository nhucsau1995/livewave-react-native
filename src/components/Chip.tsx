import { colors, font, radius } from '../theme/tokens';
import { ScalePressable } from './Pressable';
import { T } from './Text';

export function Chip({ label, active, onPress, testID }: { label: string; active?: boolean; onPress?: () => void; testID?: string }) {
  return (
    <ScalePressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      onPress={onPress}
      style={{ minHeight: 36, paddingHorizontal: 14, borderRadius: radius.pill, justifyContent: 'center', backgroundColor: active ? colors.accentFill : colors.accentTint }}
    >
      <T variant="caption" style={{ fontFamily: font.semibold, color: active ? colors.white : colors.accentFill }}>{label}</T>
    </ScalePressable>
  );
}
