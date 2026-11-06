import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card } from '../components/Card';
import { Toggle } from '../components/Controls';
import { Header } from '../components/Header';
import { Icon, type IconName } from '../components/Icon';
import { Screen } from '../components/Screen';
import { T } from '../components/Text';
import { backoffSchedule } from '../logic/health';
import { useApp, type Settings } from '../store';
import { colors, font } from '../theme/tokens';

export default function StreamSettings() {
  const s = useApp((st) => st.settings);
  const set = useApp((st) => st.setSetting);
  const delays = backoffSchedule(s.maxRetries);
  const backoff = `Exponential ${delays[0] / 1000}s to ${delays[delays.length - 1] / 1000}s`;

  const toggle = (key: keyof Settings, label: string, icon: IconName) => (
    <Row icon={icon} label={label}>
      <Toggle testID={`set-${key}`} label={label} value={s[key] as boolean} onChange={(v) => set(key, v as never)} />
    </Row>
  );
  const value = (label: string, v: string, icon: IconName, onPress?: () => void) => (
    <Row icon={icon} label={label} onPress={onPress}>
      <T variant="label" style={{ color: colors.text2 }}>{v}</T>
      <Icon name="chevron-right" size={18} color={colors.text3} />
    </Row>
  );

  return (
    <Screen testID="screen-settings" header={<Header title="Stream settings" right={<T variant="label" style={{ color: colors.accentFill, fontFamily: font.semibold }}>Reset</T>} />}>
      <Group title="Video">
        {value('Default quality', s.defaultQuality, 'sliders', () => set('defaultQuality', s.defaultQuality === '720p' ? '1080p' : s.defaultQuality === '1080p' ? '480p' : '720p'))}
        {value('Frame rate', `${s.frameRate} fps`, 'film', () => set('frameRate', s.frameRate === 30 ? 60 : 30))}
        {toggle('adaptiveBitrate', 'Adaptive bitrate', 'trending-up')}
        {toggle('lowLatency', 'Low-latency mode', 'zap')}
      </Group>
      <Group title="Reliability">
        {toggle('autoReconnect', 'Auto-reconnect', 'refresh-cw')}
        {value('Max retries', String(s.maxRetries), 'repeat', () => set('maxRetries', s.maxRetries >= 7 ? 3 : s.maxRetries + 1))}
        {value('Backoff', backoff, 'clock')}
      </Group>
      <Group title="Engine">
        {value('Default engine', s.defaultEngine, 'layers', () => set('defaultEngine', s.defaultEngine === 'Agora' ? 'LiveKit' : s.defaultEngine === 'LiveKit' ? 'WebRTC' : 'Agora'))}
        {value('Region', 'Auto', 'globe')}
      </Group>
      <Group title="Developer and QA">
        {toggle('debugOverlay', 'Debug overlay', 'cpu')}
        {toggle('simulatePoorNetwork', 'Simulate poor network', 'wifi-off')}
        {value('Export session logs', '', 'download')}
      </Group>
      <Group title="Chat">
        {toggle('slowMode', 'Slow mode', 'message-circle')}
        {value('Blocked words', '12', 'slash')}
      </Group>
    </Screen>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ marginTop: 16 }}>
      <T variant="caption" style={{ fontFamily: font.semibold, color: colors.text3, letterSpacing: 1, marginBottom: 8 }}>{title.toUpperCase()}</T>
      <Card style={{ paddingVertical: 4 }}>{children}</Card>
    </View>
  );
}

function Row({ icon, label, children, onPress }: { icon: IconName; label: string; children: ReactNode; onPress?: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress} accessibilityRole={onPress ? 'button' : undefined}>
      <Icon name={icon} size={18} color={colors.accent} />
      <T variant="label" style={{ flex: 1 }}>{label}</T>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
});
