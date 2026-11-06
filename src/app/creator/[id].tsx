import { router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { IconButton, SectionTitle } from '../../components/Header';
import { Icon } from '../../components/Icon';
import { LivePill } from '../../components/Pills';
import { T } from '../../components/Text';
import { images } from '../../data/images';
import { creators, lenaReplays, schedule } from '../../data/seed';
import { compact } from '../../logic/format';
import { useApp } from '../../store';
import { colors, font, radius, space } from '../../theme/tokens';

export default function CreatorProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = creators.find((x) => x.id === id) ?? creators[0];
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const following = useApp((s) => s.following.includes(c.id));
  const toggleFollow = useApp((s) => s.toggleFollow);
  const col = (width - space.edge * 2 - 12) / 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }} testID="screen-creator">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 16) + 16 }}>
        <Image source={images.coverLenaStudio} style={{ width: '100%', height: 200 + insets.top }} resizeMode="cover" />
        <View style={[styles.back, { top: insets.top + 6 }]}>
          <IconButton icon="arrow-left" label="Back" color={colors.white} testID="back" onPress={() => router.back()} />
        </View>
        <View style={{ paddingHorizontal: space.edge }}>
          <View style={{ marginTop: -44, alignSelf: 'flex-start', alignItems: 'center' }}>
            <View style={{ backgroundColor: colors.bg, borderRadius: 50, padding: 3 }}><Avatar img={c.avatar} size={88} ring /></View>
            <View style={{ marginTop: -14 }}><LivePill small /></View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <T variant="title">{c.name}</T>
            <Icon name="check-circle" size={16} color={colors.accent} />
          </View>
          <T variant="caption">{c.handle}</T>
          <T variant="body" style={{ color: colors.text2, marginTop: 8 }}>{c.bio}</T>

          <Card style={styles.stats}>
            {[[compact(c.followers), 'Followers'], [String(c.streams), 'Streams'], [`${c.rating}`, 'Rating']].map(([v, l]) => (
              <View key={l} style={{ flex: 1, alignItems: 'center' }}>
                <T variant="title" style={{ color: colors.accent, fontFamily: font.bold }}>{v}</T>
                <T variant="caption">{l}</T>
              </View>
            ))}
          </Card>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Button testID="watch-live" label="Watch live" icon="play" onPress={() => router.push(`/watch/${c.id}`)} style={{ flex: 1 }} />
            <Button testID="toggle-follow" kind="secondary" label={following ? 'Following' : 'Follow'} icon={following ? 'check' : 'plus'} onPress={() => toggleFollow(c.id)} style={{ flex: 1 }} />
          </View>

          <Card style={{ marginTop: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="calendar" size={18} color={colors.accent} />
              <T variant="label" bold style={{ flex: 1 }}>Stream schedule</T>
              <T variant="caption" style={{ color: colors.accentFill }}>Weekly</T>
            </View>
            {schedule.map((s) => (
              <View key={s.id} style={styles.sched}>
                <View style={styles.day}><T variant="caption" style={{ color: colors.accentFill, fontFamily: font.bold }}>{s.day}</T></View>
                <View style={{ flex: 1 }}>
                  <T variant="label" bold>{s.day} {s.time}</T>
                  <T variant="caption" numberOfLines={1}>{s.title}</T>
                </View>
                <Button small kind="secondary" label="Remind" />
              </View>
            ))}
          </Card>

          <SectionTitle title="Past streams" action="View all" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {lenaReplays.map((r) => (
              <View key={r.id} style={{ width: col }}>
                <View style={{ height: col * 0.75, borderRadius: radius.card, overflow: 'hidden' }}>
                  <Image source={images[r.thumb]} style={StyleSheet.absoluteFill} resizeMode="cover" />
                  <View style={styles.dur}><T variant="caption" style={{ color: colors.white, fontSize: 12 }}>{r.duration}</T></View>
                </View>
                <T variant="label" bold numberOfLines={1} style={{ marginTop: 6 }}>{r.title}</T>
                <T variant="caption">{r.views} - {r.ago}</T>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  back: { position: 'absolute', left: 8, backgroundColor: colors.overlay, borderRadius: 22 },
  stats: { flexDirection: 'row', marginTop: 16, paddingVertical: 14 },
  sched: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surfaceAlt, borderRadius: radius.control, padding: 10, marginTop: 8 },
  day: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentTint, alignItems: 'center', justifyContent: 'center' },
  dur: { position: 'absolute', right: 8, bottom: 8, backgroundColor: colors.overlay, borderRadius: radius.pill, paddingHorizontal: 8, height: 22, justifyContent: 'center' },
});
