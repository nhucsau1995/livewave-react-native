import { StyleSheet, View } from 'react-native';
import { compact } from '../logic/format';
import { colors, font, radius } from '../theme/tokens';
import { Icon } from './Icon';
import { T } from './Text';

// Shared LIVE pill: red fill, white dot, bold LIVE.
export function LivePill({ small }: { small?: boolean }) {
  return (
    <View style={[styles.live, small && { paddingHorizontal: 6, height: 20 }]}>
      <View style={styles.dot} />
      <T variant="caption" style={{ color: colors.white, fontFamily: font.bold, fontSize: small ? 12 : 13, lineHeight: 16 }}>LIVE</T>
    </View>
  );
}

// Shared viewer pill: dark translucent, eye icon + count.
export function ViewerPill({ count, exact }: { count: number; exact?: string }) {
  return (
    <View style={styles.viewers}>
      <Icon name="eye" size={14} color={colors.white} />
      <T variant="caption" style={{ color: colors.white, fontFamily: font.semibold, lineHeight: 16 }}>{exact ?? compact(count)}</T>
    </View>
  );
}

export function StatusChip({ label, tone }: { label: string; tone: 'success' | 'warning' | 'danger' | 'info' }) {
  const map = {
    success: [colors.success, colors.successTint],
    warning: [colors.warning, colors.warningTint],
    danger: [colors.danger, colors.dangerTint],
    info: [colors.accentFill, colors.accentTint],
  } as const;
  const [fg, bg] = map[tone];
  return (
    <View style={[styles.status, { backgroundColor: bg }]}>
      <View style={[styles.sdot, { backgroundColor: fg }]} />
      <T variant="caption" style={{ color: fg, fontFamily: font.semibold }}>{label}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  live: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.live, borderRadius: radius.pill, paddingHorizontal: 9, height: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  viewers: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 9, height: 24 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radius.pill, paddingHorizontal: 10, height: 28, alignSelf: 'flex-start' },
  sdot: { width: 6, height: 6, borderRadius: 3 },
});
