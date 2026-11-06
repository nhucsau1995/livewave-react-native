import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, font, radius } from '../theme/tokens';
import { Icon, Ion, type IconName, type IonName } from './Icon';
import { ScalePressable } from './Pressable';
import { T } from './Text';

type Kind = 'primary' | 'secondary' | 'danger' | 'ghost';

export function Button({ label, onPress, kind = 'primary', icon, ion, disabled, testID, style, small }: {
  label: string;
  onPress?: () => void;
  kind?: Kind;
  icon?: IconName;
  ion?: IonName;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}) {
  const fg = kind === 'primary' ? colors.white : kind === 'danger' ? colors.danger : colors.accentFill;
  return (
    <ScalePressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      containerStyle={style}
      style={[styles.base, small && styles.small, styles[kind], disabled && { opacity: 0.4 }]}
    >
      <View style={styles.row}>
        {icon ? <Icon name={icon} size={small ? 16 : 20} color={fg} /> : null}
        {ion ? <Ion name={ion} size={small ? 16 : 20} color={fg} /> : null}
        <T variant={small ? 'label' : 'body'} style={{ color: fg, fontFamily: font.semibold }}>{label}</T>
      </View>
    </ScalePressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 56, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  small: { height: 44, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primary: { backgroundColor: colors.accentFill },
  secondary: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.accent },
  danger: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.danger },
  ghost: { backgroundColor: 'transparent' },
});
