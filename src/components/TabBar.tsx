import { StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font } from '../theme/tokens';
import { Icon, Ion, type IconName } from './Icon';
import { ScalePressable } from './Pressable';
import { T } from './Text';

// Shared nav from DESIGN.md: exactly Home, Explore, Go Live, Wallet, Profile on a flat white bar.
const TABS: Record<string, { label: string; icon?: IconName }> = {
  home: { label: 'Home', icon: 'home' },
  explore: { label: 'Explore', icon: 'compass' },
  golive: { label: 'Go Live' },
  wallet: { label: 'Wallet', icon: 'credit-card' },
  profile: { label: 'Profile', icon: 'user' },
};

export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, i) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const active = state.index === i;
        const color = active ? colors.accent : colors.text3;
        return (
          <ScalePressable
            key={route.key}
            testID={`tab-${route.name}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
            onPress={() => !active && navigateToTab(route.key)}
            containerStyle={{ flex: 1 }}
            style={styles.item}
          >
            {tab.icon ? (
              <View style={styles.iconBox}><Icon name={tab.icon} color={color} size={22} /></View>
            ) : (
              <View style={styles.live}><Ion name="radio-outline" color={colors.white} size={20} /></View>
            )}
            <T variant="tab" style={{ color, fontFamily: active ? font.semibold : font.medium }}>{tab.label}</T>
          </ScalePressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8 },
  item: { flex: 1, alignItems: 'center', gap: 2, minHeight: 50 },
  iconBox: { height: 32, alignItems: 'center', justifyContent: 'center' },
  live: { width: 36, height: 32, borderRadius: 16, backgroundColor: colors.accentFill, alignItems: 'center', justifyContent: 'center' },
});
