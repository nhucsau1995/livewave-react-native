import type { ReactNode } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../theme/tokens';
import { Icon, type IconName } from './Icon';
import { ScalePressable } from './Pressable';
import { T } from './Text';

export function IconButton({ icon, onPress, testID, label, color = colors.text }: { icon: IconName; onPress?: () => void; testID?: string; label: string; color?: string }) {
  return (
    <ScalePressable testID={testID} accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} color={color} size={22} />
    </ScalePressable>
  );
}

export function Header({ title, right, back = 'arrow-left', testID }: { title: string; right?: ReactNode; back?: IconName; testID?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: -12 }}>
      <IconButton icon={back} label="Back" testID={testID ?? 'back'} onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))} />
      <T variant="title" style={{ flex: 1 }}>{title}</T>
      {right}
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 }}>
      <T variant="title">{title}</T>
      {action ? <T variant="label" onPress={onAction} style={{ color: colors.accentFill, fontFamily: 'Sora_600SemiBold' }}>{action}</T> : null}
    </View>
  );
}
