import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { IconButton } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { StatusChip } from '../../components/Pills';
import { Screen } from '../../components/Screen';
import { T } from '../../components/Text';
import { images } from '../../data/images';
import { me, myReplays, schedule } from '../../data/seed';
import { grouped } from '../../logic/format';
import { colors, font, radius, space } from '../../theme/tokens';

const WEEK = [1.2, 1.6, 0.6, 2.1, 3.1, 1.4, 0.4];
const TABS = ['Replays', 'Clips', 'Scheduled'] as const;

export default function Profile() {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Replays');
  const col = (width - space.edge * 2 - 12) / 2;
  const peak = Math.max(...WEEK);
  const list = tab === 'Replays' ? myReplays : tab === 'Clips' ? myReplays.slice(0, 2) : [];

  return (
    <Screen testID="screen-profile">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T variant="title">Profile</T>
        <IconButton icon="settings" label="Stream settings" testID="open-settings" onPress={() => router.push('/settings')} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <Avatar img="avatarMaya" size={96} ring />
        <T variant="title" style={{ marginTop: 10 }}>{me.name}</T>
        <T variant="caption">{me.handle}</T>
        <Button small kind="secondary" label="Edit profile" style={{ marginTop: 10 }} />
      </View>
      <Card style={{ flexDirection: 'row', marginTop: 16, paddingVertical: 14 }}>
        {[[grouped(me.followers), 'Followers'], [String(me.following), 'Following'], [String(me.streams), 'Streams']].map(([v, l]) => (
          <View key={l} style={{ flex: 1, alignItems: 'center' }}>
            <T variant="title" style={{ color: colors.accent, fontFamily: font.bold }}>{v}</T>
            <T variant="caption">{l}</T>
          </View>
        ))}
      </Card>

      <Card style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <T variant="caption" style={{ fontFamily: font.semibold }}>This week</T>
          <StatusChip label="Peak 2,940 viewers" tone="success" />
        </View>
        <T variant="display" style={{ marginTop: 2 }}>{WEEK.reduce((a, b) => a + b, 0).toFixed(1)} h <T variant="label" style={{ color: colors.text2 }}>streamed</T></T>
        <View style={styles.bars}>
          {WEEK.map((h, i) => (
            <View key={i} style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ width: 18, height: 80 * (h / peak), borderRadius: 6, backgroundColor: h === peak ? colors.supportStrong : colors.support }} />
              <T variant="caption" style={{ fontSize: 12, marginTop: 6 }}>{'MTWTFSS'[i]}</T>
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} testID={`ptab-${t}`} onPress={() => setTab(t)} style={[styles.tab, tab === t && { borderBottomColor: colors.accent }]}>
            <T variant="label" style={{ color: tab === t ? colors.accentFill : colors.text2, fontFamily: tab === t ? font.semibold : font.medium }}>{t}</T>
          </Pressable>
        ))}
      </View>
      {tab === 'Scheduled' ? (
        <View style={{ gap: 10 }}>
          {schedule.map((s) => (
            <Card key={s.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Icon name="calendar" size={20} color={colors.accent} />
              <View style={{ flex: 1 }}><T variant="label" bold>{s.day} {s.time}</T><T variant="caption">{s.title}</T></View>
            </Card>
          ))}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {list.map((r) => (
            <View key={r.id} style={{ width: col }}>
              <View style={{ height: col * 1.2, borderRadius: radius.card, overflow: 'hidden' }}>
                <Image source={images[r.thumb]} style={StyleSheet.absoluteFill} resizeMode="cover" />
                <View style={styles.dur}><T variant="caption" style={{ color: colors.white, fontSize: 12 }}>{r.duration}</T></View>
              </View>
              <T variant="label" bold numberOfLines={1} style={{ marginTop: 6 }}>{r.title}</T>
              <T variant="caption">{r.views} - {r.ago}</T>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bars: { flexDirection: 'row', alignItems: 'flex-end', height: 108, marginTop: 8 },
  tabs: { flexDirection: 'row', marginTop: 20, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent', marginBottom: -1 },
  dur: { position: 'absolute', right: 8, bottom: 8, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 8, height: 22, justifyContent: 'center' },
});
